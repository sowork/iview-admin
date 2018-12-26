<style>
    .hide {
        display: none !important;
    }
</style>
<template>
    <Poptip v-model="visibleCopy.value" :placement="placement" :width="width" @on-popper-show="onPopperShow" @on-popper-hide="onPopperHide" transfer>
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
            visible: {
                type: Boolean,
                default: false
            },
            width: {
                type: Number,
                default: 660
            },
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
                itemValueCopy: JSON.parse(JSON.stringify(this.itemDefaultValue)),
                visibleCopy: {
                    value: this.visible
                }
            };
        },
        methods: {
            handleChange (targetData, direction, moveKeys) {
                this.$emit('handleChange', targetData, this.itemValueCopy, direction, moveKeys);
            },
            onPopperShow () {
                this.$emit('onPopperShow', this.itemValueCopy);
                this.$emit('PopperToggle', this.visibleCopy);
            },
            onPopperHide () {
                this.$emit('PopperToggle', this.visibleCopy);
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

