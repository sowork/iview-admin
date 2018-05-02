<style lang="less">
    @import '../../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-remove"></Icon>
                客户端列表
            </p>
            <div >
                <Clients></Clients>
                <!--<PersonalAccessTokens></PersonalAccessTokens>-->
                <!--<AuthorizedClients></AuthorizedClients>-->
            </div>
        </Card>
    </div>
</template>

<script>
    import AuthorizedClients from './component/passport/AuthorizedClients.vue';
    import Clients from './component/passport/Clients.vue';
    import PersonalAccessTokens from './component/passport/PersonalAccessTokens.vue';

    export default {
        components: {
            AuthorizedClients,
            Clients,
            PersonalAccessTokens
        },
        data () {
            return {
            };
        },
        methods: {
            initData () {
            }
        },
        created () {
            this.initData();
        }
    };
</script>