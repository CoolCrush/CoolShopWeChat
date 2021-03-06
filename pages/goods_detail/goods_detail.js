/**
 * 1 发送请求 获取商品的详情
 * 2 点击轮播图 预览大图
 *  1 给轮播图绑定点击事件
 *  2 调用小程序API previewImage
 * 3 点击加入购物车
 *  1
 */
import { showToast } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },

  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    var curPages = getCurrentPages();
    let currentPage = curPages[curPages.length - 1];
    console.log(currentPage);
    let { options } = currentPage;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: { goods_id },
    });
    this.GoodsInfo = goodsObj;
    // 1 获取缓存中商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        pics: goodsObj.pics,
        // iphone部分机型不支持 .webp图片格式
        // 临时修改后缀，正则表达式临时替换
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, ".jpg"),
      },
      isCollect
    });
  },

  // 点击轮播图放大预览
  handlePreviewImage(e) {
    const urls = this.data.goodsObj.pics.map((v) => v.pics_mid_url);
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      current: urls[index],
      urls: urls,
    });
  },

  // 点击加入购物车
  handleCartAdd() {
    // 1 获取缓存中的购物车数组
    //  1 第一次获取为空字符串，转换为数组
    let cart = wx.getStorageSync("cart") || [];
    // 2 判断商品对象是否存在与购物车
    let index = cart.findIndex((v) => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 3 表示第一次添加不存在
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 4 已经存在该商品数据，只执行num++
      cart[index].num++;
    }
    // 5 把购物车重新覆盖到缓存中
    wx.setStorageSync("cart", cart);
    // 6 弹窗提示
    wx.showToast({
      title: "添加成功",
      icon: "success",
      mask: true,
    });
  },
  // 点击收藏图标
  async handleCollect() {
    let isCollect = this.data.isCollect;
    // 1 获取缓存中的商品收藏
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断刚商品是否被收藏
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3 当index不为-1 表示已经收藏
    if (index !== -1) {
      collect.splice(index, 1);
      await showToast({"title":"取消收藏"});
    } else {
      await showToast({"title":"收藏成功"});
      collect.push(this.GoodsInfo);
    }
    // 4 把数组存入缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改页面的收藏
    this.setData({
      isCollect: !isCollect
    })
  }
});
