import axios from 'axios';
import Cookies from 'js-cookie';
import env from '../../build/env';
import { Message } from 'iview';

const apiDomain = {
    'development': {
        'host': 'http://127.0.0.1',
        'host_api': 'http://127.0.0.1/api',
        'host_v1': 'http://127.0.0.1/api/v1'
    },
    'production': {
        'host': 'http://192.168.1.21:8803',
        'host_api': 'http://192.168.1.21:8803/api',
        'host_v1': 'http://192.168.1.21:8803/api/v1'
    }
};

let bear = Cookies.get('bear');

let ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

if (bear) {
    ajax.defaults.headers.common['Authorization'] = 'Bearer ' + bear;
}

function parseUrl (url) {
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

// Add a request interceptor
ajax.interceptors.request.use(function (config) {
    config.url = parseUrl(config.url);
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

ajax.interceptors.response.use(function (response) {
    if (response.data.access_token) {
        Cookies.set('bear', response.data.access_token);
        Cookies.set('refresh_bear', response.data.refresh_token);
        Cookies.set('expires_in', response.data.expires_in);

        ajax.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
    }
    if (response.data.code !== undefined) {
        if (response.data.code === '-1') {
            const err = new Error(response.data.msg);
            err.response = response;
            Message.error(response.data.msg);
            throw err;
        } else if (response.data.code === '-2') {
            const err = new Error(response.data.msg);
            err.response = response;
            Message.error(response.data.data[0]);
            throw err;
        }
    }
    return response;
}, function (error) {
    // Do something with response error
    if (error.response) {
        switch (error.response.status) {
            case 400:
                error.message = '请求错误';
                break;

            case 401:
                error.message = '未授权，请登录';
                break;

            case 403:
                error.message = '权限不足，拒绝访问';
                break;

            case 404:
                error.message = `请求地址出错: ${error.response.config.url}`;
                break;

            case 408:
                error.message = '请求超时';
                break;

            case 500:
                error.message = '服务器内部错误';
                break;

            case 501:
                error.message = '服务未实现';
                break;

            case 502:
                error.message = '网关错误';
                break;

            case 503:
                error.message = '服务不可用';
                break;

            case 504:
                error.message = '网关超时';
                break;

            case 505:
                error.message = 'HTTP版本不受支持';
                break;

            default:
        }
    }
    Message.error(error.message);
    return Promise.reject(error);
});

export default ajax;
