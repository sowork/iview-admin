import axios from '@/libs/axios';
import semver from 'semver';
import packjson from '../../package.json';
import { routerList } from '../router/router.component';
import { appRouter } from '../router/router';
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import { apiDomain } from '@/libs/const';
import env from '../../build/env';

let util = {

};
util.title = function (title) {
    title = title || '弘智云管理平台';
    window.document.title = title;
};

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof currentAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj) {
            if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
                currentPathArr = [
                    {
                        title: '首页',
                        path: '',
                        name: 'home_index'
                    }
                ];
            } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
                currentPathArr = [
                    {
                        title: '首页',
                        path: '/home',
                        name: 'home_index'
                    },
                    {
                        title: currentPathObj.title,
                        path: '',
                        name: name
                    }
                ];
            } else {
                let childObj = currentPathObj.children.filter((child) => {
                    return child.name === name;
                })[0];
                currentPathArr = [
                    {
                        title: '首页',
                        path: '/home',
                        name: 'home_index'
                    },
                    {
                        title: currentPathObj.title,
                        path: '',
                        name: currentPathObj.name
                    },
                    {
                        title: childObj.title,
                        path: currentPathObj.path + '/' + childObj.path,
                        name: name
                    }
                ];
            }
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.spliteMenu = function (router = appRouter) {
    let routers = [];
    for (let menu of router) {
        if (menu.children !== undefined && menu.children.length > 0) {
            let tmpMenu = JSON.parse(JSON.stringify(menu));
            tmpMenu.children = undefined;
            routers.push(tmpMenu);
            routers = routers.concat(util.spliteMenu(menu.children));
        } else {
            routers.push(menu);
        }
    }

    return routers;
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
};

util.parseGrade = function (date, type = 1) {
    let year = new Date(date).getFullYear();
    let currentYear = new Date().getFullYear();
    if (type === 1) {
        let diffYear = Number.parseInt(currentYear) - Number.parseInt(year);
        switch (diffYear) {
            case 0:
                return '一年级';
            case 1:
                return '二年级';
            case 2:
                return '三年级';
            case 3:
                return '四年级';
            case 4:
                return '五年级';
            case 5:
                return '六年级';
            default:
                return '已毕业';
        }
    }
};

util.checkUpdate = function (vm) {
    axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
        let version = res.data.tag_name;
        vm.$Notice.config({
            duration: 0
        });
        if (semver.lt(packjson.version, version)) {
            vm.$Notice.info({
                title: 'iview-admin更新啦',
                desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
            });
        }
    });
};

util.parseMenuTree = function (menus) {
    if (!menus) {
        return [];
    }
    let tree = [];
    let temp = new Map();
    for (let item of menus) {
        if (item.other_data !== undefined && item.other_data !== '') {
            let data = JSON.parse(item.other_data);
            temp.set(item.relation_id, {
                path: data.path,
                icon: data.icon,
                component: routerList[item.item_code],
                title: item.item_name,
                parent_id: item.parent_id,
                relation_id: item.relation_id,
                name: item.item_code,
                meta: {target: data.target}
            });
        }
    }

    for (let value of temp.values()) {
        if (value.parent_id !== null && temp.get(value.parent_id) !== undefined) {
            if (temp.get(value.parent_id).children === undefined) {
                temp.get(value.parent_id).children = [];
            }
            temp.get(value.parent_id).children.push(value);
        } else {
            tree.push(value);
        }
    }

    for (let index in tree) {
        if (tree[index].children === undefined) {
            tree.splice(index, 1);
        }
    }

    return tree;
};

util.loadMenu = function () {
    return Promise.all([
        axios.get('{{auth_host_v1}}/auth/items', {
            params: {
                'scope': 'admin_menus,school_menus,org_menus',
                'type': 2
            }
        }),
        axios.get('{{auth_host_v1}}/auth/items', {
            params: {
                'scope': 'admin_top_menus',
                'type': 2
            }
        }),
        axios.get('{{auth_host_v1}}/auth/items', {
            params: {
                'scope': 'admin_permissions,school_permissions',
                'type': 1
            }
        })
    ]).then(([menus, topMenus, permissions]) => {
        localStorage.menuList = JSON.stringify(menus.data.data);
        localStorage.topMenuList = JSON.stringify(topMenus.data.data);
        localStorage.permissions = JSON.stringify(permissions.data.data);
        localStorage.allItems = JSON.stringify(menus.data.data.concat(topMenus.data.data, permissions.data.data));
    });
};

util.storeMenus = function () {
    Vue.use(VueRouter);
    const userMenus = util.parseMenuTree(JSON.parse(localStorage.menuList || null) || []);

    store.state.app.spliteAppMenu = util.spliteMenu(appRouter); // 自定义路由
    store.state.app.menuList = userMenus.concat(appRouter);
    store.state.app.routers.push(...userMenus);
    store.state.app.menuList.map((item) => {
        let tagsList = [];
        if (item.children) {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
            store.commit('setTagsList', tagsList);
        }
    });

    return userMenus;
};

util.parseUrl = function (url) {
    let reg = /{{([a-zA-Z0-9_.-]+)}}/g;
    let item = '';
    while ((item = reg.exec(url)) !== null) {
        if (item) {
            let tmp = new RegExp('{{' + item[1] + '}}', 'g');
            url = url.replace(tmp, apiDomain[env][item[1]]);
        }
    }
    return url;
}

export default util;
