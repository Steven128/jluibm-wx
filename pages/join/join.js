var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/WxValidate.js';
var Validate = ""
Page({
  data: {
    array: ["大一", "大二", "大三", "大四"],
    languages: [
      { name: 'cpp', value: 'C/C++' },
      { name: 'algorithm', value: '算法' },
      { name: 'web', value: 'Web开发' },
      { name: 'linux', value: 'Linux' },
      { name: 'java', value: 'Java' }
    ],
    userNumber:'',
    index: 0,
    submitSuccess: false,
    showErrorMsg: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数  
    const rules = {
      name: {
        required: true,
        chinese: true,
      },
      number: {
        required: true,
        digits: true,
        rangelength: [8, 8]
      },
      college: {
        required: true,
        chinese: true
      },
      major: {
        required: true,
        chinese: true
      },
      qq: {
        required: true,
        digits: true,
        rangelength: [5, 12]
      },
      phone: {
        required: true,
        tel: true
      },
      languages: {
        required: true,
      }
    }
    // 验证字段的提示信息
    const messages = {
      name: {
        required: '请输入姓名',
        chinese: '请输入正确的姓名'
      },
      number: {
        required: '请输入学号',
        digits: '学号只能为数字',
        rangelength: '学号应为8位',
      },
      college: {
        required: '请输入学院',
        chinese: '请输入正确的学院名称'
      },
      major: {
        required: '请输入专业',
        chinese: '请输入正确的专业名称'
      },
      qq: {
        required: '请输入QQ号码',
        digits: 'QQ号码应为数字',
        rangelength: '请输入正确的QQ号码',
      },
      phone: {
        required: '请输入电话号码',
        tel: '请输入正确的电话号码'
      },
      languages: {
        required: '请至少选择一项学习方向',
      }
    }
    Validate = new WxValidate(rules, messages)  
  },
  onReady: function () {
    // 页面渲染完成  
  },
  onShow: function () {
    // 页面显示  
  },
  onHide: function () {
    // 页面隐藏  
  },
  onUnload: function () {
    // 页面关闭  
  },
  formSubmit: function (e) {
    var that=this;
    const params = e.detail.value
    // 传入表单数据，调用验证方法  
    if (!Validate.checkForm(e)) {
      const error = Validate.errorList;
      //提示信息  
      console.log(error);
     this.setData({
       showErrorMsg:error[0].msg,
      });
      return false
    }  
    this.setData({
      showErrorMsg: '',
    });
    console.log(e);
    var submitTime = util.formatTime(new Date());
    wx.showModal({
      title: '提示',
      content: '确认要提交吗？',
      showCancel: 'true',
      success: function (res) {
        //
        console.log(res.confirm);
        if (res.confirm) {
          that.data.sure = true;
          console.log('wx.request');
          that.setData({
            userNumber: e.detail.value.number
          });
          wx.request({
            url: 'https://www.jluibm.cn/jluibm-wx/form.php',
            method: "POST",
            data: {
              request: 'check',
              number:e.detail.value.number,
            },
            header: {
              'content-Type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              console.log('success');
              console.log(res.data);
              if(res.data=="has joined"){
                wx.showModal({
                  title: '提示',
                  content: '你已经成员了，不需要重复报名了！',
                  showCancel: 'false',
                });
              }
              else if (res.data == "not found") {
                app.globalData.formData = e.detail.value;
                wx.navigateTo({
                  url: '/pages/password/password'
                });
              }
              that.data.submitSuccess = true;
            },
            fail: function (err) {
              console.log(err);
              that.data.submitSuccess = false;
              wx.showToast({
                title: '出错啦\n再试一次吧',
                icon: 'loading',
                duration: 2000,
                mask: true
              })
            }
          });
        }
        if (res.cancel) {
          console.log('cancel toast');
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 1500,
            mask:true
          })
        }
      },
      fail: function (err) {
        console.log('cancel button');
        console.log(err);
      }
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

})