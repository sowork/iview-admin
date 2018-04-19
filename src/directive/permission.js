import Vue from 'vue';
import Cookies from 'js-cookie';
import Util from '../libs/util';

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
