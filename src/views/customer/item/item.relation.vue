<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                节点关联关系
            </p>
            <div>
                <Tree :data="treeData" :render="renderContent" style="width:500px;"></Tree>
            </div>
        </Card>
    </div>
</template>

<script>
    import PopTipTable from './component/PopTipTable.vue';
    import Vue from 'vue';
    Vue.component('PopTipTable', PopTipTable);

    export default {
        name: 'auth_role',
        components: {
            PopTipTable
        },
        data () {
            return {
                intent: JSON.parse(this.$route.query.data),
                treeData: [],
                formItem: {
                    item_name: '',
                    item_desc: ''
                },
                itemTypes: [
                    {
                        value: 1,
                        name: '权限'
                    },
                    {
                        value: 2,
                        name: '菜单'
                    },
                    {
                        value: 3,
                        name: '角色'
                    }
                ],
                columns: [
                    {
                        title: '节点名称',
                        width: '90',
                        key: 'item_name'
                    },
                    {
                        title: '节点描述',
                        width: '90',
                        key: 'item_desc'
                    },
                    {
                        title: '节点类型',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.item_type === 1 ? 'blue' : row.item_type === 2 ? 'green' : 'red';
                            let text = '';
                            for (let item of this.itemTypes) {
                                if (item.value === params.row.item_type) {
                                    text = item.name;
                                }
                            }
                            return h('a', [
                                h('Tag', {
                                    props: {
                                        type: 'dot',
                                        color: color
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.$router.push({
                                                name: 'item.relation',
                                                query: {data: JSON.stringify(params.row)}
                                            });
                                        }
                                    }
                                }, text)
                            ]);
                        }
                    }
                ],
                dataItems: [],
                initDataItmes: []
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{host_v1}}/auth/item/relation/tree/' + this.intent.id),
                    this.axios.get('{{host_v1}}/auth/item/tree/' + this.intent.id)
                ]).then(([intents, items]) => {
                    this.treeData = [
                        {
                            title: this.intent.item_name,
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
                                                dbClick: this.dbClick
                                            }
                                        }, [
                                            h('Button', {
                                                props: Object.assign({}, this.buttonProps, {
                                                    icon: 'ios-plus-empty',
                                                    type: 'primary'
                                                }),
                                                style: {
                                                    width: '52px'
                                                }
                                            })
                                        ])
                                    ])
                                ]);
                            },
                            item_id: this.intent.id,
                            children: intents.data.data
                        }
                    ];
                    this.dataItems = this.initDataItmes = items.data.data;
                });
            },
            * actionModal (name, method, index) {
                if (method === 'store') {
                    this.reset(name);
                }
                yield this.modal1 = true;
                while (true) {
                    yield this.$refs[name].validate(valid => {
                        if (valid) {
                            this[method](index);
                        }
                    });
                }
            },
            reset (name) {
                this.$refs[name].resetFields();
            },
            store () {
                let permissionData = {
                    'ids': this.checkAllGroup,
                    '_method': 'put'
                };
                this.axios.post('{{host_v1}}/auth/store/role', this.formItem).then(response => {
                    this.editInlineData.push(response.data.data);
                    return this.axios.post('{{host_v1}}/auth/role/add/permissions/' + response.data.data.id, permissionData);
                }).then(response => {
                    this.modal1 = false;
                });
            },
            update (index) {
                this.formItem._method = 'put';
                let permissionData = {
                    'ids': this.checkAllGroup,
                    '_method': 'put'
                };
                Promise.all([
                    this.axios.post('{{host_v1}}/auth/update/role/' + this.formItem.id, this.formItem),
                    this.axios.post('{{host_v1}}/auth/role/add/permissions/' + this.formItem.id, permissionData)
                ]).then(([role, permissions]) => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, role.data.data);
                    this.checkAllGroup = permissions.data.data;
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{host_v1}}/auth/destroy/role/' + this.formItem.id, this.formItem).then(response => {
                    this.editInlineData.splice(index, 1);
                });
            },
            dblClick (row, index) {
                this.formItem = row;
                this.httpRequest = this.actionModal('formItem', 'update', index);
                this.httpRequest.next();
            },
            renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
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
                                dbClick: this.dbClick
                            }
                        }, [
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'ios-plus-empty'
                                }),
                                style: {
                                    marginRight: '8px'
                                }
                            })
                        ]),
                        h('Poptip', {
                            props: {
                                confirm: true,
                                title: '您确定要删除该节点(及以下节点)吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    let other = {
                                        _method: 'delete'
                                    };
                                    this.axios.post('{{host_v1}}/auth/item/relation/tree/' + data.id, other).then((response) => {
                                        if (response.data.code === '0') {
                                            const parentKey = root.find(el => el === node).parent;
                                            const parent = root.find(el => el.nodeKey === parentKey).node;
                                            const index = parent.children.indexOf(data);
                                            parent.children.splice(index, 1);
                                        }
                                    });
                                }
                            }
                        }, [
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'ios-minus-empty'
                                })
                            })
                        ])
                    ])
                ]);
            },
            search (searchContent) {
                let res = [];
                let dataClone = JSON.parse(JSON.stringify(this.initDataItmes));
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
            dbClick (row, index, parentRow) {
                this.axios.post('{{host_v1}}/auth/item/relation/tree/' + parentRow.id, {
                    id: row.id,
                    pitem_id: parentRow.item_id
                }).then((response) => {
                    if (response.data.code === '0') {
                        const children = parentRow.children || [];
                        children.push(response.data.data);
                        this.$set(parentRow, 'children', children);
                    }
                });
            }
        },
        created () {
            this.initData();
        }
    };
</script>