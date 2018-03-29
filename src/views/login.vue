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
//                            return this.axios.get('{{host_v1}}/user/permissions');
                        }
                    }).then((response) => {
//                        Cookies.set('access', response.data.data);
                        Cookies.set('access', []);
                        this.$router.push({
                            name: 'home_index'
                        });
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
