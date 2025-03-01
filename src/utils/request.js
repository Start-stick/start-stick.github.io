import axios from 'axios'

//自制智能体
const app_id='1895304167887695872'
const baseURL =`https://open.bigmodel.cn/api/llm-application/open`
//deepSeek API
// const baseURL = 'https://api.deepseek.com'
const apiKey ='49613b99603942908e202474f204ead5.LYg0QJKY8Mkr6rjv'

//智能体
const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
}

const instance = axios.create({
    baseURL,
    apiKey,
    // timeout: 100000
    transformResponse: [function (data, headers) {
        // 如果是SSE响应，直接返回原始数据
        if (headers['content-type']?.includes('text/event-stream')) {
            return data
        }
        // 其他情况保持默认处理
        try {
            return JSON.parse(data)
        } catch (e) {
            return data
        }
    }]
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers = headers

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default instance