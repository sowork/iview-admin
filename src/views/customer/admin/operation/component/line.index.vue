<template>
    <div style="width:100%;height:100%;" :id="id"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        props: {
            id: String,
            xAxis: {
                type: Object
            },
            yAxis: {
                type: Object
            },
            series: {
                type: Array
            },
            title: {
                type: Object
            }
        },
        data () {
            return {
                serviceRequestChart: null
            };
        },
        computed: {
            option: function () {
                return {
                    title: {...{x: 'center', align: 'right'}, ...this.title},
                    xAxis: {...{type: 'category'}, ...this.xAxis},
                    yAxis: {...{type: 'value'}, ...this.yAxis},
                    series: [...this.series],
                    color: ['#00FF00', '#e99e80', '#b78bc8', '#e5c271', '#8bc56e', '#a4d6ef', '#5d85d4', '#e97b7a']
                };
            }
        },
        watch: {
            option: {
                deep: true,
                handler: function (newVal, oldVal) {
                    this.serviceRequestChart.setOption(this.option);
                }
            }
        },
        mounted () {
            if (this.id !== null && this.id !== '' && this.id !== undefined) {
                this.serviceRequestChart = echarts.init(document.getElementById(this.id));
                this.serviceRequestChart.setOption(this.option);
            }
        }
    };
</script>