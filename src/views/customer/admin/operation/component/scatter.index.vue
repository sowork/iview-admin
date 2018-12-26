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
            grid: {
                type: Object
            },
            label: {
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
                    title: {...{text: ''}, ...this.title},
                    xAxis: {...{scale: true}, ...this.xAxis},
                    yAxis: {...{scale: true}, ...this.yAxis},
                    series: [...this.series],
                    color: ['#3398DB']
                };
            }
        },
        created () {
            if (this.serviceRequestChart) {
                this.serviceRequestChart.setOption(this.option);
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