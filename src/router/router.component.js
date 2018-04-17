
// 不作为Main组件的子页面展示的页面单独写，如下
export const routerList = {
    'auth': () => import('@/views/Main.vue'),
    'list': () => import('@/views/customer/auth/item.index.vue'),
    'union': () => import('@/views/customer/auth/item.relation.group.vue'),
};