<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                菜单管理
            </p>
            <div>
                <Tabs value="0">
                    <TabPane :label="tree.name" :name="'' + index" v-for="(tree, index) in treeData">
                        <Tree :data="tree.data" :render="renderContent" style="width:400px;" ></Tree>
                    </TabPane>
                </Tabs>
            </div>
        </Card>
        <Modal v-model="modal1" title="节点管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="80">
                <FormItem label="节点名称" prop="item_name">
                    <Input type="text" v-model="formItem.item_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="节点代码" prop="item_code">
                    <Input type="text" v-model="formItem.item_code" placeholder=""></Input>
                </FormItem>
                <FormItem label="节点归属" prop="scope">
                    <Select v-model="formItem.scope" multiple>
                        <Option v-for="item in itemScopes" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="节点类型" prop="item_type">
                    <Select v-model="formItem.item_type">
                        <Option v-for="item in itemTypes" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="节点描述" prop="item_desc">
                    <Input type="text" v-model="formItem.item_desc" placeholder=""></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: 'auth_role',
        components: {
        },
        data () {
            return {
                treeData: [],
                modal1: false,
                formItem: {
                    item_code: '',
                    item_name: '',
                    item_desc: '',
                    item_type: '',
                    scope: []
                },
                itemScopes: [
                    {
                        value: 'admin',
                        name: '管理员权限'
                    },
                    {
                        value: 'user',
                        name: '学校权限'
                    }
                ],
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
                httpRequest: '',
                ruleInline: {
                    item_code: [
                        { required: true, message: '节点码不能为空', trigger: 'blur' }
                    ],
                    item_name: [
                        { required: true, message: '节点名称不能为空', trigger: 'blur' }
                    ],
                    scope: [
                        { required: true, type: 'array', message: '节点归属不能为空', trigger: 'change' }
                    ],
                    item_type: [
                        { required: true, type: 'number', message: '节点类型不能为空', trigger: 'change' }
                    ],
                    item_desc: [
                        { type: 'string', max: 191, message: '字符串最多为191', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{host_v1}}/auth/index/menu')
                ]).then(([trees]) => {
                    let groups = this.groupTree(trees.data.data);
                    if (groups.length > 0) {
                        for (let group in groups) {
                            groups[group]['data'] = this.parseTree(JSON.parse(JSON.stringify(groups[group]['data'])));
                        }
                    }
                    this.treeData = groups;
                    console.log(groups);

//                    for (let group of groups) {
//                        data.push(this.parseTree(group));
//                    }
//                    console.log(data)

//                    if (trees.data.data.length > 0) {
//                        for (let tree of trees.data.data) {
//                            tree.data.unshift(this.topMenu());
//                        }
//                        this.treeData = trees.data.data;
//                    } else {
//                        this.treeData = [{data: [this.topMenu()], name: '初始化菜单'}];
//                    }
                });
            },
            groupTree (items) {
                let treeData = {};
                if (items.length > 0) {
                    for (let tree of items) {
                        let scopes = tree.items.scope.split(',');
                        for (let scope of scopes) {
                            if (!treeData[scope]) {
                                treeData[scope] = {};
                                treeData[scope]['data'] = [];
                                for (let itemScope of this.itemScopes) {
                                    if (scope === itemScope.value) {
                                        treeData[scope]['name'] = itemScope.name;
                                    }
                                }
                            }
                            tree['expand'] = true;
                            treeData[scope]['data'].push(tree);
                        }
                    }
                }

                console.log(treeData)

                return Object.values(treeData);
            },
            parseTree (data, id = null) {
                let tree = [];
                for (let item of data) {
                    if (item.parent_id === id) {
                        let res = this.parseTree(data, item.id);
                        if (res.length > 0) {
                            item['children'] = res;
                        }
                        tree.push(item);
                    }
                }
                return tree;
            },
            topMenu () {
                return {
                    title: '添加顶级菜单',
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
                                h('Button', {
                                    props: Object.assign({}, this.buttonProps, {
                                        icon: 'ios-plus-empty',
                                        type: 'primary'
                                    }),
                                    style: {
                                        width: '52px'
                                    },
                                    on: {
                                        click: () => {
                                            this.httpRequest = this.actionModal('formItem', 'store', data);
                                            this.httpRequest.next();
                                        }
                                    }
                                })
                            ])
                        ]);
                    }
                };
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
            store (data) {
                this.formItem.id = data.id;
                this.axios.post('{{host_v1}}/auth/store/menu', this.formItem).then(response => {
                    if (this.formItem.id) {
                        const children = data.children || [];
                        children.push(response.data.data);
                        this.$set(data, 'children', children);
                    } else {
                        this.initData();
                    }

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
                        h('span', data.items.item_name)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-plus-empty'
                            }),
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                'click': () => {
                                    this.httpRequest = this.actionModal('formItem', 'store', data);
                                    this.httpRequest.next();
                                }
                            }
                        }),
                        h('Poptip', {
                            props: {
                                confirm: true,
                                title: '您确定要删除该节点(及以下节点)吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.axios.post('{{host_v1}}/auth/destroy/menu/' + data.id).then((response) => {
                                        if (response.data.code === '0') {
                                            const parentKey = root.find(el => el === node).parent;
                                            if (parentKey) {
                                                const parent = root.find(el => el.nodeKey === parentKey).node;
                                                const index = parent.children.indexOf(data);
                                                parent.children.splice(index, 1);
                                            } else {
                                                for (let tree of this.treeData) {
                                                    for (let [index, t] of tree.data.entries()) {
                                                        if (t.id === data.id) {
                                                            tree.data.splice(index, 1);
                                                        }
                                                    }
                                                }
                                            }
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
            }
        },
        created () {
            this.initData();
        }
    };
</script>