var app = getApp();
import WxValidate from '../../utils/WxValidate.js';
var md5 = require('../../utils/md5');
var Validate = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showErrorMsg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const rules = {
      number: {
        required: true,
        digits: true,
        rangelength: [8, 8]
      },
      password: {
        required: true,
      },
    }
    // 验证字段的提示信息，若不传则调用默认的信息  
    const messages = {
      number: {
        required: '请输入学号',
        digits: '学号只能为数字',
        rangelength: '学号应为8位',
      },
      password: {
        required: '请输入学院',
      },
    }
    Validate = new WxValidate(rules, messages)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formSubmit: function (e) {
    var that = this;
    const params = e.detail.value
    // 传入表单数据，调用验证方法  
    if (!Validate.checkForm(e)) {
      const error = Validate.errorList;
      //提示信息  
      console.log(error);
      this.setData({
        showErrorMsg: error[0].msg,
      });
      return false
    }
    this.setData({
      showErrorMsg: '',
    });
    var formData = e.detail.value;
    var info_Name = formData.name;
    if (info_Name == null || info_Name == '') {
    }
    that.data.sure = true;
    console.log('wx.request');
    var password = 'JLUIBMclub' + e.detail.value.number + e.detail.value.password;
    password = md5.hex_md5(password);
    console.log(password);
    wx.request({
      url: 'https://www.jluibm.cn/jluibm-wx/login.php',
      method: "POST",
      data: {
        number: e.detail.value.number,
        password: password
      },
      header: {
        'content-Type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log('success');
        console.log(res.data);
        if (res.data == "wrong passwd") {
          that.setData({
            showErrorMsg:'学号或密码输入错误！'
          })
        }
        else {
          console.log('success toast');
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500,
            mask: true
          });
          app.globalData.isSigned=true;
          app.globalData.PHPSESSID=res.data.PHPSESSID;
          app.globalData.userNumber=res.data.number;
          wx.setStorage({
            key: "PHPSESSID",
            data: app.globalData.PHPSESSID
          })  
          wx.setStorage({
            key: "userNumber",
            data: res.data.number
          })
          wx.navigateBack({
            url: '/pages/index/index',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad(); 
            }
          });
        }
        that.data.submitSuccess = true;

      },
      error:function(err){
        wx.showToast({
          title: '咦，出错啦！',
          icon: 'loading',
          duration: 1500,
          mask: true
        });
      },
  });
  },
  joinus: function(){
    console.log("navigate to joinus");
    wx.switchTab({
      url: '../join/join'
    });
  }

})