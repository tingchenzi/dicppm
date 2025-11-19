import axios from "axios";
//import { Message } from 'element-ui'
import cacheCookies from "@/utils/auth";
import store from '@/_MUlTIPAGES/orders/store'

// 利用拦截器
const service = axios.create();

// 请求拦截器
service.interceptors.request.use(
	(config) => {	
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
// 响应拦截器
service.interceptors.response.use(
	(response) => {		
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);
// 再次封装
export default async function request(options) {
	if (options.headers) {
		if (!options.headers["Content-Type"]) {
			options.headers["Content-Type"] = "application/json;charset:utf-8";
		}
	} else {
		options.headers = {
			"Content-Type": "application/json;charset:utf-8",
		};
	}

	if (!options.method) {
		options.method = "POST";
	}
	// if (options.url.indexOf("http") == -1) {
	// 	options.url = process.env.VUE_APP_BASE_URL + options.url;
	// }

	if (options.data instanceof Object) {
		options.type = "json";
		options.data.token = options.data.token ? options.data.token : cacheCookies.getToken();
	}
	// 处理请求参数的匹配
	if (options.method.toLowerCase() == "get" && !options.params) {
		options.params = options.data;
	}

	try {
		const response = await service(options);
		const {method,url,params} = response.config
		if(method==='get'&& url.includes('qryAttrValueList')){
			store.commit('http/setQryAttrValueList',params)
		}
		return response.data;
	} catch (err) {
		return {
			status: -1,
			data: err.message,
		};
	}
}
