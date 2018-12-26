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
        <Modal :loading="loading" v-model="modal2" title="模型管理" @keydown.enter.native="httpRequest2.next()" width="820">
            <Select v-model="indexType" style="width:350px" @on-change="getIndexData" v-if="showTransfer">
                <Option v-for="item in indexLists" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            <Transfer v-if="showTransfer"
                    :data="targetData"
                    :target-keys="targetKeys"
                    :list-style="listStyle"
                    :operations="['左移','右移']"
                    filterable
                    @on-change="storeIndex">
            </Transfer>
        </Modal>
    </div>
</template>

<script>
    import PopTipTransfer from '../../common/auth/component/PopTipTransfer.vue';
    export default {
        components: {
            PopTipTransfer
        },
        data () {
            return {
                showTransfer: true,
                currentModelId: '',
                indexType: 0,
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
                                            this.indexType = 0;
                                            this.getIndexData();
                                            this.showTransfer = false;
                                            this.$nextTick(function () {
                                                this.showTransfer = true;
                                            });
                                            this.targetKeys = [];
                                            this.httpRequest2 = this.actionModal('formItem2', '', params.row.id, 'modal2', false);
                                            this.httpRequest2.next();
                                            this.getIndexDataKeys(params.row.id);
                                            this.currentModelId = params.row.id;
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
                    model_code: '',
                    model_name: '',
                    model_type: '',
                    age_from: '',
                    org_to: '',
                    model_desc: ''
                },
                ruleValidate2: {
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
            storeIndex (targetKeys, direction, moveKeys) {
                this.formItem._method = 'post';
                this.axios.post('{{base_host_v1}}/m/index/keys/' + this.currentModelId, {
                    ids: targetKeys
                }).then(response => {
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
            }
        },
        created () {
            this.initData();
        }
    };
</script>