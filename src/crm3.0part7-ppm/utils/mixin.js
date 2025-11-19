export default {
	computed: {
		/**
		 * 获取处理后的名称
		 */
		title() {
			return (structName, mark) => {
				if (!structName) return "";
				let idx = structName.indexOf(mark);
				if (idx !== -1) return (structName.split(mark))[1];
				return structName;
			};
		},

		/**
		 * 是否开启标题
		 */
		onoff() {
			return (structName, mark) => {
				if (!structName) return true;
				let array = structName.split(mark);
				if (array.length === 1) return true;
				else return false;
			};
		},
	},
};
