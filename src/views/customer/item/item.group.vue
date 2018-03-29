<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                节点分组
            </p>
            <Transfer
                    :data="groupData"
                    :target-keys="targetItems"
                    :list-style="listStyle"
                    :render-format="renderItem"
                    :operations="['To left','To right']"
                    filterable
                    @on-change="handleChange">
                <div :style="{float: 'right', margin: '5px'}">
                    <Button type="ghost" size="small" @click="initData(0)">LoadAll</Button>
                </div>
            </Transfer>
        </Card>
    </div>
</template>
<script>
    export default {
        name: 'item-group',
        data () {
            return {
                httpRequest: '',
                groupData: [],
                targetItems: [],
                formItem: {
                    item_code: '',
                    item_name: '',
                    item_desc: '',
                    item_type: '',
                    scope: ''
                },
                itemTypes: [
                    {
                        value: 1,
                        name: '权限',
                        level: 1
                    },
                    {
                        value: 2,
                        name: '菜单',
                        level: 2
                    },
                    {
                        value: 3,
                        name: '角色',
                        level: 3
                    }
                ],
                intent: JSON.parse(this.$route.query.data),
                listStyle: {
                    width: '250px',
                    height: '300px'
                }
            };
        },
        methods: {
            initData (showAll = 1) {
                let types = [];
                for (let t of this.itemTypes) {
                    if (this.intent.item_type === t.value) {
                        this.intent.level = t.level;
                    }
                }
                if (this.intent.level) {
                    for (let t of this.itemTypes) {
                        if (this.intent.level > t.level) {
                            types.push(t.value);
                        }
                    }
                }
                Promise.all([
                    this.axios.get('{{host_v1}}/auth/item/group/original/' + this.intent.id, {
                        params: {
                            types: types,
                            filter: showAll,
                            scope: this.intent.scope.split(',')
                        }
                    }),
                    this.axios.get('{{host_v1}}/auth/item/group/target/' + this.intent.id)
                ]).then(([items, targetItmes]) => {
                    if (items.data.data.length > 0) {
                        for (let item of items.data.data) {
                            item.key = item.id;
                            item.label = item.item_name;
                            for (let t of this.itemTypes) {
                                if (t.value === item.item_type) {
                                    item.item_type = t.name;
                                    item.level = t.level;
                                }
                                if (this.intent.item_type === t.value) {
                                    this.intent.level = t.level;
                                }
                            }
                            if (item.level > this.intent.level) {
                                item.disabled = true;
                            }
                        }
                    }
                    this.groupData = items.data.data;
                    this.targetItems = targetItmes.data.data;
                });
            },
            renderItem (item) {
                return item.item_name + ' - ' + item.item_desc + ' - ' + item.item_type;
            },
            handleChange (targetData) {
                this.axios.post('{{host_v1}}/auth/item/add/group/' + this.intent.id, {
                    ids: targetData
                }).then(response => {
                    if (response.data.code === '0') {
                        this.targetItems = targetData;
                    }
                });
            }
        },
        created () {
            this.initData();
        }
    };
</script>