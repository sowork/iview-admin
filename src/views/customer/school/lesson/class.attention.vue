<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                课程列表
            </p>
            <div class="edittable-table-height-con">
                <Row>
                    <Col span="4" style="padding-right:20px">
                        <Select
                                v-model="formItem.user_id"
                                filterable
                                remote
                                placeholder="请输入： 账户名、电话、姓名"
                                :remote-method="searchTeachers"
                                :loading="isLoading"
                                @on-change="getClasses">
                            <Option v-for="(option, index) in teachers" :value="option.id" :key="index">{{option.user_name + '#' + option.user_email + '#' + option.user_tel}}</Option>
                        </Select>
                    </Col>
                    <Col span="4" style="padding-right:10px">
                        <Select v-model="formItem.class_id" @on-change="getCourses" clearable style="width:200px" placeholder="选择班级" not-found-text="无匹配数据">
                            <Option v-for="item in classes" :value="item.id" :key="item.id">{{ item.grade.grade_name + item.class_name }}</Option>
                        </Select>
                    </Col>
                    <Col span="4" style="padding-right:10px">
                        <Select v-model="formItem.course_id" clearable style="width:200px" placeholder="选择课程">
                            <Option v-for="item in courses" :value="item.id" :key="item.id">{{ item.course_name }}</Option>
                        </Select>
                    </Col>
                    <Col span="4" style="padding-right:10px">
                        <DatePicker @on-change="parseDate($event, 0)" format="yyyy-MM-dd" :value="formItem.start_date" type="date" placeholder="开始日期" style="width: 200px"></DatePicker>
                    </Col>
                    <Col span="4" style="padding-right:10px">
                        <DatePicker @on-change="parseDate($event, 1)" format="yyyy-MM-dd" :value="formItem.end_date" type="date" placeholder="结束日期" style="width: 200px"></DatePicker>
                    </Col>
                    <Col span="4" style="padding-right:10px">
                        <Button type="ghost" @click="initData()">搜&nbsp;&nbsp;&nbsp;&nbsp;索</Button>
                    </Col>
                </Row>
                <br>
                <Table :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
            <div class="margin-top-20">
                <Page @on-change="changePage" @on-page-size-change="changePageSize" :total="total" show-total size="small" :current="formItem.page" :page-size="formItem.limit" show-elevator show-sizer></Page>
            </div>
        </Card>
        <Modal width="900" :loading="loading" v-model="modal1" title="学生课堂指数报表">
            <Row>
                <Col span="12" style="padding-right:20px">
                    <div style="height: 400px; width: 400px;" id="container"></div>
                </Col>
                <Col span="12" style="padding-right:20px">
                    <div style="height: 400px; width: 400px;" id="container2"></div>
                </Col>

            </Row>
        </Modal>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import util from '@/libs/util';

    export default {
        components: {
        },
        data () {
            return {
                isLoading: false,
                teachers: [],
                classes: [],
                courses: [],
                formItem: {
                    user_id: '',
                    class_id: '',
                    course_id: '',
                    start_date: '',
                    end_date: '',
                    page: 1,
                    limit: 10
                },
                total: 0,
                loading: false,
                modal1: false,
                editInlineColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '教师姓名',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.user.user_name);
                        }
                    },
                    {
                        title: '班级',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', util.parseGrade(params.row.banji.enrollment_year) + params.row.banji.class_name);
                        }
                    },
                    {
                        title: '课程',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.course.course_name);
                        }
                    },
                    {
                        title: '录制开始时间',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.start_date);
                        }
                    },
                    {
                        title: '录制结束时间',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.end_date);
                        }
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
                                            this.modal1 = true;
                                            this.show(params.row, params.index);
                                        }
                                    }
                                }, '查看报表')
                            ]);
                        }
                    }
                ],
                editInlineData: [],
                option: '',
                option2: '',
                myChart: '',
                myChart2: ''
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{school_host_v1}}/student/index/attention', {
                        params: this.formItem
                    })
                ]).then(([attentionData]) => {
                    if (attentionData.data.data) {
                        this.editInlineData = attentionData.data.data.data;
                        this.total = attentionData.data.data.total;
                        this.show(attentionData.data.data.data[0], 0);
                    }
                });
            },
            searchTeachers (query) {
                if (query !== '') {
                    this.isLoading = true;
                    this.axios.get('{{school_host_v1}}/school/users', {
                        params: {
                            user_name: query
                        }
                    }).then(response => {
                        this.isLoading = false;
                        this.teachers = response.data.data;
                    });
                } else {
                    this.teachers = [];
                }
            },
            getClasses (value) {
                this.axios.get('{{auth_host_v1}}/user/classes', {
                    params: {
                        user_id: value
                    }
                }).then(response => {
                    this.classes = response.data.data;
                });
            },
            getCourses (value) {
                this.axios.get('{{school_host_v1}}/class/courses', {
                    params: {
                        user_id: this.teacher_id,
                        id: value
                    }
                }).then(response => {
                    this.courses = response.data.data;
                });
            },
            parseDate (date, value) {
                if (value === 0) {
                    this.start_date = date;
                } else if (value === 1) {
                    this.end_data = date;
                }
            },
            changePage (page) {
                this.formItem.page = page;
                this.initData();
            },
            changePageSize (number) {
                this.formItem.limit = number;
                this.initData();
            },
            show (data, index) {
                this.select = index;
                let attention = [];
                let smile = [];
                let number = 0;
                let group = 1; // 每几个分一组
                this.option.series = [];
                this.option2.series = [];
                if (data) {
                    attention = [];
                    smile = [];
                    number = 0;
                    this.option.xAxis.data = [0];
                    this.option2.xAxis.data = [0];
                    for (let v of data.indexes) {
                        number++;
                        let index = JSON.parse(v.index_data);
                        if (index) {
                            let i = 0;
                            let j = 0;
                            for (let [k1, v1] of index.attention_index.entries()) { // 专注力
                                if (k1 % group === 0 && k1 !== 0) {
                                    i++;
                                }
                                attention[i] = attention[i] ? attention[i] + parseInt(v1) : parseInt(v1);
                            }
                            for (let [k1, v1] of index.smile_index.entries()) { // 快乐指数
                                if (k1 % group === 0 && k1 !== 0) {
                                    j++;
                                }
                                smile[j] = smile[j] ? smile[j] + parseInt(v1) : parseInt(v1);
                            }
                        }
                    }
                    let o = 0;
                    if (attention) {
                        for (let [k, item] of attention.entries()) {
                            attention[k] = parseInt(item / group / number * 100);
                            this.option.xAxis.data.push(o += 10);
                        }
                        this.option.legend.data.push('专注力指数');
                        this.option.series.push(JSON.parse(JSON.stringify({
                            name: '专注力指数',
                            type: 'line',
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            },
                            data: attention
                        })));
                    }

                    let t = 0;
                    if (smile) {
                        for (let [k, item] of smile.entries()) {
                            smile[k] = parseInt(item / group / number * 100);
                            this.option2.xAxis.data.push(t += 10);
                        }
                        this.option2.legend.data.push('快乐指数');
                        this.option2.series.push(JSON.parse(JSON.stringify({
                            name: '快乐指数',
                            type: 'line',
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            },
                            data: smile
                        })));
                    }
                    // 重绘
                    this.myChart.setOption(this.option, true);
                    this.myChart2.setOption(this.option2, true);
                } else {
                    // 重绘
                    this.myChart.setOption(this.option, true);
                    this.myChart2.setOption(this.option2, true);
                }
            }
        },
        created () {
            this.initData();
        },
        mounted () {
            this.$nextTick(() => {
                this.myChart = echarts.init(document.getElementById('container'));
                this.option = {
                    xAxis: {
                        name: '分钟',
                        type: 'category',
                        data: [],
                        axisLabel: {
                            interval: 11,
                            formatter: function (value, idx) {
                                return value / 60;
                            }
                        }
                    },
                    legend: {
                        data: []
                    },
                    yAxis: {
                        name: '百分比',
                        type: 'value'
                    },
                    series: []
                };
                this.myChart.setOption(this.option);

                this.myChart2 = echarts.init(document.getElementById('container2'));
                this.option2 = {
                    xAxis: {
                        name: '分钟',
                        type: 'category',
                        data: [],
                        axisLabel: {
                            interval: 11,
                            formatter: function (value, idx) {
                                return value / 60;
                            }
                        }
                    },
                    legend: {
                        data:[]
                    },
                    yAxis: {
                        name: '百分比',
                        type: 'value'
                    },
                    series: []
                };
                this.myChart2.setOption(this.option2);
            });
        }
    };
</script>