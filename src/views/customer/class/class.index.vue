<style lang="less">
    @import '../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                年级管理
            </p>
            <div class="edittable-table-height-con">
                <div class="margin-bottom-10">
                    <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store')) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                </div>
                <Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
        </Card>
        <Modal :loading="loading" v-model="modal1" title="年级管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="班级名称" prop="class_name">
                    <Input v-model="formItem.class_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="年级" prop="grade_id">
                    <Select v-model="formItem.grade_id">
                        <Option v-for="item in grades" :value="item.id" :key="item.id">{{ item.grade_name }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认</Button>
            </div>
        </Modal>
        <Modal :loading="loading" v-model="modal2" title="课程选择" @keydown.enter.native="httpRequest2.next()">
            <Form ref="formItem2" :model="formItem2" :label-width="80">
                <Select v-model="formItem2.course_ids" multiple filterable>
                    <Option v-for="item in courses" :value="item.id" :key="item.id">{{ item.course_name }}</Option>
                </Select>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem2')">重置</Button>
                <Button type="primary" @click="addCourses">确认</Button>
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
                        title: '班级名称',
                        align: 'center',
                        key: 'class_name'
                    },
                    {
                        title: '年级',
                        align: 'center',
                        render: (h, params) => {
                            for (let grade of Array.from(this.grades)) {
                                if (grade.id === params.row.grade_id) {
                                    return grade.grade_name;
                                }
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.showCourse(JSON.parse(JSON.stringify(this.editInlineData[params.index])), params.index);
                                        }
                                    }
                                }, '课程管理'),
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
                grades: [],
                courses: [],
                formItem: {
                    class_name: '',
                    grade_id: ''
                },
                formItem2: {
                    course_ids: [],
                    cid: 0
                },
                ruleValidate: {
                    class_name: [
                        {required: true, message: '班级名称不能为空', trigger: 'blur'}
                    ],
                    grade_id: [
                        {required: true, type: 'number', message: '年级不能为空', trigger: 'change'}
                    ]
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{host_v1}}/classes'),
                    this.axios.get('{{host_v1}}/grade/index'),
                    this.axios.get('{{host_v1}}/course')
                ]).then(([templates, grades, courses]) => {
                    this.editInlineData = templates.data.data;
                    this.grades = grades.data.data;
                    this.courses = courses.data.data;
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
                this.axios.post('{{host_v1}}/classes', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.push(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{host_v1}}/classes/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{host_v1}}/classes/' + this.formItem.id, this.formItem).then(response => {
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
            showCourse (row, index) {
                this.axios.get('{{host_v1}}/class/course', {
                    params: {
                        id: row.id
                    }
                }).then(response => {
                    this.formItem2.course_ids = response.data.data;
                });
                this.formItem2.cid = row.id;
                this.modal2 = true;
            },
            addCourses () {
                this.axios.post('{{host_v1}}/class/add/course', this.formItem2).then(response => {
                    if (response.data.code === '0') {
                        this.modal2 = false;
                    }
                });
            }
        },
        created () {
            this.initData();
        }
    };
</script>