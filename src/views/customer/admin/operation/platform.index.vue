<style lang="less">
    @import '../../../../styles/common.less';
    @import './operation';
</style>
<style type="text/css">
    .icon {
        width: 1.5em; height: 1.5em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>

<template>
    <div class="home-main">
        <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="android-map"></Icon>
                    用户访问量统计
                </p>
                <div slot="extra" >
                    <Cascader :data="data" @on-change="changeUserSelectCity">
                        {{userSelectCity}}
                        <a href="javascript:void(0)">
                            [切换地区]
                        </a>
                    </Cascader>
                </div>
                <Row :gutter="10">
                    <Col :lg="12">
                        <Card style="height: 450px;">
                            <p slot="title" class="card-title">
                                <Icon type="android-map"></Icon>
                                按时间
                            </p>
                            <Row class="margin-top-10" type="flex" justify="center" >
                                <Col span="10" style="line-height: 30px;">日期范围</Col>
                                <Col span="10" offset="1">
                                    <Select v-model="user.time.typeVal" style="width: 100%;" @on-change="changeUserTime">
                                        <Option v-for="item in timeTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="margin-top-10" type="flex" justify="center">
                                <Col span="10">
                                    <DatePicker v-model="user.time.start_date" type="date" show-week-numbers placeholder="开始日期" style="width: 100%;"></DatePicker>
                                </Col>
                                <Col span="1" style="line-height: 30px;">
                                至
                                </Col>
                                <Col span="10">
                                    <DatePicker v-model="user.time.end_date" type="date" show-week-numbers placeholder="结束日期" style="width: 100%;"></DatePicker>
                                </Col>
                            </Row>
                            <RadioGroup @on-change="userAccessIsAllToggle" v-model.number="user.time.is_all" style="width: 100%;">
                                <Row class="margin-top-20" type="flex" justify="center">
                                    <Col span="10">
                                        <Radio :label="2">
                                            <span>新注册用户</span>
                                        </Radio>
                                    </Col>
                                    <Col span="10" offset="1">
                                        <Radio :label="1">
                                            <span>所有用户</span>
                                        </Radio>
                                    </Col>
                                </Row>
                            </RadioGroup>
                            <div class="data-source-row">
                                <chart-line :id="'line1'" :xAxis="line1.xAxis" :series="line1.series"></chart-line>
                            </div>
                        </Card>
                    </Col>
                    <Col :lg="12">
                        <Card style="height: 450px;">
                            <p slot="title" class="card-title">
                                <Icon type="android-map"></Icon>
                                按业务
                            </p>
                            <div slot="extra">
                                <svg class="icon" aria-hidden="true" style="cursor:pointer" @click="showBar">
                                    <use xlink:href="#icon-zhuzhuangtu"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" style="cursor:pointer" @click="showPie">
                                    <use xlink:href="#icon-bingzhuangtu"></use>
                                </svg>
                            </div>
                            <RadioGroup v-model.number="user.prod.type" style="width:100%;" @on-change="changeBusinessType">
                                <Row class="margin-top-10" type="flex" justify="center" >
                                    <Col span="21" style="line-height: 30px;">
                                        <Radio label="1">按产品类型</Radio>
                                    </Col>
                                </Row>
                                <Row class="margin-top-10" type="flex" justify="center" >
                                    <Col span="3" style="line-height: 30px;">
                                        <Radio label="2">按内容类型</Radio>
                                    </Col>
                                    <Col span="17" offset="1">
                                        <Select v-model="user.prod.id" style="width:100%" @on-change="changeBusinessProdType">
                                            <Option v-for="item in itemTypes" :value="item.id" :key="item.id">{{ item.item_name }}</Option>
                                        </Select>
                                    </Col>
                                </Row>
                                <!--<Row class="margin-top-10" type="flex" justify="center" >-->
                                    <!--<Col span="3" style="line-height: 30px;">-->
                                        <!--<Radio label="3">按内容类型</Radio>-->
                                    <!--</Col>-->
                                    <!--<Col span="8" offset="1">-->
                                        <!--<Select v-model="user.prod.combo_id1" style="width:100%">-->
                                            <!--<Option v-for="item in itemTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                                        <!--</Select>-->
                                    <!--</Col>-->
                                    <!--<Col span="8" offset="1">-->
                                        <!--<Select v-model="user.prod.item_id" style="width:100%">-->
                                            <!--<Option v-for="item in itemTypes1" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                                        <!--</Select>-->
                                    <!--</Col>-->
                                <!--</Row>-->
                            </RadioGroup>
                            <div class="data-source-row">
                                <chart-pie :id="'pie1'" :series="pie1.series" v-if="prod_is_show_pie"></chart-pie>
                                <chart-bar :id="'bar1'" :xAxis="bar1.xAxis" :series="bar1.series" v-if="prod_is_show_bar"></chart-bar>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="android-map"></Icon>
                    业务量统计
                </p>
                <div slot="extra" >
                    <Cascader :data="data" @on-change="changeBusinessSelectCity">
                        {{businessSelectCity}}
                        <a href="javascript:void(0)">
                            [切换地区]
                        </a>
                    </Cascader>
                </div>
                <Row :gutter="10">
                    <Col :lg="12">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="android-map"></Icon>
                                交易收入统计
                            </p>
                            <div slot="extra">
                                <svg class="icon" aria-hidden="true" style="cursor:pointer" @click="businessIncomeShowBar">
                                    <use xlink:href="#icon-zhuzhuangtu"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" style="cursor:pointer" @click="businessIncomeShowPie">
                                    <use xlink:href="#icon-bingzhuangtu"></use>
                                </svg>
                            </div>
                            <RadioGroup v-model="business.income.type" style="width:100%;" @on-change="changeBusinessIncomeType">
                                <Row class="margin-top-10" type="flex" justify="center" >
                                    <Col span="21" style="line-height: 30px;">
                                    <Radio label="1">按产品类型</Radio>
                                    </Col>
                                </Row>
                                <Row class="margin-top-10" type="flex" justify="center" >
                                    <Col span="10" style="line-height: 30px;">
                                        <Radio label="2">按时间段</Radio>
                                    </Col>
                                    <Col span="10" offset="1">
                                        <Select v-model="business.income.timeType" style="width: 100%;" @on-change="changeBusinessIncome">
                                            <Option v-for="item in timeTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </Col>
                                </Row>
                                <Row class="margin-top-10" type="flex" justify="center">
                                    <Col span="10">
                                        <DatePicker v-model="business.income.start_date" type="date" show-week-numbers placeholder="开始日期" style="width: 100%;"></DatePicker>
                                    </Col>
                                    <Col span="1" style="line-height: 30px;">
                                    至
                                    </Col>
                                    <Col span="10">
                                        <DatePicker v-model="business.income.end_date" type="date" show-week-numbers placeholder="结束日期" style="width: 100%;"></DatePicker>
                                    </Col>
                                </Row>
                            </RadioGroup>
                            <div class="data-source-row">
                                <chart-pie :id="'pie2'" :series="pie2.series" v-if="business_income_show_pie"></chart-pie>
                                <chart-bar :id="'bar2'" :xAxis="bar2.xAxis" :series="bar2.series" v-if="business_income_show_bar"></chart-bar>
                            </div>
                        </Card>
                    </Col>
                    <Col :lg="12">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="android-map"></Icon>
                                订单统计
                            </p>
                            <div slot="extra">
                                <svg class="icon" aria-hidden="true" style="cursor:pointer" @click="businessOrderShowBar">
                                    <use xlink:href="#icon-zhuzhuangtu"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" style="cursor:pointer" @click="businessOrderShowPie">
                                    <use xlink:href="#icon-bingzhuangtu"></use>
                                </svg>
                            </div>
                            <RadioGroup v-model="business.order.type" style="width:100%;" @on-change="changeBusinessOrderType">
                                <Row class="margin-top-10" type="flex" justify="center" >
                                    <Col span="21" style="line-height: 30px;">
                                    <Radio label="1">按产品类型</Radio>
                                    </Col>
                                </Row>
                                <Row class="margin-top-10" type="flex" justify="center" >
                                    <Col span="10" style="line-height: 30px;">
                                        <Radio label="2">按时间段</Radio>
                                    </Col>
                                    <Col span="10" offset="1">
                                        <Select v-model="business.order.timeType" style="width: 100%;" @on-change="changeBusinessOrder">
                                            <Option v-for="item in timeTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </Col>
                                </Row>
                                <Row class="margin-top-10" type="flex" justify="center">
                                    <Col span="10">
                                        <DatePicker v-model="business.order.start_date" type="date" show-week-numbers placeholder="开始日期" style="width: 100%;"></DatePicker>
                                    </Col>
                                    <Col span="1" style="line-height: 30px;">
                                    至
                                    </Col>
                                    <Col span="10">
                                        <DatePicker v-model="business.order.end_date" type="date" show-week-numbers placeholder="结束日期" style="width: 100%;"></DatePicker>
                                    </Col>
                                </Row>
                            </RadioGroup>
                            <div class="data-source-row">
                                <chart-pie :id="'pie3'" :series="pie3.series" v-if="business_order_show_pie"></chart-pie>
                                <chart-bar :id="'bar3'" :xAxis="bar3.xAxis" :series="bar3.series" v-if="business_order_show_bar"></chart-bar>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="android-map"></Icon>
                    全网视图
                </p>
                <Row :gutter="10">
                    <Col :lg="12">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="android-map"></Icon>
                                已部署省份
                            </p>
                            <div style="height: 400px;">
                                <chart-map :id="'map1'" :series="map1.series"></chart-map>
                            </div>
                        </Card>
                    </Col>
                    <Col :lg="12">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="android-map"></Icon>
                                用户数TOP10
                            </p>
                            <div slot="extra">
                                <Button type="text" @click="changeUserNumberType" ghost v-text="showUserNumberText"></Button>
                            </div>
                            <Table border :columns="top10Column" :data="top10Data"></Table>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
    import { Message } from 'iview';
    import ChartLine from './component/line.index.vue';
    import ChartMap from './component/map.index.vue';
    import ChartBar from './component/bar.index.vue';
    import ChartPie from './component/pie.index.vue';
    import cityData from '@/libs/city1Data';
    import '@/styles/iconfont/iconfont.js';
    import moment from 'moment';
    import mapCityData from '@/libs/mapCityData.js';
    moment.lang('zh-cn', {week: {dow: 1}});
    export default {
        components: {
            ChartLine,
            ChartMap,
            ChartBar,
            ChartPie
        },
        data () {
            return {
                mapCityData: mapCityData,
                prod_is_show_pie: true,
                prod_is_show_bar: false,
                business_income_show_bar: true,
                business_income_show_pie: false,
                business_order_show_bar: false,
                business_order_show_pie: true,
                showUserNumberType: 1,
                showUserNumberText: '查看年龄段分布',
                timeTypes: [
                    {
                        value: 1,
                        type: 'hour',
                        label: '当日'
                    },
                    {
                        value: 2,
                        label: '昨日'
                    },
                    {
                        value: 3,
                        label: '本周'
                    },
                    {
                        value: 4,
                        label: '上周'
                    },
                    {
                        value: 5,
                        label: '本月'
                    },
                    {
                        value: 6,
                        label: '上月'
                    },
                    {
                        value: 7,
                        label: '最近三个月'
                    },
                    {
                        value: 8,
                        label: '本季'
                    },
                    {
                        value: 9,
                        label: '上季'
                    },
                    {
                        value: 10,
                        label: '今年'
                    },
                    {
                        value: 11,
                        label: '去年'
                    }
                ],
                itemTypes: [],
                itemTypes1: [
                    {
                        value: 0,
                        label: '全部'
                    },
                    {
                        value: 1,
                        label: '有效培养孩子专注力'
                    },
                    {
                        value: 2,
                        label: '有效培养孩子执行功能'
                    }
                ],
                user: {
                    time: {
                        typeVal: 1,
                        type: 'hour',
                        is_all: 1,
                        start_date: moment().startOf('day').format('YYYY-MM-DD'),
                        end_date: moment().startOf('day').subtract('day', -1).format('YYYY-MM-DD')
                    },
                    prod: {
                        type: 1,
                        id: 0
                    }
                },
                business: {
                    income: {
                        type: 1,
                        timeType: 1,
                        start_date: moment().startOf('day').format('YYYY-MM-DD'),
                        end_date: moment().startOf('day').subtract('day', -1).format('YYYY-MM-DD')
                    },
                    order: {
                        type: 1,
                        timeType: 1,
                        start_date: moment().startOf('day').format('YYYY-MM-DD'),
                        end_date: moment().startOf('day').subtract('day', -1).format('YYYY-MM-DD')
                    }
                },
                register: {

                },
                userSelectCity: '青岛',
                businessSelectCity: '青岛',
                data: cityData,
                line1: {
                    xAxis: {
                        data: []
                    },
                    series: []
                },
                bar1: {
                    xAxis: {
                        data: []
                    },
                    series: []
                },
                pie1: {
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
                    ],
                    title: {
                    },
                    legend: {

                    }
                },
                bar2: {
                    xAxis: {
                        data: []
                    },
                    series: []
                },
                pie2: {
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
                    ],
                    title: {
                    },
                    legend: {

                    }
                },
                bar3: {
                    xAxis: {
                        data: []
                    },
                    series: []
                },
                pie3: {
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
                    ],
                    title: {
                    },
                    legend: {

                    }
                },
                map1: {
                    series: {
                        data: []
                    }
                },
                top10Column: [
                    {
                        title: 'No.',
                        render: (h, params) => params.index + 1
                    },
                    {
                        title: '城市',
                        key: 'city'
                    },
                    {
                        title: '注册用户数',
                        key: 'user_number'
                    },
                    {
                        title: '订购用户数',
                        key: 'order_number'
                    }
                ],
                top10Data: []
            };
        },
        methods: {
            getUserAccessData () {
                let data = JSON.parse(JSON.stringify(this.user.time));
                data.start_date = moment(data.start_date).format('YYYY-MM-DD');
                data.end_date = moment(data.end_date).format('YYYY-MM-DD');
                this.axios.get('{{base_host_v1}}/child/statistics/access', {
                    params: data
                }).then(line1 => {
                    this.line1.xAxis.data = line1.data.data.x;
                    this.line1.series = [];
                    this.line1.series.push({
                        data: line1.data.data.y,
                        type: 'line'
                    });
                    this.line1.series.push({
                        data: line1.data.data.y,
                        type: 'bar'
                    });
                });
            },
            getUserUsageData () {
                this.axios.get('{{base_host_v1}}/child/statistics/usage', {
                    params: this.user.prod
                }).then(pie1 => {
                    let pieData = [];
                    for (let [k, v] of pie1.data.data.x.entries()) {
                        pieData.push({name: v, value: pie1.data.data.y[k]});
                    }
                    this.pie1.series[0].data = pieData;
                    this.bar1.xAxis.data = pie1.data.data.x;
                    this.bar1.series = [];
                    this.bar1.series.push({
                        data: pie1.data.data.y,
                        type: 'bar',
                        barWidth: '60%'
                    });
                });
            },
            getUserIncomeData () {
                let data = JSON.parse(JSON.stringify(this.business.income));
                data.start_date = moment(data.start_date).format('YYYY-MM-DD');
                data.end_date = moment(data.end_date).format('YYYY-MM-DD');
                this.axios.get('{{base_host_v1}}/child/statistics/income', {
                    params: data
                }).then(pie2 => {
                    let pieData = [];
                    for (let [k, v] of pie2.data.data.x.entries()) {
                        pieData.push({name: v, value: pie2.data.data.y[k]});
                    }
                    this.pie2.series[0].data = pieData;
                    this.bar2.xAxis.data = pie2.data.data.x;
                    this.bar2.series = [];
                    this.bar2.series.push({
                        data: pie2.data.data.y,
                        type: 'bar',
                        barWidth: '60%'
                    });
                });
            },
            getUserOrderData () {
                let data = JSON.parse(JSON.stringify(this.business.order));
                data.start_date = moment(data.start_date).format('YYYY-MM-DD');
                data.end_date = moment(data.end_date).format('YYYY-MM-DD');
                this.axios.get('{{base_host_v1}}/child/statistics/order', {
                    params: data
                }).then(pie3 => {
                    let pieData = [];
                    for (let [k, v] of pie3.data.data.x.entries()) {
                        pieData.push({name: v, value: pie3.data.data.y[k]});
                    }
                    this.pie3.series[0].data = pieData;
                    this.bar3.xAxis.data = pie3.data.data.x;
                    this.bar3.series = [];
                    this.bar3.series.push({
                        data: pie3.data.data.y,
                        type: 'bar',
                        barWidth: '60%'
                    });
                });
            },
            getUserAreaData () {
                this.axios.get('{{base_host_v1}}/child/statistics/area/number').then(map1 => {
                    let pieData = [];
                    for (let [k, v] of map1.data.data.x.entries()) {
                        pieData.push({name: v, value: map1.data.data.y[k]});
                    }
                    this.map1.series.data = pieData;
                    this.map1.series.nameMap = this.mapCityData;
                });
            },
            getUserShowNumberData () {
                this.axios.get('{{base_host_v1}}/child/statistics/show/user/number', {
                    params: {
                        type: this.showUserNumberType
                    }
                }).then(data => {
                    this.top10Data = data.data.data;
                });
            },
            initData () {
                this.getUserAccessData();
                this.getUserUsageData();
                this.getUserIncomeData();
                this.getUserOrderData();
                this.getUserAreaData();
                this.getUserShowNumberData();
                Promise.all([
                    this.axios.get('{{base_host_v1}}/item/filter', {
                        params: {
                            type: 3
                        }
                    })
                ]).then(([items]) => {
                    this.itemTypes = items.data.data;
                });
            },
            userAccessIsAllToggle () {
                this.getUserAccessData();
            },
            changeBusinessOrderType () {
                this.getUserOrderData();
            },
            showBar () {
                this.prod_is_show_bar = true;
                this.prod_is_show_pie = false;
            },
            showPie () {
                this.prod_is_show_bar = false;
                this.prod_is_show_pie = true;
            },
            businessIncomeShowBar () {
                this.business_income_show_bar = true;
                this.business_income_show_pie = false;
            },
            businessIncomeShowPie () {
                this.business_income_show_bar = false;
                this.business_income_show_pie = true;
            },
            businessOrderShowBar () {
                this.business_order_show_bar = true;
                this.business_order_show_pie = false;
            },
            businessOrderShowPie () {
                this.business_order_show_bar = false;
                this.business_order_show_pie = true;
            },
            changeUserTime (val) {
                let dates = this.getDate(Number.parseInt(val));
                this.user.time.start_date = new Date(dates[0]);
                this.user.time.end_date = new Date(dates[1]);
            },
            changeBusinessIncome (val) {
                let dates = this.getDate(Number.parseInt(val));
                this.business.income.start_date = new Date(dates[0]);
                this.business.income.end_date = new Date(dates[1]);
            },
            changeBusinessOrder (val) {
                let dates = this.getDate(Number.parseInt(val));
                this.business.order.start_date = new Date(dates[0]);
                this.business.order.end_date = new Date(dates[1]);
            },
            changeUserSelectCity (val, selectedData) {
                this.userSelectCity = val[0];
            },
            changeBusinessSelectCity (val, selectedData) {
                this.businessSelectCity = val[0];
            },
            changeBusinessType () {
                if (this.user.prod.type === 2) {
                    if (this.user.prod.id === '') {
                        return '';
                    }
                }
                this.getUserUsageData();
            },
            changeBusinessProdType () {
                if (this.user.prod.type === 2) {
                    if (this.user.prod.id === '') {
                        return '';
                    }
                    this.getUserUsageData();
                }
            },
            changeBusinessIncomeType () {
                this.getUserIncomeData();
            },
            changeUserNumberType () {
                this.showUserNumberType = this.showUserNumberType === 1 ? 2 : 1;
                this.top10Data = [];
                if (this.showUserNumberType === 1) {
                    this.showUserNumberText = '查看年龄段分布';
                    this.top10Column = [
                        {
                            title: 'No.',
                            render: (h, params) => params.index + 1
                        },
                        {
                            title: '城市',
                            key: 'city'
                        },
                        {
                            title: '注册用户数',
                            key: 'user_number'
                        },
                        {
                            title: '订购用户数',
                            key: 'order_number'
                        }
                    ];
                } else {
                    this.showUserNumberText = '查看用户量省级Top10';
                    this.top10Column = [
                        {
                            title: 'No.',
                            render: (h, params) => params.index + 1
                        },
                        {
                            title: '年龄段',
                            key: 'nld'
                        },
                        {
                            title: '注册用户数',
                            key: 'number'
                        }
                    ];
                }
                this.getUserShowNumberData();
            },
            getDate (val) {
                switch (val) {
                    case 1: // 当日
                        return [moment().startOf('day'), moment().startOf('day').subtract('day', -1)];
                    case 2: // 昨日
                        return [moment().startOf('day').subtract('day', 1), moment().endOf('day')];
                    case 3: // 本周
                        return [moment().startOf('week'), moment().endOf('week')];
                    case 4: // 上周
                        return [moment().weekday(-7), moment().weekday(-7).endOf('week')];
                    case 5: // 本月
                        return [moment().startOf('month'), moment().endOf('month')];
                    case 6: // 上月
                        return [moment().startOf('month').subtract('month', 1), moment().endOf('month').subtract('month', 1)];
                    case 7: // 最近三个月
                        return [moment().startOf('month').subtract('month', 3), moment().endOf('month')];
                    case 8: // 本季度
                        return [moment().startOf('quarter'), moment().endOf('quarter')];
                    case 9: // 上季度
                        return [moment().startOf('quarter').subtract('quarter', 1), moment().endOf('quarter').subtract('quarter', 1)];
                    case 10: // 今年
                        return [moment().startOf('year'), moment().endOf('year')];
                    case 11: // 去年
                        return [moment().startOf('year').subtract('year', 1), moment().endOf('year').subtract('year', 1)];
                }
            },
            getCustomDate () {
                let days = moment(this.user.time.end_date).diff(moment(this.user.time.start_date), 'days');
                if (days <= 1) {
                    this.user.time.type = 'hour';
                } else if (days > 1 && days <= 30) {
                    this.user.time.type = 'day';
                } else if (days > 30 && days <= 366) {
                    this.user.time.type = 'month';
                } else {
                    this.user.time.type = 'year';
                }
            }
        },
        watch: {
            'user.time.typeVal': function (newVal, oldVal) {
                if ([1, 2].indexOf(newVal) !== -1) {
                    this.user.time.type = 'hour';
                } else if ([3, 4, 5, 6].indexOf(newVal) !== -1) {
                    this.user.time.type = 'day';
                } else if ([8, 9, 10, 11].indexOf(newVal) !== -1) {
                    this.user.time.type = 'month';
                }
            },
            'user.time.start_date': function (newVal, oldVal) {
                newVal = moment(newVal).format('YYYY-MM-DD');
                oldVal = moment(oldVal).format('YYYY-MM-DD');
                if (newVal === oldVal) return;
                if (this.user.time.start_date !== '' && this.user.time.end_date !== '' && newVal >= moment(this.user.time.end_date).format('YYYY-MM-DD')) {
                    Message.error('开始日期必须小于结束日期');
                    this.user.time.start_date = oldVal;
                    return;
                }
                this.getCustomDate();

                if (this.user.time.start_date && this.user.time.end_date) {
                    this.getUserAccessData();
                }
            },
            'user.time.end_date': function (newVal, oldVal) {
                newVal = moment(newVal).format('YYYY-MM-DD');
                oldVal = moment(oldVal).format('YYYY-MM-DD');
                if (newVal === oldVal) return;
                if (this.user.time.start_date !== '' && this.user.time.end_date !== '' && newVal <= moment(this.user.time.start_date).format('YYYY-MM-DD')) {
                    Message.error('结束日期必须大于开始日期');
                    this.user.time.end_date = oldVal;
                    return;
                }
                this.getCustomDate();

                if (this.user.time.start_date && this.user.time.end_date) {
                    this.getUserAccessData();
                }
            },
            'business.income.start_date': function (newVal, oldVal) {
                newVal = moment(newVal).format('YYYY-MM-DD');
                oldVal = moment(oldVal).format('YYYY-MM-DD');
                if (newVal === oldVal) return;
                if (this.business.income.start_date !== '' && this.business.income.end_date !== '' && newVal >= moment(this.business.income.end_date).format('YYYY-MM-DD')) {
                    Message.error('开始日期必须小于结束日期');
                    this.business.income.start_date = oldVal;
                    return;
                }

                if (this.business.income.start_date && this.business.income.end_date) {
                    this.getUserIncomeData();
                }
            },
            'business.income.end_date': function (newVal, oldVal) {
                newVal = moment(newVal).format('YYYY-MM-DD');
                oldVal = moment(oldVal).format('YYYY-MM-DD');
                if (newVal === oldVal) return;
                if (this.business.income.start_date !== '' && this.business.income.end_date !== '' && newVal <= moment(this.business.income.start_date).format('YYYY-MM-DD')) {
                    Message.error('结束日期必须大于开始日期');
                    this.business.income.end_date = oldVal;
                    return;
                }

                if (this.business.income.start_date && this.business.income.end_date) {
                    this.getUserIncomeData();
                }
            },
            'business.order.start_date': function (newVal, oldVal) {
                newVal = moment(newVal).format('YYYY-MM-DD');
                oldVal = moment(oldVal).format('YYYY-MM-DD');
                if (newVal === oldVal) return;
                if (this.business.order.start_date !== '' && this.business.order.end_date !== '' && newVal >= moment(this.business.order.end_date).format('YYYY-MM-DD')) {
                    Message.error('开始日期必须小于结束日期');
                    this.business.order.start_date = oldVal;
                    return;
                }

                if (this.business.order.start_date && this.business.order.end_date) {
                    this.getUserOrderData();
                }
            },
            'business.order.end_date': function (newVal, oldVal) {
                newVal = moment(newVal).format('YYYY-MM-DD');
                oldVal = moment(oldVal).format('YYYY-MM-DD');
                if (newVal === oldVal) return;
                if (this.business.order.start_date !== '' && this.business.order.end_date !== '' && newVal <= moment(this.business.order.start_date).format('YYYY-MM-DD')) {
                    Message.error('结束日期必须大于开始日期');
                    this.business.order.end_date = oldVal;
                    return;
                }

                if (this.business.order.start_date && this.business.order.end_date) {
                    this.getUserOrderData();
                }
            }
        },
        created () {
            this.initData();
        }
    };
</script>