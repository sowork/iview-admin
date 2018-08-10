<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                试卷列表
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
        <Modal :loading="loading" v-model="modal1" title="试卷" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="试卷编号" prop="paper_code">
                    <Input v-model="formItem.paper_code" placeholder=""></Input>
                </FormItem>
                <FormItem label="试卷类型" prop="paper_type">
                    <Select v-model="formItem.paper_type">
                        <Option v-for="item in paper_types" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="归属课程" prop="course_id">
                    <Select v-model="formItem.course_id">
                        <Option v-for="item in courses" :value="item.course_id" :key="item.course_id">{{ item.course_name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="试卷总分" prop="paper_sum_score">
                    <Input v-model.number="formItem.paper_sum_score" placeholder=""></Input>
                </FormItem>
                <FormItem label="试卷描述" prop="paper_desc">
                    <Input v-model="formItem.paper_desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
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
                        key: 'id'
                    },
                    {
                        title: '试卷编号',
                        align: 'center',
                        key: 'paper_code'
                    },
                    {
                        title: '试卷类型',
                        align: 'center',
                        render: (h, params) => {
                            for (let item of Array.from(this.paper_types)) {
                                if (item.value === params.row.paper_type) {
                                    return item.name;
                                }
                            }
                        }
                    },
                    {
                        title: '归属课程',
                        align: 'center',
                        render: (h, params) => {
                            for (let course of this.courses) {
                                if (course.course_id === params.row.course_id) {
                                    return course.course_name;
                                }
                            }
                        }
                    },
                    {
                        title: '试卷总分',
                        align: 'center',
                        key: 'paper_sum_score'
                    },
                    {
                        title: '试卷描述',
                        align: 'center',
                        key: 'paper_desc'
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
                courses: [],
                paper_types: [
                    {
                        value: 1,
                        name: '平常测验'
                    },
                    {
                        value: 2,
                        name: '期中试卷'
                    },
                    {
                        value: 3,
                        name: '期末试卷'
                    }
                ],
                httpRequest: '',
                formItem: {
                    paper_code: '',
                    paper_desc: '',
                    course_id: '',
                    paper_type: '',
                    paper_sum_score: ''
                },
                ruleValidate: {
                    paper_code: [
                        {required: true, type: 'string', message: '试卷编码不能为空', trigger: 'blur'}
                    ],
                    paper_sum_score: [
                        {required: true, type: 'number', message: '试卷总分不能为空', trigger: 'blur'}
                    ],
                    course_id: [
                        {required: true, type: 'number', message: '请选择试卷对应的课程', trigger: 'change'}
                    ],
                    paper_type: [
                        {required: true, type: 'number', message: '请选择试卷对应的类型', trigger: 'change'}
                    ],
                    paper_desc: [
                        {required: true, type: 'string', message: '试卷描述不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            initData () {
                this.axios.get('{{host_v1}}/examination/paper', {
                    params: {
                        'page': this.page,
                        'number': this.number
                    }
                }).then(response => {
                    this.editInlineData = response.data.data.data;
                    this.total = response.data.data.total;
                });

                this.axios.get('{{host_v1}}/school/courses').then(response => {
                    if (response.data.data) {
                        this.courses = response.data.data;
                    }
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
                this.axios.post('{{host_v1}}/examination/paper', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.push(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{host_v1}}/examination/paper/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{host_v1}}/examination/paper/' + this.formItem.id, this.formItem).then(response => {
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
            }
        },
        created () {
            this.initData();
        }
    };
</script>