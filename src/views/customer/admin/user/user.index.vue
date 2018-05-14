<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                前台用户
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
        <Modal :loading="loading" v-model="modal1" title="前台用户" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="学校名称" prop="school_id">
                    <Select v-model="formItem.school_id">
                        <Option v-for="item in schools" :value="item.id" :key="item.id">{{ item.school_name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="用户姓名" prop="user_name">
                    <Input v-model="formItem.user_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="账户名称" prop="user_email">
                    <Input v-model="formItem.user_email" placeholder=""></Input>
                </FormItem>
                <FormItem label="账户密码" prop="password">
                    <Input type="password" v-model="formItem.password" placeholder=""></Input>
                </FormItem>
                <FormItem label="用户电话" prop="user_tel">
                    <Input v-model="formItem.user_tel" placeholder=""></Input>
                </FormItem>
                <FormItem label="用户性别" prop="user_sex">
                    <Select v-model="formItem.user_sex">
                        <Option v-for="item in sexTypes" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="用户生日" prop="user_birthday">
                    <DatePicker @on-change="parseDate" format="yyyy-MM-dd HH:mm:ss" :value="formItem.user_birthday" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
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
    import PopTipTransfer from '../../common/auth/component/PopTipTransfer.vue';
    import Vue from 'vue';

    Vue.component('PopTipTransfer', PopTipTransfer);
    export default {
        name: 'paper_index',
        components: {
        },
        data () {
            const validePhone = (rule, value, callback) => {
                var re = /^1[0-9]{10}$/;
                if (!re.test(value)) {
                    callback(new Error('请输入正确格式的手机号'));
                } else {
                    callback();
                }
            };
            return {
                editInlineColumns: [
                    {
                        title: '序号',
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '用户名称',
                        align: 'center',
                        key: 'user_name'
                    },
                    {
                        title: '账户名称',
                        align: 'center',
                        key: 'user_email'
                    },
                    {
                        title: '用户电话',
                        align: 'center',
                        key: 'user_tel'
                    },
                    {
                        title: '性别',
                        align: 'center',
                        key: 'user_sex'
                    },
                    {
                        title: '用户生日',
                        align: 'center',
                        key: 'user_birthday'
                    },
                    {
                        title: '学校',
                        align: 'center',
                        render: (h, params) => {
                            for (let school of this.schools) {
                                if (school.id === Number.parseInt(params.row.school_id)) {
                                    return school.school_name;
                                }
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('PopTipTransfer', {
                                    props: {
                                        groupData: this.groupData,
                                        targetItems: this.targetItems,
                                        listStyle: this.listStyle,
                                        operations: this.operations,
                                        renderItem: this.renderItem,
                                        items: this.itemTypes,
                                        itemDefaultValue: this.defaultItemValue,
                                        placement: 'left'
                                    },
                                    on: {
                                        onPopperShow: (value) => {
                                            this.loadGroupItems(value[0], value[1], params.row);
                                        },
                                        handleChange: (event) => {
                                            this.handleChange(event, params.row);
                                        },
                                        showAllData: (value) => {
                                            this.loadGroupItems(value[0], value[1], params.row, 0);
                                        },
                                        showFilterData: (value) => {
                                            this.loadGroupItems(value[0], value[1], params.row);
                                        },
                                        selectItemChange: (value, selectedData) => {
                                            this.loadGroupItems(value[0], value[1], params.row);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        }
                                    }, '授权')
                                ]),
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
                schools: [],
                sexTypes: [
                    {
                        value: '男',
                        name: '男'
                    },
                    {
                        value: '女',
                        name: '女'
                    }
                ],
                httpRequest: '',
                formItem: {
                    user_name: '',
                    user_email: '',
                    password: '',
                    user_birthday: '',
                    user_tel: '',
                    user_sex: '',
                    school_id: ''
                },
                ruleValidate: {
                    user_name: [
                        {required: true, type: 'string', message: '用户姓名不能为空', trigger: 'blur'}
                    ],
                    user_email: [
                        {required: true, type: 'string', message: '账户名称不能为空', trigger: 'blur'}
                    ],
                    password: [
                        { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                        { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                    ],
                    user_tel: [
                        {required: true, type: 'string', message: '手机号码不能为空', trigger: 'blur'},
                        {validator: validePhone}
                    ],
                    user_sex: [
                        {required: true, type: 'string', message: '用户性别不能为空', trigger: 'change'}
                    ],
                    school_id: [
                        {required: true, type: 'number', message: '请选择归属学校', trigger: 'blur'}
                    ]
                },
                roles: [],
                checkAllGroup: [],
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
                this.defaultItemValue = [
                    this.itemTypes[0]['value'],
                    this.itemTypes[0]['children'][0].value
                ];

                Promise.all([
                    this.axios.get('{{host_v1}}/user', {
                        params: {
                            'page': this.page,
                            'number': this.number
                        }
                    }),
                    this.axios.get('{{host_v1}}/school')
                ]).then(([users, schools]) => {
                    this.editInlineData = users.data.data.data;
                    this.total = users.data.data.total;
                    this.schools = schools.data.data;
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
                this.axios.post('{{host_v1}}/user', this.formItem).then(response => {
                    this.editInlineData.push(response.data.data);
                    return this.axios.post('{{host_v1}}/user/add/roles/' + response.data.data.id, roleData);
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
                    this.axios.post('{{host_v1}}/user/' + this.formItem.id, this.formItem),
                    this.axios.post('{{host_v1}}/user/add/roles/' + this.formItem.id, roleData)
                ]).then(([$user, $roles]) => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, $user.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{host_v1}}/user/' + this.formItem.id, this.formItem).then(response => {
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
            },
            parseDate (date) {
                this.formItem.user_birthday = date;
            },
            loadGroupItems (itemType, scope, data, filter = 1) {
                this.groupData = [];
                this.targetItems = [];
                Promise.all([
                    this.axios.get('{{host_v1}}/auth/item/group/original', {
                        params: {
                            type: itemType,
                            filter: filter,
                            scope: scope,
                            returnType: itemType
                        }
                    }),
                    this.axios.get('{{host_v1}}/auth/item/assignment/target', {
                        params: {
                            id: data.id,
                            provider: 'users'
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
                this.axios.post('{{host_v1}}/auth/item/assignment/' + data.id, {
                    ids: targetData,
                    provider: 'users'
                }).then(response => {
                    if (response.data.code === '0') {
                        this.targetItems = targetData;
                    }
                });
            }
        },
        created () {
            this.initData();
        }
    };
</script>