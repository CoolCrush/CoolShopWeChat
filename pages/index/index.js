// 1.引入用来发送请求的代码,需要补全后缀
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    swiperList: [],
    // 导航数据
    catesList: [],
    // 楼层数据
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取轮播图数据
    this.getSwiperList();
    // 获取分类导航数据
    this.getCatesList();
    // 获取楼层数据
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },
  // 获取分类导航数据
  getCatesList() {
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  // 获取楼层导航数据
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  }
})