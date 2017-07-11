import axios from 'axios'

// axios 配置
// axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://125.69.67.12:7080/hisapi';

//POST传参序列化
// axios.interceptors.request.use((config) => {
//     store.commit('maskShow',true)
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

// //返回状态判断
// axios.interceptors.response.use((res) => {
//     store.commit('maskShow',false)
//     return res;
// }, (error) => {
//     return Promise.reject(error);
// });

export function fetch(url, params, config) {
    if (window.wdphisJsObject) {
        let res = wdphisJsObject.wdphis.httppost(url, JSON.stringify(params));
        res = JSON.parse(res);
        return new Promise((resolve, reject) => {
            resolve(res);
            reject(res)
        })
    }
    if (!config) {
        config = {};
    }
    if (!config.timeout) {
        config.timeout = 5000;
    }

    var personInfo = {
        "jgid": "70",
        "czryid": "178",
        "czryxm": "周勇",
        "czryksid": "120",
        "czryksmc": "中医科",
        "loginname": "zhouyong",
    }
    params = Object.assign(params, personInfo);
    return new Promise((resolve, reject) => {
        axios({
                method: 'post',
                url: url,
                params: {
                    data: JSON.stringify(params)
                },
                config: config
            })
            .then(function(response) {
                resolve(response.data);
            }).catch(function(error) {
                reject(error)
            });
    })
}

export default {
    /**
     * 获取机构列表
     */
    getJGList(params, config) {
            return fetch('/rest/queryDataBySql/000202/1', params)
        },
        /**
         * 获取部门列表
         */
        getBMList(params, config) {
            return fetch('/rest/queryDataBySql/000204/1', params)
        },
        /**
         * 获取部门子列表
         */
        getBMNodeList(params, config) {
            return fetch('/rest/queryDataBySql/000204/2', params)
        },
        /**
         * 获取部门列表
         */
        getActicle(params, config) {
            return fetch('/rest/queryDataBySql/080104/1', params)
        },
        /**
         * 保存
         */
        saveActicle(params, config) {
            return fetch('/rest/commitData/080104/1', params)
        },
}
