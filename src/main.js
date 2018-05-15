import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import axios from './libs/axios';
import VueAxios from 'vue-axios';

Vue.use(VueI18n);
Vue.use(iView);
Vue.use(VueAxios, axios);

// 注册指令
Vue.directive('permission', {
    bind: function (el, binding, vnode) {
        let items = JSON.parse(localStorage.allItems || []).concat(store.state.app.spliteAppMenu);
        let currentPermission = binding.value;
        let flag = false;
        for (let item of items) {
            if (item.item_code === currentPermission || item.name === currentPermission) {
                flag = true;
            }
        }
        if (!flag) {
            el.style.display = 'none';
        }
    }
});

Vue.prototype.school_appId = 9; // 打包前配置：学校端appid
Vue.prototype.admin_appId = 10; // 打包前配置：管理员端appid

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
    },
    created () {
    }
});
