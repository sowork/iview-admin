<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                指标管理
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
        <Modal :loading="loading" v-model="modal1" title="指标管理" @keydown.enter.native="httpRequest.next()" width="800" @on-visible-change="onVisibleChange">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="指标代码" prop="index_code">
                    <Input v-model="formItem.index_code" placeholder=""></Input>
                </FormItem>
                <FormItem label="指标名称" prop="index_name">
                    <Input v-model="formItem.index_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="指标类型" prop="index_type">
                    <Select v-model="formItem.index_type">
                        <Option v-for="item in index_types" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="指标描述" prop="index_desc">
                    <Input v-model="formItem.index_desc" placeholder=""></Input>
                </FormItem>

                <FormItem
                        v-for="(item, index) in formItem.items"
                        :key="index"
                        :label="'自定义常量' + index">
                    <Row>
                        <Col span="5">
                        <FormItem :prop="'items.' + index + '.level_score'" :rules="ruleValidate.level_score">
                            <Input type="text" v-model="item.level_score" placeholder="指标等级"></Input>
                        </FormItem>
                        </Col>
                        <Col span="3" style="text-align: center">|</Col>
                        <Col span="5">
                        <FormItem :prop="'items.' + index + '.level_score_start'" :rules="ruleValidate.level_score_start">
                            <Input type="text" v-model="item.level_score_start" placeholder="开始分数"></Input>
                        </FormItem>
                        </Col>
                        <Col span="3" style="text-align: center">-</Col>
                        <Col span="5">
                        <FormItem :prop="'items.' + index + '.level_score_end'" :rules="ruleValidate.level_score_end">
                            <Input type="text" v-model="item.level_score_end" placeholder="结束分数"></Input>
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
                        <Button type="dashed" long @click="handleAdd" icon="plus-round">添加常量参数</Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认</Button>
            </div>
        </Modal>
        <Modal :loading="loading" v-model="modal2" title="模型管理" @keydown.enter.native="httpRequest2.next()" width="820">
            <Select v-model="contentType" style="width:350px" @on-change="getContentData" v-if="showTransfer">
                <Option v-for="item in contentLists" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            <Transfer v-if="showTransfer"
                      :data="targetData"
                      :target-keys="targetKeys"
                      :list-style="listStyle"
                      :operations="['左移','右移']"
                      filterable
                      @on-change="storeContent">
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
                contentType: 0,
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
                index_types: [
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
                        title: '指标代码',
                        align: 'center',
                        key: 'index_code'
                    },
                    {
                        title: '指标名称',
                        align: 'center',
                        key: 'index_name'
                    },
                    {
                        title: '指标类别',
                        align: 'center',
                        render: (h, params) => {
                            for (let type of Array.from(this.index_types)) {
                                if (type.value === params.row.index_type) {
                                    return h('span', type.name);
                                }
                            }
                        }
                    },
                    {
                        title: '指标描述',
                        align: 'center',
                        key: 'index_desc'
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
                                            this.contentType = 0;
                                            this.getContentData();
                                            this.showTransfer = false;
                                            this.$nextTick(function () {
                                                this.showTransfer = true;
                                            });
                                            this.targetKeys = [];
                                            this.httpRequest2 = this.actionModal('formItem2', '', params.row.id, 'modal2', false);
                                            this.httpRequest2.next();
                                            this.getContentDataKeys(params.row.id);
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
                    index_code: '',
                    index_name: '',
                    index_type: '',
                    index_desc: '',
                    items: []
                },
                ruleValidate: {
                    index_code: [
                        {required: true, message: '指标代码不能为空', trigger: 'blur'}
                    ],
                    index_name: [
                        {required: true, message: '指标名称不能为空', trigger: 'blur'}
                    ],
                    index_type: [
                        {required: true, type: 'number', message: '指标类别不能为空', trigger: 'change'}
                    ],
                    level_score: [
                        {required: true, message: '常量级别不能为空', trigger: 'change'}
                    ],
                    level_score_start: [
                        {required: true, message: '常量开始分数不能为空', trigger: 'change'}
                    ],
                    level_score_end: [
                        {required: true, message: '常量结束分数不能为空', trigger: 'change'}
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
                    this.axios.get('{{base_host_v1}}/index', {
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
                this.axios.post('{{base_host_v1}}/index', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.unshift(response.data.data);
                });
            },
            storeContent (targetKeys, direction, moveKeys) {
                this.formItem._method = 'post';
                this.axios.post('{{base_host_v1}}/index/content/keys/' + this.currentIndexId, {
                    ids: targetKeys
                }).then(response => {
                    this.targetKeys = response.data.data;
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{base_host_v1}}/index/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/index/' + this.formItem.id, this.formItem).then(response => {
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
            getContentData () {
                this.axios.get('{{base_host_v1}}/item/search', {
                    params: {
                        type: this.contentType
                    }
                }).then(indexes => {
                    this.targetData = [];
                    for (let index of indexes.data.data) {
                        this.targetData.push({
                            key: index.id,
                            label: index.item_name,
                            description: index.item_desc
                        });
                    }
                });
            },
            getContentDataKeys (id = null) {
                this.axios.get('{{base_host_v1}}/index/content/keys/' + id).then(indexKeys => {
                    this.targetKeys = [];
                    this.targetKeys = indexKeys.data.data;
                });
            },
            handleAdd () {
                this.index++;
                this.formItem.items.push({
                    level_score: '',
                    level_score_start: '',
                    level_score_end: ''
                });
            },
            handleRemove (index) {
                this.formItem.items.splice(index, 1);
            },
            onVisibleChange (status) {
                if (!status) {
                    this.formItem.items = [];
                }
            }
        },
        created () {
            this.initData();
        }
    };
</script>