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
                            <RadioGroup v-model.number="status">
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
import iView from 'iview';
import Cookies from 'js-cookie';
import util from '@/libs/util';

export default {
    data () {
        return {
            status: 1,
            form: {
                userName: '',
                password: ''
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
            let loginUrl = '{{auth_host_v1}}/admin/login';
            let provider = '';
            if (this.status === 1) {
                provider = 'users';
            } else {
                provider = 'admins';
            }
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    iView.LoadingBar.start();
                    this.axios.post(loginUrl, {
                        username: this.form.userName,
                        password: this.form.password,
                        provider: provider
                    }).then((response) => {
                        if (response.data.access_token) {
                            Cookies.set('user', this.form.userName);
                            util.loadMenu().then((response) => {
                                iView.LoadingBar.finish();
                                window.location.href = '/';
                            });
                        }
                    });
                }
            });
        }
    },
    computed: {
    }
};
</script>

<style>

</style>
