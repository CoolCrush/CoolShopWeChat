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
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "代发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      },
    ],
    orders: []
  },
  // 标题的点击事件
  handleTabsItemChange(e) {
    // 1 获取被点击item的索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求获取数据
    this.getOrders(index + 1);
  },
  onShow() {
    let curPages = getCurrentPages();
    let { type } = curPages[curPages.length - 1].options;
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  },
  // 修改头部标题的选中
  changeTitleByIndex(index) {
    // 2 修改原数据
    let { tabs } = this.data;
    // 修改被点击item的isActive
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const { orders } = await request({ url: "/my/orders/all", data: { type } });
    console.log(orders);
    this.setData({
      orders: orders.map(v => ({ ...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
    })
  }
})