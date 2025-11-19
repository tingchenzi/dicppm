/**
 * 自定义指令集合
 */

/**
 * v-fold 折叠指令
 * 用法: <div v-fold="isExpanded"><div data-ctrl="1">内容</div></div>
 */
const fold = {
  bind: (el, binding) => {
    foldFn(el, binding)
  },
  inserted: (el, binding) => {
    foldFn(el, binding)
  },
  update: (el, binding) => {
    foldFn(el, binding)
  },
  componentUpdated: () => {},
  unbind: () => {}
}

/**
 * v-prevent-re-click 防止重复点击指令
 * 用法: <button v-prevent-re-click="handleClick">按钮</button>
 * 或: <button v-prevent-re-click="[handleClick, params, 1000]">按钮</button>
 */
const preventReClick = {
  bind: function (el, binding) {
    el.pvalue = binding.value
    let timer
    el.handler = function () {
      let fn, param = [], time = 500
      if (Array.isArray(el.pvalue)) {
        [fn, param = [], time = 500] = el.pvalue
      } else {
        // 单独传一个方法时
        fn = el.pvalue
        param = []
        time = 500
      }
      if (!Array.isArray(param)) param = [param]
      timer && clearTimeout(timer)
      let callNow = !timer // 是否立即执行
      timer = setTimeout(() => {
        timer = null
      }, time)
      if (callNow) fn.apply(null, [...param])
    }
    el.addEventListener('click', el.handler)
  },
  update: function (el, binding) {
    el.pvalue = binding.value
  },
  unbind: function (el) {
    el.removeEventListener('click', el.handler)
  }
}

/**
 * v-debounce 防抖指令
 * 用法: <button v-debounce="2000" @click="handleClick">按钮</button>
 */
const debounce = {
  bind: function (el, binding) {
    let wait = binding.value
    if (!wait) {
      // 用户若不设置防抖时间，则默认2s
      wait = 2000
    }
    let timer
    el.addEventListener('click', event => {
      if (!timer) {
        // 第一次执行: 不阻止click
        timer = setTimeout(() => {
          timer = null
        }, wait)
      } else {
        clearTimeout(timer)
        timer = setTimeout(() => {
          timer = null
        }, wait)
        event && event.stopImmediatePropagation()
      }
    }, true)
  }
}

// 辅助函数
function getChildrens(ele, list) {
  var children = ele.children
  for (var i = 0; i < children.length; i++) {
    var child = children[i]
    if (child.dataset.ctrl == 1) {
      list.push(child)
    }
    getChildrens(child, list)
  }
}

function foldFn(el, binding) {
  let list = []
  getChildrens(el, list)
  list.forEach((node) => {
    if (binding.value) {
      node.style = 'display:block'
    } else {
      node.style = 'display:none'
    }
  })
}

export default {
  fold,
  preventReClick,
  debounce
}
