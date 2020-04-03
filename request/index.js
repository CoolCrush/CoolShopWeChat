/* 专门处理请求,封装请求 */
// 为了首页同时请求，但是完成一次正在加载就关闭了
let ajaxTimes = 0;
export const request = (params) => {
    ajaxTimes++;
    // 显示加载中
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    // 定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    // 关闭 正在加载
                    wx.hideLoading();
                }
            }
        });
    })
}