<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                孩子管理
            </p>
            <div class="edittable-table-height-con">
                <div class="margin-bottom-10">
                    <Row>
                        <Col :lg="2">
                            <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store', 0, 'modal1', true)) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                        </Col>
                        <Col :push="14" :lg="8">
                            <Input @on-enter="search" @on-blur="search" v-model="searchContent" placeholder="请输入孩子姓名、手机号码、身份证号" />
                        </Col>
                    </Row>
                </div>
                <Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
            <div class="margin-top-20">
                <Page @on-change="onChange" @on-page-size-change="onPageSizeChange" :total="total" show-total size="small" show-elevator show-sizer></Page>
            </div>
        </Card>
        <Modal :loading="loading" v-model="modal1" title="孩子管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="孩子姓名" prop="child_name">
                    <Input v-model="formItem.child_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="性别" prop="child_sex">
                    <Select v-model="formItem.child_sex">
                        <Option v-for="item in org_type_lists" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="孩子身份证号" prop="id_card">
                    <Input v-model="formItem.id_card" placeholder=""></Input>
                </FormItem>
                <FormItem label="出生日期" prop="child_birthday">
                    <DatePicker @on-change="changeDate" format="yyyy-MM-dd" :value="formItem.child_birthday" type="date" placeholder="选择日期"></DatePicker>
                </FormItem>
                <FormItem label="手机" prop="tel">
                    <Input v-model="formItem.tel" placeholder=""></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input type="password" v-model="formItem.password" placeholder="不填默认123456"></Input>
                </FormItem>
                <FormItem label="所在区域" prop="family_area">
                    <Cascader :data="cityData3" v-model="formItem.family_area"></Cascader>
                </FormItem>
                <FormItem label="详细住址" prop="family_address">
                    <Input v-model="formItem.family_address" placeholder=""></Input>
                </FormItem>
                <FormItem label="家长姓名" prop="parent_name">
                    <Input v-model="formItem.parent_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="学校名称" prop="school_name">
                    <Input v-model="formItem.school_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="爱好" prop="interest">
                    <Input type="textarea" v-model="formItem.interest" placeholder=""></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认订购</Button>
            </div>
        </Modal>
        <Modal :loading="loading2" v-model="modal2" title="订购管理" @keydown.enter.native="httpRequest2.next()" width="1000" @on-visible-change="onVisibleChange">
            <Form ref="formItem2" :model="formItem2">
                <Row style="margin: 10px 5px;">
                    <Col span="16">
                        <span style="font-size:20px; font-weight: bold;">选择商品</span>
                    </Col>
                    <Col push="2" span="6">
                        <span style="font-size:20px; font-weight: bold;">商品详情</span>
                    </Col>
                </Row>
                <Row style="margin: 10px 5px;">
                    <Col>
                        <Input placeholder="请输入商品名称" style="width: 200px" v-model="prodName"></Input>
                        <Select style="width:200px" placeholder="请选择商品类型" v-model="prodType">
                            <Option v-for="item in comboTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <Button @click="searchProd" type="primary">查询</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span="14">
                        <Table border :disabled-hover="true" :columns="columns4" :data="combos" height="300"></Table>
                        <div class="margin-top-20">
                            <Page @on-change="onChange2" @on-page-size-change="onPageSizeChange2" :total="total2" show-total size="small" show-sizer></Page>
                        </div>
                    </Col>
                    <Col push="2" span="8">
                        <Scroll height="300">
                            <Tree :data="selectCombos"></Tree>
                        </Scroll>
                    </Col>
                </Row>
                <Row style="margin-top: 40px;">
                    <Col span="4">
                        <FormItem prop="is_ticket">
                            <Checkbox v-model="formItem2.is_ticket">使用优惠券</Checkbox>
                        </FormItem>
                    </Col>
                    <Col span="20">
                        <FormItem prop="ticket_code">
                            <Select v-model="formItem2.ticket_code">
                                <Option v-for="item in tickets" :value="item.coupon_code" :key="item.coupon_code">{{ item.coupon_name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row style="font-size: 13px;">
                    <Col span="4">
                        <span>已选择商品{{ selectCombos.length }}件</span>
                    </Col>
                    <Col span="4">
                        <span>已享优惠：{{ ticketPrice }}元</span>
                    </Col>
                    <Col span="4">
                        <span>总价：{{ selectComboPrice }}元</span>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem2')">重置</Button>
                <Button type="primary" @click="httpRequest2.next()">确认订购</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Expand from './component/expand.index.vue';
    import { Message } from 'iview';
    import cityData3 from '@/libs/city.data-3.js';

    export default {
        components: {
            Expand
        },
        data () {
            return {
                prodName: '',
                prodType: '',
                comboTypes: [
                    {
                        value: '1',
                        label: '学习小博士'
                    }
                ],
                columns4: [
                    {
                        title: '商品名称',
                        key: 'combo_name'
                    },
                    {
                        title: '单价（元）',
                        render: (h, params) => Math.floor(params.row.sale_price / 100)
                    },
                    {
                        title: '次数',
                        render: (h, params) => {
                            return h('InputNumber', {
                                props: {
                                    max: 10,
                                    min: 1,
                                    value: this.combos[params.index].number
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.combos[params.index].number = value;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '操作',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.addProdCar(params.row);
                                    }
                                }
                            }, '添加');
                        }
                    }
                ],
                cityData3: cityData3,
                combos: [],
                combosBck: [],
                selectCombos: [],
                tickets: [],
                searchContent: '',
                groupData: [],
                targetItems: [],
                org_type_lists: [
                    {
                        name: '男',
                        value: 1
                    },
                    {
                        name: '女',
                        value: 2
                    }
                ],
                editInlineColumns: [
                    {
                        title: '#',
                        align: 'center',
                        type: 'expand',
                        render: (h, params) => {
                            return h(Expand, {
                                props: {
                                    items: params.row.family_combos
                                }
                            });
                        }
                    },
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '孩子姓名',
                        align: 'center',
                        key: 'child_name'
                    },
                    {
                        title: '性别',
                        align: 'center',
                        render: (h, params) => {
                            for (let type of Array.from(this.org_type_lists)) {
                                if (type.value === params.row.child_sex) {
                                    return h('span', type.name);
                                }
                            }
                        }
                    },
                    {
                        title: '孩子身份证号',
                        align: 'center',
                        key: 'id_card'
                    },
                    {
                        title: '出生日期',
                        align: 'center',
                        key: 'child_birthday'
                    },
                    {
                        title: '手机',
                        align: 'center',
                        key: 'tel'
                    },
                    {
                        title: '所属区域',
                        align: 'center',
                        render: (h, params) => {
                            return params.row.province + '/  ' + params.row.city + '/  ' + params.row.area;
                        }
                    },
                    {
                        title: '详细地址',
                        align: 'center',
                        key: 'family_address'
                    },
                    {
                        title: '家长姓名',
                        align: 'center',
                        key: 'parent_name'
                    },
                    {
                        title: '学校名称',
                        align: 'center',
                        key: 'school_name'
                    },
                    {
                        title: '爱好',
                        align: 'center',
                        key: 'interest'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 300,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.httpRequest2 = this.actionModal('formItem2', 'storeCombos', params.row.id, 'modal2', true);
                                            this.httpRequest2.next();
                                        }
                                    }
                                }, '订购套餐'),
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
                total2: 0,
                page: 1,
                number: 10,
                page2: 1,
                number2: 10,
                modal1: false,
                modal2: false,
                loading: false,
                loading2: false,
                httpRequest: '',
                httpRequest2: '',
                formItem: {
                    child_name: '',
                    child_sex: '',
                    child_birthday: '',
                    tel: '',
                    password: '',
                    parent_name: '',
                    family_address: '',
                    province: '',
                    city: '',
                    area: '',
                    interest: '',
                    family_area: []
                },
                formItem2: {
                    items: [],
                    is_ticket: false,
                    ticket_code: '',
                    checkStr: '',
                    priceStr: ''
                },
                ruleValidate: {
                    child_name: [
                        {required: true, message: '孩子姓名不能为空', trigger: 'blur'}
                    ],
                    child_sex: [
                        {required: true, type: 'number', message: '性别不能为空', trigger: 'change'}
                    ],
                    id_card: [
                        {required: true, message: '孩子身份证号不能为空', trigger: 'blur'}
                    ],
                    child_birthday: [
                        {required: true, message: '出生日期不能为空', trigger: 'blur'}
                    ],
                    tel: [
                        {required: true, message: '手机号码不能为空', trigger: 'blur'},
                        {pattern: /^(\+?0?86-?)?((13\d|14[57]|15[^4,\D]|17[3678]|18\d)\d{8}|170[059]\d{7})$/, message: '电话格式错误', trigger: 'blur'}
                    ],
                    family_address: [
                        {required: true, message: '家庭住址不能为空', trigger: 'blur'}
                    ],
                    family_area: [
                        {required: true, type: 'array', message: '所在区域不能为空', trigger: 'change'}
                    ]
                },
                ruleValidate2: {
                    id: [
                        {required: true, type: 'number', message: '孩子姓名不能为空', trigger: 'blur'}
                    ],
                    number: [
                        {required: true, type: 'number', message: '订购数目不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            initData () {
                this.searchProd();
                Promise.all([
                    this.axios.get('{{base_host_v1}}/children', {
                        params: {
                            page: this.page,
                            number: this.number,
                            search: this.searchContent
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/discount/coupons/default')
                ]).then(([orgs, coupons]) => {
                    this.total = orgs.data.data.total;
                    this.editInlineData = orgs.data.data.data;
                    this.tickets = coupons.data.data;
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
                this.axios.post('{{base_host_v1}}/children', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.unshift(response.data.data);
                });
            },
            storeCombos (id) {
                if (this.selectCombos.length <= 0) {
                    Message.error('商品不能为空');
                    return;
                }
                let formData = {};
                formData.items = this.selectCombos;
                formData.child_id = id;
                formData.is_ticket = this.formItem2.is_ticket;
                formData.ticket_code = this.formItem2.ticket_code;
                formData.provider = 'children';
                this.axios.post('{{base_host_v1}}/child/task/item', formData).then(response => {
                    this.modal2 = false;
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{base_host_v1}}/children/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/children/' + this.formItem.id, this.formItem).then(response => {
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
            onChange2 (page, number) {
                this.page2 = page;
                this.initData();
            },
            onPageSizeChange (number) {
                this.number = number;
                this.initData();
            },
            onPageSizeChange2 (number) {
                this.number2 = number;
                this.initData();
            },
            changeDate (date) {
                this.formItem.child_birthday = date;
            },
            getCombos (val, id) {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/combos/filter'),
                    this.axios.get('{{base_host_v1}}/children/combos/target/' + id)
                ]).then(([original, targets]) => {
                    if (original.data.data.length > 0) {
                        this.groupData = original.data.data;
                    }
                    this.targetItems = targets.data.data;
                    this.changeComboStatus(this.groupData, this.targetItems);
                });
            },
            handleItem (targetData, id, direction, moveKeys) {
                this.axios.post('{{base_host_v1}}/children/combos', {
                    ids: moveKeys,
                    id: id,
                    action: direction
                }).then(response => {
                    if (response.data.code === '0') {
                        this.targetItems = targetData;
                        this.changeComboStatus(this.groupData, this.targetItems);
                    }
                });
            },
            search () {
                this.initData();
            },
            changeComboStatus (original, targets) {
                for (let i of original) {
                    if (i.pid !== 0 && targets.indexOf(i.pid) === -1) {
                        i.disabled = true;
                    } else {
                        i.disabled = false;
                    }
                    i.key = i.id;
                    i.label = i.combo_name;
                }
            },
            addProdCar (c) {
                // 判断商品是否存在购物车
                for (let combo of this.selectCombos) {
                    if (c.id === combo.id) {
                        combo.number += c.number;
                        return;
                    }
                }
                let t1 = {};
                t1.title = c.combo_name;
                t1.children = [];
                if (c.children !== undefined && c.children.length > 0) {
                    for (let c2 of c.children) {
                        let t2 = {};
                        t2.title = c2.item.item_name;
                        t2.children = [];
                        t1.children.push(t2);
                        if (c2.item.children !== undefined && c2.item.children.length > 0) {
                            for (let c3 of c2.item.children) {
                                let t3 = {};
                                t3.title = c3.item.item_name;
                                t3.children = [];
                                t2.children.push(t3);
                                if (c3.item.children !== undefined && c3.item.children.length > 0) {
                                    for (let c4 of c3.item.children) {
                                        let t4 = {};
                                        t4.title = c4.item.item_name;
                                        t4.children = [];
                                        t3.children.push(t4);
                                    }
                                }
                            }
                        }
                    }
                }
                t1.id = c.id;
                t1.number = c.number;
                t1.sale_price = c.sale_price;
                t1.render = this.topMenu();
                this.selectCombos.push(t1);
            },
            onVisibleChange (visible) {
                if (visible) {
                    this.selectCombos = [];
                    for (let c of this.combos) {
                        c.number = 1;
                    }
                }
            },
            topMenu () {
                return (h, { root, node, data }) => {
                    return h('span', {
                        style: {
                            display: 'inline-block',
                            width: '100%'
                        }
                    }, [
                        h('span', [
                            h('Icon', {
                                style: {
                                    marginRight: '8px'
                                }
                            }),
                            h('span', data.title + '(' + data.number + ')')
                        ]),
                        h('span', {
                            style: {
                                display: 'inline-block',
                                float: 'right',
                                marginRight: '40px'
                            }
                        }, [
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'ios-minus-empty',
                                    type: 'primary',
                                    size: 'small'
                                }),
                                style: {
                                    width: '30px',
                                    height: '20px',
                                    'line-height': '13px'
                                },
                                on: {
                                    click: () => {
                                        this.deleteProd(data);
                                    }
                                }
                            })
                        ])
                    ]);
                };
            },
            deleteProd (data) {
                const index = this.selectCombos.indexOf(data);
                this.selectCombos.splice(index, 1);
            },
            searchProd () {
                this.axios.get('{{base_host_v1}}/combo/items', {
                    params: {
                        page: this.page2,
                        number: this.number2,
                        combo_name: this.prodName,
                        combo_type: this.prodType
                    }
                }).then(combos => {
                    this.total2 = combos.data.data.total;
                    for (let t of combos.data.data.data) {
                        t.number = 1;
                    }
                    this.combos = JSON.parse(JSON.stringify(combos.data.data.data));
                });
            }
        },
        created () {
            this.initData();
        },
        computed: {
            ticketPrice: function () {
                if (this.formItem2.ticket_code && this.formItem2.is_ticket === true) {
                    for (let c of this.tickets) {
                        if (c.coupon_code === this.formItem2.ticket_code) {
                            return Math.round(Number.parseFloat(c.coupon_value) / 100);
                        }
                    }
                } else {
                    return 0;
                }
            },
            selectComboPrice: function () {
                if (this.selectCombos.length > 0) {
                    return Math.floor((this.selectCombos.reduce(function (price, item) {
                        return (price += (Number.parseFloat(item.sale_price) * item.number));
                    }, 0)) / 100) - this.ticketPrice;
                } else {
                    return 0;
                }
            }
        },
        watch: {
            'formItem.family_area': function (val) {
                if (val.length > 0) {
                    this.formItem.province = val[0].name;
                    this.formItem.city = val[1].name;
                    this.formItem.area = val[2].name;
                }
            }
        }
    };
</script>