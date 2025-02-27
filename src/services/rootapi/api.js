const baseUrl = process.env.VUE_APP_API_BASE_URL;
//后端服务接口根地址（线下接口请求地址），这里可以理解为 
// const baseUrl = 'http://192.168.1.171/apib';
const editorUrl = process.env.VUE_APP_API_EDITOR_URL;  //编辑器接口地址

const articleApi = `${baseUrl}/api-atricle`  //文章接口
const videoApi = `${baseUrl}/api-video`  //视频接口
const liveApi = `${baseUrl}/api-live`  //直播接口

export {
    baseUrl,
    editorUrl,
    articleApi,
    videoApi,
    liveApi,
}
