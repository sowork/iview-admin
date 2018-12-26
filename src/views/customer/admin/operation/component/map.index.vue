<template>
    <div style="width:100%; height:100%;" :id="id"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        props: {
            id: String,
            series: {
                type: Object
            },
            title: {
                type: Object
            },
            visualMap: {
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
                    series: {...this.series, ...{type: 'map', mapType: 'china', zoom: 1.2, label: {normal: {show: true}}}},
                    visualMap: {...this.visualMap, ...{min: 0, max: 150, text: ['高', '低'], inRange: {color: ['#e3f2fe', '#b9def9', '#8dcbfc', '#43a5f6', '#1977cf']}}}
                };
            }
        },
        watch: {
            option: function (newVal, oldVal) {
                this.serviceRequestChart.setOption(this.option);
            }
        },
        created () {
            if (this.serviceRequestChart) {
                this.serviceRequestChart.setOption(this.option);
            }
        },
        mounted () {
            if (this.id !== null && this.id !== '' && this.id !== undefined) {
                const chinaJson = require('@/views/home/map-data/china.json');
                echarts.registerMap('china', chinaJson);
                this.serviceRequestChart = echarts.init(document.getElementById(this.id));
                this.serviceRequestChart.setOption(this.option);
            }
        }
    };
</script>