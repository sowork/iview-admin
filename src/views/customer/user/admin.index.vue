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
    import PopTipTransfer from '../auth/component/PopTipTransfer.vue';
    import Vue from 'vue';

    Vue.component('PopTipTransfer', PopTipTransfer);

    export default {
        components: {
        },
        data () {
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
                                h('PopTipTransfer', {
                                    props: {
                                        groupData: this.groupData,
                                        targetItems: this.targetItems,
                                        listStyle: this.listStyle,
                                        operations: this.operations,
                                        renderItem: this.renderItem,
                                        items: this.selectItems,
                                        itemDefaultValue: this.returnType,
                                        placement: 'left'
                                    },
                                    on: {
                                        onPopperShow: (value) => {
                                            this.loadGroupItems(value, params.row);
                                        },
                                        handleChange: (event) => {
                                            this.handleChange(event, params.row);
                                        },
                                        showAllData: (value) => {
                                            this.loadGroupItems(value, params.row, 0);
                                        },
                                        showFilterData: (value) => {
                                            this.loadGroupItems(value, params.row, 1);
                                        },
                                        selectChange: (value) => {
                                            this.loadGroupItems(value, params.row);
                                            this.returnType = value;
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
                },
                currentScope: '',
                currentType: '',
                itemTypes: [
                    {
                        value: 3,
                        name: '角色',
                        level: 3,
                        scopes: [
                            {
                                value: 'admin',
                                name: '后台角色'
                            },
                            {
                                value: 'user',
                                name: '前台角色'
                            }
                        ]
                    },
                    {
                        value: 2,
                        name: '菜单',
                        level: 2,
                        scopes: [
                            {
                                value: 'admin',
                                name: '后台菜单'
                            },
                            {
                                value: 'user',
                                name: '前台菜单'
                            }
                        ]
                    },
                    {
                        value: 1,
                        name: '权限',
                        level: 1,
                        scopes: [
                            {
                                value: 'admin',
                                name: '后台权限'
                            },
                            {
                                value: 'user',
                                name: '前台权限'
                            }
                        ]
                    }
                ],
                dataItems: [],
                initDataItems: [],
                groupData: [],
                targetItems: [],
                selectItems: [],
                returnType: 0,
                listStyle: {
                    width: '250px',
                    height: '300px'
                },
                operations: ['To left', 'To right']
            };
        },
        methods: {
            initData () {
                this.returnType = this.itemTypes[0]['value'];
                for (let item of this.itemTypes) {
                    this.selectItems.push({
                        name: item.name,
                        value: item.value
                    });
                }

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
                this.axios.post('{{host_v1}}/admin', this.formItem).then(response => {
                    this.editInlineData.push(response.data.data);
                }).then(response => {
                    this.modal1 = false;
                });
            },
            update (index) {
                this.formItem._method = 'put';
                Promise.all([
                    this.axios.post('{{host_v1}}/admin/' + this.formItem.id, this.formItem)
                ]).then(([$admin, $roles]) => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, $admin.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{host_v1}}/admin/' + this.formItem.id, this.formItem).then(response => {
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
            loadGroupItems (value, data, filter = 0) {
                this.groupData = [];
                this.targetItems = [];
                Promise.all([
                    this.axios.get('{{host_v1}}/auth/item/group/original', {
                        params: {
                            type: this.currentType,
                            filter: filter,
                            scope: 'admin',
                            returnType: value
                        }
                    }),
                    this.axios.get('{{host_v1}}/auth/item/assignment/target', {
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
                this.axios.post('{{host_v1}}/auth/item/assignment/' + data.id, {
                    ids: targetData,
                    scope: this.currentScope
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