<style lang="less">
    @import '../../../../styles/common.less';
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                菜单管理
            </p>
            <div>
                <Tabs ref="itemTypes" @on-click="loadItemRelation" style="height: 700px;">
                    <TabPane :label="type.name" :name="'' + type.value" v-for="(type, index) in itemTypes">
                        <Tabs ref="treeGroups" @on-click="loadItems" style="height: 700px;">
                            <TabPane :label="scope.name" :name="JSON.stringify({scope: scope.value, type: type.value})" v-for="(scope, index) in type.scopes">
                                <Tree :data="tree.data" :render="renderContent" style="width:500px;" v-for="tree in treeData" v-if="tree['scope'] === scope.value"></Tree>
                            </TabPane>
                        </Tabs>
                    </TabPane>
                </Tabs>
            </div>
        </Card>
    </div>
</template>

<script>
    import PopTipTable from './component/PopTipTable.vue';
    import PopTipTransfer from './component/PopTipTransfer.vue';

    import Vue from 'vue';
    Vue.component('PopTipTable', PopTipTable);
    Vue.component('PopTipTransfer', PopTipTransfer);

    export default {
        name: 'auth_role',
        components: {
        },
        data () {
            return {
                treeData: [],
                currentScope: '',
                currentType: '',
                scopes: [],
                itemTypes: [
                    {
                        value: 3,
                        name: '角色',
                        scopes: [
                            {
                                value: 'admin',
                                name: '后台角色'
                            },
                            {
                                value: 'user',
                                name: '前台角色'
                            }
                        ]
                    },
                    {
                        value: 2,
                        name: '菜单',
                        scopes: [
                            {
                                value: 'admin',
                                name: '后台菜单'
                            },
                            {
                                value: 'user',
                                name: '前台菜单'
                            }
                        ]
                    },
                    {
                        value: 1,
                        name: '权限',
                        scopes: [
                            {
                                value: 'admin',
                                name: '后台权限'
                            },
                            {
                                value: 'user',
                                name: '前台权限'
                            }
                        ]
                    }
                ],
                columns: [
                    {
                        title: '菜单名称',
                        key: 'item_name'
                    },
                    {
                        title: '菜单描述',
                        key: 'item_desc'
                    }
                ],
                dataItems: [],
                initDataItems: [],
                groupData: [],
                targetItems: [],
                listStyle: {
                    width: '250px',
                    height: '300px'
                },
                operations: ['To left', 'To right']
            };
        },
        methods: {
            initData (type) {
                if (type === undefined) {
                    type = this.itemTypes[0]['value'];
                }
                Promise.all([
                    this.axios.get('{{host_v1}}/auth/item/relation/tree', {
                        params: {
                            type: type
                        }
                    })
                ]).then(([trees]) => {
                    let defaultRootItems = [];
                    /* 加载选择节点 */
                    for (let [index, typeItem] of this.itemTypes.entries()) {
                        if (typeItem.value === Number.parseInt(type)) {
                            for (let scope of typeItem.scopes) {
                                let menu = this.topMenu();
                                for (let tree of trees.data.data) {
                                    if (scope.value === tree.scope) {
                                        menu.children = tree.data;
                                    }
                                }
                                defaultRootItems[scope.value] = {
                                    data: [
                                        menu
                                    ],
                                    scope: scope.value
                                };
                            }
                        }

                        if (Number.parseInt(type) === typeItem.value) {
                            this.$refs.treeGroups[index].$emit('on-click', {
                                scope: this.itemTypes[index]['scopes'][0].value,
                                type: type
                            });
                        }
                    }

                    this.treeData = Object.values(defaultRootItems);
                });
            },
            topMenu () {
                return {
                    title: '添加顶级节点',
                    id: 0,
                    expand: true,
                    render: (h, {root, node, data}) => {
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%'
                            }
                        }, [
                            h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-folder-outline'
                                    },
                                    style: {
                                        marginRight: '8px'
                                    }
                                }),
                                h('span', data.title)
                            ]),
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    float: 'right',
                                    marginRight: '32px'
                                }
                            }, [
                                h('PopTipTable', {
                                    props: {
                                        data: this.dataItems,
                                        columns: this.columns,
                                        selectNode: data
                                    },
                                    on: {
                                        search: this.search,
                                        dbClick: this.store,
                                        'on-popper-show': () => {
                                            this.getItemOriginal(data);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: Object.assign({}, this.buttonProps, {
                                            icon: 'ios-plus-empty',
                                            type: 'primary'
                                        }),
                                        style: {
                                            width: '184px'
                                        }
                                    })
                                ])
                            ])
                        ]);
                    }
                };
            },
            destroy (data) {
                this.axios.post('{{host_v1}}/auth/item/relation/tree/' + data.id, {
                    _method: 'delete'
                }).then((response) => {
                    if (response.data.code === '0') {
                        this.initData();
                    }
                });
            },
            search (searchContent) {
                let res = [];
                let dataClone = JSON.parse(JSON.stringify(this.initDataItems));
                if (searchContent === '') {
                    res = dataClone;
                } else {
                    let argumentObj = {item_name: searchContent, item_desc: searchContent};
                    for (let argu in argumentObj) {
                        if (argumentObj[argu].length > 0) {
                            for (let key in dataClone) {
                                if (dataClone[key][argu].indexOf(argumentObj[argu]) > -1) {
                                    res.push(dataClone[key]);
                                    dataClone.splice(key, 1);
                                }
                            }
                        }
                    }
                }
                this.dataItems = res;
            },
            store (row, index, parentRow) {
                this.axios.post('{{host_v1}}/auth/item/relation/' + parentRow.id, {
                    id: row.id,
                    scope: this.currentScope
                }).then((response) => {
                    if (response.data.code === '0') {
                        const children = parentRow.children || [];
                        children.push(response.data.data);
                        this.$set(parentRow, 'children', children);
                    }
                });
            },
            renderContent (h, { root, node, data }) {
                let style = '';
                if (data.children) {
                    style = 'ios-folder-outline';
                } else {
                    style = 'ios-paper-outline';
                }
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: style
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.item.item_name)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('PopTipTable', {
                            props: {
                                data: this.dataItems,
                                columns: this.columns,
                                selectNode: data
                            },
                            on: {
                                search: this.search,
                                dbClick: this.store,
                                'on-popper-show': () => {
                                    this.getItemOriginal(data);
                                }
                            }
                        }, [
                            h('Button', {
                                style: {
                                    marginRight: '8px'
                                }
                            }, '添加')
                        ]),
                        h('Poptip', {
                            props: {
                                confirm: true,
                                title: '您确定要删除该节点(及以下节点)吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.destroy(data);
                                }
                            }
                        }, [
                            h('Button', {
                                style: {
                                    marginRight: '8px'
                                }
                            }, '删除')
                        ]),
                        h('PopTipTransfer', {
                            props: {
                                groupData: this.groupData,
                                targetItems: this.targetItems,
                                listStyle: this.listStyle,
                                operations: this.operations,
                                renderItem: this.renderItem
                            },
                            on: {
                                onPopperShow: () => {
                                    this.loadGroupItems(data);
                                },
                                handleChange: (event) => {
                                    this.handleChange(event, data);
                                },
                                showAllData: () => {
                                    this.loadGroupItems(data, 0);
                                }
                            }
                        }, [
                            h('Button', '权限')
                        ])
                    ])
                ]);
            },
            loadItems (obj) {
                if (!(obj instanceof Object)) {
                    obj = JSON.parse(obj);
                }
                this.currentScope = obj.scope;
                this.currentType = obj.type;
            },
            getItemOriginal (data, filter = 1) {
                this.dataItems = this.initDataItems = [];
                this.axios.get('{{host_v1}}/auth/item/relation/original', {
                    params: {
                        scope: this.currentScope,
                        type: this.currentType,
                        id: data.id,
                        filter: filter
                    }
                }).then(menus => {
                    this.dataItems = this.initDataItems = menus.data.data;
                });
            },
            loadGroupItems (data, filter = 1) {
                this.groupData = [];
                this.targetItems = [];
                Promise.all([
                    this.axios.get('{{host_v1}}/auth/item/group/original', {
                        params: {
                            id: data.item.id,
                            type: this.currentType,
                            filter: filter,
                            scope: this.currentScope
                        }
                    }),
                    this.axios.get('{{host_v1}}/auth/item/group/target', {
                        params: {
                            id: data.item.id
                        }
                    })
                ]).then(([items, targetItems]) => {
                    if (items.data.data.length > 0) {
                        for (let item of items.data.data) {
                            item.key = item.id;
                            item.label = item.item_name;
                        }
                    }
                    this.groupData = items.data.data;
                    this.targetItems = targetItems.data.data;
                });
            },
            renderItem (item) {
                return item.item_name + ' - ' + item.item_desc;
            },
            handleChange (targetData, data) {
                this.axios.post('{{host_v1}}/auth/item/group/' + data.item.id, {
                    ids: targetData,
                    scope: this.currentScope
                }).then(response => {
                    if (response.data.code === '0') {
                        this.targetItems = targetData;
                    }
                });
            },
            loadItemRelation (type) {
                this.initData(type);
            }
        },
        created () {
            this.initData();
        }
    };
</script>