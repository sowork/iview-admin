<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                机构用户
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
        <Modal :loading="loading" v-model="modal1" title="机构用户" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="账户名称" prop="account">
                    <Input v-model="formItem.account" placeholder=""></Input>
                </FormItem>
                <FormItem label="账户密码" prop="password">
                    <Input type="password" v-model="formItem.password" placeholder="不填默认为123456"></Input>
                </FormItem>
                <FormItem label="用户姓名" prop="real_name">
                    <Input v-model="formItem.real_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="用户电话" prop="tel">
                    <Input v-model="formItem.tel" placeholder=""></Input>
                </FormItem>
                <FormItem label="用户邮箱" prop="email">
                    <Input v-model="formItem.email" placeholder=""></Input>
                </FormItem>
                <hr>
                <CheckboxGroup v-model="formItem.rolesIds">
                    <Checkbox :label="role.id" v-for="role in roles">
                        <span v-text="role.item_name"></span>
                    </Checkbox>
                </CheckboxGroup>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import PopTipTransfer from '../../common/auth/component/PopTipTransfer.vue';
    import Vue from 'vue';

    Vue.component('PopTipTransfer', PopTipTransfer);
    export default {
        name: 'paper_index',
        components: {
        },
        data () {
            const validePhone = (rule, value, callback) => {
                if (value === '') {
                    callback();
                }
                var re = /^1[0-9]{10}$/;
                if (value !== null && !re.test(value)) {
                    callback(new Error('请输入正确格式的手机号'));
                } else {
                    callback();
                }
            };
            return {
                org_name: '',
                options1: [],
                loading1: false,
                itemTypes: [
                    {
                        value: 3,
                        label: '角色',
                        level: 3,
                        children: [
                            {
                                value: 'admin_roles',
                                label: '智慧云端角色'
                            },
                            {
                                value: 'school_roles',
                                label: '学校端角色'
                            },
                            {
                                value: 'org_roles',
                                label: '机构端角色'
                            }
                        ]
                    },
                    {
                        value: 2,
                        label: '菜单',
                        level: 2,
                        children: [
                            {
                                value: 'admin_menus',
                                label: '智慧云端菜单'
                            },
                            {
                                value: 'admin_top_menus',
                                label: '智慧云端顶部菜单'
                            },
                            {
                                value: 'school_menus',
                                label: '学校端菜单'
                            }
                        ]
                    },
                    {
                        value: 1,
                        label: '权限',
                        level: 1,
                        children: [
                            {
                                value: 'admin_permissions',
                                label: '智慧云端权限'
                            },
                            {
                                value: 'school_permissions',
                                label: '学校端权限'
                            },
                            {
                                value: 'org_permissions',
                                label: '机构端权限'
                            }
                        ]
                    }
                ],
                editInlineColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '账号',
                        align: 'center',
                        key: 'account'
                    },
                    {
                        title: '用户姓名',
                        align: 'center',
                        key: 'real_name'
                    },
                    {
                        title: '所属机构',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.org.org_name);
                        }
                    },
                    {
                        title: '用户电话',
                        align: 'center',
                        key: 'tel'
                    },
                    {
                        title: '用户邮箱',
                        align: 'center',
                        key: 'email'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
//                                h('PopTipTransfer', {
//                                    props: {
//                                        showBtn1: false,
//                                        showBtn2: false,
//                                        groupData: this.groupData,
//                                        targetItems: this.targetItems,
//                                        listStyle: this.listStyle,
//                                        operations: this.operations,
//                                        renderItem: this.renderItem,
//                                        items: this.itemTypes,
//                                        itemDefaultValue: this.defaultItemValue,
//                                        placement: 'left'
//                                    },
//                                    on: {
//                                        onPopperShow: (value) => {
//                                            this.loadGroupItems(value[0], value[1], params.row, 0);
//                                        },
//                                        handleChange: (event) => {
//                                            this.handleChange(event, params.row);
//                                        },
//                                        showAllData: (value) => {
//                                            this.loadGroupItems(value[0], value[1], params.row, 0);
//                                        },
//                                        showFilterData: (value) => {
//                                            this.loadGroupItems(value[0], value[1], params.row);
//                                        },
//                                        selectItemChange: (value, selectedData) => {
//                                            this.loadGroupItems(value[0], value[1], params.row, 0);
//                                        }
//                                    }
//                                }, [
//                                    h('Button', {
//                                        props: {
//                                            type: 'text',
//                                            size: 'small'
//                                        }
//                                    }, '授权')
//                                ]),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.org_name = params.row.org.org_name;
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
                roles: [],
                formItem: {
                    account: '',
                    real_name: '',
                    password: '',
                    nickname: '',
                    email: null,
                    tel: null,
                    org_id: '',
                    rolesIds: []
                },
                ruleValidate: {
                    org_id: [
                        {required: true, type: 'number', message: '机构是必填项', trigger: 'blur'}
                    ],
                    account: [
                        {required: true, type: 'string', message: '账户名称不能为空', trigger: 'blur'}
                    ],
                    password: [
                        { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                        { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                    ],
                    tel: [
                        {validator: validePhone}
                    ],
                    email: [
                        {type: 'email', message: '邮箱格式错误', trigger: 'blur'}
                    ]
                },
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
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/org/sub/users', {
                        params: {
                            'page': this.page,
                            'number': this.number
                        }
                    }),
                    this.axios.get('{{auth_host_v1}}/auth/items', {
                        params: {
                            type: 3,
                            scope: 'org_roles'
                        }
                    })
                ]).then(([users, roles]) => {
                    for (let user of users.data.data.data) {
                        user.rolesIds = [];
                        if (user.roles !== undefined && user.roles.length > 0) {
                            for (let role of user.roles) {
                                user.rolesIds.push(role.item_id);
                            }
                        }
                    }
                    this.editInlineData = users.data.data.data;
                    this.total = users.data.data.total;
                    this.roles = roles.data.data;
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
                this.axios.post('{{base_host_v1}}/org/sub/users', this.formItem).then(response => {
                    this.editInlineData.push(response.data.data);
                }).then(response => {
                    this.modal1 = false;
                });
            },
            update (index) {
                this.formItem._method = 'put';
                Promise.all([
                    this.axios.post('{{base_host_v1}}/org/sub/users/' + this.formItem.id, this.formItem)
                ]).then(([response]) => {
                    this.modal1 = false;
                    let user = response.data.data;
//                    user.rolesIds = this.formItem.rolesIds;
                    this.editInlineData.splice(index, 1, user);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/org/sub/users/' + this.formItem.id, this.formItem).then(response => {
                    this.editInlineData.splice(index, 1);
                });
            },
            dblClick (row, index) {
                this.formItem = row;
                this.httpRequest = this.actionModal('formItem', 'update', index);
                this.httpRequest.next();
            },
            reset (name) {
                this.options1 = [];
                this.$refs[name].resetFields();
            },
            onChange (page, number) {
                this.page = page;
                this.initData();
            },
            onPageSizeChange (number) {
                this.number = number;
                this.initData();
            },
            parseDate (date) {
                this.formItem.user_birthday = date;
            },
            loadGroupItems (itemType, scope, data, filter = 1) {
                this.groupData = [];
                this.targetItems = [];
                Promise.all([
                    this.axios.get('{{auth_host_v1}}/auth/item/group/original', {
                        params: {
                            filter: filter,
                            returnScope: scope,
                            returnType: itemType
                        }
                    }),
                    this.axios.get('{{auth_host_v1}}/auth/item/assignment/target', {
                        params: {
                            id: data.id,
                            provider: 'org_users'
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
                this.axios.post('{{auth_host_v1}}/auth/item/assignment/' + data.id, {
                    ids: targetData,
                    provider: 'org_users'
                }).then(response => {
                    if (response.data.code === '0') {
                        this.targetItems = targetData;
                    }
                });
            },
            searchOrg (query) {
                if (query === '') return;
                this.loading1 = true;
                this.axios.get('{{base_host_v1}}/org/search', {
                    params: {
                        name: query
                    }
                }).then(response => {
                    this.loading1 = false;
                    this.options1 = response.data.data;
                });
            }
        },
        watch: {
            'formItem.email': function  (val, old) {
                if (val === '') {
                    this.formItem.email = null;
                }
            },
            'formItem.tel': function  (val, old) {
                if (val === '') {
                    this.formItem.tel = null;
                }
            }
        },
        created () {
            this.initData();
        }
    };
</script>