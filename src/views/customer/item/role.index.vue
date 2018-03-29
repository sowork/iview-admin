<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                角色列表
            </p>
            <div class="edittable-table-height-con">
                <div class="margin-bottom-10">
                    <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store')) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                </div>
                <Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
        </Card>
        <Modal v-model="modal1" title="角色管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="80">
                <FormItem label="角色代码" prop="item_name">
                    <Input type="text" v-model="formItem.item_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="角色名称" prop="item_desc">
                    <Input type="text" v-model="formItem.item_desc" placeholder=""></Input>
                </FormItem>
                <FormItem label="权限配置" :label-width="0">
                    <Scroll class="margin-top-20">
                        <CheckboxGroup v-model="checkAllGroup">
                            <Checkbox :label="permission.id" v-for="permission in permissions">
                                <span v-text="permission.item_desc"></span>
                            </Checkbox>
                        </CheckboxGroup>
                    </Scroll>
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
        data () {
            return {
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
                editInlineColumns: [
                    {
                        title: '序号',
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '角色代码',
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
                                            this.dblClick(JSON.parse(JSON.stringify(this.editInlineData[params.index])), params.index);
                                            this.setSelectPermissions(params.row);
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
                modal1: false,
                permissions: [],
                checkAllGroup: []
            };
        },
        methods: {
            initData () {
                this.axios.get('{{host_v1}}/auth/roles').then(response => {
                    this.editInlineData = response.data.data;
                });
                this.axios.get('{{host_v1}}/auth/permissions').then(response => {
                    this.permissions = response.data.data;
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
            setSelectPermissions (row) {
                this.axios.get('{{host_v1}}/auth/role/permissions/' + row.id).then(response => {
                    this.checkAllGroup = response.data.data;
                });
            }
        },
        created () {
            this.initData();
        }
    };
</script>