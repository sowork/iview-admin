<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                任务管理
            </p>
            <div class="edittable-table-height-con">
                <!--<div class="margin-bottom-10">-->
                    <!--<Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store', 0, 'modal1', true)) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>-->
                <!--</div>-->
                <Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
            <div class="margin-top-20">
                <Page @on-change="onChange" @on-page-size-change="onPageSizeChange" :total="total" show-total size="small" show-elevator show-sizer></Page>
            </div>
        </Card>
        <Modal :loading="loading" v-model="modal1" title="任务管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="机构名称" prop="org_name">
                    <Input v-model="formItem.org_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="机构类型" prop="org_type">
                    <Select v-model="formItem.org_type">
                        <Option v-for="item in org_type_lists" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="机构地址" prop="org_address">
                    <Input v-model="formItem.org_address" placeholder=""></Input>
                </FormItem>
                <FormItem label="机构邮箱" prop="org_email">
                    <Input v-model="formItem.org_email" placeholder=""></Input>
                </FormItem>
                <FormItem label="机构电话" prop="org_phone">
                    <Input v-model="formItem.org_phone" placeholder=""></Input>
                </FormItem>
                <FormItem label="机构联系人" prop="org_contacter">
                    <Input v-model="formItem.org_contacter" placeholder=""></Input>
                </FormItem>
                <FormItem label="机构官网" prop="org_website">
                    <Input v-model="formItem.org_website" placeholder=""></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认</Button>
            </div>
        </Modal>

        <Modal :loading="loading" v-model="modal2" title="任务管理" width="800">
            <Collapse v-model="value2" accordion>
                <Panel v-for="(itemDetail, index) in itemDetails">
                    {{ itemDetail.item.item_name }}
                    <div slot="content">
                        <Row v-for="(record, index) in itemDetail.child_task_detail_record" style="margin: 10px 0px;">
                            <Col span="6" v-text="'第' + index + 1 + '提交结果'"></Col>
                            <Col span="18">
                            <Row>
                                <Col span="6"style="border: 1px solid;" align="middle">代码</Col>
                                <Col span="6"style="border: 1px solid;" align="middle">值</Col>
                            </Row>
                            <Row v-for="data in record.child_task_detail_data">
                                <Col span="6" v-text="data.extension_field_id" align="middle" style="border: 1px solid;"></Col>
                                <Col span="6" v-text="data.extension_field_value" align="middle" style="border: 1px solid;"></Col>
                            </Row>
                            </Col>
                        </Row>
                    </div>
                </Panel>
            </Collapse>
        </Modal>
    </div>
</template>

<script>
    import util from '@/libs/util.js';
    import Cookies from 'js-cookie';

    export default {
        components: {
        },
        data () {
            return {
                itemDetails: [],
                value2: '0',
                org_type_lists: [
                    {
                        name: '医院机构',
                        value: 1
                    },
                    {
                        name: '学校机构',
                        value: 2
                    },
                    {
                        name: '康复机构',
                        value: 3
                    }
                ],
                editInlineColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '任务流水号',
                        align: 'center',
                        key: 'order_code'
                    },
                    {
                        title: '用户名称',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.user.user_name);
                        }
                    },
                    {
                        title: '总金额',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', Math.round(params.row.total_money) / 100 + '元');
                        }
                    },
                    {
                        title: '实际支付金额',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', Math.round(params.row.actual_money) / 100 + '元');
                        }
                    },
                    {
                        title: '是否支付',
                        align: 'center',
                        render: (h, params) => {
                            let str = '';
                            if (params.row.is_pay === 1) {
                                str = '已支付';
                            } else {
                                str = '未支付';
                            }

                            return h('span', str);
                        }
                    },
                    {
                        title: '定制时间',
                        align: 'center',
                        key: 'created_at'
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
                                            this.modal2 = true;
                                            this.getContentData(params.row.order_code);
                                        }
                                    }
                                }, '查看结果'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let token = Cookies.get('bear');
                                            let tname = 'component1';
                                            window.open(util.parseUrl('{{base_host}}/component/print?order_code=' + params.row.order_code + '&api_token=' + token + '&tname=' + tname));
                                        }
                                    }
                                }, '打印报告')
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
                    org_name: '',
                    org_type: '',
                    org_address: '',
                    org_email: '',
                    org_phone: '',
                    org_contacter: '',
                    org_website: ''
                },
                formItem2: {

                },
                ruleValidate: {
                    org_name: [
                        {required: true, message: '机构名称不能为空', trigger: 'blur'}
                    ],
                    org_type: [
                        {required: true, type: 'number', message: '机构类别不能为空', trigger: 'change'}
                    ],
                    org_address: [
                        {required: true, message: '机构地址不能为空', trigger: 'blur'}
                    ],
                    org_phone: [
                        {required: true, message: '机构电话不能为空', trigger: 'blur'},
                        {pattern: /^(\+?0?86-?)?((13\d|14[57]|15[^4,\D]|17[3678]|18\d)\d{8}|170[059]\d{7})$/, message: '电话格式错误', trigger: 'blur'}
                    ],
                    org_email: [
                        {required: true, message: '机构邮箱不能为空', trigger: 'blur'},
                        {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                    ],
                    org_contacter: [
                        {required: true, message: '机构联系人不能为空', trigger: 'blur'}
                    ],
                    org_website: [
                        {type: 'url', message: 'url格式错误', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/sub/order', {
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
                this.axios.post('{{base_host_v1}}/org', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.push(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{base_host_v1}}/org/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/org/' + this.formItem.id, this.formItem).then(response => {
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
            getContentData (order) {
                this.itemDetails = [];
                this.axios.get('{{base_host_v1}}/sub/order/contents', {
                    params: {
                        order_code: order
                    }
                }).then(details => {
                    this.itemDetails = details.data.data;
                });
            }
        },
        created () {
            this.initData();
        }
    };
</script>