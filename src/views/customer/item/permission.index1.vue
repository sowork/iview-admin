<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                权限列表
            </p>
            <div style="width: 600px">
                <div class="margin-bottom-10">
                    <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store')) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                </div>
                <!--<Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>-->
                <Tree :data="data3" :render="renderContent"></Tree>
            </div>
        </Card>
        <Modal v-model="modal1" title="权限管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="80">
                <FormItem label="权限代码" prop="item_name">
                    <Input type="text" v-model="formItem.item_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="权限名称" prop="item_desc">
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
        name: 'auth_permission',
        data () {
            return {
                httpRequest: '',
                editInlineColumns: [
                    {
                        title: '序号',
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '权限代码',
                        align: 'center',
                        key: 'item_name'
                    },
                    {
                        title: '权限名称',
                        align: 'center',
                        key: 'item_desc'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.formItem = params.row;
                                            this.httpRequest = this.actionModal('formItem', 'update');
                                            this.httpRequest.next();
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.formItem = params.row;
                                            this.destroy();
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        }
                                    }, '删除')
                                ])
                            ]);
                        }
                    }
                ],
                editInlineData: [],
                formItem: {
                    item_name: '',
                    item_desc: ''
                },
                ruleInline: {
                    item_name: [
                        { required: true, message: '角色代码不能为空', trigger: 'blur' }
                    ],
                    item_desc: [
                        { required: true, message: '角色名称不能为空', trigger: 'blur' },
                        { type: 'string', max: 191, message: '字符串最多为191', trigger: 'blur' }
                    ]
                },
                modal1: false,
                data3: [
                    {
                        title: 'parent 1',
                        expand: true,
                        children: [
                            {
                                title: 'child 1-1',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-1-1',
                                        expand: true
                                    },
                                    {
                                        title: 'leaf 1-1-2',
                                        expand: true
                                    }
                                ]
                            },
                            {
                                title: 'child 1-2',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-2-1',
                                        expand: true
                                    },
                                    {
                                        title: 'leaf 1-2-1',
                                        expand: true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
        },
        methods: {
            initData () {
                this.axios.get('auth/permissions').then(response => {
                    this.editInlineData = response.data.data;
                });
            },
            * actionModal (name, method) {
                yield this.modal1 = true;
                while (true) {
                    yield this.$refs[name].validate(valid => {
                        if (valid) {
                            this[method]();
                        }
                    });
                }
            },
            reset (name) {
                this.$refs[name].resetFields();
            },
            store () {
                this.axios.post('auth/store/permission', this.formItem).then(response => {
                    this.modal1 = false;
                    this.initData();
                });
            },
            update () {
                this.formItem._method = 'put';
                this.axios.post('auth/update/permission/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                });
            },
            destroy () {
                this.formItem._method = 'delete';
                this.axios.post('auth/destroy/permission/' + this.formItem.id, this.formItem).then(response => {
                    this.initData();
                });
            },
            dblClick (row, status) {
                this.formItem = row;
                this.httpRequest = this.actionModal('formItem', 'update');
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
                                icon: 'ios-plus-empty'
                            }),
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                    this.httpRequest = this.actionModal('formItem', 'store');
                                    this.httpRequest.next();
                                }
                            }
                        }),
                        h('Poptip', {
                            props: {
                                confirm: true,
                                title: '您确定要删除这条数据吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.formItem = node;
                                    this.destroy();
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