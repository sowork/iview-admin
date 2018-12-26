<!-- 分离指标的模板,暂时没有成功,后期优化 -->
<template>
    <div>
        <Modal :loading="loading" :value="value" title="指标管理" @keydown.enter.native="httpRequest.next()" @on-cancel="onCancel">
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem
                    v-for="(item, index) in formDynamic.items"
                    :key="index"
                    :label="'自定义指标' + index">
                    <Row>
                        <Col span="8">
                            <FormItem>
                                <Input type="text" v-model="item.item_field_code" placeholder="请输入指标code"></Input>
                            </FormItem>
                        </Col>
                        <Col span="1" style="text-align: center">-</Col>
                        <Col span="8">
                            <FormItem>
                                <Input type="text" v-model="item.item_field_name" placeholder="请输入指标name"></Input>
                            </FormItem>
                        </Col>
                        <Col span="4" offset="1">
                            <Button type="ghost" @click="handleRemove(index)">删除</Button>
                        </Col>
                    </Row>
                </FormItem>

                <FormItem>
                    <Row>
                        <Col span="12">
                            <Button type="dashed" long @click="handleAdd" icon="plus-round">添加指标</Button>
                        </Col>
                    </Row>
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
        props: {
            value: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                loading: false,
                httpRequest: '',
                formItem: {
                    item_name: ''
                },
                ruleValidate: {
//                    'extra_data.app_scope': [
//                        {required: true, type: 'number', message: '内容域不能为空', trigger: 'change'}
//                    ]
                },
                formDynamic: {
                    items: [
                        {
                            item_field_code: '',
                            item_field_name: ''
                        }
                    ]
                }
            };
        },
        methods: {
            onCancel () {
                this.$emit('input', false);
            },
            handleAdd () {
                this.index++;
                this.formDynamic.items.push({
                    item_field_code: '',
                    item_field_name: ''
                });
            },
            handleRemove (index) {
                this.formDynamic.items.splice(index, 1);
            },
            * actionModal (name, method, index = 0, modalName = 'modal1') {
                if (method === 'store') {
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
            }
        },
        created () {
        },
        beforeDestroy () {
        }
    };
</script>