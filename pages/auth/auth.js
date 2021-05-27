import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from '../../utils/asyncWx.js'

Page({
  async handleGetUserInfo(e) {
    // 1 获取用户登录信息
    const { encryptedData, rawData, iv, signature } = e.detail;
    const { code } = await login();
    const loginParams = { encryptedData, rawData, iv, signature, code };
    // const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
    wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
    // 返回几层
    wx.navigateBack({
      delta: 1
    });
  }
})