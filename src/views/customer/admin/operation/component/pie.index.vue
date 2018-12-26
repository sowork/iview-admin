<template>
    <div style="width:100%;height:100%;" :id="id"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        props: {
            id: String,
            series: {
                type: Array
            },
            title: {
                type: Object
            },
            legend: {
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
                    title: {...this.title, ...{left: 'center'}},
                    legend: {...this.legend, ...{bottom: 10}},
                    series: [...this.series],
                    color: ['#e99e80', '#b78bc8', '#e5c271', '#8bc56e', '#a4d6ef', '#5d85d4', '#e97b7a']
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