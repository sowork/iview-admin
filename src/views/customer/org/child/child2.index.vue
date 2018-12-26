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
        <Modal :loading="loading2" v-model="modal2" title="订购管理" @keydown.enter.native="httpRequest2.next()" width="600">
            <Form ref="formItem2" :model="formItem2">
                <Scroll>
                <Row>
                    <Col span="15">业务</Col>
                    <Col span="5">数量</Col>
                    <Col span="4">单价(元)</Col>
                </Row>
                <Row class="margin-top-20" v-for="(combo, index) in combos">
                    <Col span="4">
                        {{combo.item_name}}
                    </Col>
                    <Col span="20">
                        <Row v-for="(item, index) in combo.children">
                            <Col span="12">
                                <FormItem :prop="'items.' + item.key + '.check'">
                                    <Checkbox @on-change="changeCombo" v-model="formItem2.items[item.key].check">{{item.item_name}}</Checkbox>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem :prop="'items.' + item.key + '.number'">
                                    <InputNumber @on-change="changeCombo" :max="10" :min="1" v-model="formItem2.items[item.key].number"></InputNumber>
                                </FormItem>
                            </Col>
                            <Col span="4">{{Math.floor(item.price / 100)}}</Col>
                        </Row>
                    </Col>
                </Row>
                </Scroll>
                <Row style="margin-top: 40px;">
                    <Col span="4">
                        <FormItem prop="is_ticket">
                            <Checkbox @on-change="changeCombo" v-model="formItem2.is_ticket">使用优惠券</Checkbox>
                        </FormItem>
                    </Col>
                    <Col span="20">
                        <FormItem prop="ticket_code">
                            <Select @on-change="changeCombo" v-model="formItem2.ticket_code">
                                <Option v-for="item in tickets" :value="item.coupon_code" :key="item.coupon_code">{{ item.coupon_name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem prop="checkStr">
                            已选择：{{ formItem2.checkStr }}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem prop="priceStr">
                            总金额： {{ formItem2.priceStr }}
                        </FormItem>
                    </Col>
                </Row>
                <Row style="color:red;">
                    <Col>
                        温馨提示：首次订购业务，配套平板为必选。首次订购学习小博士需开通90课时的课程。首次订购学习小助手时，配套智慧笔和书写册为必选。
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
    import cityData3 from '@/libs/city.data-3.js';

    export default {
        components: {
            Expand
        },
        data () {
            return {
                cityData3: cityData3,
                combos: [],
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
                        align: 'center',
                        render: (h, params) => params.index + 1
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
                                    return type.name;
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
                page: 1,
                number: 10,
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
                Promise.all([
                    this.axios.get('{{base_host_v1}}/children', {
                        params: {
                            page: this.page,
                            number: this.number,
                            search: this.searchContent
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/combo/items'),
                    this.axios.get('{{base_host_v1}}/discount/coupons/default')
                ]).then(([orgs, combos, coupons]) => {
                    this.editInlineData = orgs.data.data.data;
                    for (let c of combos.data.data) {
                        c.item_name = c.combo_name;
                        for (let t of c.children) {
                            t.key = t.id;
                            t.item_name = t.item.item_name;
                        }
                    }
                    this.combos = combos.data.data;
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
                let items = [];
                for (let item of this.formItem2.items) {
                    if (item && item.check) {
                        items.push(item);
                    }
                }
                let formData = {};
                formData.items = items;
                formData.child_id = id;
                formData.is_ticket = this.formItem2.is_ticket;
                formData.ticket_code = this.formItem2.ticket_code;
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
            onPageSizeChange (number) {
                this.number = number;
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
            changeCombo () {
                let str1 = '';
                let str2 = '';
                for (let item of this.formItem2.items) {
                    if (item && item.check) {
                        for (let t of this.combos) {
                            for (let c of t.children) {
                                if (c.id === item.key) {
                                    str1 += c.item_name + ' + ';
                                    let price = Number.parseInt(c.price) * Number.parseInt(item.number);
                                    str2 += price + ' + ';
                                }
                            }
                        }
                    }
                }
                this.formItem2.checkStr = '';
                this.formItem2.priceStr = '';
                if (str1 === '' || str2 === '') return;
                this.formItem2.checkStr = str1.slice(0, -2);
                str2 = str2.slice(0, -3).split(' + ');
                str2.unshift(0);
                let sumPrice = str2.reduce(function (partial, value) {
                    return Math.floor((Number.parseInt(partial) + Number.parseInt(value) / 100), 2);
                });
                let couponPrice = 0;
                if (this.formItem2.is_ticket && this.formItem2.ticket_code !== '') {
                    for (let t of this.tickets) {
                        if (t.coupon_code === this.formItem2.ticket_code) {
                            sumPrice = (Math.floor(Number.parseInt(t.coupon_value / 100), 2)) >= 0 ? (sumPrice -= Math.floor(Number.parseInt(t.coupon_value / 100), 2)) : 0;
                            couponPrice = t.coupon_value;
                        }
                    }
                }
                if (str2 !== [] && str2.length > 1) {
                    str2.shift();
                    this.formItem2.priceStr = str2.map(function (val) {
                        return Math.floor(Number.parseInt(val) / 100, 2);
                    }).join(' + ') + ' ';
                    if (this.formItem2.is_ticket && this.formItem2.ticket_code !== '') {
                        this.formItem2.priceStr += '- ' + Math.floor(Number.parseInt(couponPrice) / 100, 2);
                    }
                    this.formItem2.priceStr += '= ' + sumPrice;
                } else {
                    this.formItem2.priceStr = '';
                }
            }
        },
        created () {
            this.initData();

//            this.formItem2.ticket_code = this.tickets[0]['ticket_code'];
//            this.formItem2.items = [];
//            for (let combo of this.combos) {
//                for (let c of combo.children) {
//                    let temp = {};
//                    temp.check = false;
//                    temp.item_id = c.item_id;
//                    temp.number = 1;
//                    temp.price = c.price;
//                    this.formItem2.items[c.id] = temp;
//                }
//            }
//            console.log(this.formItem2)
        },
        computed: {
            _formItem2 () {
//                let data = {};
//                data.ticket_code = this.tickets[0]['ticket_code'];
//                data.is_ticket = false;
//                data.checkStr = '123';
//                data.priceStr = '';
//                data.items = [];
//                for (let combo of this.combos) {
//                    for (let c of combo.children) {
//                        let temp = {};
//                        temp.check = false;
//                        temp.id = c.id;
//                        temp.number = 1;
//                        data.items[c.id] = temp;
//                    }
//                }
//
//                return data;
            }
        },
        watch: {
            'formItem.family_area': function (val) {
                if (val.length > 0) {
                    this.formItem.province = val[0].name;
                    this.formItem.city = val[1].name;
                    this.formItem.area = val[2].name;
                }
            },
            combos: {
                deep: true,
                handler: function (newV, oldV) {
                    let ticketCode = '';
                    if (this.tickets.length > 0) {
                        ticketCode = this.tickets[0]['coupon_code'];
                    }
                    this.formItem2.ticket_code = ticketCode;
                    this.formItem2.items = [];
                    for (let combo of newV) {
                        for (let c of combo.children) {
                            let temp = {};
                            temp.check = false;
                            temp.item_id = c.item_id;
                            temp.combo_id = c.combo_id;
                            temp.key = c.id;
                            temp.number = 1;
                            temp.item_name = c.item.item_name;
                            temp.item_desc = c.item.item_desc;
                            temp.combo_id = combo.id;
                            this.formItem2.items[c.id] = temp;
                        }
                    }
                }
            }
        }
    };
</script>