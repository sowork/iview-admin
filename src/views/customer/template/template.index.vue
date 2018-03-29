<style lang="less">
    @import '../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                模板管理
            </p>
            <div>
                <Row>
                    <Col span="6" style="padding-right:10px">
                        <Select v-model="formItem.class_id" @on-change="selectClass" clearable>
                            <Option v-for="item in classes" :value="item.id" :key="item.id">{{ item.class_name }}</Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <Select v-model="formItem.course_id" @on-change="selectCourse" clearable>
                            <Option v-for="item in courses" :value="item.id" :key="item.id">{{ item.course_name }}</Option>
                        </Select>
                    </Col>
                </Row>
                <br>
                <div>
                    <Transfer
                            :data="data3"
                            :target-keys="targetKeys3"
                            :list-style="listStyle"
                            :render-format="render3"
                            :operations="['To left','To right']"
                            filterable
                            @on-change="handleChange3">
                        <div :style="{float: 'right', margin: '5px'}">
                            <Button type="ghost" size="small" @click="reloadMockData">Refresh</Button>
                        </div>
                    </Transfer>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'paper_index',
        components: {
        },
        data () {
            return {
                classes: [],
                courses: [],
                value1: [],
                data3: [],
                targetKeys3: [],
                listStyle: {
                    width: '450px',
                    height: '300px'
                },
                formItem: {
                    class_id: '',
                    course_id: ''
                }
            };
        },
        methods: {
            initData () {
                Promise.all([
                    this.axios.get('{{host_v1}}/classes')
                ]).then(([classes]) => {
                    this.classes = classes.data.data;
                });
                this.getMockData();
                this.getTargetKeys();
            },
            store () {
                this.formItem._method = 'post';
                this.axios.post('{{host_v1}}/student', this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.unshift(response.data.data);
                });
            },
            update (index) {
                this.formItem._method = 'put';
                this.axios.post('{{host_v1}}/student/' + this.formItem.id, this.formItem).then(response => {
                    this.modal1 = false;
                    this.editInlineData.splice(index, 1, response.data.data);
                });
            },
            destroy (index) {
                this.formItem._method = 'delete';
                this.axios.post('{{host_v1}}/student/' + this.formItem.id, this.formItem).then(response => {
                    this.editInlineData.splice(index, 1);
                });
            },
            selectClass () {
                this.courses = [];
                this.axios.get('{{host_v1}}/class/courses', {
                    params: {
                        id: this.formItem.class_id
                    }
                }).then(response => {
                    this.courses = response.data.data;
                });
                this.getTargetKeys();
            },
            selectCourse () {
                this.getTargetKeys();
            },
            getMockData () {
                this.axios.get('{{host_v1}}/template').then((response) => {
                    this.data3 = response.data.data;
                });
            },
            getTargetKeys () {
                this.axios.get('{{host_v1}}/template/setting', {
                    params: this.formItem
                }).then(response => {
                    this.targetKeys3 = response.data.data.map(item => item.template_id);
                    console.log(this.targetKeys3);
                });
            },
            handleChange3 (newTargetKeys) {
                console.log(newTargetKeys)
                let data = this.formItem;
                data['template_ids'] = newTargetKeys;
                this.axios.post('{{host_v1}}/template/setting/setting', data).then(response => {
                    if (response.data.code === '0') {
                        this.targetKeys3 = newTargetKeys;
                    }
                });
            },
            render3 (item) {
                return item.label + ' - ' + item.description;
            },
            reloadMockData () {
                this.data3 = this.getMockData();
                this.targetKeys3 = this.getTargetKeys();
            }
        },
        created () {
            this.initData();
        }
    };
</script>