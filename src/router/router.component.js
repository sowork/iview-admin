
// 不作为Main组件的子页面展示的页面单独写，如下
export const routerList = {
    // ========================智慧云===============================
    'authentication.manage': () => import('@/views/Main.vue'),
    'authentication.list': () => import('@/views/customer/common/auth/item.index.vue'),
    'authentication.union': () => import('@/views/customer/common/auth/item.relation.group.vue'),

    'user.manage': () => import('@/views/Main.vue'),
    'user.index': () => import('@/views/customer/admin/user/user.index.vue'),
    'admin.index': () => import('@/views/customer/admin/user/admin.index.vue'),
    'org.user.index': () => import('@/views/customer/admin/user/org.user.index.vue'),

    'setting': () => import('@/views/Main.vue'),
    'client.list': () => import('@/views/customer/common/setting/client.index.vue'),

    'org.manage': () => import('@/views/Main.vue'),
    'org.list': () => import('@/views/customer/admin/org/org.index.vue'),

    'item.manage': () => import('@/views/Main.vue'),
    'item.list': () => import('@/views/customer/admin/item/item.index.vue'),

    // ========================学校===============================
    'school.manage': () => import('@/views/Main.vue'),
    // 'school.grades': () => import('@/views/customer/school/grade/grade.index.vue'),
    'school.classes': () => import('@/views/customer/school/class/class.index.vue'),
    'school.students': () => import('@/views/customer/school/student/student.index.vue'),
    'school.teachers': () => import('@/views/customer/school/teacher/teacher.index.vue'),
    'school.lessons': () => import('@/views/customer/school/lesson/class.attention.vue'),

};