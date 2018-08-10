<template>
    <div>
        <FormItem label="内容域" prop="extra_data.app_scope">
            <Select v-model.number="newFormItem.app_scope">
                <Option v-for="item in item_category_lists" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="适用年龄">
            <Row>
                <Col span="11">
                    <FormItem prop="extra_data.age_from">
                        <Input v-model.number="newFormItem.age_from" placeholder="例如：0（岁为单位）"></Input>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <FormItem prop="extra_data.age_to">
                        <Input v-model.number="newFormItem.age_to" placeholder="例如：3（岁为单位）"></Input>
                    </FormItem>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="项目归属" prop="extra_data.app_belong">
            <Select v-model.number="newFormItem.app_belong">
                <Option v-for="item in item_belong_lists" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="完成所需时间" prop="extra_data.app_finish_time">
            <Input v-model.number="newFormItem.app_finish_time" placeholder="例如：20（分钟为单位）"></Input>
        </FormItem>
        <FormItem label="运行平台" prop="extra_data.app_platform">
            <Select v-model.number="newFormItem.app_platform">
                <Option v-for="item in item_platform_lists" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
        </FormItem>
    </div>
</template>

<script>
    export default {
        props: {
            formItem: {
                type: Object,
                default: {}
            },
            ruleValidate: {
                type: Object,
                default: {}
            }
        },
        data () {
            return {
                item_category_lists: [
                    {
                        name: '感知觉与运动域',
                        value: 1
                    },
                    {
                        name: '认知域',
                        value: 2
                    },
                    {
                        name: '情绪域',
                        value: 3
                    },
                    {
                        name: '社交域',
                        value: 4
                    },
                    {
                        name: '学习域',
                        value: 5
                    },
                    {
                        name: '语言域',
                        value: 6
                    }
                ],
                item_belong_lists: [
                    {
                        name: '评测',
                        value: 1
                    },
                    {
                        name: '训练',
                        value: 2
                    }
                ],
                item_platform_lists: [
                    {
                        name: '安卓',
                        value: 1
                    },
                    {
                        name: 'windows',
                        value: 2
                    }
                ],
                newFormItem: {
                    item_scope: '',
                    age_from: '',
                    age_to: '',
                    item_belong: '',
                    item_finish_time: '',
                    item_platform: ''
                },
                newRuleValidate: {
                    'extra_data.app_scope': [
                        {required: true, type: 'number', message: '内容域不能为空', trigger: 'change'}
                    ],
                    'extra_data.age_from': [
                        {required: true, type: 'number', message: '开始年龄不能为空', trigger: 'blur'}
                    ],
                    'extra_data.age_to': [
                        {required: true, type: 'number', message: '结束年龄不能为空', trigger: 'blur'}
                    ],
                    'extra_data.app_belong': [
                        {required: true, type: 'number', message: '项目归属不能为空', trigger: 'change'}
                    ],
                    'extra_data.app_finish_time': [
                        {required: true, type: 'number', message: '完成所需时间不能为空', trigger: 'blur'}
                    ],
                    'extra_data.app_platform': [
                        {required: true, type: 'number', message: '运行平台不能为空', trigger: 'change'}
                    ]
                }
            };
        },
        created () {
            if (this.formItem.extra_data === undefined) {
                this.formItem.extra_data = {};
                this.formItem.extra_data = this.newFormItem;
            } else {
                this.newFormItem = this.formItem.extra_data;
            }
            Object.assign(this.ruleValidate, this.newRuleValidate);
        },
        beforeDestroy () {
            this.newFormItem = {};
            delete this.formItem['extra_data'];
            for (let newRuleKey in this.newRuleValidate) {
                delete this.ruleValidate[newRuleKey];
            }
        }
    };
</script>