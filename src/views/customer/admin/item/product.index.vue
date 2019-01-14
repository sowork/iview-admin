<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                商品管理
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
        <Modal :loading="loading" v-model="modal1" title="商品管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="商品名称" prop="combo_name">
                    <Input v-model="formItem.combo_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="商品类别" prop="combo_type">
                    <Select v-model="formItem.combo_type">
                        <Option v-for="item in org_type_lists" :disabled="item.disabled" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="报告模板" prop="component_id">
                    <Select v-model="formItem.component_id">
                        <Option v-for="item in components" :disabled="item.disabled" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <!--<FormItem label="使用场景" prop="use_type">-->
                    <!--<RadioGroup v-model="formItem.use_type">-->
                        <!--<Radio :label="1">-->
                            <!--<span>通用</span>-->
                        <!--</Radio>-->
                        <!--<Radio :label="2">-->
                            <!--<span>指定机构</span>-->
                        <!--</Radio>-->
                    <!--</RadioGroup>-->
                <!--</FormItem>-->
                <!--<FormItem label="" prop="org_id" v-if="formItem.use_type === 2">-->
                    <!--<Select-->
                            <!--placeholder="请输入机构名称"-->
                            <!--v-model="formItem.org_id"-->
                            <!--filterable-->
                            <!--remote-->
                            <!--:remote-method="remoteSearchOrgs"-->
                            <!--:loading="loading1">-->
                        <!--<Option v-for="(option, index) in remoteOrgs" :value="option.value" :key="index">{{option.name}}</Option>-->
                    <!--</Select>-->
                <!--</FormItem>-->
                <FormItem label="销售价格" prop="sale_price">
                    <Input v-model.number="formItem.sale_price" placeholder=""></Input>
                </FormItem>
                <FormItem label="使用次数" prop="use_num">
                    <Input v-model.number="formItem.use_num" placeholder="商品下默认的使用次数"></Input>
                </FormItem>
                <FormItem label="有效天数" prop="valid_day">
                    <Input v-model.number="formItem.valid_day" placeholder="不填表示永久有效，填写（7）表示必须在7天内激活，否则失效"></Input>
                </FormItem>
                <FormItem label="生效日期" prop="start_date">
                    <DatePicker @on-change="startDate" format="yyyy-MM-dd" :value="formItem.start_date" type="date" placeholder="不填默认立即生效" ></DatePicker>
                </FormItem>
                <FormItem label="过期日期" prop="end_date">
                    <DatePicker @on-change="endDate" format="yyyy-MM-dd" :value="formItem.end_date" type="date" placeholder="不填默认永不过期"></DatePicker>
                </FormItem>
                <FormItem label="商品描述" prop="combo_desc">
                    <Input type="textarea" v-model="formItem.combo_desc" placeholder=""></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认</Button>
            </div>
        </Modal>
        <Modal v-model="modal2" title="内容管理" @keydown.enter.native="httpRequest2.next()" width="1000">
            <Form ref="formItem2" :model="formItem2" :rules="ruleValidate2" label-position="top">
                <div v-for="(item, index) in formItem2.items">
                    <Row>
                        <!--<Col span="4">-->
                        <!--<FormItem label="产品" :prop="'items.' + index + '.product_id'" :rules="ruleValidate2.product_id">-->
                        <!--<Select @on-change="changeProduct" v-model="item.product_id">-->
                        <!--<Option v-for="item in products" :value="item.item_id" :key="item.item_id">{{ item.item_name }}</Option>-->
                        <!--</Select>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                        <Col span="4">
                        <FormItem label="课程" :prop="'items.' + index + '.item_id'" :rules="ruleValidate2.item_id">
                            <Select v-model="item.item_id">
                                <Option v-for="item in courses" :value="item.id" :key="item.id">{{ item.item_name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                        <FormItem label="房间" :prop="'items.' + index + '.room_id'" :rules="ruleValidate2.room_id">
                            <Select v-model="item.room_id">
                                <Option v-for="item in rooms" :value="item.id" :key="item.id">{{ item.room_name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                        <FormItem label="老师" :prop="'items.' + index + '.user_id'" :rules="ruleValidate2.user_id">
                            <Select v-model="item.user_id">
                                <Option v-for="item in teachers" :value="item.id" :key="item.id">{{ item.real_name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                        <FormItem label="上课时间" :prop="'items.' + index + '.time'" :rules="ruleValidate2.time">
                            <TimePicker :value="item.time" @on-change="changeTime($event, item)" format="HH:mm" type="timerange" placement="bottom-end" placeholder="选择上课时间" style="width: 168px"></TimePicker>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="4">
                        <FormItem label="间隔次数" :prop="'items.' + index + '.interval_num'" :rules="ruleValidate2.interval_num">
                            <Input v-model.number="item.interval_num" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                        <FormItem label="循环次数" :prop="'items.' + index + '.loop_num'" :rules="ruleValidate2.loop_num">
                            <Input v-model.number="item.loop_num" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                        <FormItem label="循环类型" :prop="'items.' + index + '.loop_type'" :rules="ruleValidate2.loop_type">
                            <RadioGroup v-model.number="item.loop_type">
                                <Radio label="1">日</Radio>
                                <Radio label="2">周</Radio>
                                <Radio label="3">年</Radio>
                            </RadioGroup>
                        </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                        <FormItem label=" ">
                            <Button type="ghost" @click="handleRemove(index)">删除</Button>
                        </FormItem>
                        </Col>
                    </Row>
                </div>
                <FormItem>
                    <Row>
                        <Col span="6">
                        <Button type="dashed" long @click="handleAdd" icon="plus-round">新增课程</Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem2')">重置</Button>
                <Button type="primary" @click="httpRequest2.next()">确认</Button>
            </div>
        </Modal>
        <Modal v-model="modal3" title="添加课程" @keydown.enter.native="httpRequest3.next()" width="1000">
            <Form ref="formItem3" :model="formItem3" :rules="ruleValidate3" label-position="top">
                <div v-for="(item, index) in formItem3.items">
                    <Row>
                        <Col span="4">
                        <FormItem label="产品" :prop="'items.' + index + '.item_id'" :rules="ruleValidate3.item_id">
                            <Select v-model="item.item_id">
                                <Option v-for="item in products" :value="item.id" :key="item.id">{{ item.item_name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                        <FormItem label="使用次数" :prop="'items.' + index + '.use_num'"  :rules="ruleValidate3.use_num">
                            <Input v-model.number="item.use_num" placeholder="不填不限制次数"></Input>
                        </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                        <FormItem label="价格(元)" :prop="'items.' + index + '.price'"  :rules="ruleValidate3.use_num">
                            <Input v-model.number="item.price" placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                        <FormItem label=" ">
                            <Button type="ghost" @click="handleRemove2(index)">删除</Button>
                        </FormItem>
                        </Col>
                    </Row>
                </div>
                <FormItem>
                    <Row>
                        <Col span="6">
                        <Button type="dashed" long @click="handleAdd2" icon="plus-round">新增课程</Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem3')">重置</Button>
                <Button type="primary" @click="httpRequest3.next()">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data () {
            const isLtEndDate = (rule, value, callback) => {
                if (value === '') {
                    return callback();
                }
                if (this.formItem.end_date !== '' && value > this.formItem.end_date) {
                    callback(new Error('开始日期不能大于结束日期'));
                } else {
                    callback();
                }
            };

            const isGtStartDate = (rule, value, callback) => {
                if (value === '') {
                    return callback();
                }
                if (this.formItem.start_date !== '' && value < this.formItem.start_date) {
                    callback(new Error('结束日期不能小于开始日期'));
                } else {
                    callback();
                }
            };
            return {
                remoteOrgs: [],
                components: [],
                products: [],
                courses: [],
                rooms: [],
                teachers: [],
                org_type_lists: [
                    {
                        name: '机构商品',
                        value: 1
                    },
                    {
                        name: '家庭商品',
                        value: 2
                    }
                ],
                item_type_lists: [
                    {
                        name: '产品',
                        value: 3
                    },
                    {
                        name: '课程',
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
                        title: '商品名称',
                        align: 'center',
                        key: 'combo_name'
                    },
                    {
                        title: '商品类别',
                        align: 'center',
                        render: (h, params) => {
                            for (let type of Array.from(this.org_type_lists)) {
                                if (type.value === params.row.combo_type) {
                                    return h('span', type.name);
                                }
                            }
                        }
                    },
                    {
                        title: '使用次数',
                        align: 'center',
                        key: 'use_num'
                    },
                    {
                        title: '销售价格(元)',
                        align: 'center',
                        render: (h, params) => params.row.sale_price / 100
                    },
                    {
                        title: '生效日期',
                        align: 'center',
                        key: 'start_date'
                    },
                    {
                        title: '失效日期',
                        align: 'center',
                        key: 'end_date'
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
                                            if (params.row.combo_type === 1) {
                                                this.httpRequest2 = this.actionModal('formItem2', 'storeOrgItems', params.row.id, 'modal2', true);
                                                this.httpRequest2.next();
                                                this.formItem2.items = [{
                                                    product_id: '',
                                                    combo_id: params.row.id,
                                                    item_id: '',
                                                    room_id: '',
                                                    user_id: '',
                                                    start_time: '',
                                                    end_time: '',
                                                    interval_num: 0,
                                                    loop_num: 0,
                                                    loop_type: 1,
                                                    time: []
                                                }];
                                                this.getOrgItems(params.row.id);
                                            } else if (params.row.combo_type === 2) {
                                                this.httpRequest3 = this.actionModal('formItem3', 'storeFamilyItems', params.row.id, 'modal3', true);
                                                this.httpRequest3.next();
                                                this.formItem3.items = [{
                                                    product_id: '',
                                                    combo_id: params.row.id,
                                                    item_id: '',
                                                    use_num: null,
                                                    price: 0
                                                }];
                                                this.getFamilyItems(params.row.id);
                                            }
                                        }
                                    }
                                }, '添加课程'),
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
                modal3: false,
                loading: false,
                loading1: false,
                httpRequest: '',
                httpRequest2: '',
                httpRequest3: '',
                formItem: {
                    component_id: '',
                    pid: 0,
                    combo_name: '',
                    combo_type: '',
                    start_date: null,
                    end_date: null,
                    combo_desc: '',
                    valid_day: null,
                    use_num: null,
                    sale_price: 0
                },
                formItem2: {
                    items: []
                },
                formItem3: {
                    items: []
                },
                ruleValidate: {
                    combo_name: [
                        {required: true, message: '商品名称不能为空', trigger: 'blur'}
                    ],
                    combo_type: [
                        {required: true, type: 'number', message: '商品类别不能为空', trigger: 'change'}
                    ],
                    component_id: [
                        {required: true, type: 'number', message: '模板类别不能为空', trigger: 'change'}
                    ],
                    start_date: [
                        {trigger: 'change', message: '开始时间要小于结束时间', validator: isLtEndDate}
                    ],
                    end_date: [
                        {trigger: 'change', message: '结束时间要大于开始时间', validator: isGtStartDate}
                    ],
                    valid_day: [
                        {type: 'number', message: '有效天数必须是整数', change: 'blur'}
                    ],
                    use_num: [
                        {type: 'number', message: '使用次数必须是整数', change: 'blur'}
                    ]
                },
                ruleValidate2: {
//                    product_id: [
//                        {required: true, type: 'number', message: '产品不能为空', trigger: 'blur'}
//                    ],
                    item_id: [
                        {required: true, type: 'number', message: '项目不能为空', trigger: 'blur'}
                    ],
                    room_id: [
                        {required: true, type: 'number', message: '房间不能为空', trigger: 'blur'}
                    ],
                    user_id: [
                        {required: true, type: 'number', message: '老师不能为空', trigger: 'blur'}
                    ],
                    interval_num: [
                        {required: true, type: 'number', message: '间隔次数不能为空', trigger: 'blur'}
                    ],
                    loop_num: [
                        {required: true, type: 'number', message: '循环次数不能为空', trigger: 'blur'}
                    ],
                    loop_type: [
                        {required: true, type: 'number', message: '循环类型不能为空', trigger: 'blur'}
                    ],
                    time: [
                        {required: true, type: 'array', message: '时间不能为空', trigger: 'change'}
                    ]
                },
                ruleValidate3: {
//                    product_id: [
//                        {required: true, type: 'number', message: '产品不能为空', trigger: 'blur'}
//                    ],
                    item_id: [
                        {required: true, type: 'number', message: '项目不能为空', trigger: 'change'}
                    ],
                    use_num: [
                        {type: 'number', message: '使用次数必须是整数', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/combos', {
                        params: {
                            'page': this.page,
                            'number': this.number
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/item/search', {
                        params: {
                            item_type: 2
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/item/search', {
                        params: {
                            item_type: 3
                        }
                    }),
                    this.axios.get('{{base_host_v1}}/rooms'),
                    this.axios.get('{{base_host_v1}}/org/id/users'),
                    this.axios.get('{{base_host_v1}}/component/search')
                ]).then(([orgs, courses, products, rooms, users, components]) => {
                    this.total = orgs.data.data.total;
                    this.editInlineData = orgs.data.data.data;
                    if (courses.data.data.length > 0) {
                        for (let i of courses.data.data) {
                            i.item_id = i.id;
                        }
                        this.courses = courses.data.data;
                    }
                    if (products.data.data.length > 0) {
                        for (let i of products.data.data) {
                            i.item_id = i.id;
                        }
                        this.products = products.data.data;
                    }

                    this.components = [];
                    for (let component of components.data.data) {
                        this.components.push({
                            name: component.component_name,
                            value: component.id
                        });
                    }
//                    this.total = products.data.dat;
                    this.rooms = rooms.data.data;
                    this.teachers = users.data.data;
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
            store (pid) {
                this.formItem._method = 'post';
                this.formItem.pid = (pid + 0) > 0 ? pid : 0;
                let data = JSON.parse(JSON.stringify(this.formItem));
                data.sale_price *= 100;
                this.axios.post('{{base_host_v1}}/combos', data).then(response => {
                    this.modal1 = false;
                    this.editInlineData.unshift(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                let data = JSON.parse(JSON.stringify(this.formItem));
                data.sale_price *= 100;
                this.axios.post('{{base_host_v1}}/combos/' + data.id, data).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/combos/' + this.formItem.id, this.formItem).then(response => {
                    this.editInlineData.splice(index, 1);
                });
            },
            dblClick (row, index) {
                this.formItem = row;
                this.formItem.sale_price /= 100;
                if (row.components !== undefined) {
                    for (let c of row.components) {
                        this.formItem.component_id = c.id;
                    }
                }
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
            startDate (date) {
                this.formItem.start_date = date;
            },
            endDate (date) {
                this.formItem.end_date = date;
            },
            changeTime (time, item) {
                item.start_time = time[0];
                item.end_time = time[1];
            },
            handleRemove (index) {
                this.formItem2.items.splice(index, 1);
            },
            handleAdd () {
                this.formItem2.items.push({
                    product_id: '',
                    combo_id: this.formItem2.items[0].combo_id,
                    item_id: '',
                    room_id: '',
                    user_id: '',
                    start_time: '',
                    end_time: '',
                    interval_num: 0,
                    loop_num: 0,
                    loop_type: 1,
                    time: []
                });
            },
            handleRemove2 (index) {
                this.formItem3.items.splice(index, 1);
            },
            handleAdd2 () {
                this.formItem3.items.push({
                    product_id: '',
                    combo_id: this.formItem3.items[0].combo_id,
                    item_id: '',
                    use_num: null,
                    price: 0
                });
            },
            storeOrgItems (id) {
                this.formItem2.id = id;
                this.axios.post('{{base_host_v1}}/combos/org/item', this.formItem2).then(response => {
                    this.modal2 = false;
                });
            },
            storeFamilyItems (id) {
                this.formItem3.id = id;
                this.axios.post('{{base_host_v1}}/combos/family/item', this.formItem3).then(response => {
                    this.modal3 = false;
                });
            },
            getOrgItems (id) {
                this.axios.get('{{base_host_v1}}/combos/org/item/' + id).then(response => {
                    if (response.data.data.length > 0) {
                        for (let i of response.data.data) {
                            i.time = [i.start_time, i.end_time];
                        }
                        this.formItem2.items = response.data.data.concat(this.formItem2.items);
                    }
                });
            },
            getFamilyItems (id) {
                this.axios.get('{{base_host_v1}}/combos/family/item/' + id).then(response => {
                    if (response.data.data.length > 0) {
                        for (let item of response.data.data) {
                            item.price = Math.floor(item.price / 100, 2);
                        }
                        this.formItem3.items = response.data.data.concat(this.formItem3.items);
                    }
                });
            },
            remoteSearchOrgs (name) {
                this.loading1 = true;
                this.axios.get('{{base_host_v1}}/org/search', {
                    params: {
                        name: name
                    }
                }).then(response => {
                    this.loading1 = false;
                    this.remoteOrgs = [];
                    for (let org of response.data.data) {
                        this.remoteOrgs.push({
                            value: org.id,
                            name: org.org_name
                        });
                    }
                });
            }
        },
        created () {
            this.initData();
        },
        watch: {
            'formItem.valid_day': function (newVal) {
                if (newVal === '') {
                    this.formItem.valid_day = null;
                }
            },
            'formItem.use_num': function (newVal) {
                if (newVal === '') {
                    this.formItem.use_num = null;
                }
            }
        }
    };
</script>