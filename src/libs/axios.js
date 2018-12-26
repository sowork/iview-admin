import axios from 'axios';
import Cookies from 'js-cookie';
import { Message } from 'iview';
import util from './util';

let bear = Cookies.get('bear');

let ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});
if (bear) {
    ajax.defaults.headers.common['Authorization'] = 'Bearer ' + bear;
}

// Add a request interceptor
ajax.interceptors.request.use(function (config) {
    config.url = util.parseUrl(config.url);
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

let lastTime = '';
ajax.interceptors.response.use((response) => {
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
            if (lastTime === '') {
                lastTime = Date.parse(new Date());
                Message.error(response.data.msg);
            } else {
                let currentTime = Date.parse(new Date());
                if (currentTime - lastTime > 4) {
                    lastTime = Date.parse(new Date());
                    Message.error(response.data.msg);
                }
            }
            // Message.error(response.data.msg);
            throw err;
        } else if (response.data.code === '-2') {
            const err = new Error(response.data.msg);
            err.response = response;
            Message.error(response.data.data[0]);
            throw err;
        }
    }
    return response;
}, (error) => {
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
    } else {
        error.message = '服务器开小差了...';
    }
    if (lastTime === '') {
        lastTime = Date.parse(new Date());
        Message.error(error.message);
    } else {
        let currentTime = Date.parse(new Date());
        if (currentTime - lastTime > 4) {
            lastTime = Date.parse(new Date());
            Message.error(error.message);
        }
    }
    return Promise.reject(error);
});

export default ajax;
