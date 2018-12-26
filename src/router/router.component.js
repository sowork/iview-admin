
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

    'resource.manage': () => import('@/views/Main.vue'),
    'product.list': () => import('@/views/customer/admin/item/product.index.vue'),
    'course.list': () => import('@/views/customer/admin/item/course.index.vue'),
    'lesson.list': () => import('@/views/customer/admin/item/lesson.index.vue'),
    'content.list': () => import('@/views/customer/admin/item/content.index.vue'),

    'operation.manage': () => import('@/views/Main.vue'),
    'operation.linyi': () => import('@/views/customer/admin/operation/linyi.index.vue'),
    'operation.platform': () => import('@/views/customer/admin/operation/platform.index.vue'),

    'model.manage': () => import('@/views/Main.vue'),
    'model.list': () => import('@/views/customer/admin/model/model.index.vue'),
    'index.list': () => import('@/views/customer/admin/model/index.index.vue'),
    'component.list': () => import('@/views/customer/admin/model/component.index.vue'),

    // ========================学校===============================
    'school.manage': () => import('@/views/Main.vue'),
    // 'school.grades': () => import('@/views/customer/school/grade/grade.index.vue'),
    'school.classes': () => import('@/views/customer/school/class/class.index.vue'),
    'school.students': () => import('@/views/customer/school/student/student.index.vue'),
    'school.teachers': () => import('@/views/customer/school/teacher/teacher.index.vue'),
    'school.lessons': () => import('@/views/customer/school/lesson/class.attention.vue'),


    // ========================机构===============================
    'org.manage.client': () => import('@/views/Main.vue'),
    'org.users': () => import('@/views/customer/org/user/user.index.vue'),
    'org.room.list': () => import('@/views/customer/org/room/room.index.vue'),
    'org.term.list': () => import('@/views/customer/org/term/term.index.vue'),
    'org.combo.list': () => import('@/views/customer/org/combo/combo.index.vue'),
    'org.child.list': () => import('@/views/customer/org/child/child.index.vue'),
    'org.task.list': () => import('@/views/customer/org/task/task.index.vue'),
};