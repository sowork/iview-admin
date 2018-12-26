<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                房间管理
            </p>
            <div class="edittable-table-height-con">
                <div class="margin-bottom-10">
                    <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store')) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                </div>
                <Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
            <div class="margin-top-20">
                <Page @on-change="onChange" @on-page-size-change="onPageSizeChange" :total="total" show-total size="small" show-elevator show-sizer></Page>
            </div>
        </Card>
        <Modal :loading="loading" v-model="modal1" title="房间管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="房间名称" prop="room_name">
                    <Input v-model="formItem.room_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="房间地址" prop="room_address">
                    <Input v-model="formItem.room_address" placeholder=""></Input>
                </FormItem>
                <FormItem label="房间人数" prop="room_number">
                    <Input v-model.number="formItem.room_number" placeholder=""></Input>
                </FormItem>
                <FormItem label="房间描述" prop="room_desc">
                    <Input type="textarea" v-model="formItem.room_desc" placeholder=""></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="reset('formItem')">重置</Button>
                <Button type="primary" @click="httpRequest.next()">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data () {
            return {
                org_type_lists: [
                    {
                        name: '测评架机构',
                        value: 1
                    }
                ],
                editInlineColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '房间名称',
                        align: 'center',
                        key: 'room_name'
                    },
                    {
                        title: '房间地址',
                        align: 'center',
                        key: 'room_address'
                    },
                    {
                        title: '房间人数',
                        align: 'center',
                        key: 'room_number'
                    },
                    {
                        title: '房间描述',
                        align: 'center',
                        key: 'room_desc'
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
                loading: false,
                httpRequest: '',
                formItem: {
                    room_name: '',
                    room_address: '',
                    room_number: '',
                    room_desc: ''
                },
                ruleValidate: {
                    room_name: [
                        {required: true, message: '房间名称不能为空', trigger: 'blur'}
                    ],
                    room_address: [
                        {required: true, message: '房间地址不能为空', trigger: 'blur'}
                    ],
                    room_number: [
                        {required: true, type: 'number', message: '房间人数必须为整形', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{base_host_v1}}/rooms', {
                        params: {
                            'page': this.page,
                            'number': this.number
                        }
                    })
                ]).then(([orgs]) => {
                    this.editInlineData = orgs.data.data.data;
                });
            },
            * actionModal (name, method, index = 0) {
                if (method === 'store') {
                    this.reset(name);
                }
                yield (this.modal1 = true);
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
                this.axios.post('{{base_host_v1}}/rooms', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.push(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{base_host_v1}}/rooms/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{base_host_v1}}/rooms/' + this.formItem.id, this.formItem).then(response => {
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
            }
        },
        created () {
            this.initData();
        }
    };
</script>