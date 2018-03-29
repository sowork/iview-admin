<style lang="less">
    @import '../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                后台用户
            </p>
            <div class="edittable-table-height-con">
                <div class="margin-bottom-10">
                    <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store')) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                </div>
                <Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
            <div class="margin-top-20">
                <Page @on-change="onChange" @on-page-size-change="onPageSizeChange" :total="total" show-total size="small" show-elevator show-sizer></Page>
            </div>
        </Card>
        <Modal :loading="loading" v-model="modal1" title="后台用户" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="用户姓名" prop="name">
                    <Input v-model="formItem.name" placeholder=""></Input>
                </FormItem>
                <FormItem label="账户名称" prop="username">
                    <Input v-model="formItem.username" placeholder=""></Input>
                </FormItem>
                <FormItem label="账户密码" prop="password">
                    <Input type="password" v-model="formItem.password" placeholder=""></Input>
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
        name: 'paper_index',
        components: {
        },
        data () {
            return {
                editInlineColumns: [
                    {
                        title: '序号',
                        align: 'center',
                        key: 'admin_id'
                    },
                    {
                        title: '用户名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '账户名称',
                        align: 'center',
                        key: 'username'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            params.row.id = params.row.admin_id;
                                            this.$router.push({
                                                name: 'item.assign',
                                                query: {data: JSON.stringify({scope: ['admin'], 'user': params.row})}
                                            });
                                        }
                                    }
                                }, '节点分配'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.dblClick(JSON.parse(JSON.stringify(this.editInlineData[params.index])), params.index);
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
                                            this.destroy(params.index);
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
                total: 0,
                page: 1,
                number: 10,
                modal1: false,
                loading: false,
                httpRequest: '',
                formItem: {
                    name: '',
                    username: '',
                    password: ''
                },
                ruleValidate: {
                    name: [
                        {required: true, type: 'string', message: '用户姓名不能为空', trigger: 'blur'}
                    ],
                    username: [
                        {required: true, type: 'string', message: '账户名称不能为空', trigger: 'blur'}
                    ],
                    password: [
                        { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                        { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{host_v1}}/admin', {
                        'page': this.page,
                        'number': this.number
                    })
                ]).then(([users]) => {
                    this.editInlineData = users.data.data.data;
                    this.total = users.data.data.total;
                });
            },
            * actionModal (name, method, index = 0) {
                if (method === 'store') {
                    this.reset(name);
                }
                yield (this.modal1 = true);
                while (true) {
                    yield this.$refs[name].validate(valid => {
                        if (valid) {
                            this[method](index);
                        }
                    });
                }
            },
            store () {
                this.formItem._method = 'post';
                let roleData = {
                    'ids': this.checkAllGroup,
                    _method: 'put'
                };
                this.axios.post('{{host_v1}}/admin', this.formItem).then(response => {
                    this.editInlineData.push(response.data.data);
                    return this.axios.post('{{host_v1}}/admin/add/roles/' + response.data.data.admin_id, roleData);
                }).then(response => {
                    this.modal1 = false;
                });
            },
            update (index) {
                this.formItem._method = 'put';
                let roleData = {
                    'ids': this.checkAllGroup,
                    '_method': 'put'
                };
                Promise.all([
                    this.axios.post('{{host_v1}}/admin/' + this.formItem.admin_id, this.formItem),
                    this.axios.post('{{host_v1}}/admin/add/roles/' + this.formItem.admin_id, roleData)
                ]).then(([$admin, $roles]) => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, $admin.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{host_v1}}/admin/' + this.formItem.admin_id, this.formItem).then(response => {
                    this.editInlineData.splice(index, 1);
                });
            },
            dblClick (row, index) {
                this.formItem = row;
                this.httpRequest = this.actionModal('formItem', 'update', index);
                this.httpRequest.next();
            },
            reset (name) {
                this.$refs[name].resetFields();
                this.checkAllGroup = [];
            },
            onChange (page, number) {
                this.page = page;
                this.initData();
            },
            onPageSizeChange (number) {
                this.number = number;
                this.initData();
            }
        },
        created () {
            this.initData();
        }
    };
</script>