<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                模板管理
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
        <Modal :loading="loading" v-model="modal1" title="模板管理" @keydown.enter.native="httpRequest.next()" width="600">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="模板ID" prop="component_code">
                    <Input v-model="formItem.component_code" placeholder=""></Input>
                </FormItem>
                <FormItem label="模板名称" prop="component_name">
                    <Input v-model="formItem.component_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="模板类型" prop="component_type">
                    <Select v-model="formItem.component_type">
                        <Option v-for="item in component_types" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始年龄" prop="start_age">
                    <Input v-model.number="formItem.start_age" placeholder=""></Input>
                </FormItem>
                <FormItem label="结束年龄" prop="end_age">
                    <Input v-model.number="formItem.end_age" placeholder=""></Input>
                </FormItem>
                <FormItem label="模板路径" prop="component_path">
                    <Input v-model="formItem.component_path" placeholder=""></Input>
                </FormItem>
                <FormItem label="模板描述" prop="component_desc">
                    <Input v-model="formItem.component_desc" type="textarea" placeholder=""></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认</Button>
            </div>
        </Modal>
        <Modal :loading="loading" v-model="modal2" title="模型管理" @keydown.enter.native="httpRequest2.next()" width="820">
            <Select v-model="search.type" style="width:250px" v-if="showTransfer">
                <Option v-for="item in contentLists" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            <Input v-model="search.start_age" placeholder="开始年龄" style="width:250px" v-if="showTransfer"></Input>
            <Input v-model="search.end_age" placeholder="结束年龄" style="width:250px" v-if="showTransfer"></Input>
            <Transfer v-if="showTransfer"
                      :data="targetData"
                      :target-keys="targetKeys"
                      :list-style="listStyle"
                      :operations="['左移','右移']"
                      filterable
                      @on-change="storeModels">
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
                search: {
                    type: 0,
                    start_age: '',
                    end_age: ''
                },
                showTransfer: true,
                currentIndexId: '',
                contentLists: [
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
                component_types: [
                    {
                        name: '个体',
                        value: 1
                    },
                    {
                        name: '群体',
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
                        title: '模板ID',
                        align: 'center',
                        key: 'component_code'
                    },
                    {
                        title: '模板名称',
                        align: 'center',
                        key: 'component_name'
                    },
                    {
                        title: '开始年龄',
                        align: 'center',
                        key: 'start_age'
                    },
                    {
                        title: '结束年龄',
                        align: 'center',
                        key: 'end_age'
                    },
                    {
                        title: '模板地址',
                        align: 'center',
                        key: 'component_path'
                    },
                    {
                        title: '模板类别',
                        align: 'center',
                        render: (h, params) => {
                            for (let type of Array.from(this.component_types)) {
                                if (type.value === params.row.component_type) {
                                    return h('span', type.name);
                                }
                            }
                        }
                    },
                    {
                        title: '模板描述',
                        align: 'center',
                        key: 'component_desc'
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
                                            this.search.type = 0;
                                            this.search.start_age = '';
                                            this.search.end_age = '';
                                            this.getModelData();
                                            this.showTransfer = false;
                                            this.$nextTick(function () {
                                                this.showTransfer = true;
                                            });
                                            this.targetKeys = [];
                                            this.httpRequest2 = this.actionModal('formItem2', '', params.row.id, 'modal2', false);
                                            this.httpRequest2.next();
                                            this.getModelDataKeys(params.row.id);
                                            this.currentIndexId = params.row.id;
                                        }
                                    }
                                }, '添加内容'),
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
                    component_code: '',
                    component_name: '',
                    component_type: '',
                    component_desc: '',
                    component_path: '',
                    start_age: '',
                    end_age: ''
                },
                ruleValidate: {
                    component_code: [
                        {required: true, message: '模板代码不能为空', trigger: 'blur'}
                    ],
                    component_name: [
                        {required: true, message: '模板名称不能为空', trigger: 'blur'}
                    ],
                    component_type: [
                        {required: true, type: 'number', message: '模板类型不能为空', trigger: 'change'}
                    ],
                    start_age: [
                        {required: true, type: 'number', message: '开始年龄不能为空', trigger: 'change'}
                    ],
                    end_age: [
                        {required: true, type: 'number', message: '结束年龄不能为空', trigger: 'change'}
                    ]
                },
                formItem2: {
                    index_code: '',
                    index_name: '',
                    index_type: '',
                    index_desc: ''
                },
                ruleValidate2: {
                    index_code: [
                        {required: true, message: '指标代码不能为空', trigger: 'blur'}
                    ],
                    index_name: [
                        {required: true, message: '指标名称不能为空', trigger: 'blur'}
                    ],
                    index_type: [
                        {required: true, type: 'number', message: '指标类别不能为空', trigger: 'change'}
                    ]
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/component', {
                        params: {
                            'page': this.page,
                            'number': this.number
                        }
                    })
                ]).then(([orgs]) => {
                    this.editInlineData = orgs.data.data.data;
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
                this.axios.post('{{base_host_v1}}/component', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.unshift(response.data.data);
                });
            },
            storeModels (targetKeys, direction, moveKeys) {
                this.formItem._method = 'post';
                this.axios.post('{{base_host_v1}}/component/model/keys/' + this.currentIndexId, {
                    ids: targetKeys
                }).then(response => {
                    this.targetKeys = response.data.data;
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{base_host_v1}}/component/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/component/' + this.formItem.id, this.formItem).then(response => {
                    this.editInlineData.splice(index, 1);
                });
            },
            dblClick (row, index) {
                row.items = row.levels;
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
            getModelData () {
                this.axios.get('{{base_host_v1}}/m/search', {
                    params: this.search
                }).then(modeles => {
                    this.targetData = [];
                    for (let model of modeles.data.data) {
                        this.targetData.push({
                            key: model.id,
                            label: model.model_name,
                            description: model.model_desc
                        });
                    }
                });
            },
            getModelDataKeys (id = null) {
                this.axios.get('{{base_host_v1}}/component/model/keys/' + id).then(indexKeys => {
                    this.targetKeys = [];
                    this.targetKeys = indexKeys.data.data;
                });
            }
        },
        created () {
            this.initData();
        },
        watch: {
            search: {
                deep: true,
                handler: function (newV, oldV) {
                    this.getModelData();
                }
            }
        }
    };
</script>