<style>
    .hide {
        display: none;
    }
</style>
<template>
    <Poptip :placement="placement" width="660" @on-popper-show="onPopperShow" transfer>
        <div slot="content">
            <Row :gutter="10">
                <Col span="24">
                    <Card>
                        <slot name="head">
                            <div style="padding-bottom: 15px">
                                <Button :class="{hide: !showBtn1}" type="ghost" @click="showFilterData">LoadFilter</Button>
                                <Button :class="{hide: !showBtn2}" type="ghost" @click="showAllData">LoadAll</Button>
                                <Cascader :class="{hide: !showCascader}" :data="items" v-model="itemValueCopy" @on-change="selectItemChange" style="width: 250px; display: inline-block"></Cascader>
                            </div>
                        </slot>
                        <Transfer
                                :data="groupData"
                                :target-keys="targetItems"
                                :list-style="listStyle"
                                :render-format="renderItem"
                                :operations="operations"
                                filterable
                                @on-change="handleChange">
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
            showBtn1: {
                type: Boolean,
                default: true
            },
            showBtn2: {
                type: Boolean,
                default: true
            },
            showCascader: {
                type: Boolean,
                default: true
            },
            groupData: Array,
            targetItems: Array,
            listStyle: Object,
            operations: Array,
            placement: {
                type: String,
                default () {
                    return 'bottom';
                }
            },
            itemDefaultValue: {
                type: Array,
                default () {
                    return [];
                }
            },
            items: {
                type: Array,
                default () {
                    return [];
                }
            },
            renderItem: {
                type: Function,
                default (item) {
                    return item.label || item.key;
                }
            }
        },
        data () {
            return {
                itemValueCopy: this.itemDefaultValue
            };
        },
        methods: {
            handleChange (targetData) {
                this.$emit('handleChange', targetData, this.itemValueCopy);
            },
            onPopperShow () {
                this.$emit('onPopperShow', this.itemValueCopy);
            },
            showAllData () {
                this.$emit('showAllData', this.itemValueCopy);
            },
            selectItemChange (value, selectedData) {
                this.$emit('selectItemChange', value, selectedData);
            },
            showFilterData () {
                this.$emit('showFilterData', this.itemValueCopy);
            }
        }
    };
</script>

