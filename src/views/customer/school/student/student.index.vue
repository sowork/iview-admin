<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                学生列表
            </p>
            <div>
                <div class="margin-bottom-10">
                    <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store')) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                </div>
                <Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
                <div class="margin-top-20">
                    <Page @on-change="onChange" @on-page-size-change="onPageSizeChange" :total="total" show-total size="small" show-elevator show-sizer></Page>
                </div>
            </div>
        </Card>
        <Modal :loading="loading" v-model="modal1" title="学生列表" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="班级" prop="class_id">
                    <Cascader :data="classes" v-model="class_data" @on-change="selectClass"></Cascader>
                </FormItem>
                <FormItem label="学号" prop="stu_card">
                    <Input v-model="formItem.stu_card" placeholder=""></Input>
                </FormItem>
                <FormItem label="姓名" prop="stu_name">
                    <Input v-model="formItem.stu_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="性别" prop="stu_sex">
                    <Select v-model="formItem.stu_sex">
                        <Option v-for="item in sex" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="出生日期" prop="user_birthday">
                    <DatePicker @on-change="parseDate" format="yyyy-MM-dd HH:mm:ss" :value="formItem.stu_birthday" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="nfc码" prop="nfc_id_code">
                    <Input v-model="formItem.nfc_id_code" placeholder=""></Input>
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
    import util from '@/libs/util';
    export default {
        name: 'paper_index',
        components: {
        },
        data () {
            return {
                editInlineColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '学号',
                        align: 'center',
                        key: 'stu_card'
                    },
                    {
                        title: '姓名',
                        align: 'center',
                        key: 'stu_name'
                    },
                    {
                        title: '性别',
                        align: 'center',
                        key: 'stu_sex'
                    },
                    {
                        title: '出生日期',
                        align: 'center',
                        key: 'stu_birthday'
                    },
                    {
                        title: '班级',
                        align: 'center',
                        render: (h, params) => {
                            for (let item of this.classes) {
                                if (item.id === params.row.class_id) {
                                    return h('span', item.class_name);
                                }
                            }
                        }
                    },
                    {
                        title: 'nfc码',
                        align: 'center',
                        key: 'nfc_id_code'
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
                    stu_card: '',
                    stu_name: '',
                    stu_sex: '',
                    class_id: '',
                    stu_birthday: '',
                    nfc_id_code: ''
                },
                class_data: [],
                ruleValidate: {
                    stu_card: [
                        {required: true, type: 'string', message: '学号不能为空', trigger: 'blur'}
                    ],
                    stu_name: [
                        {required: true, type: 'string', message: '姓名不能为空', trigger: 'blur'}
                    ],
                    stu_sex: [
                        {required: true, type: 'string', message: '性别不能为空', trigger: 'change'}
                    ],
                    class_id: [
                        {required: true, type: 'number', message: '班级不能为空', trigger: 'blur'}
                    ]
                },
                classes: [],
                sex: [
                    {
                        name: '男',
                        value: '男'
                    },
                    {
                        name: '女',
                        value: '女'
                    }
                ]
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/student', {
                        params: {
                            'page': this.page,
                            'number': this.number
                        }
                    }),
                    this.axios.get('{{school_host_v1}}/classes')
                ]).then(([students, classes]) => {
                    let tempClasses = [];
                    let temp = [];
                    for (let banji of classes.data.data) {
                        if (tempClasses[banji.enrollment_year] === undefined){
                            tempClasses[banji.enrollment_year] = [];
                            tempClasses[banji.enrollment_year].push({value: banji.id, label: banji.class_name});
                        } else {
                            tempClasses[banji.enrollment_year].push({value: banji.id, label: banji.class_name});
                        }
                    }
                    for (let index in tempClasses) {
                        temp.push({value: index, label: util.parseGrade(index), children: tempClasses[index]});
                    }
                    this.editInlineData = students.data.data.data;
                    this.total = students.data.data.total;
                    this.classes = temp;
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
                this.axios.post('{{base_host_v1}}/student', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.unshift(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{base_host_v1}}/student/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/student/' + this.formItem.id, this.formItem).then(response => {
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
                this.class_data = [];
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
            selectClass (value, selectedData) {
                this.formItem.class_id = value[1];
            }
        },
        created () {
            this.initData();
        }
    };
</script>