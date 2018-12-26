<style lang="less">
    @import '../../../../styles/common.less';
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                权限列表
            </p>
            <div>
                <div class="margin-bottom-10">
                    <Button type="ghost" @click="(httpRequest = actionModal('formItem', 'store')) && httpRequest.next()">添&nbsp;&nbsp;&nbsp;&nbsp;加</Button>
                    <Button type="ghost" @click="refreshItem">刷新缓存</Button>
                </div>
                <Table @on-row-dblclick="dblClick" :columns="editInlineColumns" :data="editInlineData" border ></Table>
            </div>
        </Card>
        <Modal v-model="modal1" title="节点管理" @keydown.enter.native="httpRequest.next()">
            <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="80">
                <FormItem label="节点代码" prop="item_code">
                    <Input type="text" v-model="formItem.item_code" placeholder=""></Input>
                </FormItem>
                <FormItem label="节点名称" prop="item_name">
                    <Input type="text" v-model="formItem.item_name" placeholder=""></Input>
                </FormItem>
                <FormItem label="节点类型" prop="item_type">
                    <Select v-model.number="formItem.item_type">
                        <Option v-for="item in itemTypes" :value="item.value" :key="item.label">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="节点归属" prop="scope">
                    <Select v-model="formItem.scope" multiple>
                        <Option v-for="item in getItemScopes()" :value="item.value" :key="item.value + item.label">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="额外数据" prop="other_data">
                    <Input type="textarea" v-model="formItem.other_data" placeholder=""></Input>
                </FormItem>
                <FormItem label="节点描述" prop="item_desc">
                    <Input type="text" v-model="formItem.item_desc" placeholder=""></Input>
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
    import { Message } from 'iview';

    export default {
        name: 'auth_permission',
        data () {
            return {
                httpRequest: '',
                itemTypes1: [
                    {
                        value: 3,
                        name: '角色',
                        scopes: [
                            {
                                value: 'admin',
                                name: '后台角色'
                            },
                            {
                                value: 'user',
                                name: '前台角色'
                            }
                        ]
                    },
                    {
                        value: 2,
                        name: '菜单',
                        scopes: [
                            {
                                value: 'admin',
                                name: '后台菜单'
                            },
                            {
                                value: 'adminTop',
                                name: '后台顶部菜单'
                            }
                        ]
                    },
                    {
                        value: 1,
                        name: '权限',
                        scopes: [
                            {
                                value: 'admin',
                                name: '后台权限'
                            },
                            {
                                value: 'user',
                                name: '前台权限'
                            }
                        ]
                    }
                ],
                itemTypes: [
                    {
                        value: 3,
                        label: '角色',
                        level: 3,
                        children: [
                            {
                                value: 'admin_roles',
                                label: '智慧云端角色'
                            },
                            {
                                value: 'school_roles',
                                label: '学校端角色'
                            },
                            {
                                value: 'org_roles',
                                label: '机构端角色'
                            }
                        ]
                    },
                    {
                        value: 2,
                        label: '菜单',
                        level: 2,
                        children: [
                            {
                                value: 'admin_menus',
                                label: '智慧云端菜单'
                            },
                            {
                                value: 'admin_top_menus',
                                label: '智慧云端顶部菜单'
                            },
                            {
                                value: 'school_menus',
                                label: '学校端菜单'
                            },
                            {
                                value: 'org_menus',
                                label: '机构端菜单'
                            }
                        ]
                    },
                    {
                        value: 1,
                        label: '权限',
                        level: 1,
                        children: [
                            {
                                value: 'admin_permissions',
                                label: '智慧云端权限'
                            },
                            {
                                value: 'school_permissions',
                                label: '学校端权限'
                            },
                            {
                                value: 'org_permissions',
                                label: '机构端权限'
                            }
                        ]
                    }
                ],
                editInlineColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '节点代码',
                        align: 'center',
                        key: 'item_code'
                    },
                    {
                        title: '节点名称',
                        align: 'center',
                        key: 'item_name'
                    },
                    {
                        title: '节点归属',
                        align: 'center',
                        render: (h, params) => {
                            let scopeStr = [];
                            for (let item of this.itemTypes) {
                                if (item.value === Number.parseInt(params.row.item_type)) { // 类型对应
                                    for (let itemScope of item.children) {
                                        for (let scope of params.row.scope.split(',')) {
                                            if (itemScope.value === scope) {
                                                scopeStr.push(itemScope.label);
                                            }
                                        }
                                    }
                                }
                            }
                            return h('span', scopeStr.join(','));
                        }
                    },
                    {
                        title: '节点类型',
                        align: 'center',
                        render: (h, params) => {
                            const row = params.row;
                            const color = Number.parseInt(row.item_type) === 1 ? 'blue' : Number.parseInt(row.item_type) === 2 ? 'green' : 'red';
                            let text = '';
                            for (let item of this.itemTypes) {
                                if (item.value === Number.parseInt(params.row.item_type)) {
                                    text = item.label;
                                }
                            }
                            return h('a', [
                                h('Tag', {
                                    props: {
                                        type: 'dot',
                                        color: color
                                    }
                                }, text)
                            ]);
                        }
                    },
                    {
                        title: '节点描述',
                        align: 'center',
                        key: 'item_desc'
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
                formItem: {
                    item_code: '',
                    item_name: '',
                    item_desc: '',
                    item_type: '',
                    scope: [],
                    other_data: ''
                },
                ruleInline: {
                    item_code: [
                        { required: true, message: '节点码不能为空', trigger: 'blur' }
                    ],
                    item_name: [
                        { required: true, message: '节点名称不能为空', trigger: 'blur' }
                    ],
                    item_desc: [
                        { type: 'string', max: 191, message: '字符串最多为191', trigger: 'blur' }
                    ],
                    scope: [
                        { required: true, type: 'array', message: '节点归属不能为空', trigger: 'change' }
                    ],
                    item_type: [
                        { required: true, type: 'number', message: '节点类型不能为空', trigger: 'change' }
                    ]
                },
                modal1: false
            };
        },
        methods: {
            initData () {
                this.axios.get('{{auth_host_v1}}/auth/item').then(response => {
                    this.editInlineData = response.data.data;
                });
            },
            * actionModal (name, method, index = 0) {
                if (method === 'store') {
                    this.reset(name);
                }
                yield this.modal1 = true;
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
                this.axios.post('{{auth_host_v1}}/auth/item', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.unshift(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{auth_host_v1}}/auth/item/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{auth_host_v1}}/auth/item/' + this.formItem.id, this.formItem).then(response => {
                    this.editInlineData.splice(index, 1);
                });
            },
            reset (name) {
                this.$refs[name].resetFields();
            },
            dblClick (row, index) {
                row.scope = row.scope.split(',');
                this.formItem = row;
                this.httpRequest = this.actionModal('formItem', 'update', index);
                this.httpRequest.next();
            },
            getItemScopes () {
                for (let item of this.itemTypes) {
                    if (item.value === this.formItem.item_type) {
                        return item.children;
                    }
                }
            },
            refreshItem () {
                this.axios.get('{{auth_host_v1}}/auth/item/refresh/cache').then(response => {
                    if (response.data.code === '0') {
                        Message.success(response.data.msg);
                    }
                });
            }
        },
        created () {
            this.initData();
        }
    };
</script>