<template>
    <Poptip :placement="placement" width="660" @on-popper-show="onPopperShow" transfer>
        <div slot="content">
            <Row :gutter="10">
                <Col span="24">
                    <Card>
                        <div style="padding-bottom: 15px">
                            <Button type="ghost" @click="showFilterData">LoadFilter</Button>
                            <Button type="ghost" @click="showAllData">LoadAll</Button>
                            <Select style="width:200px" :value="valueCopy" @on-change="selectChange">
                                <Option v-for="item in items" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
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
            value: {
                type: Number,
                default () {
                    return 0;
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
                valueCopy: this.value
            };
        },
        methods: {
            handleChange (targetData) {
                this.$emit('handleChange', targetData);
            },
            onPopperShow () {
                this.$emit('onPopperShow', this.value);
            },
            showAllData () {
                this.$emit('showAllData', this.value);
            },
            selectChange (value) {
                this.$emit('selectChange', value);
            },
            showFilterData () {
                this.$emit('showFilterData', this.value);
            }
        }
    };
</script>

