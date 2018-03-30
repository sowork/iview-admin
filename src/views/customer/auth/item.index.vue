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
            <div>
                <div class="margin-bottom-10">
                    <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store')) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                </div>
                <Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
        </Card>
        <Modal v-model="modal1" title="节点管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="80">
                <FormItem label="节点代码" prop="item_code">
                    <Input type="text" v-model="formItem.item_code" placeholder=""></Input>
                </FormItem>
                <FormItem label="节点名称" prop="item_name">
                    <Input type="text" v-model="formItem.item_name" placeholder=""></Input>
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
        name: 'auth_permission',
        data () {
            return {
                httpRequest: '',
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
                editInlineColumns: [
                    {
                        title: '序号',
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '节点代码',
                        align: 'center',
                        key: 'item_code'
                    },
                    {
                        title: '节点名称',
                        align: 'center',
                        key: 'item_name'
                    },
                    {
                        title: '节点归属',
                        align: 'center',
                        render: (h, params) => {
                            let scopeStr = [];
                            for (let item of this.itemScopes) {
                                for (let scope of params.row.scope.split(',')) {
                                    if (item.value === scope) {
                                        scopeStr.push(item.name);
                                    }
                                }
                            }
                            return scopeStr.join(',');
                        }
                    },
                    {
                        title: '节点类型',
                        align: 'center',
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
                                                name: 'item.group',
                                                query: {data: JSON.stringify(params.row)}
                                            });
                                        }
                                    }
                                }, text)
                            ]);
                        }
                    },
                    {
                        title: '节点描述',
                        align: 'center',
                        key: 'item_desc'
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
                                            this.$router.push({
                                                name: 'item.relation',
                                                query: {data: JSON.stringify(params.row)}
                                            });
                                        }
                                    }
                                }, '节点关联'),
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
                    item_code: '',
                    item_name: '',
                    item_desc: '',
                    item_type: '',
                    scope: []
                },
                ruleInline: {
                    item_code: [
                        { required: true, message: '节点码不能为空', trigger: 'blur' }
                    ],
                    item_name: [
                        { required: true, message: '节点名称不能为空', trigger: 'blur' }
                    ],
                    item_desc: [
                        { type: 'string', max: 191, message: '字符串最多为191', trigger: 'blur' }
                    ],
                    scope: [
                        { required: true, type: 'array', message: '节点归属不能为空', trigger: 'change' }
                    ],
                    item_type: [
                        { required: true, type: 'number', message: '节点类型不能为空', trigger: 'change' }
                    ]
                },
                modal1: false
            };
        },
        methods: {
            initData () {
                this.axios.get('{{host_v1}}/auth/item').then(response => {
                    this.editInlineData = response.data.data;
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
                this.axios.post('{{host_v1}}/auth/item', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.unshift(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{host_v1}}/auth/item/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{host_v1}}/auth/item/' + this.formItem.id, this.formItem).then(response => {
                    this.editInlineData.splice(index, 1);
                });
            },
            reset (name) {
                this.$refs[name].resetFields();
            },
            dblClick (row, index) {
                row.scope = row.scope.split(',');
                this.formItem = row;
                this.httpRequest = this.actionModal('formItem', 'update', index);
                this.httpRequest.next();
            }
        },
        created () {
            this.initData();
        }
    };
</script>