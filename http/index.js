const axios = require('axios');
const { loginOptions, hostUrl } = require('./../config');
const { isLogin, loginWrite } = require('./../utils');

const DEFAULT_API_TYPE = 'get';

const getAjaxConfig = (config = {}) => {
    const { api, path, data, headers, responseType } = config;
    const type = api.type || DEFAULT_API_TYPE;
    let url = hostUrl + api.url;

    if (path) Object.entries(path).forEach(([key, value]) => {
        url = url.replace(':' + key, value)
    })

    const ajaxConfig = {
        url,
        method: type,
        responseType
    }

    if (data) {
        if (type === DEFAULT_API_TYPE) {
            ajaxConfig.params = data;
        } else {
            ajaxConfig.data = data;
        }
    }

    if (headers) ajaxConfig.headers = headers;
    
    return ajaxConfig
}

const ajax = config => {
    const ajaxConfig = getAjaxConfig(config);
    return new Promise((resolve, reject) => {
        axios(ajaxConfig)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    })
}

const loginApi = obj => {
    return ajax(obj)
        .then(res => {
            if (res.success) {
                loginWrite(res.data);
                return res.data
            } else {
                throw res.message
            }
        })
        .catch(err => console.log(err))
}

const addUserToken = (config, loginInfo) => {
    const user = JSON.parse(loginInfo().toString())
    config.headers = {
        token: user.token
    }
}

const http = async config => {
    const getLogin = await isLogin();

    if (getLogin) {
        addUserToken(config, getLogin);
        return ajax(config)
    } else {
        loginApi(loginOptions)
    }
}

module.exports = {
    loginApi,
    http
}