<template>
    <Poptip placement="bottom" width="660" @on-popper-show="onPopperShow" transfer>
        <div slot="content">
            <Row :gutter="10">
                <Col span="24">
                    <Card>
                        <div style="padding-bottom: 15px">
                            <Button type="ghost" size="small" @click="showAllData">LoadFilter</Button>
                            <Button type="ghost" size="small" @click="showAllData">LoadAll</Button>
                        </div>
                        <Transfer
                                :data="groupData"
                                :target-keys="targetItems"
                                :list-style="listStyle"
                                :render-format="renderItem"
                                :operations="operations"
                                filterable
                                @on-change="handleChange">
                            <div :style="{float: 'right', margin: '5px'}">
                                <Button type="ghost" size="small" @click="showAllData">LoadAll</Button>
                            </div>
                        </Transfer>
                    </Card>
                </Col>
            </Row>
        </div>
        <slot></slot>
    </Poptip>
</template>

<script>
    export default {
        name: 'PopTipTransfer',
        props: {
            groupData: Array,
            targetItems: Array,
            listStyle: Object,
            operations: Array,
            renderItem: {
                type: Function,
                default (item) {
                    return item.label || item.key;
                }
            }
        },
        data () {
            return {
                searchContent: '',
                initData: []
            };
        },
        methods: {
            handleChange (targetData) {
                this.$emit('handleChange', targetData);
            },
            onPopperShow () {
                this.$emit('onPopperShow');
            },
            showAllData () {
                this.$emit('showAllData');
            }
        }
    };
</script>

