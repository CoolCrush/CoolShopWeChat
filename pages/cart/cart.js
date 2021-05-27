/**
 * 1 获取用户的收货地址
 *  1 调用小程序内置api 获取用户的收货地址
 *  1 获取权限状态
 *  2 获取其权限状态 如果发现一些奇怪的属性名 需要使用[""]形式来获取值
 * 2 页面加载
 *  1 获取本地存储中的地址数据
 *  2 把数据 设置data中的一个变量
 * 3 全选的实现
 *  1 获取缓存中的购物车数组 如果所有商品被选中 checked=true 全选就被选中
 * 5 全选情况下的计算总价格
 */

// 导入对原生封装的js
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
} from "../../utils/asyncWx.js";
// 导入解决报错信息
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    // 缓存中购物车的数据
    cart: [],
    // 判断是否全选
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },

  // 添加地址的点击事件
  async handleChooseAddress() {
    try {
      // 1 获取权限状态
      const res1 = await getSetting();
      // 2 获取其权限状态 如果发现一些奇怪的属性名 需要使用[""]形式来获取值
      const scopeAddress = res1.authSetting["scope.address"];
      // 3 判断权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 4 调用获取收获地址的api
      let address = await chooseAddress();
      address.all =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo;
      wx.setStorageSync("address", address);
    } catch (error) {
      // 如果错误打印错误信息
      console.log(error);
    }
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
    const cart = wx.getStorageSync("cart") || [];

    this.setData({
      address,
    });
    this.setCart(cart);
  },
  handeItemChange(e) {
    // 1 获取被点击的商品ID
    let goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 获取被修改的商品对象
    let index = cart.findIndex((v) => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 设置购物车状态 重新计算
  setCart(cart) {
    let allChecked = true;
    // 循环计算总价 数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;

    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked,
    });
    wx.setStorageSync("cart", cart);
  },
  // 全选按钮的事件
  handleItemAllCheck() {
    // 1 获取data中的值
    let { cart, allChecked } = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组中的checked
    cart.forEach((v) => (v.checked = allChecked));
    // 4 穿回data 缓存中，重新计算
    this.setCart(cart);
  },
  // 商品数量的加减
  async handleItemNumEdit(e) {
    // 1 获取传过来的商品id 和 操作
    let { id, operation } = e.currentTarget.dataset;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到需要修改的索引
    let index = cart.findIndex((v) => v.goods_id === id);
    // 4 判断是否要执行 -1
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({ content: "您是否要删除商品" });
      if (res.confirm) {
        // 点击确认 从数组中移除
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4 修改商品数组的num
      cart[index].num += operation;
      // 5 穿回data 缓存中，重新计算
      this.setCart(cart);
    }
  },
  async handlePay() {
    // 1 获取数据
    const { address, totalNum } = this.data;
    // 判断收货地址
    if (!address.userName) {
      await showToast({ title: "请选择收获地址" });
      this.handleChooseAddress();
      return;
    }
    // 判断用户有没有选择商品
    if (totalNum === 0) {
      await showToast({ title: "请您想购买的商品" });
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/pay',
    });
  },
});
