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
                    <TabPane :label="type.label" :name="'' + type.value" v-for="(type, index) in itemTypes">
                        <Tabs ref="treeGroups" @on-click="loadItems" style="height: 700px;">
                            <TabPane :label="scope.label" :name="JSON.stringify({scope: scope.value, type: type.value})" v-for="(scope, index) in type.children">
                                <Scroll height="600">
                                    <Tree :data="tree.data" :render="renderContent" style="width:500px;" v-for="tree in treeData" v-if="tree['scope'] === scope.value"></Tree>
                                </Scroll>
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
                defaultScope: '',
                currentType: '',
                itemTypes: [
                    {
                        value: 3,
                        label: '角色',
                        level: 3,
                        children: [
                            {
                                value: 'admin',
                                label: '后台角色'
                            },
                            {
                                value: 'user',
                                label: '前台角色'
                            }
                        ]
                    },
                    {
                        value: 2,
                        label: '菜单',
                        level: 2,
                        children: [
                            {
                                value: 'admin',
                                label: '后台菜单'
                            },
                            {
                                value: 'adminTop',
                                label: '后台顶部菜单'
                            }
                        ]
                    },
                    {
                        value: 1,
                        label: '权限',
                        level: 1,
                        children: [
                            {
                                value: 'admin',
                                label: '后台权限'
                            },
                            {
                                value: 'user',
                                label: '前台权限'
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
                defaultItemValue: [],
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
                this.treeData = [];
                this.currentItem = {};
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
                        if (typeItem.value === type) {
                            this.currentItem = typeItem;
                            this.defaultItemValue = [
                                this.currentItem.value - 1 > 0 ? this.currentItem.value - 1 : 1,
                                typeItem['children'][0].value
                            ];
                        }
                        if (typeItem.value === Number.parseInt(type)) {
                            for (let scope of typeItem.children) {
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
                                scope: this.itemTypes[index]['children'][0].value,
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
                    relation_id: 0,
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
            destroy (root, node, data) {
                this.axios.post('{{host_v1}}/auth/item/relation/tree/' + data.relation_id, {
                    _method: 'delete'
                }).then((response) => {
                    if (response.data.code === '0') {
                        const parentKey = root.find(el => el === node).parent;
                        const parent = root.find(el => el.nodeKey === parentKey).node;
                        const index = parent.children.indexOf(data);
                        parent.children.splice(index, 1);
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
                this.axios.post('{{host_v1}}/auth/item/relation/' + parentRow.relation_id, {
                    id: row.id,
                    scope: this.defaultScope
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
                        h('span', data.item_name)
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
                                    this.destroy(root, node, data);
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
                                renderItem: this.renderItem,
                                items: this.itemTypes,
                                itemDefaultValue: this.defaultItemValue
                            },
                            on: {
                                onPopperShow: (value) => {
                                    this.loadGroupItems(value[0], this.defaultScope, data);
                                },
                                handleChange: (event) => {
                                    this.handleChange(event, data);
                                },
                                showAllData: (value) => {
                                    this.loadGroupItems(value[0], this.defaultScope, data, 0);
                                },
                                showFilterData: (value) => {
                                    this.loadGroupItems(value[0], this.defaultScope, data, 1);
                                },
                                selectItemChange: (value, selectedData) => {
                                    this.loadGroupItems(value[0], value[1], data, 1);
                                }
                            }
                        }, [
                            h('Button', '分配')
                        ])
                    ])
                ]);
            },
            loadItems (obj) {
                if (!(obj instanceof Object)) {
                    obj = JSON.parse(obj);
                }
                this.defaultScope = obj.scope;
                this.currentType = obj.type;
            },
            getItemOriginal (data, filter = 1) {
                this.dataItems = this.initDataItems = [];
                this.axios.get('{{host_v1}}/auth/item/relation/original', {
                    params: {
                        scope: this.defaultScope,
                        type: this.currentType,
                        id: data.relation_id,
                        filter: filter
                    }
                }).then(menus => {
                    this.dataItems = this.initDataItems = menus.data.data;
                });
            },
            loadGroupItems (itemType, scope, data, filter = 1) {
                this.groupData = [];
                this.targetItems = [];
                Promise.all([
                    this.axios.get('{{host_v1}}/auth/item/group/original', {
                        params: {
                            id: data.id,
                            type: this.currentType,
                            filter: filter,
                            scope: scope,
                            returnType: itemType
                        }
                    }),
                    this.axios.get('{{host_v1}}/auth/item/group/target', {
                        params: {
                            id: data.id
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
                this.axios.post('{{host_v1}}/auth/item/group/' + data.id, {
                    ids: targetData,
                    scope: this.defaultScope
                }).then(response => {
                    if (response.data.code === '0') {
                        this.targetItems = targetData;
                    }
                });
            },
            loadItemRelation (type) {
                this.initData(Number.parseInt(type));
            }
        },
        created () {
            this.initData();
        }
    };
</script>