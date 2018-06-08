var app = getApp()

var util = require('../../utils/util.js');
import WxValidate from '../../utils/WxValidate.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_enroll_id:'',
    tipsNumber:1        // 提示选择是否为IBM俱乐部的成员时的弹窗次数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
     wx.request({
      url:'https://www.jluibm.cn/jluibm-wx/check-enroll.php?request=getActiveList',
       method: "GET",
        data:{
        activity_enroll_id:''
       },

        header:{
        "content-type":"json"
        },

        success: function (res) {
          console.log(res)
            if(res.data=='')
            {
              wx.showModal({
                title: '提示',
                content: '目前没有可报名的活动哟！',
                showCancel: 'true',
                success: function ()
                {
                  wx.navigateTo({
                    url: '/pages/activities/activities'
                  });
                },
              });
            }
        

        that.setData({
          activity: res.data,
         })
        
         console.log(that.data.activity[0].enroll_id) 

        },

        fail: function () {
        // 请求失败时候被调用，如网络问题，可以做一个弹窗在这里
          wx.showModal({
            title: '提示',
              content: '网络出小差了哦~',
                showCancel: 'false',
                  success: function () { },
          });
        },

        complete: function () {

        },
      })
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


  enroll0: function () {
    var that = this;
    var isLogged = false;
    if (app.globalData.userNumber != '') {
      isLogged = true;
    }
    //是否已登录
    if (!isLogged) {
      wx.showModal({
        title: '提示',
        content: '先登录（其他社团填写信息）才能报名哟！',
        showCancel: 'false',
        success: function (res) {
          if (res.confirm) {
            //用户点击确定，跳转到登录页面
            app.globalData.enroll_ID = that.data.activity[0].enroll_id;
            wx.navigateTo({
              url: '../enroll_signin/enroll_signin',
            })
          }
        }
      });
    }
    else {
      var getsubmitTime0 = util.formatTime(new Date());
      var getsubmitTime1 = getsubmitTime0.replace('/', '-');
      var new_getsubmitTime = getsubmitTime1.replace('/', '-');
      var that = this;
      var getNumber = app.globalData.userNumber;
      var getname = '';
      var getcollege = '';
      var getgender = '';
      var getgrade = '';
      var getqq = '';
      wx.request({
        url: 'https://www.jluibm.cn/jluibm-wx/user-info.php?number=' + getNumber,
        method: "GET",

        header: {
          'content-Type': 'application/json',
          'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
        },
        success: function (res) {

          getname = res.data.name;
          getcollege = res.data.college;
          getgender = res.data.gender;
          getgrade = res.data.grade;
          getqq = res.data.qq;
        }
      })


      wx.request({
        url: 'https://www.jluibm.cn/jluibm-wx/enroll.php',
        method: "POST",

        data: {
          request: 'submit',
          enroll_id: that.data.activity[0].enroll_id,
          submitTime: new_getsubmitTime,
          name: getname,
          number: getNumber,
          college: getcollege,
          gender: getgender,
          grade: getgrade,
          qq: getqq,
          comeFrom: "IBM俱乐部"
        },



        header: {
          "content-type": "application/x-www-form-urlencoded"
        },

        success: function (e) {

          console.log(e)
          if(e.data=='')
          {
            wx.showModal({
              title: '提示',
              content: '报名成功！',
              showCancel: 'false',
              success: function () { },
            });
            //检测重复报名
            /*wx.request({
              url: 'https://www.jluibm.cn/jluibm-wx/check-enroll.php?request=checkAlready&{}',
              method: "GET",
              data: {
                enroll_id: that.data.activity[0].enroll_id, 
                number: e.detail.value.number
              },
              header: {
                'content-Type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function (res) {
                console.log(res)
                if (res.data.message == "has_enrolled") {
                  wx.showModal({ title: '提示', content: '你已经报名成功了，不需要重复报名了！', showCancel: 'false' });
                }
                else if (res.data.message == "not-allowed") {
                  wx.showModal({ title: '提示', content: '人数已满，下次手快些哦！', showCancel: 'false' });
                }
            }
          })*/
          }
        },

        fail: function () {
          // 请求失败时候被调用，如网络问题，可以做一个弹窗在这里
          console.log("失败")
        },

        complete: function () {

        },
      });
    }
   
  },





  enroll1: function () {
    var that = this;
    var isLogged = false;
    if (app.globalData.userNumber != '') {
      isLogged = true;
    }
    //是否已登录
    if (!isLogged) {
      wx.showModal({
        title: '提示',
        content: '先登录（其他社团填写信息）才能报名哟！',
        showCancel: 'false',
        success: function (res) {
          if (res.confirm) {
            //用户点击确定，跳转到登录页面
            app.globalData.enroll_ID = that.data.activity[1].enroll_id;
            wx.navigateTo({
              url: '../enroll_signin/enroll_signin',
            })
          }
        }
      });
    }
    else {
      var getsubmitTime0 = util.formatTime(new Date());
      var getsubmitTime1 = getsubmitTime0.replace('/', '-');
      var new_getsubmitTime = getsubmitTime1.replace('/', '-');
      var that = this;
      var getNumber = app.globalData.userNumber;
      var getname = '';
      var getcollege = '';
      var getgender = '';
      var getgrade = '';
      var getqq = '';
      wx.request({
        url: 'https://www.jluibm.cn/jluibm-wx/user-info.php?number=' + getNumber,
        method: "GET",

        header: {
          'content-Type': 'application/json',
          'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
        },
        success: function (res) {

          getname = res.data.name;
          getcollege = res.data.college;
          getgender = res.data.gender;
          getgrade = res.data.grade;
          getqq = res.data.qq;
        }
      })


      wx.request({
        url: 'https://www.jluibm.cn/jluibm-wx/enroll.php',
        method: "POST",

        data: {
          request: 'submit',
          enroll_id: that.data.activity[1].enroll_id,
          submitTime: new_getsubmitTime,
          name: getname,
          number: getNumber,
          college: getcollege,
          gender: getgender,
          grade: getgrade,
          qq: getqq,
          comeFrom: "IBM俱乐部"
        },



        header: {
          "content-type": "application/x-www-form-urlencoded"
        },

        success: function (e) {

          console.log(e)
          if (e.data == '') {
            wx.showModal({
              title: '提示',
              content: '报名成功！',
              showCancel: 'false',
              success: function () { },
            });
            //检测重复报名
            /*wx.request({
              url: 'https://www.jluibm.cn/jluibm-wx/check-enroll.php?request=checkAlready&{}',
              method: "GET",
              data: {
                enroll_id: that.data.activity[1].enroll_id, 
                number: e.detail.value.number
              },
              header: {
                'content-Type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function (res) {
                console.log(res)
                if (res.data.message == "has_enrolled") {
                  wx.showModal({ title: '提示', content: '你已经报名成功了，不需要重复报名了！', showCancel: 'false' });
                }
                else if (res.data.message == "not-allowed") {
                  wx.showModal({ title: '提示', content: '人数已满，下次手快些哦！', showCancel: 'false' });
                }
            }
          })*/
          }
        },

        fail: function () {
          // 请求失败时候被调用，如网络问题，可以做一个弹窗在这里
          console.log("失败")
        },

        complete: function () {

        },
      });
    }

  },






  enroll2: function () {
    var that = this;
    var isLogged = false;
    if (app.globalData.userNumber != '') {
      isLogged = true;
    }
    //是否已登录
    if (!isLogged) {
      wx.showModal({
        title: '提示',
        content: '先登录（其他社团填写信息）才能报名哟！',
        showCancel: 'false',
        success: function (res) {
          if (res.confirm) {
            //用户点击确定，跳转到登录页面
            app.globalData.enroll_ID = that.data.activity[2].enroll_id;
            wx.navigateTo({
              url: '../enroll_signin/enroll_signin',
            })
          }
        }
      });
    }
    else {
      var getsubmitTime0 = util.formatTime(new Date());
      var getsubmitTime1 = getsubmitTime0.replace('/', '-');
      var new_getsubmitTime = getsubmitTime1.replace('/', '-');
      var that = this;
      var getNumber = app.globalData.userNumber;
      var getname = '';
      var getcollege = '';
      var getgender = '';
      var getgrade = '';
      var getqq = '';
      wx.request({
        url: 'https://www.jluibm.cn/jluibm-wx/user-info.php?number=' + getNumber,
        method: "GET",

        header: {
          'content-Type': 'application/json',
          'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
        },
        success: function (res) {

          getname = res.data.name;
          getcollege = res.data.college;
          getgender = res.data.gender;
          getgrade = res.data.grade;
          getqq = res.data.qq;
        }
      })


      wx.request({
        url: 'https://www.jluibm.cn/jluibm-wx/enroll.php',
        method: "POST",

        data: {
          request: 'submit',
          enroll_id: that.data.activity[2].enroll_id,
          submitTime: new_getsubmitTime,
          name: getname,
          number: getNumber,
          college: getcollege,
          gender: getgender,
          grade: getgrade,
          qq: getqq,
          comeFrom: "IBM俱乐部"
        },



        header: {
          "content-type": "application/x-www-form-urlencoded"
        },

        success: function (e) {

          console.log(e)
          if (e.data == '') {
            wx.showModal({
              title: '提示',
              content: '报名成功！',
              showCancel: 'false',
              success: function () { },
            });
            //检测重复报名
            /*wx.request({
              url: 'https://www.jluibm.cn/jluibm-wx/check-enroll.php?request=checkAlready&{}',
              method: "GET",
              data: {
                enroll_id: that.data.activity[2].enroll_id, 
                number: e.detail.value.number
              },
              header: {
                'content-Type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function (res) {
                console.log(res)
                if (res.data.message == "has_enrolled") {
                  wx.showModal({ title: '提示', content: '你已经报名成功了，不需要重复报名了！', showCancel: 'false' });
                }
                else if (res.data.message == "not-allowed") {
                  wx.showModal({ title: '提示', content: '人数已满，下次手快些哦！', showCancel: 'false' });
                }
            }
          })*/
          }
        },

        fail: function () {
          // 请求失败时候被调用，如网络问题，可以做一个弹窗在这里
          console.log("失败")
        },

        complete: function () {

        },
      });
    }

  }



})