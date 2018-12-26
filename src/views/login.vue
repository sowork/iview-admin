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
                <Tabs @on-click="toggleTab" value="loginForm2">
                    <TabPane label="短信登录" name="loginForm2">
                        <div class="form-con">
                            <Form ref="loginForm2" :model="form" :rules="rules2">
                                <FormItem prop="userName">
                                    <Input v-model="form.userName" placeholder="请输入手机号码">
                                        <span slot="prepend">
                                            <Icon :size="16" type="person"></Icon>
                                        </span>
                                    </Input>
                                </FormItem>
                                <FormItem prop="password">
                                    <Row>
                                        <Col span="15">
                                            <FormItem prop="password">
                                                <Input type="password" v-model="form.password" placeholder="请输入验证码">
                                                    <span slot="prepend">
                                                        <Icon :size="14" type="locked"></Icon>
                                                    </span>
                                                </Input>
                                            </FormItem>
                                        </Col>
                                        <Col push="1" span="7">
                                            <Button @click="getCode" :disabled="disabled" type="primary" v-text="codeText"></Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                                <FormItem label="">
                                    <RadioGroup v-model="status2">
                                        <Radio label='org'>机构端</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <FormItem>
                                    <Button @click="handleSubmit" type="primary" long>登录</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </TabPane>
                    <TabPane label="账号密码登录" name="loginForm">
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
                                        <Radio label='school'>学校端</Radio>
                                        <Radio label='org'>机构端</Radio>
                                        <Radio label='admin'>管理员端</Radio>
                                        <Radio label='cq_org_user'>重庆机构端</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <FormItem>
                                    <Button @click="handleSubmit" type="primary" long>登录</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    </div>
</template>

<script>
import iView, { Message } from 'iview';
import Cookies from 'js-cookie';
import util from '@/libs/util';

export default {
    data () {
        const validePhone = (rule, value, callback) => {
            if (value === '') {
                callback();
            }
            var re = /^1[0-9]{10}$/;
            if (value !== null && !re.test(value)) {
                callback(new Error('请输入正确格式的手机号'));
            } else {
                callback();
            }
        };
        return {
            status: 'school',
            status2: 'org',
            codeText: '获取验证码',
            currentRef: 'loginForm2',
            time: 60,
            disabled: false,
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
            },
            rules2: {
                userName: [
                    { required: true, message: '手机号码不能为空', trigger: 'blur' },
                    {validator: validePhone}
                ],
                password: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            let loginUrl = '{{auth_host_v1}}/admin/login';
            let provider = '';
            if (this.currentRef === 'loginForm') {
                if (this.status === 'school') {
                    provider = 'users';
                } else if (this.status === 'org') {
                    provider = 'org_users';
                } else if (this.status === 'admin') {
                    provider = 'admins';
                } else if (this.status === 'cq_org_user') {
                    provider = 'cq_org_users';
                } else {
                    return;
                }
            } else if (this.currentRef === 'loginForm2') {
                if (this.status2 === 'org') {
                    provider = 'org_users';
                } else {
                    return;
                }
            } else {
                return;
            }

            this.$refs[this.currentRef].validate((valid) => {
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
                                window.location.reload();
                            });
                        }
                    });
                }
            });
        },
        getCode () {
            this.$refs.loginForm2.validateField('userName', (valid) => {
                if (!valid) {
                    this.codeText = '请等待  ' + this.time + '  秒';
                    this.disabled = true;
                    let timer = setInterval(() => {
                        this.time--;
                        this.codeText = '请等待 ' + this.time + ' 秒';
                        if (this.time === 0) {
                            clearInterval(timer);
                            this.codeText = '获取验证码';
                            this.disabled = false;
                            this.time = 60;
                        }
                    }, 1000);

                    this.axios.post('{{auth_host_v1}}/sms/code', {
                        tel: this.form.userName
                    }).then(response => {
                        if (response.data.code === '0') {
                            Message.success('验证码发送成功');
                        }
                    });
                }
            });
        },
        toggleTab (name) {
            if (this.currentRef === '') {
                return 'loginForm2';
            }
            this.currentRef = name;
        }
    },
    computed: {
    }
};
</script>

<style>

</style>
