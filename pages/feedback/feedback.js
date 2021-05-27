
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片的数组
    chooseImgs: [],
    textVal: ""
  },
  // 上传以后 外网的图片数组
  UpLoadImgs: [],
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

  // 添加图片的点击事件
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 把图片数组进行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      },
      fail: () => { },
      complete: () => { }
    });
  },

  // 点击自定义组件图片
  handleRemoveImg(e) {
    // 获取点击的索引
    const { index } = e.currentTarget.dataset;
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 删除索引
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },

  // 文本域的输入事件
  handleTextInput(e) {
    // 获取文本域中的value
    this.setData({
      textVal: e.detail.value
    })
  },

  // 点击提交按钮
  handleFormSubmit() {
    // 1 获取文本域的内容
    const { textVal, chooseImgs } = this.data;
    if (!textVal.trim()) {
      wx.showToast({
        title: '请输入您的意见',
        icon: 'none',
        mask: true,
      });
      return;
    }
    // 等待
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    // 判断需不需要上传图片
    if (chooseImgs.length !== 0) {
      // 循环发送请求
      chooseImgs.forEach((v, i) => {
        // 2 提交图片
        wx.uploadFile({
          // 上传的路径
          url: 'https://img.coolcr.cn/api/upload',
          // 被上传的文件的路径
          filePath: v,
          name: "image",
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data);
            this.UpLoadImgs.push(url);
            console.log(this.UpLoadImgs);
            // 所有图片都已经上传完毕才会触发
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              // 提交成功
              wx.showToast({
                title: '提交成功',
                icon: 'none'
              });
              this.setData({
                textVal: "",
                chooseImgs: [],
                UpLoadImgs: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      });
    }else{
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'none'
      });
      this.setData({
        textVal: "",
        chooseImgs: [],
        UpLoadImgs: []
      })
      // 返回上一个页面
      wx.navigateBack({
        delta: 1
      });
    }

  }
})