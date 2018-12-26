/**
 * 配置后台访问接口host地址
 * @type {{development: {host: string, host_api: string, host_v1: string}, production: {host: string, host_api: string, host_v1: string}}}
 */
export const apiDomain = {
    'development': {
        // 'host': 'http://127.0.0.1',
        // 'host_api': 'http://127.0.0.1/api',
        // 'host_v1': 'http://127.0.0.1/api/v1'
        'auth_host': 'http://auth.yun.test',
        'auth_host_api': 'http://auth.yun.test/api',
        'auth_host_v1': 'http://auth.yun.test/api/v1',
        'school_host': 'http://app.yun.test',
        'school_host_api': 'http://app.yun.test/api',
        'school_host_v1': 'http://app.yun.test/api/v1',
        'base_host': 'http://base.yun.test',
        'base_host_api': 'http://base.yun.test/api',
        'base_host_v1': 'http://base.yun.test/api/v1'
    },
    'ceshi': {
        // 'host': 'http://192.168.1.21:8803',
        // 'host_api': 'http://192.168.1.21:8803/api',
        // 'host_v1': 'http://192.168.1.21:8803/api/v1'
        'auth_host': 'http://192.168.1.21:8006',
        'auth_host_api': 'http://192.168.1.21:8006/api',
        'auth_host_v1': 'http://192.168.1.21:8006/api/v1',
        'school_host': 'http://192.168.1.23:8007',
        'school_host_api': 'http://192.168.1.23:8007/api',
        'school_host_v1': 'http://192.168.1.23:8007/api/v1',
        'base_host': 'http://192.168.1.23:8008',
        'base_host_api': 'http://192.168.1.23:8008/api',
        'base_host_v1': 'http://192.168.1.23:8008/api/v1'
    },
    'production': {
        // 'host': 'http://192.168.1.21:8803',
        // 'host_api': 'http://192.168.1.21:8803/api',
        // 'host_v1': 'http://192.168.1.21:8803/api/v1'
        'auth_host': 'http://auth.21thedu.com/',
        'auth_host_api': 'http://auth.21thedu.com/api',
        'auth_host_v1': 'http://auth.21thedu.com/api/v1',
        'school_host': 'http://agent.21thedu.com/',
        'school_host_api': 'http://agent.21thedu.com/api',
        'school_host_v1': 'http://agent.21thedu.com/api/v1',
        'base_host': 'http://family.21thedu.com/',
        'base_host_api': 'http://family.21thedu.com/api',
        'base_host_v1': 'http://family.21thedu.com/api/v1'
    }
};
