const requireContext = require.context("../../crm3.0part7-ppm", true, /\.vue$/);
const install = (Vue) => {
	Vue.directive("fold", {
		bind: (el, binding) => {
			foldFn(el, binding);
		},
		inserted: (el, binding) => {
			foldFn(el, binding);
		},
		update: (el, binding) => {
			foldFn(el, binding);
		},
		componentUpdated: () => {

		},
		unbind: () => {

		}
	});
	Vue.directive('preventReClick', {
		bind: function (el, binding) {

		  el.pvalue = binding.value;
		  let timer
		  el.handler = function () {
			let fn,param=[],time=500;
			if(Array.isArray(el.pvalue)){
			  [fn,param=[],time=500] = el.pvalue;
			}else{
			  // 单独传一个方法时
			  fn = el.pvalue;
			  param = [];
			  time = 500;
			}
			if(!Array.isArray(param)) param=[param]
			timer && clearTimeout(timer)
			let callNow = !timer;    //是否立即执行
			timer = setTimeout(() => {
			  timer = null;
			},time)
			if(callNow) fn.apply(null,[...param])
		  }
		  el.addEventListener('click', el.handler)
		},
		update: function(el,binding,vnode,oldVnode){
		  el.pvalue = binding.value;
		},
		unbind: function (el, binding) {
		  el.removeEventListener('click',el.handler);
		}
	});

	Vue.directive('debounce', {
		// 指令第一次绑定到元素时
		// eslint-disable-next-line no-unused-vars
		bind: function(el, binding, vnode) {
			let wait = binding.value; // 防抖时间
			if (!wait) { // 用户若不设置防抖时间，则默认2s
				wait = 2000;
			}
			let timer;
			el.addEventListener('click', event => {
				if (!timer) { // 第一次执行: 不阻止click⌚️
					timer = setTimeout(() => {
						timer = null;
					}, wait);
				} else {
					clearTimeout(timer)
					timer = setTimeout(() => {
						timer = null;
					}, wait);
					event && event.stopImmediatePropagation();
				}
			}, true);
		}
	})

	requireContext.keys().forEach((filename) => {
		var name = filename
			.split("/")
			.pop()
			.replace(/\.\w+$/, "");
		if (name !== "index" && filename.split("/")[1] !== "core") return;
		const componentConfig = requireContext(filename);
		Vue.component(componentConfig.default.name || componentConfig.name, componentConfig.default || componentConfig);
	});
};
export default install;
function getChildrens(ele, list) {
	var children = ele.children;
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (child.dataset.ctrl == 1) {
			list.push(child);
		}
		getChildrens(child, list);
	}
}

function foldFn(el, binding) {
	let list = [];
	getChildrens(el, list);
	list.forEach((node) => {
		if (binding.value) {
			node.style = "display:block";
		} else {
			node.style = "display:none";
		}
	});
}
