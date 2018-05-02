
// 不作为Main组件的子页面展示的页面单独写，如下
export const routerList = {
    'authentication.manage': () => import('@/views/Main.vue'),
    'authentication.list': () => import('@/views/customer/auth/item.index.vue'),
    'authentication.union': () => import('@/views/customer/auth/item.relation.group.vue'),

    'user.manage': () => import('@/views/Main.vue'),
    'user.index': () => import('@/views/customer/user/user.index.vue'),
    'admin.index': () => import('@/views/customer/user/admin.index.vue'),

    'setting': () => import('@/views/Main.vue'),
    'client.list': () => import('@/views/customer/setting/client.index.vue'),
};