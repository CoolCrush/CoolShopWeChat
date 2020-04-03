/**
 * 1 获取用户的收货地址
 *  1 调用小程序内置api 获取用户的收货地址
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 添加地址的点击事件
  handleChooseAddress() {
    // 1 获取权限状态
    wx.getSetting({
      success: (result) => {
        console.log(result);
        // 2 获取其权限状态 如果发现一些奇怪的属性名 需要使用[""]形式来获取值
        const scopeAddress = result.authSetting["scope.address"];
        if(scopeAddress===true||scopeAddress===undefined){
          wx.chooseAddress({
            success: (result1)=>{
              console.log(result1);
            }
          });
        }else{
          // 3 如果用户之前拒绝过授权权限，先引导用户打开授权页面
          wx.openSetting({
            success: (result)=>{
              wx.chooseAddress({
                success: (result1)=>{
                  console.log(result1);
                }
              });
            }
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})