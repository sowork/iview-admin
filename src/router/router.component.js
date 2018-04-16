
// 不作为Main组件的子页面展示的页面单独写，如下
export const routers = {
    '@/views/Main.vue': () => import('@/views/Main.vue'),
    '@/views/customer/auth/item.index.vue': () => import('@/views/customer/auth/item.index.vue'),
    '@/views/customer/auth/item.relation.group.vue': () => import('@/views/customer/auth/item.relation.group.vue'),
};