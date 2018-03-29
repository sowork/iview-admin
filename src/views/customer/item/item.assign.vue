<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                节点分配
            </p>
            <Tabs value="0"  @on-click="switchPane">
                <TabPane :label="type.name" v-for="(type, index) in itemTypes" :name="'' + index">
                    <Tree :ref="'tree' + index" :data="assignData[index]" @on-check-change="getSelected" show-checkbox></Tree>
                </TabPane>
            </Tabs>
        </Card>
    </div>
</template>
<script>
    export default {
        name: 'item-assign',
        data () {
            return {
                httpRequest: '',
                assignData: [],
                itemTypes: [
                    {
                        value: 3,
                        name: '角色'
                    },
                    {
                        value: 2,
                        name: '菜单'
                    },
                    {
                        value: 1,
                        name: '权限'
                    }
                ],
                intent: JSON.parse(this.$route.query.data)
            };
        },
        methods: {
            initData (type = 3) {
                this.axios.get('{{host_v1}}/auth/item/tree', {
                    params: {
                        scope: this.intent.scope,
                        uid: this.intent.user.id
                    }
                }).then(response => {
                    if (response.data.data) {
                        this.assignData.splice(0, 0, response.data.data.roles);
                        this.assignData.splice(1, 0, response.data.data.menus);
                        this.assignData.splice(2, 0, response.data.data.permissions);
                    }
                });
            },
            switchPane (name) {
                this.initData(name);
            },
            getSelected (items) {
                let t0 = this.$refs.tree0[0].getCheckedNodes();
                let t1 = this.$refs.tree1[0].getCheckedNodes();
                let t2 = this.$refs.tree2[0].getCheckedNodes();
                let selectItems = t0.concat(t1).concat(t2);
                let ids = [];
                for (let item of selectItems) {
                    ids.push(item.id);
                }
                this.axios.post('{{host_v1}}/user/assign/item/' + this.intent.user.admin_id, {
                    ids: ids
                })
            }
        },
        created () {
            this.initData();
        }
    };
</script>