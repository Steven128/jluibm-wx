var app = getApp()

var util = require('../../utils/util.js');
import WxValidate from '../../utils/WxValidate.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        activity_enroll_id: '',
        tipsNumber: 1, // 提示选择是否为IBM俱乐部的成员时的弹窗次数
        hasActivity: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.request({
            url: 'https://www.jluibm.cn/jluibm-wx/check-enroll.php?request=getActiveList',
            method: "GET",
            data: {
                activity_enroll_id: ''
            },

            header: {
                "content-type": "json"
            },

            success: function(res) {
                console.log(res)
                if (res.data == '') {
                    that.setData({
                        activity: res.data,
                        hasActivity: false
                    })
                } else {
                    that.setData({
                        activity: res.data,
                        hasActivity: true
                    })
                }
            },

            fail: function() {
                // 请求失败时候被调用
                wx.showModal({
                    title: '提示',
                    content: '网络出小差了哦~',
                    showCancel: 'false',
                    success: function() {},
                });
            },

            complete: function() {

            },
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },


    enroll: function() {
        var that = this;
        var enroll_id = that.data.activity[0].enroll_id;
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
                success: function(res) {
                    if (res.confirm) {
                        //用户点击确定，跳转到登录页面
                        app.globalData.enroll_ID = that.data.activity[0].enroll_id;
                        wx.navigateTo({
                            url: '../enroll_signin/enroll_signin',
                        })
                    }
                }
            });
        } else {
            //检查是否已经报名过了
            var getNumber = app.globalData.userNumber;
            wx.request({
                url: 'https://www.jluibm.cn/jluibm-wx/check-enroll.php?request=checkAlready&number=' + getNumber + '&enroll_id=' + enroll_id,
                method: 'GET',
                header: {
                    'content-Type': 'application/json',
                    'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
                },
                fail: (err) => {
                    console.log(err)
                },
                success: (res) => {
                    console.log(res)
                    if (res.data.message == 'has_enrolled') {
                        //已经报名过了
                        wx.showModal({
                            title: '提示',
                            content: '你已经报名过啦~',
                            showCancel: 'false'
                        });
                    } else if (res.data.message == 'not-allowed') {
                        //人数已满
                        wx.showModal({
                            title: '提示',
                            content: '手慢啦，名额已满，下次快点哟~',
                            showCancel: 'false'
                        });
                    } else if (res.data.message == 'enroll_allowed') {
                        //可以报名
                        var submitTime = util.formatTime(new Date()).replace('/', '-').replace('/', '-');
                        var getname = '';
                        var getcollege = '';
                        var getgender = '';
                        var getgrade = '';
                        var getqq = '';
                        //拉取个人信息
                        wx.request({
                            url: 'https://www.jluibm.cn/jluibm-wx/user-info.php?number=' + getNumber,
                            method: "GET",

                            header: {
                                'content-Type': 'application/json',
                                'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
                            },

                            success: function(res) {

                                getname = res.data.name;
                                getcollege = res.data.college;
                                getgender = res.data.gender;
                                getgrade = res.data.grade;
                                getqq = res.data.qq;
                                //报名
                                wx.request({
                                    url: 'https://www.jluibm.cn/jluibm-wx/enroll.php',
                                    method: "POST",

                                    data: {
                                        request: 'submit',
                                        enroll_id: that.data.activity[0].enroll_id,
                                        submitTime: submitTime,
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

                                    success: function(e) {

                                        console.log(e)
                                        if (e.data.message == 'success') {
                                            wx.showModal({
                                                title: '提示',
                                                content: '报名成功！',
                                                showCancel: 'false',
                                                success: function() {},
                                            });
                                        } else if (e.data.message == 'already_exists') {
                                            wx.showModal({
                                                title: '提示',
                                                content: '你已经报名过啦~',
                                                showCancel: 'false'
                                            });
                                        } else {
                                            wx.showModal({
                                                title: '提示',
                                                content: '网络开小差啦~',
                                                showCancel: 'false'
                                            });
                                        }

                                    }
                                });

                            }
                        })

                    }
                }
            });
        }



        // else {
        //     var submitTime0 = util.formatTime(new Date()).replace('/', '-');
        //     submitTime1 = getsubmitTime0.;
        //     var new_getsubmitTime = getsubmitTime1.replace('/', '-');
        //     var that = this;
        //     var getNumber = app.globalData.userNumber;
        //     var getname = '';
        //     var getcollege = '';
        //     var getgender = '';
        //     var getgrade = '';
        //     var getqq = '';
        //     wx.request({
        //         url: 'https://www.jluibm.cn/jluibm-wx/user-info.php?number=' + getNumber,
        //         method: "GET",

        //         header: {
        //             'content-Type': 'application/json',
        //             'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
        //         },
        //         success: function(res) {

        //             getname = res.data.name;
        //             getcollege = res.data.college;
        //             getgender = res.data.gender;
        //             getgrade = res.data.grade;
        //             getqq = res.data.qq;
        //         }
        //     })
        //     wx.request({
        //         url: 'https://www.jluibm.cn/jluibm-wx/enroll.php',
        //         method: "POST",

        //         data: {
        //             request: 'submit',
        //             enroll_id: that.data.activity[0].enroll_id,
        //             submitTime: new_getsubmitTime,
        //             name: getname,
        //             number: getNumber,
        //             college: getcollege,
        //             gender: getgender,
        //             grade: getgrade,
        //             qq: getqq,
        //             comeFrom: "IBM俱乐部"
        //         },
        //         header: {
        //             "content-type": "application/x-www-form-urlencoded"
        //         },

        //         success: function(e) {

        //             console.log(e)
        //             if (e.data == '') {
        //                 wx.showModal({
        //                     title: '提示',
        //                     content: '报名成功！',
        //                     showCancel: 'false',
        //                     success: function() {},
        //                 });
        //             }
        //         }
        //     });
        // }

    },

})