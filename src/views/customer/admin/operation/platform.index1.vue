<style lang="less">
    @import '../../../../styles/common.less';
    @import './operation';
</style>

<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="8">
                <Row class="margin-top-10">
                    <Card>
                        <p slot="title" class="card-title">
                            <Icon type="android-map"></Icon>
                            一天内用户24小时注册量
                        </p>
                        <div class="data-source-row">
                            <chart-line :id="'line1'" :xAxis="line1.xAxis" :series="line1.series"></chart-line>
                        </div>
                    </Card>
                </Row>
            </Col>
            <Col :md="24" :lg="8">
                <Row class="margin-top-10">
                    <Card>
                        <p slot="title" class="card-title">
                            <Icon type="android-map"></Icon>
                            一天内用户24小时访问量
                        </p>
                        <div class="data-source-row">
                            <chart-line :id="'line2'" :xAxis="line2.xAxis" :series="line2.series"></chart-line>
                        </div>
                    </Card>
                </Row>
            </Col>
            <Col :md="24" :lg="8">
                <Row class="margin-top-10">
                    <Card>
                        <p slot="title" class="card-title">
                            <Icon type="android-map"></Icon>
                            当日课程产品用户使用量
                        </p>
                        <div class="data-source-row">
                            <chart-bar :id="'bars1'" :xAxis="bars1.xAxis" :series="bars1.series"></chart-bar>
                        </div>
                    </Card>
                </Row>
            </Col>
        </Row>
        <Row :gutter="10">
            <Col :md="24" :lg="8">
            <Row class="margin-top-10">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        业务订购年龄占比
                    </p>
                    <div class="data-source-row-large">
                        <chart-line></chart-line>
                    </div>
                </Card>
            </Row>
            </Col>
            <Col :md="24" :lg="16">
            <Row class="margin-top-10">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        服务地域分析
                    </p>
                    <div class="data-source-row-large">
                        <chart-map></chart-map>
                    </div>
                </Card>
            </Row>
            </Col>
        </Row>
        <Row :gutter="10">
            <Col :md="24" :lg="8">
            <Row class="margin-top-10">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        用户订购套餐数量
                    </p>
                    <div class="data-source-row">
                        <chart-bar></chart-bar>
                    </div>
                </Card>
            </Row>
            </Col>
            <Col :md="24" :lg="8">
            <Row class="margin-top-10">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        收入占比
                    </p>
                    <div class="data-source-row">
                        <chart-line></chart-line>
                    </div>
                </Card>
            </Row>
            </Col>
            <Col :md="24" :lg="8">
            <Row class="margin-top-10">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        套餐订单数量
                    </p>
                    <div class="data-source-row">
                        <chart-line></chart-line>
                    </div>
                </Card>
            </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
    import ChartLine from './component/line.index.vue';
    import ChartMap from './component/map.index.vue';
    import ChartBar from './component/bar.index.vue';
    export default {
        components: {
            ChartLine,
            ChartMap,
            ChartBar
        },
        data () {
            return {
                line1: {
                    xAxis: {
                        data: []
                    },
                    series: {
                        data: []
                    }
                },
                line2: {
                    xAxis: {
                        data: []
                    },
                    series: {
                        data: []
                    }
                },
                bars1: {
                    xAxis: {
                        data: []
                    },
                    series: {
                        data: []
                    }
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/child/statistics/number', {
                        params: {
                            type: 'hour'
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/child/statistics/access', {
                        params: {
                            type: 'hour'
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/child/statistics/usage', {
                        params: {
                            type: 'hour'
                        }
                    })
                ]).then(([lines1, lines2, bars1]) => {
                    this.line1.xAxis.data = lines1.data.data.x;
                    this.line1.series.data = lines1.data.data.y;

                    this.line2.xAxis.data = lines2.data.data.x;
                    this.line2.series.data = lines2.data.data.y;

                    this.bars1.xAxis.data = bars1.data.data.x;
                    this.bars1.series.data = bars1.data.data.y;
                });
            }
        },
        created () {
            this.initData();
        }
    };
</script>