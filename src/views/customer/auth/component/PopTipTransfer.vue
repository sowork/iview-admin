<template>
    <Poptip :placement="placement" width="660" @on-popper-show="onPopperShow" transfer>
        <div slot="content">
            <Row :gutter="10">
                <Col span="24">
                    <Card>
                        <div style="padding-bottom: 15px">
                            <Button type="ghost" @click="showFilterData">LoadFilter</Button>
                            <Button type="ghost" @click="showAllData">LoadAll</Button>
                            <Select style="width:200px" :value="itemValueCopy" @on-change="selectItemChange">
                                <Option v-for="item in items" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
                            <Select style="width:200px" :value="scopeValueCopy" @on-change="selectScopeChange">
                                <Option v-for="scope in scopes" :value="scope.value" :key="scope.value + scope.name">{{ scope.name }}</Option>
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
            itemDefaultValue: {
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
            scopeDefaultValue: {
                type: String,
                default () {
                    return '';
                }
            },
            scopes: {
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
//                scopeValueCopy: this.scopeDefaultValue
            };
        },
        computed: {
            scopeValueCopy () {
                console.log(this.scopeDefaultValue)
                return this.scopeDefaultValue;
            }
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
            selectItemChange (value) {
                this.$emit('selectItemChange', value);
            },
            selectScopeChange (value) {
                this.$emit('selectScopeChange', value);
            },
            showFilterData () {
                this.$emit('showFilterData', this.itemDefaultValue);
            }
        }
    };
</script>

