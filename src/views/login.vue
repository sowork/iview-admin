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
import iView from 'iview';
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
            let loginUrl = '{{host_v1}}/admin/login';
            let provider = '';
            let appID = 0;
            if (this.status === 1) {
                provider = 'users';
                appID = this.school_appId;
            } else {
                provider = 'admins';
                appID = this.admin_appId;
            }
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    iView.LoadingBar.start();
                    this.axios.post(loginUrl, {
                        username: this.form.userName,
                        password: this.form.password,
                        provider: provider,
                        client_id: appID
                    }).then((response) => {
                        if (response.data.access_token) {
                            Cookies.set('user', this.form.userName);
                            return Promise.all([
                                this.axios.get('{{host_v1}}/auth/items', {
                                    params: {
                                        'scope': 'admin',
                                        'type': 2
                                    }
                                }),
                                this.axios.get('{{host_v1}}/auth/items', {
                                    params: {
                                        'scope': 'adminTop',
                                        'type': 2
                                    }
                                }),
                                this.axios.get('{{host_v1}}/auth/items', {
                                    params: {
                                        'scope': 'admin',
                                        'type': 1
                                    }
                                })
                            ]);
                        }
                    }).then(([menus, topMenus, permissions]) => {
                        iView.LoadingBar.finish();
                        localStorage.menuList = JSON.stringify(menus.data.data);
                        localStorage.topMenuList = JSON.stringify(topMenus.data.data);
                        localStorage.permissions = JSON.stringify(permissions.data.data);
                        localStorage.allItems = JSON.stringify(menus.data.data.concat(topMenus.data.data, permissions.data.data));
                        window.location.href = '/';
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
