import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },

  // 接口需要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  // 总页码
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodList();
  },

  // 获取商品列表数据
  async getGoodList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // 获取商品数据的总条数
    const { total } = res;
    // 计算商品的总页数  Math.ceil 向上取整
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      // 拼接数组
      // goodsList: [...this.data.goodsList, ...res.goods]
      goodsList: this.data.goodsList.concat(res.goods)
    })
    // 成功请求结束以后关闭小程序下拉刷新
    wx.stopPullDownRefresh();
  },

  // 标题的点击事件
  handleTabsItemChange(e) {
    // 1 获取被点击item的索引
    const { index } = e.detail;
    // 2 修改原数据
    let { tabs } = this.data;
    // 修改被点击item的isActive
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  // 滚动调触底事件
  onReachBottom() {
    // 判断是否还有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '我是一个有底线的人',
        icon: 'none'
      });
    } else {
      // 如果还有下一页数据，请求下一页数据
      this.QueryParams.pagenum++;
      this.getGoodList();
    }
  },

  // 下拉刷新事件
  onPullDownRefresh() {
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1;
    // 重新发送请求
    this.getGoodList();
  }

})