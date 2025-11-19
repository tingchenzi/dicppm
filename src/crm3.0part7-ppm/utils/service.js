import http from './http'

const PPMService = {
    /**
     *
     * @param {*} param
     * @returns
     */
    async getAttrValueList(param) {
        let res = await http({
            url: `${process.env.VUE_APP_CTX_ORDER_QUERY}/qryAttrValueList`,
            // url: 'http://192.168.1.71:8085/order/query/qryAttrValueList',
            data: param,
            method: 'GET'
        });
        return res;
    },
    /**
     * 选址获取token
     * @param {*} param
     * @returns
     */
    async applyDcoosToken(param) {
        let res = await http({
            url: `${process.env.VUE_APP_CTX_ORDER_QUERY}/applyDcoosToken`,
            // url: 'http://192.168.1.83:8085/order-query/applyDcoosToken',
            // url: 'http://10.141.136.40:10000/order-query/applyDcoosToken',
            data: param,
            method: 'POST'
        });
        return res;
    },
    /**
  * gis选址
  * @param {*} param
  * @returns
  */
    async getGisInfo(param) {
        let res = await http({
            url: `${process.env.VUE_APP_CTX_ORDER_QUERY}/getGisInfo`,
            data: param,
            method: 'POST'
        });
        return res;
    },
    /**
     * 范围选址获取token
     * @param {*} param
     * @returns
     */
    async applyRdspToken(param) {
        let res = await http({
            url: `${process.env.VUE_APP_CTX_ORDER_QUERY}/applyRdspToken`,
            data: param,
            method: 'POST'
        });
        return res;
    },
}
export default PPMService
