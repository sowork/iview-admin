<template>
    <Poptip :placement="placement" width="660" @on-popper-show="onPopperShow" transfer>
        <div slot="content">
            <Row :gutter="10">
                <Col span="24">
                    <Card>
                        <div style="padding-bottom: 15px">
                            <Button type="ghost" @click="showFilterData">LoadFilter</Button>
                            <Button type="ghost" @click="showAllData">LoadAll</Button>
                            <Cascader :data="items" :value="itemDefaultValue" @on-change="selectItemChange" style="width: 250px; display: inline-block"></Cascader>
                        </div>
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
                this.$emit('handleChange', targetData);
            },
            onPopperShow () {
                this.$emit('onPopperShow', this.itemDefaultValue);
            },
            showAllData () {
                this.$emit('showAllData', this.itemDefaultValue);
            },
            selectItemChange (value, selectedData) {
                this.$emit('selectItemChange', value, selectedData);
            },
            showFilterData () {
                this.$emit('showFilterData', this.itemDefaultValue);
            }
        }
    };
</script>

