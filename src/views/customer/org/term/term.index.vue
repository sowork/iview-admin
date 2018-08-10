<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                学期管理
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
        <Modal :loading="loading" v-model="modal1" title="学期管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="学期名称" prop="term_name">
                    <Input v-model="formItem.term_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="开课日期" prop="start_date">
                    <DatePicker @on-change="startDate" format="yyyy-MM-dd" :value="formItem.start_date" type="date" placeholder="选择日期" ></DatePicker>
                </FormItem>
                <FormItem label="结课日期" prop="end_date">
                    <DatePicker @on-change="endDate" format="yyyy-MM-dd" :value="formItem.end_date" type="date" placeholder="选择日期"></DatePicker>
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
        components: {
        },
        data () {
            const isLtEndDate = (rule, value, callback) => {
                if (this.formItem.end_date !== '' && value > this.formItem.end_date) {
                    callback(new Error('开始日期不能大于结束日期'));
                } else {
                    callback();
                }
            };

            const isGtStartDate = (rule, value, callback) => {
                if (this.formItem.start_date !== '' && value < this.formItem.start_date) {
                    callback(new Error('结束日期不能小于开始日期'));
                } else {
                    callback();
                }
            };
            return {
                editInlineColumns: [
                    {
                        title: '序号',
                        align: 'center',
                        render: (h, params) => params.index + 1
                    },
                    {
                        title: '学期名称',
                        align: 'center',
                        key: 'term_name'
                    },
                    {
                        title: '开课日期',
                        align: 'center',
                        key: 'start_date'
                    },
                    {
                        title: '结课日期',
                        align: 'center',
                        key: 'end_date'
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
                total: 0,
                page: 1,
                number: 10,
                modal1: false,
                loading: false,
                httpRequest: '',
                formItem: {
                    term_name: '',
                    start_date: '',
                    end_date: ''
                },
                ruleValidate: {
                    term_name: [
                        {required: true, message: '学期名称不能为空', trigger: 'blur'}
                    ],
                    start_date: [
                        {required: true, message: '开课日期不能为空', trigger: 'change'},
                        {trigger: 'change', message: '开始时间要小于结束时间', validator: isLtEndDate}
                    ],
                    end_date: [
                        {required: true, message: '结课日期不能为空', trigger: 'change'},
                        {trigger: 'change', message: '结束时间要大于开始时间', validator: isGtStartDate}
                    ]
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/terms', {
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
                this.axios.post('{{base_host_v1}}/terms', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.push(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{base_host_v1}}/terms/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/terms/' + this.formItem.id, this.formItem).then(response => {
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
            startDate (date) {
                this.formItem.start_date = date;
            },
            endDate (date) {
                this.formItem.end_date = date;
            }
        },
        created () {
            this.initData();
        }
    };
</script>