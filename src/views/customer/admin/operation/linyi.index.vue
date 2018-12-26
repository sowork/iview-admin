<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                山东运营明细
            </p>
            <div class="edittable-table-height-con">
                <Row>
                    <Col span="10" style="padding-right:20px">
                        <div style="height: 600px; width: auto;" id="container"></div>
                    </Col>
                    <Col span="14" style="padding-right:20px">
                        <div style="height: 600px; width: auto;" id="container2"></div>
                    </Col>
                </Row>
            </div>
        </Card>
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
                option: {},
                option2: {},
                myChart: '',
                myChart2: ''
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/linyi/statistics/number'),
                    this.axios.get('{{base_host_v1}}/linyi/statistics/income')
                ]).then(([numbers, incomes]) => {
                    if (numbers.data.data) {
                        this.option.xAxis.data = numbers.data.data.date;
                        this.option.series[0].data = numbers.data.data.number;
                        this.myChart.setOption(this.option, true);

                        this.option2.series[0].data = incomes.data.data;
                        this.myChart2.setOption(this.option2, true);
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
                    title: {
                        text: '山东项目次数图表',
                        x: 'center'
                    },
                    xAxis: {
                        name: '月份',
                        type: 'category',
                        data: []
                    },
                    legend: {
                        data: []
                    },
                    yAxis: {
                        name: '次数',
                        type: 'value'
                    },
                    series: [{
                        data: [],
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#83bff6'},
                                        {offset: 0.5, color: '#188df0'},
                                        {offset: 1, color: '#188df0'}
                                    ]
                                )
                            },
                            emphasis: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2378f7'},
                                        {offset: 0.7, color: '#2378f7'},
                                        {offset: 1, color: '#83bff6'}
                                    ]
                                )
                            }
                        },
                        type: 'bar'
                    }]
                };
                this.myChart.setOption(this.option);

                this.myChart2 = echarts.init(document.getElementById('container2'));
                this.option2 = {
                    title: {
                        text: '山东前10个项目收入图表',
                        x: 'center'
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            data: [],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            label: {
                                normal: {
                                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                    backgroundColor: '#eee',
                                    borderColor: '#aaa',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    // shadowBlur:3,
                                    // shadowOffsetX: 2,
                                    // shadowOffsetY: 2,
                                    // shadowColor: '#999',
                                    // padding: [0, 7],
                                    rich: {
                                        a: {
                                            color: '#999',
                                            lineHeight: 22,
                                            align: 'center'
                                        },
                                        // abg: {
                                        //     backgroundColor: '#333',
                                        //     width: '100%',
                                        //     align: 'right',
                                        //     height: 22,
                                        //     borderRadius: [4, 4, 0, 0]
                                        // },
                                        hr: {
                                            borderColor: '#aaa',
                                            width: '100%',
                                            borderWidth: 0.5,
                                            height: 0
                                        },
                                        b: {
                                            fontSize: 16,
                                            lineHeight: 33
                                        },
                                        per: {
                                            color: '#eee',
                                            backgroundColor: '#334455',
                                            padding: [2, 4],
                                            borderRadius: 2
                                        }
                                    }
                                }
                            }
                        }
                    ]
                };
                this.myChart2.setOption(this.option2);
            });
        }
    };
</script>