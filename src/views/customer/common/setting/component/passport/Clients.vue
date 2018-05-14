<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                OAuth客户端列表
            </p>
            <div>
                <div class="margin-bottom-10">
                    <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store')) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                </div>
                <Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
        </Card>
        <Modal v-model="modal1" title="客户端管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="100">
                <FormItem label="客户端名称" prop="name">
                    <Input type="text" v-model="formItem.name" placeholder=""></Input>
                </FormItem>
                <FormItem label="重定向地址" prop="redirect">
                    <Input type="text" v-model="formItem.redirect" placeholder=""></Input>
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
        name: 'Clients',
        data () {
            return {
                httpRequest: '',
                editInlineColumns: [
                    {
                        title: '客户端ID',
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '客户端名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '密钥',
                        align: 'center',
                        key: 'secret'
                    },
                    {
                        title: '重定向地址',
                        align: 'center',
                        key: 'redirect'
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
                formItem: {
                    name: '',
                    secret: '',
                    item_desc: '',
                    redirect: ''
                },
                ruleInline: {
                    name: [
                        { required: true, message: '客户端名称不能为空', trigger: 'blur' }
                    ],
                    redirect: [
                        { required: true, message: '重定向地址不能为空', trigger: 'blur' }
                    ]
                },
                modal1: false
            };
        },
        ready () {
            this.initData();
        },
        mounted () {
            this.initData();
        },

        methods: {
            initData () {
                this.getClients();
            },
            getClients () {
                this.axios.get('{{host}}/oauth/clients')
                    .then(response => {
                        this.editInlineData = response.data;
                    });
            },
            * actionModal (name, method, index = 0) {
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
            store () {
                this.formItem._method = 'post';
                this.axios.post('{{host}}/oauth/clients', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.unshift(response.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{host}}/oauth/clients/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, Object.assign(this.formItem, response.data));
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{host}}/oauth/clients/' + this.formItem.id, this.formItem).then(response => {
                    this.editInlineData.splice(index, 1);
                });
            },
            reset (name) {
                this.$refs[name].resetFields();
            },
            dblClick (row, index) {
                this.formItem = row;
                this.httpRequest = this.actionModal('formItem', 'update', index);
                this.httpRequest.next();
            }
        }
    };
</script>
