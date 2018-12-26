<template>
    <Poptip :placement="placement" width="400" @on-popper-show="onPopperShow">
        <div slot="content">
            <Row :gutter="10">
                <Col span="24">
                    <Card>
                        <Row>
                            <Input icon="search" v-model="searchContent" @on-change="handleSearch" placeholder="请输入节点名称搜索..." style="width: 300px" />
                        </Row>
                        <Row class="margin-top-10 searchable-table-con1">
                            <Scroll height="400">
                                <Table width="330" :columns="columns" :data="data" @on-row-dblclick="handleDbClick"></Table>
                            </Scroll>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
        <slot></slot>
    </Poptip>
</template>

<script>
    export default {
        name: 'PopTipTable',
        props: {
            columns: Array,
            data: Array,
            selectNode: Object,
            placement: {
                type: String,
                default: 'bottom'
            }
        },
        data () {
            return {
                searchContent: '',
                initData: []
            };
        },
        methods: {
            handleSearch () {
                this.$emit('search', this.searchContent);
            },
            handleDbClick (row, index) {
                this.$emit('dbClick', row, index, this.selectNode);
            },
            onPopperShow () {
                this.$emit('on-popper-show');
            }
        }
    };
</script>

