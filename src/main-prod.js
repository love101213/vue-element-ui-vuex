import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 引入进度条
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// 轮播图
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)
    // axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
    // axios请求拦截器 config请求对象那个 里面有headers  展示进度条  NProgress.start()
axios.interceptors.request.use(function(config) {
        NProgress.start()
        config.headers.Authorization = window.sessionStorage.getItem('token')
        console.log(config)
        return config
    }, function(error) {
        console.log(error)
    })
    // 在 response 隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
    // 格式化时间的全局过滤器
Vue.filter('dateFormate', function(originVal) {
        const dt = new Date(originVal * 1000)
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1 + '').padStart(2, '0')
        const d = (dt.getDate() + '').padStart(2, '0')
        const hh = (dt.getHours() + '').padStart(2, '0')
        const mm = (dt.getMinutes() + '').padStart(2, '0')
        const ss = (dt.getSeconds() + '').padStart(2, '0')
        return ` ${y}-${m}-${d} ${hh}:${mm}:${ss}`
    })
    // 富文本 编辑器
import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')