import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消按钮的是否显示
    isShow: false,
    // 输入框的值
    inputValue: ""
  },

  TimeId: -1,

  // 输入框的值改变
  handleInput(e) {
    // 1 获取输入的值
    const { value } = e.detail;
    // 2 合法性验证
    if (!value.trim()) {
      this.TimeId = setTimeout(() => {
        this.setData({
          goods: [],
          isShow: false
        })
      }, 1000);
      return;
    }
    this.setData({
      isShow: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      // 3 发送请求
      this.getSearchList(value);
    }, 1000);
  },

  async getSearchList(query) {
    const goods = await request({ url: "/goods/qsearch", data: { query } });
    this.setData({
      goods
    })
  },

  // 点击取消
  handleCancel() {
    this.setData({
      inputValue: "",
      isShow: false,
      goods: []
    })
  }
})