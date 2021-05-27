// 导入对原生封装的js
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js";
// 导入解决报错信息
import regeneratorRuntime from "../../lib/runtime/runtime";
import { request } from "../../request/index.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    // 缓存中购物车的数据
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },

  // 每次打开都进行初始化
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 筛选数组中选中的商品
    cart = cart.filter(v => v.checked);
    // 循环计算总价 数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  // 点击支付
  async handleOrderPay() {
    try {
      // 1 判断缓存中是否存在token
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth'
        });
        return;
      }
      // 3 创建订单
      // 3.1 准备 请求头参数
      const header = { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo" };
      // 3.2 准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      let orderParams = { order_price, consignee_addr, goods };
      // 3.4 发起请求 获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "post", data: orderParams });

      // 获取 发送支付的参数
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "post", data: { order_number: order_number } });

      // 调用微信支付接口
      // wxappid 与服务器段 不符合
      // await requestPayment(pay);

      // 查询订单是否支付成功
      const res = await request({ url: "/my/orders/chkOrder", method: "post", data: { order_number } });
      console.log(res);

      await showToast({ title: "支付成功" });
      // 支付成功后删除缓存中的 已经支付了的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);
      // 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order?type=1'
      });
    } catch (error) {
      await showToast({ title: "支付失败" });
      console.log(error);
    }
  }
});
