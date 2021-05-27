// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    collectNum: 0
  },
  onShow() {
    const userInfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      userInfo,
      collectNum: collect.length
    })
  },
  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  }
})