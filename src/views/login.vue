<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem label="">
                            <RadioGroup v-model="status">
                                <Radio label="1">学校端</Radio>
                                <Radio label="2">管理员端</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Cookies from 'js-cookie';

export default {
    data () {
        return {
            status: 1,
            form: {
                userName: '18334787559',
                password: '123123'
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            let loginUrl = '';
            if (this.status === 1) {
                loginUrl = '{{host_v1}}/user/login';
            } else {
                loginUrl = '{{host_v1}}/admin/login';
            }
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.axios.post(loginUrl, {
                        username: this.form.userName,
                        password: this.form.password
                    }).then((response) => {
                        if (response.data.access_token) {
                            Cookies.set('user', this.form.userName);
                            return this.axios.get('{{host_v1}}/auth/items', {
                                params: {
                                    'scope': 'admin',
                                    'type': 2
                                }
                            });
                        }
                    }).then((response) => {
                        let menus = this.parseMenuTree(response.data.data);
                        console.log(menus)
                        localStorage.menuList = JSON.stringify(menus);
//                        this.$router.addRoutes(menus);
//                        this.$store.commit('updateMenulist', menus);

                        Cookies.set('access', []);
                       // this.$router.push({
                       //     name: 'home_index'
                       // });
                    });
//                    Cookies.set('user', this.form.userName);
//                    Cookies.set('password', this.form.password);
//                    this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
//                    if (this.form.userName === 'iview_admin') {
//                        Cookies.set('access', 0);
//                    } else {
//                        Cookies.set('access', 1);
//                    }
//                    this.$router.push({
//                        name: 'home_index'
//                    });
                }
            });
        },
        parseMenuTree (treeData) {
            let tree = [];
            let temp = {tree: {}};
            for (let item of treeData) {
                let data = JSON.parse(item.other_data);
                temp['tree'][item.relation_id] = {
                    path: data.path,
                    icon: data.icon,
                    component: () => import(data.component),
                    title: item.item_name,
                    parent_id: item.parent_id,
                    relation_id: item.relation_id,
                    name: item.item_code
                };
            }

            for (let index in temp['tree']) {
                if (temp['tree'][index].parent_id !== null && temp['tree'][temp['tree'][index]['parent_id']] !== undefined) {
                    if (temp['tree'][temp['tree'][index]['parent_id']].children === undefined) {
                        temp['tree'][temp['tree'][index]['parent_id']].children = [];
                    }
                    temp['tree'][temp['tree'][index]['parent_id']].children.push(temp['tree'][index]);
                } else {
                    tree.push(temp['tree'][index])
                }
            }

            return tree;
        }
    },
    computed: {
        ...mapState([
        ])
    }
};
</script>

<style>

</style>
