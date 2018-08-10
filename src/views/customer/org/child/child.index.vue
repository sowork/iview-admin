<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                孩子管理
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
        <Modal :loading="loading" v-model="modal1" title="孩子管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="孩子姓名" prop="child_name">
                    <Input v-model="formItem.child_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="性别" prop="child_sex">
                    <Select v-model="formItem.child_sex">
                        <Option v-for="item in org_type_lists" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="孩子身份证号" prop="id_card">
                    <Input v-model="formItem.id_card" placeholder=""></Input>
                </FormItem>
                <FormItem label="出生日期" prop="child_birthday">
                    <DatePicker @on-change="changeDate" format="yyyy-MM-dd" :value="formItem.child_birthday" type="date" placeholder="选择日期"></DatePicker>
                </FormItem>
                <FormItem label="手机" prop="tel">
                    <Input v-model="formItem.tel" placeholder=""></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input type="password" v-model="formItem.password" placeholder="不填默认123456"></Input>
                </FormItem>
                <FormItem label="所在区域" prop="family_area">
                    <al-cascader v-model="formItem.family_area" level="2"/>
                </FormItem>
                <FormItem label="详细住址" prop="family_address">
                    <Input v-model="formItem.family_address" placeholder=""></Input>
                </FormItem>
                <FormItem label="家长姓名" prop="parent_name">
                    <Input v-model="formItem.parent_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="学校名称" prop="school_name">
                    <Input v-model="formItem.school_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="爱好" prop="interest">
                    <Input type="textarea" v-model="formItem.interest" placeholder=""></Input>
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
    import iviewArea from 'iview-area';
    Vue.use(iviewArea);

    export default {
        components: {
        },
        data () {
            return {
                groupData: [],
                targetItems: [],
                org_type_lists: [
                    {
                        name: '男',
                        value: 1
                    },
                    {
                        name: '女',
                        value: 2
                    }
                ],
                editInlineColumns: [
                    {
                        title: '序号',
                        align: 'center',
                        render: (h, params) => params.index + 1
                    },
                    {
                        title: '孩子姓名',
                        align: 'center',
                        key: 'child_name'
                    },
                    {
                        title: '性别',
                        align: 'center',
                        render: (h, params) => {
                            for (let type of Array.from(this.org_type_lists)) {
                                if (type.value === params.row.child_sex) {
                                    return type.name;
                                }
                            }
                        }
                    },
                    {
                        title: '孩子身份证号',
                        align: 'center',
                        key: 'id_card'
                    },
                    {
                        title: '出生日期',
                        align: 'center',
                        key: 'child_birthday'
                    },
                    {
                        title: '手机',
                        align: 'center',
                        key: 'tel'
                    },
                    {
                        title: '所属区域',
                        align: 'center',
                        render: (h, params) => {
                            return params.row.province + '/  ' + params.row.city + '/  ' + params.row.area;
                        }
                    },
                    {
                        title: '详细地址',
                        align: 'center',
                        key: 'family_address'
                    },
                    {
                        title: '家长姓名',
                        align: 'center',
                        key: 'parent_name'
                    },
                    {
                        title: '学校名称',
                        align: 'center',
                        key: 'school_name'
                    },
                    {
                        title: '爱好',
                        align: 'center',
                        key: 'interest'
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
                                        showBtn1: false,
                                        showBtn2: false,
                                        showCascader: false,
                                        groupData: this.groupData,
                                        targetItems: this.targetItems,
                                    },
                                    on: {
                                        onPopperShow: (value) => {
                                            this.getCombos(value[0], params.row.id);
                                        },
                                        handleChange: (targetData, value, direction, moveKeys) => {
                                            this.handleItem(targetData, params.row.id, direction, moveKeys);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        }
                                    }, '订购套餐')
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
                    child_name: '',
                    child_sex: '',
                    child_birthday: '',
                    tel: '',
                    password: '',
                    parent_name: '',
                    family_address: '',
                    province: '',
                    city: '',
                    area: '',
                    interest: '',
                    family_area: []
                },
                ruleValidate: {
                    child_name: [
                        {required: true, message: '孩子姓名不能为空', trigger: 'blur'}
                    ],
                    child_sex: [
                        {required: true, type: 'number', message: '性别不能为空', trigger: 'change'}
                    ],
                    id_card: [
                        {required: true, message: '孩子身份证号不能为空', trigger: 'blur'}
                    ],
                    child_birthday: [
                        {required: true, message: '出生日期不能为空', trigger: 'blur'}
                    ],
                    tel: [
                        {required: true, message: '手机号码不能为空', trigger: 'blur'},
                        {pattern: /^(\+?0?86-?)?((13\d|14[57]|15[^4,\D]|17[3678]|18\d)\d{8}|170[059]\d{7})$/, message: '电话格式错误', trigger: 'blur'}
                    ],
                    family_address: [
                        {required: true, message: '家庭住址不能为空', trigger: 'blur'}
                    ],
                    family_area: [
                        {required: true, type: 'array', message: '所在区域不能为空', trigger: 'change'}
                    ]
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/children', {
                        params: {
                            'page': this.page,
                            'number': this.number
                        }
                    })
                ]).then(([orgs]) => {
                    this.editInlineData = orgs.data.data.data;
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
                this.axios.post('{{base_host_v1}}/children', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.unshift(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{base_host_v1}}/children/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/children/' + this.formItem.id, this.formItem).then(response => {
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
            changeDate (date) {
                this.formItem.child_birthday = date;
            },
            getCombos (val, id) {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/combos/filter'),
                    this.axios.get('{{base_host_v1}}/children/combos/target/' + id)
                ]).then(([original, targets]) => {
                    if (original.data.data.length > 0) {
                        for (let i of original.data.data) {
                            i.key = i.id;
                            i.label = i.combo_name;
                        }
                        this.groupData = original.data.data;
                    }
                    this.targetItems = targets.data.data;
                });
            },
            handleItem (targetData, id, direction, moveKeys) {
                this.axios.post('{{base_host_v1}}/children/combos', {
                    ids: moveKeys,
                    id: id,
                    action: direction
                }).then(response => {
                    if (response.data.code === '0') {
                        this.targetItems = targetData;
                    }
                });
            }
        },
        created () {
            this.initData();
        },
        watch: {
            'formItem.family_area': function (val) {
                if (val.length > 0) {
                    this.formItem.province = val[0].name;
                    this.formItem.city = val[1].name;
                    this.formItem.area = val[2].name;
                }
            }
        }
    };
</script>