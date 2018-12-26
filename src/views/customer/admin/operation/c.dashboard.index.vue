<style lang="less">
    @import '../../../../styles/common.less';
</style>

<style scoped="scoped" lang="less">
    @import './styles/c.dashboard.index.less';
</style>

<template>
    <div class="layout">
        <Layout style="height: 100%;">
            <Header class="layout-header">
                <div>
                    <h1 class="layout-h-title">上海培明中学评测训练数据平台</h1>
                    <span class="layout-p-time" v-html="currentTime"></span>
                </div>
            </Header>
            <Content class="layout-content">
                <Card class="layout-card">
                    <p slot="title" style="color: #00b9ff; font-size: 15px;">
                        <Icon type="android-map"></Icon>
                        今日数据
                    </p>
                    <Row type="flex" justify="space-around">
                        <Col span="7" style="height: 330px; border: 1px solid #40bbd9;">
                            <chart-bar id="bar1" :title="bar1.title" :label="bar1.label" :yAxis="bar1.yAxis" :xAxis="bar1.xAxis" :series="bar1.series"></chart-bar>
                        </Col>
                        <!--<Col span="7" style="border: 1px solid #40bbd9;">-->
                            <!--<div style="width: 80%; height: 330px;float: left; margin-left: 5%;">-->
                                <!--<div style="width: 100%; height: 330px; display: flex; justify-content: center; flex-direction: column;">-->
                                    <!--<div v-for="task in finishTasks">-->
                                        <!--<span style="width: 30%; vertical-align: middle; font-size: 13px; text-align: right; display: inline-block; font-size: 13px; line-height: 25px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-text="task.name"></span>-->
                                        <!--<Progress :percent="task.value" style="border-radius: 0 !important; width: 65%; margin-left: 10px; height: 15px !important;">-->
                                            <!--<span v-text="task.value"></span>-->
                                        <!--</Progress>-->
                                    <!--</div>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</Col>-->
                        <Col span="7" style="border: 1px solid #40bbd9;">
                            <div style="width: 20%; height: 330px; float: left;">
                                <p style="width: 100%; color: #7cbcf6; font-size: 18px; align-items: center; height: 100%; writing-mode: vertical-rl; display: flex; display: -webkit-flex; justify-content: center;">完 成 任 务 总 数</p>
                            </div>
                            <div style="width: 75%; height: 330px;float: left;">
                                <chart-bar id="bar2" :grid="bar2.grid" :title="bar2.title" :label="bar2.label" :yAxis="bar2.yAxis" :xAxis="bar2.xAxis" :series="bar2.series"></chart-bar>
                            </div>
                        </Col>
                        <Col span="7" style="border: 1px solid #40bbd9; height: 330px;">
                            <chart-scatter id="scatter1" :xAxis="scatter1.xAxis" :yAxis="scatter1.yAxis" :title="scatter1.title" :series="scatter1.series"></chart-scatter>
                        </Col>
                    </Row>
                </Card>
                <Card class="layout-card">
                    <p slot="title">
                        <span style="color: #00b9ff; font-size: 15px;">
                            <Icon type="android-map"></Icon>
                            历史数据
                        </span>
                        <DatePicker
                                :open="open"
                                :value="start_date"
                                type="date"
                                @on-change="handleChange" style="margin-left: 50px;">
                            <a href="javascript:void(0)" @click="handleClick" style="color: #00b9ff;">
                                <template>截止到:  {{ start_date | parseDate }}</template>
                                <Icon type="edit"></Icon>
                            </a>
                        </DatePicker>
                    </p>
                    <Row type="flex" justify="space-around">
                        <Col span="7" style="height: 330px; border: 1px solid #40bbd9;">
                            <chart-line id="line1" :title="line1.title" :label="line1.label" :yAxis="line1.yAxis" :xAxis="line1.xAxis" :series="line1.series"></chart-line>
                        </Col>
                        <Col span="7" style="border: 1px solid #40bbd9;">
                            <chart-pie id="pie1" :title="pie1.title" :series="pie1.series"></chart-pie>
                        </Col>
                        <Col span="7" style="border: 1px solid #40bbd9; height: 330px;">
                            <chart-pie id="pie2" :title="pie2.title" :series="pie2.series"></chart-pie>
                        </Col>
                    </Row>
                </Card>
            </Content>
        </Layout>
    </div>
</template>

<script>
    import ChartLine from './component/line.index.vue';
    import ChartPie from './component/pie.index.vue';
    import ChartBar from './component/bar.index.vue';
    import ChartScatter from './component/scatter.index.vue';
    import moment from 'moment';

    export default {
        components: {
            ChartLine,
            ChartPie,
            ChartBar,
            ChartScatter
        },
        data () {
            return {
                currentTime: '',
                open: false,
                bar1: {
                    title: {
                        text: '{title|预约任务总数}',
                        x: 'center',
                        textStyle: {
                            rich: {
                                title: {
                                    width: '100',
                                    height: 25,
                                    fontSize: 16
                                }
                            },
                            color: '#7cbcf6'
                        },
                        borderColor: '#40bbd9',
                        borderWidth: '1'
                    },
                    xAxis: {
                        data: [],
                        axisLine: {
                            lineStyle: {
                                color: '#40bbd9'
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: 40
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {color: '#00ccff'},
                            position: 'top'
                        }
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#40bbd9'
                            }
                        }
                    },
                    series: [
                        {
                            data: [],
                            type: 'bar',
                            tooltip: {
                                show: false
                            },
                            barWidth: '15%'
                        }
                    ]
                },
                bar2: {
                    xAxis: {
                        axisLine: {
                            lineStyle: {
                                color: '#40bbd9'
                            }
                        },
                        show: false,
                        type: 'value',
                        boundaryGap: [0, 0],
                        nameGap: '150',
                        position: 'top'
                    },
                    grid: {
                        left: 0,
                        right: '8%',
                        bottom: 0,
                        top: 0
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {color: '#00ccff'},
                            position: 'right'
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: [],
                        splitLine: {
                            show: false
                        },
                        axisTick: [{
                            show: false
                        }],
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#40bbd9'
                            }
                        }
                    },
                    series: [
                        {
                            data: [],
                            tooltip: {
                                show: false
                            },
                            type: 'bar',
                            barWidth: '5%'
                        }
                    ]
                },
                scatter1: {
                    title: {
                        text: '{title|任务完成分布图}',
                        x: 'center',
                        textStyle: {
                            rich: {
                                title: {
                                    width: '100',
                                    height: 25,
                                    fontSize: 16
                                }
                            },
                            color: '#7cbcf6'
                        },
                        borderColor: '#40bbd9',
                        borderWidth: '1'
                    },
                    xAxis: {
                        data: [],
                        axisLine: {
                            lineStyle: {
                                color: '#40bbd9'
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: 40
                        }
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#40bbd9'
                            }
                        }
                    },
                    series: [{
                        type: 'scatter',
                        data: []
                    }]
                },
                line1: {
                    title: {
                        text: '{title|历史预约任务总数}',
                        x: 'center',
                        textStyle: {
                            rich: {
                                title: {
                                    width: '100',
                                    height: 25,
                                    fontSize: 16
                                }
                            },
                            color: '#7cbcf6'
                        },
                        borderColor: '#40bbd9',
                        borderWidth: '1'
                    },
                    xAxis: {
                        data: [],
                        axisLine: {
                            lineStyle: {
                                color: '#40bbd9'
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: 40
                        }
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#40bbd9'
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {color: '#00ccff'},
                            position: 'top'
                        }
                    },
                    series: [
                        {
                            data: [],
                            type: 'line',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            }
                        }
                    ]
                },
                pie1: {
                    title: {
                        text: '{title|评测项目定制任务分布}',
                        x: 'center',
                        textStyle: {
                            rich: {
                                title: {
                                    width: '100',
                                    height: 25,
                                    fontSize: 16
                                }
                            },
                            color: '#7cbcf6'
                        },
                        borderColor: '#40bbd9',
                        borderWidth: '1'
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '50%'],
                            data: [],
                            label: {
                                normal: {
                                    show: true,
                                    formatter: '{b}({d}%)',
                                    fontSize: 13,
                                    fontFamily: '微软雅黑'
                                }
                            }
                        }
                    ]
                },
                pie2: {
                    title: {
                        text: '{title|训练项目定制任务分布}',
                        x: 'center',
                        textStyle: {
                            rich: {
                                title: {
                                    width: '100',
                                    height: 25,
                                    fontSize: 16
                                }
                            },
                            color: '#7cbcf6'
                        },
                        borderColor: '#40bbd9',
                        borderWidth: '1'
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '50%'],
                            data: [],
                            label: {
                                normal: {
                                    show: true,
                                    formatter: '{b}({d}%)',
                                    fontSize: 13,
                                    fontFamily: '微软雅黑'
                                }
                            }
                        }
                    ]
                },
                start_date: moment().startOf('day').subtract('day', 7).format('YYYY-MM-DD'),
                end_date: moment().startOf('day').format('YYYY-MM-DD')
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.post('{{base_host_v1}}/cq/statistics/schedule/tasks'),
                    this.axios.post('{{base_host_v1}}/cq/statistics/finish/schedule/tasks'),
                    this.axios.post('{{base_host_v1}}/cq/statistics/finish/time/schedule/tasks'),
                    this.axios.post('{{base_host_v1}}/cq/statistics/schedule/tasks', {
                        start_date: this.start_date,
                        end_date: this.end_date
                    }),
                    this.axios.post('{{base_host_v1}}/cq/statistics/schedule/task/group', {
                        start_date: this.start_date,
                        end_date: this.end_date,
                        type: 1
                    }),
                    this.axios.post('{{base_host_v1}}/cq/statistics/schedule/task/group', {
                        start_date: this.start_date,
                        end_date: this.end_date,
                        type: 2
                    })
                ]).then(([tasks, finishTasks, timeFinishTasks, tasks2, scheduleTaskGroups, scheduleTaskGroups2]) => {
                    this.bar1.xAxis.data = tasks.data.data.x;
                    this.bar1.series[0].data = tasks.data.data.y;

                    let temp = [];
                    for (let task of finishTasks.data.data.x) {
                        temp.push(task.slice(0, 7) + '...');
                    }
                    this.bar2.yAxis.data = temp;
                    this.bar2.series[0].data = finishTasks.data.data.y;

                    this.scatter1.xAxis.data = timeFinishTasks.data.data.x;
                    this.scatter1.series[0].data = timeFinishTasks.data.data.y;

                    this.line1.xAxis.data = tasks2.data.data.x;
                    this.line1.series[0].data = tasks2.data.data.y;

                    this.pie1.series[0].data = scheduleTaskGroups.data.data;
                    this.pie2.series[0].data = scheduleTaskGroups2.data.data;
                });
            },
            handleChange (date) {
                this.start_date = date;
                this.open = !this.open;
            },
            handleClick () {
                this.open = !this.open;
            }
        },
        filters: {
            parseDate (val) {
                return moment(val).format('YYYY年MM月DD日');
            }
        },
        created () {
            this.initData();
        },
        mounted () {
            setInterval(() => {
                let year = new Date().getFullYear();
                let month = new Date().getMonth() + 1;
                let day = new Date().getDate();
                let hours = new Date().getHours();
                let minutes = new Date().getMinutes();
                let ss = new Date().getTime() % 60000;
                let seconds = (ss - (ss % 1000)) / 1000;
                let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                let week = weeks[new Date().getDay()];
                this.currentTime = year + '年' + month + '月' + day + '日&nbsp;&nbsp;' + hours + '时' + minutes + '分' + seconds + '秒&nbsp;&nbsp;' + week;
            }, 1000);
        },
        watch: {
            start_date: function (newVal, oldVal) {
                Promise.all([
                    this.axios.post('{{base_host_v1}}/cq/statistics/schedule/tasks', {
                        start_date: this.start_date,
                        end_date: this.end_date
                    }),
                    this.axios.post('{{base_host_v1}}/cq/statistics/schedule/task/group', {
                        start_date: this.start_date,
                        end_date: this.end_date,
                        type: 1
                    }),
                    this.axios.post('{{base_host_v1}}/cq/statistics/schedule/task/group', {
                        start_date: this.start_date,
                        end_date: this.end_date,
                        type: 2
                    })
                ]).then(([tasks2, scheduleTaskGroups, scheduleTaskGroups2]) => {
                    this.line1.xAxis.data = tasks2.data.data.x;
                    this.line1.series[0].data = tasks2.data.data.y;

                    this.pie1.series[0].data = scheduleTaskGroups.data.data;
                    this.pie2.series[0].data = scheduleTaskGroups2.data.data;
                });
            }
        }
    };
</script>