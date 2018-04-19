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
import Cookies from 'js-cookie';

Vue.use(VueI18n);
Vue.use(iView);
Vue.use(VueAxios, axios);

// 注册指令
Vue.directive('permission', {
    bind: function (el, binding, vnode) {
        let allAccess = Cookies.get('access');
        let currentAccess = binding.value;
        if (currentAccess && allAccess) {
            allAccess = JSON.parse(allAccess);
            // if (!Util.isShowRoute(currentAccess, allAccess)) {
            el.style.display = 'none';
            // }
        }
    }
});

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
