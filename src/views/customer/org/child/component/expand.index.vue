<style lang="less">
    @import '../../../../../styles/common.less';
</style>
<template>
    <div>
        <p><b>套餐订购详情：</b></p>
        <Row class="expand-row margin-top-8" v-for="item in items">
            <Col span="4">
                <span class="expand-key">名称: </span>
                <span class="expand-value">{{ item.pivot.item_name }}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">默认使用次数: </span>
                <span class="expand-value">{{ item.pivot.use_num }}</span>
            </Col>
            <Col span="3">
                <span class="expand-key">激活日期: </span>
                <span class="expand-value">{{ item.pivot.active_time }}</span>
            </Col>
            <Col span="3">
                <span class="expand-key">默认有效日期: </span>
                <span class="expand-value">{{ item.pivot.valid_date }}</span>
            </Col>
            <Col span="3">
                <span class="expand-key">默认失效日期: </span>
                <span class="expand-value">{{ item.pivot.invalid_date }}</span>
            </Col>
            <Col span="4">
                <span class="expand-key">描述: </span>
                <span class="expand-value">{{ item.pivot.item_desc }}</span>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            items: {
                type: Array,
                default: []
            }
        },
        data () {
            return {

            };
        },
        created () {
        }
    };
</script>