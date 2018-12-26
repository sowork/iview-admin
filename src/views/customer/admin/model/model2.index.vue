<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                模型管理
            </p>
            <div class="edittable-table-height-con">
                <div class="margin-bottom-10">
                    <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store', 0, 'modal1', true)) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                </div>
                <Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
            <div class="margin-top-20">
                <Page @on-change="onChange" @on-page-size-change="onPageSizeChange" :total="total" show-total size="small" show-elevator show-sizer></Page>
            </div>
        </Card>
        <Modal :loading="loading" v-model="modal1" title="模型管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="模型代码" prop="model_code">
                    <Input v-model="formItem.model_code" placeholder=""></Input>
                </FormItem>
                <FormItem label="模型名称" prop="model_name">
                    <Input v-model="formItem.model_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="模型分类" prop="model_type">
                    <Select v-model="formItem.model_type">
                        <Option v-for="item in model_types" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="适用年龄">
                    <Row>
                        <Col span="11">
                        <FormItem prop="age_from">
                            <Input v-model.number="formItem.age_from" placeholder="例如：0（岁为单位）"></Input>
                        </FormItem>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                        <FormItem prop="age_to">
                            <Input v-model.number="formItem.age_to" placeholder="例如：3（岁为单位）"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="模型描述" prop="org_address">
                    <Input type="textarea" v-model="formItem.org_address" placeholder=""></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认</Button>
            </div>
        </Modal>
        <Modal :loading="loading" v-model="modal2" title="模型管理" width="820">
            <Form ref="formItem2" :model="formItem2" :rules="ruleValidate2" :label-width="80">
                <FormItem
                    v-for="(item, index) in formItem2.items"
                    :key="index"
                    :label="'指标' + (index + 1)">
                <Row>
                    <Col span="5">
                    <FormItem :prop="'items.' + index + '.index_type'" :rules="ruleValidate2.index_type">
                        <Select v-model="item.index_type" placeholder="请选择指标类别" @on-change="getIndexesByType($event, index)">
                            <Option v-for="item in indexTypes" :value="item.value" :key="item.value">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="5">
                    <FormItem :prop="'items.' + index + '.index_id'" :rules="ruleValidate2.index_id">
                        <Select v-model.number="item.index_id" placeholder="请选择指标名称">
                            <Option v-for="item in indexes[index]" :value="item.id" :key="item.id">{{ item.index_name }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="1" style="text-align: center">|</Col>
                    <Col span="5">
                    <FormItem :prop="'items.' + index + '.model_index_ref_name'" :rules="ruleValidate2.model_index_ref_name">
                        <Input type="text" v-model="item.model_index_ref_name" placeholder="请输入参考值名称"></Input>
                    </FormItem>
                    </Col>
                    <Col span="5">
                    <FormItem :prop="'items.' + index + '.model_index_ref_value'" :rules="ruleValidate2.model_index_ref_value">
                        <Input type="text" v-model="item.model_index_ref_value" placeholder="请输入参考值"></Input>
                    </FormItem>
                    </Col>
                    <Col span="2" offset="1">
                    <Button type="ghost" @click="handleRemove(index)">删除</Button>
                    </Col>
                </Row>
                </FormItem>

                <FormItem>
                    <Row>
                        <Col span="12">
                            <Button type="dashed" long @click="handleAdd" icon="plus-round">添加指标</Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem2')">重置</Button>
                <Button type="primary" @click="httpRequest2.next()">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { indexTypes } from '@/libs/types';

    export default {
        components: {
        },
        data () {
            return {
                indexes: [
                    []
                ],
                showTransfer: true,
                currentModelId: '',
                indexType: 0,
                indexTypes: indexTypes,
                indexLists: [
                    {
                        name: '请选择',
                        value: 0
                    },
                    {
                        name: '运动',
                        value: 1
                    },
                    {
                        name: '社交',
                        value: 2
                    }
                ],
                listStyle: {
                    width: '350px',
                    height: '400px',
                    margin: '20px auto'
                },
                targetData: [],
                targetKeys: [],
                model_types: [
                    {
                        name: '运动',
                        value: 1
                    },
                    {
                        name: '社交',
                        value: 2
                    }
                ],
                editInlineColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '模型代码',
                        align: 'center',
                        key: 'model_code'
                    },
                    {
                        title: '模型名称',
                        align: 'center',
                        key: 'model_name'
                    },
                    {
                        title: '模型类型',
                        align: 'center',
                        render: (h, params) => {
                            for (let t of this.model_types) {
                                if (t.value === params.row.model_type) {
                                    return h('span', t.name);
                                }
                            }
                        }
                    },
                    {
                        title: '开始年龄',
                        align: 'center',
                        key: 'age_from'
                    },
                    {
                        title: '结束年龄',
                        align: 'center',
                        key: 'age_to'
                    },
                    {
                        title: '模型描述',
                        align: 'center',
                        key: 'model_desc'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.httpRequest2 = this.actionModal('formItem2', 'storeModelIndexes', params.row.id, 'modal2', true);
                                            this.httpRequest2.next();
                                            this.formItem2.items = [];
                                            this.handleAdd();
                                            this.getModelIndexRefs(params.row.id);
                                        }
                                    }
                                }, '添加指标'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.dblClick(JSON.parse(JSON.stringify(this.editInlineData[params.index])), params.index);
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.formItem = params.row;
                                            this.destroy(params.index);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        }
                                    }, '删除')
                                ])
                            ]);
                        }
                    }
                ],
                editInlineData: [],
                total: 0,
                page: 1,
                number: 10,
                modal1: false,
                modal2: false,
                loading: false,
                httpRequest: '',
                formItem: {
                    model_code: '',
                    model_name: '',
                    model_type: '',
                    age_from: '',
                    org_to: '',
                    model_desc: ''
                },
                ruleValidate: {
                    model_code: [
                        {required: true, message: '模型代码不能为空', trigger: 'blur'}
                    ],
                    model_name: [
                        {required: true, message: '模型名称不能为空', trigger: 'blur'}
                    ],
                    model_type: [
                        {required: true, type: 'number', message: '模型类别不能为空', trigger: 'change'}
                    ],
                    age_from: [
                        {required: true, type: 'number', message: '开始年龄不能为空', trigger: 'blur'}
                    ],
                    age_to: [
                        {required: true, type: 'number', message: '结束年龄不能为空', trigger: 'blur'}
                    ],
                    model_desc: [
                        {required: true, message: '模型描述不能为空', trigger: 'blur'}
                    ]
                },
                formItem2: {
                    items: []
                },
                ruleValidate2: {
                    index_type: [
                        {required: true, type: 'number', message: '指标类别不能为空', trigger: 'change'}
                    ],
                    index_id: [
                        {required: true, type: 'number', message: '指标名称不能为空', trigger: 'change'}
                    ],
                    model_index_ref_name: [
                        {required: true, message: '常量开始分数不能为空', trigger: 'change'}
                    ],
                    model_index_ref_value: [
                        {required: true, message: '常量结束分数不能为空', trigger: 'change'}
                    ]
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/m', {
                        params: {
                            'page': this.page,
                            'number': this.number
                        }
                    })
                ]).then(([orgs]) => {
                    this.editInlineData = orgs.data.data.data;
                    this.total = orgs.data.data.total;
                });
            },
            * actionModal (name, method, index = 0, modalName = 'modal1', isReset = false) {
                if (isReset) {
                    this.reset(name);
                }
                yield (this[modalName] = true);
                while (true) {
                    yield this.$refs[name].validate(valid => {
                        if (valid) {
                            this[method](index);
                        }
                    });
                }
            },
            store () {
                this.formItem._method = 'post';
                this.axios.post('{{base_host_v1}}/m', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.unshift(response.data.data);
                });
            },
            storeModelIndexes (id) {
                this.formItem._method = 'post';
                this.axios.post('{{base_host_v1}}/m/index/refs/' + id, this.formItem2).then(response => {
                    this.modal2 = false;
                    this.targetKeys = response.data.data;
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{base_host_v1}}/m/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/m/' + this.formItem.id, this.formItem).then(response => {
                    this.editInlineData.splice(index, 1);
                });
            },
            dblClick (row, index) {
                this.formItem = row;
                this.httpRequest = this.actionModal('formItem', 'update', index);
                this.httpRequest.next();
            },
            reset (name) {
                this.$refs[name].resetFields();
            },
            onChange (page, number) {
                this.page = page;
                this.initData();
            },
            onPageSizeChange (number) {
                this.number = number;
                this.initData();
            },
            getIndexData () {
                this.axios.get('{{base_host_v1}}/index/search', {
                    params: {
                        type: this.indexType
                    }
                }).then(indexes => {
                    this.targetData = [];
                    for (let index of indexes.data.data) {
                        this.targetData.push({
                            key: index.id,
                            label: index.index_name,
                            description: index.index_desc
                        });
                    }
                });
            },
            getIndexDataKeys (id = null) {
                this.axios.get('{{base_host_v1}}/m/index/keys/' + id).then(indexKeys => {
                    this.targetKeys = [];
                    this.targetKeys = indexKeys.data.data;
                });
            },
            handleAdd () {
                this.formItem2.items.push({
                    index_type: '',
                    index_id: '',
                    model_index_ref_name: '',
                    model_index_ref_value: ''
                });
            },
            handleRemove (index) {
                this.formItem2.items.splice(index, 1);
            },
            getIndexesByType (type, index) {
                this.indexes[index] = [];
                this.formItem2.items[index].index_id = '';
                this.axios.get('{{base_host_v1}}/index/search', {
                    params: {
                        type: type
                    }
                }).then(indexes => {
                    this.$set(this.indexes, index, indexes.data.data);
                });
            },
            getModelIndexRefs (id) {
                this.axios.get('{{base_host_v1}}/m/index/refs/' + id).then(indexes => {
                    let temps = [];
                    for (let [index, d] of indexes.data.data.entries()) {
                        temps.push({
                            index_type: d.index_type,
                            index_id: d.id,
                            model_index_ref_name: d.pivot.model_index_ref_name,
                            model_index_ref_value: d.pivot.model_index_ref_value
                        });
                        this.indexes[index] = d.indexes;
                    }
                    this.formItem2.items = temps.concat(this.formItem2.items);
                });
            }
        },
        created () {
            this.initData();
        }
    };
</script>