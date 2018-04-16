
// 不作为Main组件的子页面展示的页面单独写，如下
export const routerList = {
    'auth.manage': () => import('@/views/Main.vue'),
    'permission.list': () => import('@/views/customer/auth/item.index.vue'),
    'permission.': () => import('@/views/customer/auth/item.relation.group.vue'),
};