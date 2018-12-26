<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                机构管理
            </p>
            <div class="edittable-table-height-con">
                <div class="margin-bottom-10">
                    <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store')) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                </div>
                <Table ref="table" @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
            <div class="margin-top-20">
                <Page @on-change="onChange" @on-page-size-change="onPageSizeChange" :total="total" show-total size="small" show-elevator show-sizer></Page>
            </div>
        </Card>
        <Modal :loading="loading" v-model="modal1" title="机构管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="机构名称" prop="org_name">
                    <Input v-model="formItem.org_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="机构类型" prop="org_type">
                    <Select v-model="formItem.org_type">
                        <Option v-for="item in org_type_lists" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="机构地址" prop="org_address">
                    <Input v-model="formItem.org_address" placeholder=""></Input>
                </FormItem>
                <FormItem label="机构邮箱" prop="org_email">
                    <Input v-model="formItem.org_email" placeholder=""></Input>
                </FormItem>
                <FormItem label="机构电话" prop="org_phone">
                    <Input v-model="formItem.org_phone" placeholder=""></Input>
                </FormItem>
                <FormItem label="机构联系人" prop="org_contacter">
                    <Input v-model="formItem.org_contacter" placeholder=""></Input>
                </FormItem>
                <FormItem label="机构官网" prop="org_website">
                    <Input v-model="formItem.org_website" placeholder=""></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认</Button>
            </div>
        </Modal>
        <Modal v-model="modal2" title="项目管理" @keydown.enter.native="httpRequest2.next()">
            <Form :model="formItem2" :rules="ruleValidate2" :label-width="80">
                <FormItem :label="item.label" prop="item" v-for="item in org_items">
                    <Input v-model="item.id" placeholder=""></Input>
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

    export default {
        data () {
            return {
                itemDefaultValue: [1],
                poptipTransferVisible: false,
                org_items: [],
                groupData: [],
                targetItems: [],
                item_type_lists: [
                    {
                        label: '内容应用',
                        value: 1
                    },
                    {
                        label: '课程',
                        value: 2
                    },
                    {
                        label: '产品',
                        value: 3
                    }
                ],
                org_type_lists: [
                    {
                        name: '医院机构',
                        value: 1
                    },
                    {
                        name: '学校机构',
                        value: 2
                    },
                    {
                        name: '康复机构',
                        value: 3
                    }
                ],
                editInlineColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '机构名称',
                        align: 'center',
                        key: 'org_name'
                    },
                    {
                        title: '机构类别',
                        align: 'center',
                        render: (h, params) => {
                            for (let type of Array.from(this.org_type_lists)) {
                                if (type.value === params.row.org_type) {
                                    return h('span', type.name);
                                }
                            }
                        }
                    },
                    {
                        title: '机构地址',
                        align: 'center',
                        key: 'org_address'
                    },
                    {
                        title: '机构邮箱',
                        align: 'center',
                        key: 'org_email'
                    },
                    {
                        title: '机构电话',
                        align: 'center',
                        key: 'org_phone'
                    },
                    {
                        title: '机构联系人',
                        align: 'center',
                        key: 'org_contacter'
                    },
                    {
                        title: '机构官网',
                        align: 'center',
                        key: 'org_website'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h(PopTipTransfer, {
                                    props: {
                                        visible: JSON.parse(JSON.stringify(this.poptipTransferVisible)),
                                        items: this.item_type_lists,
                                        showBtn1: false,
                                        showBtn2: false,
                                        showCascader: false,
                                        itemDefaultValue: this.itemDefaultValue,
                                        groupData: this.groupData,
                                        targetItems: this.targetItems
                                    },
                                    on: {
                                        onPopperShow: (value) => {
                                            this.getItem(value[0], params.row.id);
                                        },
                                        selectItemChange: (value, selectedData) => {
                                            this.getItem(value[0], params.row.id);
                                        },
                                        handleChange: (targetData, value) => {
                                            this.handleItem(targetData, params.row.id, value[0]);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        }
                                    }, '项目管理')
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
                modal2: false,
                loading: false,
                httpRequest: '',
                httpRequest2: '',
                formItem: {
                    org_name: '',
                    org_type: '',
                    org_address: '',
                    org_email: '',
                    org_phone: '',
                    org_contacter: '',
                    org_website: ''
                },
                formItem2: {
                    org_name: ''
                },
                ruleValidate: {
                    org_name: [
                        {required: true, message: '机构名称不能为空', trigger: 'blur'}
                    ],
                    org_type: [
                        {required: true, type: 'number', message: '机构类别不能为空', trigger: 'change'}
                    ],
                    org_address: [
                        {required: true, message: '机构地址不能为空', trigger: 'blur'}
                    ],
                    org_phone: [
                        {required: true, message: '机构电话不能为空', trigger: 'blur'},
                        {
                            pattern: /^(\+?0?86-?)?((13\d|14[57]|15[^4,\D]|17[3678]|18\d)\d{8}|170[059]\d{7})$/,
                            message: '电话格式错误',
                            trigger: 'blur'
                        }
                    ],
                    org_email: [
                        {required: true, message: '机构邮箱不能为空', trigger: 'blur'},
                        {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                    ],
                    org_contacter: [
                        {required: true, message: '机构联系人不能为空', trigger: 'blur'}
                    ],
                    org_website: [
                        {type: 'url', message: 'url格式错误', trigger: 'blur'}
                    ]
                },
                ruleValidate2: {

                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/org', {
                        params: {
                            'page': this.page,
                            'number': this.number
                        }
                    })
                ]).then(([orgs]) => {
                    this.editInlineData = orgs.data.data.data;
                    this.total = orgs.data.data.total;
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
                this.axios.post('{{base_host_v1}}/org', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.push(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{base_host_v1}}/org/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/org/' + this.formItem.id, this.formItem).then(response => {
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
            },
            onChange (page, number) {
                this.page = page;
                this.initData();
            },
            onPageSizeChange (number) {
                this.number = number;
                this.initData();
            },
            getItem (type, id) {
                this.groupData = [];
                Promise.all([
                    this.axios.get('{{base_host_v1}}/combos/filter'),
                    this.axios.get('{{base_host_v1}}/org/combo/target', {
                        params: {
                            id: id
                        }
                    })
                ]).then(([origin, target]) => {
                    if (origin.data.data !== '' && origin.data.data.length > 0) {
                        for (let item of origin.data.data) {
                            this.groupData.push({
                                key: item.id,
                                label: item.combo_name,
                                item_type: item.combo_type
                            });
                        }
                    }
                    if (target.data.data) {
                        this.targetItems = target.data.data;
                    }
                });
            },
            handleItem (targetData, id, type) {
                this.org_items = [];
                for (let item of this.groupData) {
                    if (item.item_type === type && targetData.indexOf(item.key)) {
                        this.org_items.push(item);
                    }
                }
                this.poptipTransferVisible = true;
//                this.modal2 = true;
                this.axios.post('{{base_host_v1}}/org/item/store', {
                    ids: targetData,
                    id: id
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