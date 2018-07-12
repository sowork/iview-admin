<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                机构管理
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
        <Modal :loading="loading" v-model="modal1" title="项目管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="项目名称" prop="item_name">
                    <Input v-model="formItem.item_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="项目代码" prop="item_code">
                    <Input v-model="formItem.item_code" placeholder=""></Input>
                </FormItem>
                <FormItem label="项目类别" prop="item_type">
                    <Select v-model="formItem.item_type">
                        <Option v-for="item in item_type_lists" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="价格（分）" prop="reference_price">
                    <Input v-model.number="formItem.reference_price" placeholder=""></Input>
                </FormItem>
                <FormItem label="项目排序" prop="item_order">
                    <Input v-model="formItem.display_order" placeholder=""></Input>
                </FormItem>
                <FormItem label="项目描述" prop="item_desc">
                    <Input v-model="formItem.item_desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
                </FormItem>

                <compoent :is="comp" :formItem="formItem" :ruleValidate="ruleValidate" v-if="formItem.item_type !== ''"></compoent>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认</Button>
            </div>
        </Modal>

        <Modal :loading="loading" v-model="modal2" title="指标管理" @keydown.enter.native="httpRequest2.next()">
            <Form ref="formItem2" :model="formItem2" :label-width="80">
                <FormItem
                        v-for="(item, index) in formItem2.items"
                        :key="index"
                        :label="'自定义指标' + index">
                    <Row>
                        <Col span="8">
                        <FormItem :prop="'items.' + index + '.item_field_code'" :rules="ruleValidate2.item_field_code">
                            <Input type="text" v-model="item.item_field_code" placeholder="请输入指标code"></Input>
                        </FormItem>
                        </Col>
                        <Col span="1" style="text-align: center">-</Col>
                        <Col span="8">
                        <FormItem :prop="'items.' + index + '.item_field_name'" :rules="ruleValidate2.item_field_name">
                            <Input type="text" v-model="item.item_field_name" placeholder="请输入指标name"></Input>
                        </FormItem>
                        </Col>
                        <Col span="4" offset="1">
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
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest2.next()">确认</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import PopTipTransfer from '../../common/auth/component/PopTipTransfer.vue';

    export default {
        components: {
        },
        data () {
            return {
                items: [],
                groupData: [],
                targetItems: [],
                item_category_lists: [
                    {
                        name: '感知觉与运动域',
                        value: 1
                    },
                    {
                        name: '认知域',
                        value: 2
                    },
                    {
                        name: '情绪域',
                        value: 3
                    },
                    {
                        name: '社交域',
                        value: 4
                    },
                    {
                        name: '学习域',
                        value: 5
                    },
                    {
                        name: '语言域',
                        value: 6
                    }
                ],
                item_type_lists: [
                    {
                        label: 'APP应用',
                        value: 1
                    },
                    {
                        label: '课程包',
                        value: 2
                    },
                    {
                        label: '课程集',
                        value: 3
                    }
                ],
                editInlineColumns: [
                    {
                        title: '序号',
                        align: 'center',
                        key: 'id'
                    },
                    {
                        title: '项目代码',
                        align: 'center',
                        key: 'item_code'
                    },
                    {
                        title: '项目名称',
                        align: 'center',
                        key: 'item_name'
                    },
                    {
                        title: '项目类别',
                        align: 'center',
                        render: (h, params) => {
                            for (let type of Array.from(this.item_type_lists)) {
                                if (type.value === params.row.item_type) {
                                    return type.label;
                                }
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 250,
                        render: (h, params) => {
                            return h('div', [
                                h(PopTipTransfer, {
                                    props: {
                                        items: this.item_type_lists,
                                        showBtn1: false,
                                        showBtn2: false,
                                        itemDefaultValue: [1],
                                        groupData: this.groupData,
                                        targetItems: this.targetItems
                                    },
                                    on: {
                                        onPopperShow: (value) => {
                                            this.getItem(value[0], params.row.id);
                                        },
                                        selectItemChange: (value, selectedData) => {
                                            this.getItem(value[0]);
                                        },
                                        handleChange: (targetData, value) => {
                                            this.handleItem(targetData, params.row.id);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        }
                                    }, '添加项目')
                                ]),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.httpRequest2 = this.actionModal('formItem2', 'storeQuotas', params.row.id, 'modal2', true);
                                            this.httpRequest2.next();
                                            this.formItem2.items = [{
                                                item_id: params.row.id,
                                                item_field_code: '',
                                                item_field_name: ''
                                            }];
                                            this.showQuotas(params.row.id);
                                        }
                                    }
                                }, '指标管理'),
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
                httpRequest2: '',
                formItem: {
                    item_code: '',
                    item_name: '',
                    item_type: '',
                    reference_price: 0,
                    item_order: 0,
                    item_desc: ''
                },
                formItem2: {
                    items: []
                },
                ruleValidate: {
                    item_name: [
                        {required: true, message: '项目名称不能为空', trigger: 'blur'}
                    ],
                    item_type: [
                        {required: true, type: 'number', message: '项目类别不能为空', trigger: 'change'}
                    ],
                    item_code: [
                        {required: true, message: '项目代码不能为空', trigger: 'blur'}
                    ],
                    reference_price: [
                        {type: 'number', message: '价格必须是整数', trigger: 'blur'}
                    ]
                },
                ruleValidate2: {
                    item_field_code: [
                        {required: true, message: '指标code不能为空', trigger: 'blur'}
                    ],
                    item_field_name: [
                        {required: true, message: '指标名称不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        computed: {
            comp: function () {
                this.formItem.item_type; // 显示触发计算属性依赖收集 // https://segmentfault.com/q/1010000015489211?_ea=3960022
                return () => import(`./component/item${this.formItem.item_type}.form`);
            }
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/item', {
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
                this.axios.post('{{base_host_v1}}/item', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.push(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{base_host_v1}}/item/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/item/' + this.formItem.id, this.formItem).then(response => {
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
            handleAdd () {
                this.formItem2.items.push({
                    item_id: this.formItem2.items[0].item_id,
                    item_field_code: '',
                    item_field_name: ''
                });
            },
            handleRemove (index) {
                this.formItem2.items.splice(index, 1);
            },
            showQuotas (id) {
                this.axios.get('{{base_host_v1}}/item/fields', {
                    params: {
                        id: id
                    }
                }).then(response => {
                    if (response.data.data.length > 0) {
                        this.formItem2.items = response.data.data.concat(this.formItem2.items);
                    }
                });
            },
            storeQuotas (id) {
                this.formItem2._method = 'post';
                this.formItem2.id = id;
                return this.axios.post('{{base_host_v1}}/item/fields', this.formItem2).then(response => {
                    this.modal2 = false;
                });
            },
            getItem (type, id) {
                this.groupData = [];
                Promise.all([
                    this.axios.get('{{base_host_v1}}/item/origin', {
                        params: {
                            type: type
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/item/target', {
                        params: {
                            id: id
                        }
                    })
                ]).then(([origin, target]) => {
                    if (origin.data.data !== '' && origin.data.data.length > 0) {
                        for (let item of origin.data.data) {
                            this.groupData.push({
                                key: item.id,
                                label: item.item_name
                            });
                        }
                    }
                    if (target.data.data) {
                        this.targetItems = target.data.data;
                    }
                });
            },
            handleItem (targetData, id) {
                this.axios.post('{{base_host_v1}}/item/group', {
                    ids: targetData,
                    id: id
                }).then(response => {
                    if (response.data.code === '0') {
                        this.targetItems = targetData;
                    }
                });
            }
        },
        created () {
            this.initData();
        }
    };
</script>