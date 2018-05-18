
// 不作为Main组件的子页面展示的页面单独写，如下
export const routerList = {
    'authentication.manage': () => import('@/views/Main.vue'),
    'authentication.list': () => import('@/views/customer/common/auth/item.index.vue'),
    'authentication.union': () => import('@/views/customer/common/auth/item.relation.group.vue'),

    'user.manage': () => import('@/views/Main.vue'),
    'user.index': () => import('@/views/customer/admin/user/user.index.vue'),
    'admin.index': () => import('@/views/customer/admin/user/admin.index.vue'),

    'setting': () => import('@/views/Main.vue'),
    'client.list': () => import('@/views/customer/common/setting/client.index.vue'),

    'school.manage': () => import('@/views/Main.vue'),
    'school.grade.index': () => import('@/views/customer/school/grade/grade.index.vue'),
    'school.class.index': () => import('@/views/customer/school/class/class.index.vue'),
    'school.student.index': () => import('@/views/customer/school/student/student.index.vue'),
    'school.teacher.index': () => import('@/views/customer/school/teacher/teacher.index.vue'),
};