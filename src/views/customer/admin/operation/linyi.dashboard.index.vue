    @import '../../../../styles/common.less';
    <style lang="less">
    </style>

<style scoped="scoped" lang="less">
    @import './styles/c.dashboard.index.less';
</style>

<template>
    <div class="layout">
        <Layout style="height: 100%;">
            <Header class="layout-header">
                <div>
                    <h1 class="layout-h-title">山东临沂评测训练数据看板</h1>
                    <span class="layout-p-time" v-html="currentTime"></span>
                </div>
            </Header>
            <Content class="layout-content">
                <div style="height: 80px;">
                    <Row type="flex" justify="center" style="font-size: 22px; justify-content: center; align-items: center; height: 80px;">
                        <Col span="3" style="color: #00FF00;">今日服务量：{{ todayNum }}人次</Col>
                        <Col span="1">|</Col>
                        <Col span="3" style="color: #e5c271;">本月服务量：{{ monthNum }} 人次</Col>
                        <Col span="1">|</Col>
                        <Col span="3" style="color: #e97b7a;">累计服务量：{{ totalNum }} 人次</Col>
                    </Row>
                </div>
                <Card class="layout-card">
                    <p slot="title" style="color: #00b9ff; font-size: 15px;">
                        <Icon type="android-map"></Icon>
                        当日数据
                    </p>
                    <Row type="flex" justify="space-around">
                        <Col span="7" style="height: 330px; border: 1px solid #40bbd9;">
                            <chart-line id="line1" :title="line1.title" :legend="line1.legend" :grid="line1.grid" :label="line1.label" :yAxis="line1.yAxis" :xAxis="line1.xAxis" :series="line1.series"></chart-line>
                        </Col>
                        <Col span="7" style="border: 1px solid #40bbd9;">
                            <p style="width: 100%; color: #7cbcf6; font-size: 18px; align-items: center; border-bottom: 1px solid #40bbd9; line-height: 30px; display: flex; display: -webkit-flex; justify-content: center;">TOP20测评项目一览</p>
                            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; padding:20px 0 0 0;">
                                <div style="height: 68px; max-width: 19%; min-width: 17%;" v-for="evaluateDetail in evaluateDetails">
                                    <p :style="{'font-size': '10px', 'line-height': '30px', 'text-align': 'center', 'background': evaluateDetail.value > 0 ? '#017ec2' : '#4f5b68', 'overflow': 'hidden', 'text-overflow':'ellipsis', 'white-space': 'nowrap'}" v-text="evaluateDetail.name"></p>
                                    <p :style="{'text-align': 'center', 'color': '#000', 'background': evaluateDetail.value > 0 ? '#bddeef' : '#d1d5d8'}"><span style="font-weight: bold; font-size:15px; " v-text="evaluateDetail.value"></span><span style="color: #000; font-size: 10px;">&nbsp;&nbsp;人次</span></p>
                                    <span :style="{'display': 'block', 'height': '5px', 'background': evaluateDetail.value > 0 ? '#017ec2' : '#4f5b68'}">&nbsp;</span>
                                </div>
                            </div>
                        </Col>
                        <Col span="7" style="border: 1px solid #40bbd9;">
                            <p style="width: 100%; color: #7cbcf6; font-size: 18px; align-items: center; border-bottom: 1px solid #40bbd9; line-height: 30px; display: flex; display: -webkit-flex; justify-content: center;">TOP20训练项目一览</p>
                            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; padding:20px 0 0 0;">
                                <div style="height: 68px; max-width: 19%; min-width: 17%;" v-for="trainDetail in trainDetails">
                                    <p :style="{'font-size': '10px', 'line-height': '30px', 'text-align': 'center', 'background': trainDetail.value > 0 ? '#017ec2' : '#4f5b68', 'overflow': 'hidden', 'text-overflow':'ellipsis', 'white-space': 'nowrap'}" v-text="trainDetail.name"></p>
                                    <p :style="{'text-align': 'center', 'color': '#000', 'background': trainDetail.value > 0 ? '#bddeef' : '#d1d5d8'}"><span style="font-weight: bold; font-size:15px; " v-text="trainDetail.value"></span><span style="color: #000; font-size: 10px;">&nbsp;&nbsp;人次</span></p>
                                    <span :style="{'display': 'block', 'height': '5px', 'background': trainDetail.value > 0 ? '#017ec2' : '#4f5b68'}">&nbsp;</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card class="layout-card">
                    <p slot="title">
                        <span style="color: #00b9ff; font-size: 15px;">
                            <Icon type="android-map"></Icon>
                            历史累计
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
                        <a href="javascript:void(0)" @click="download()" style="margin-left: 50px;color: #00b9ff;">
                            <Icon type="search"></Icon>
                            查看详细报表
                        </a>
                    </p>
                    <Row type="flex" justify="space-around">
                        <Col span="7" style="height: 330px; border: 1px solid #40bbd9;">
                            <chart-line id="line2" :title="line2.title" :legend="line2.legend" :grid="line2.grid" :label="line2.label" :yAxis="line2.yAxis" :xAxis="line2.xAxis" :series="line2.series"></chart-line>
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
    import util from '@/libs/util.js';

    export default {
        components: {
            ChartLine,
            ChartPie,
            ChartBar,
            ChartScatter,
            moment
        },
        data () {
            return {
                currentTime: '',
                open: false,
                todayNum: 0,
                monthNum: 0,
                totalNum: 0,
                evaluateDetails: [],
                trainDetails: [],
                line1: {
                    legend: {
                        data: ['测评项目', '训练项目'],
                        x: 'right',
                        textStyle: {
                            color: '#fff',
                            padding: 5,
                            fontSize: 12
                        }
                    },
                    title: {
                        text: '{title|每日测评预约人数}',
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
                    grid: {
                        bottom: 50,
                        left: 80
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
                line2: {
                    legend: {
                        data: [],
                        x: 'right',
                        textStyle: {
                            color: '#fff',
                            padding: 5,
                            fontSize: 12
                        }
                    },
                    title: {
                        text: '{title|评测训练项目总人数}',
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
                    grid: {
                        bottom: 50,
                        left: 80
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
                        text: '{title|上月测评训练项目分布}',
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
                        text: '{title|上月项目收入分布}',
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
                start_date: moment().startOf('day').format('YYYY-MM-DD'),
                end_date: moment().startOf('day').format('YYYY-MM-DD')
            };
        },
        computed: {
            dstart_date: function () {
                return moment(this.start_date).startOf('month').subtract('month', 1).format('YYYY-MM-DD');
            },
            dend_date: function () {
                return moment(this.start_date).endOf('month').subtract('month', 1).format('YYYY-MM-DD');
            }
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/linyi/statistics/service/num'),
                    this.axios.get('{{base_host_v1}}/linyi/statistics/evaluate/train/people/num'),
                    this.axios.get('{{base_host_v1}}/linyi/statistics/project/use/detail'),
                    this.axios.get('{{base_host_v1}}/linyi/statistics/time/people/num', {
                        params: {
                            start_date: moment(this.start_date).startOf('month').subtract('month', 6).format('YYYY-MM-DD'),
                            end_date: moment(this.start_date).endOf('month').subtract('month', 1).format('YYYY-MM-DD')
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/linyi/statistics/project/top10/detail', {
                        params: {
                            start_date: moment(this.start_date).startOf('month').subtract('month', 1).format('YYYY-MM-DD'),
                            end_date: moment(this.start_date).endOf('month').subtract('month', 1).format('YYYY-MM-DD')
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/linyi/statistics/project/top10/price/detail', {
                        params: {
                            start_date: moment(this.start_date).startOf('month').subtract('month', 1).format('YYYY-MM-DD'),
                            end_date: moment(this.start_date).endOf('month').subtract('month', 1).format('YYYY-MM-DD')
                        }
                    })
                ]).then(([useNum, line1Data, useDetails, line2Data, pie1Data, pie2Data]) => {
                    this.todayNum = useNum.data.data.today;
                    this.monthNum = useNum.data.data.month;
                    this.totalNum = useNum.data.data.total;
                    this.line1.xAxis.data = line1Data.data.data.evaluate.x;
                    this.line1.series[0] = {
                        type: 'line',
                        name: '测评项目',
                        data: line1Data.data.data.evaluate.y,
                        label: {
                            normal: {show: true}
                        }
                    };
                    this.line1.series[1] = {
                        type: 'line',
                        name: '训练项目',
                        data: line1Data.data.data.train.y,
                        label: {
                            normal: {show: true}
                        }
                    };

                    this.line2.xAxis.data = line2Data.data.data.x;
                    this.line2.series[0] = {
                        type: 'line',
                        data: line2Data.data.data.y,
                        label: {
                            normal: {show: true}
                        }
                    };
                    this.line2.series[1] = {
                        type: 'bar',
                        data: line2Data.data.data.y,
                        label: {
                            normal: {show: true}
                        }
                    };

                    this.evaluateDetails = useDetails.data.data.evaluate;
                    this.trainDetails = useDetails.data.data.train;

                    this.pie1.series[0].data = pie1Data.data.data;
                    this.pie2.series[0].data = pie2Data.data.data;
                });
            },
            handleChange (date) {
                this.start_date = date;
                this.open = !this.open;
            },
            handleClick () {
                this.open = !this.open;
            },
            download () {
                window.open(util.parseUrl('{{base_host_v1}}/linyi/export/design/record?start_date=' + this.dstart_date + '&end_date=' + this.dend_date));
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
                    this.axios.get('{{base_host_v1}}/linyi/statistics/time/people/num', {
                        params: {
                            start_date: moment(newVal).startOf('month').subtract('month', 6).format('YYYY-MM-DD'),
                            end_date: moment(newVal).endOf('month').subtract('month', 1).format('YYYY-MM-DD')
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/linyi/statistics/project/top10/detail', {
                        params: {
                            start_date: moment(newVal).startOf('month').subtract('month', 1).format('YYYY-MM-DD'),
                            end_date: moment(newVal).endOf('month').subtract('month', 1).format('YYYY-MM-DD')
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/linyi/statistics/project/top10/price/detail', {
                        params: {
                            start_date: moment(newVal).startOf('month').subtract('month', 1).format('YYYY-MM-DD'),
                            end_date: moment(newVal).endOf('month').subtract('month', 1).format('YYYY-MM-DD')
                        }
                    })
                ]).then(([line2Data, pie1Data, pie2Data]) => {
                    this.line2.xAxis.data = line2Data.data.data.x;
                    this.line2.series[0] = {
                        type: 'line',
                        data: line2Data.data.data.y,
                        label: {
                            normal: {show: true}
                        }
                    };
                    this.line2.series[1] = {
                        type: 'bar',
                        data: line2Data.data.data.y,
                        label: {
                            normal: {show: true}
                        }
                    };

                    this.pie1.series[0].data = pie1Data.data.data;
                    this.pie2.series[0].data = pie2Data.data.data;
                });
            }
        }
    };
</script>