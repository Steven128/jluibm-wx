//activity.js 活动签到
var app = getApp()
var util = require('../../utils/util.js');
var amapFile = require('../../libs/amap-wx.js');
var markersData = [];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        markers: [],
        latitude: '',
        longitude: '',
        textData: {},
    },
    makertap: function(e) {
        var id = e.markerId;
        var that = this;
        that.showMarkerInfo(markersData, id);
        that.changeMarkerColor(markersData, id);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        //获取定位信息
        var myAmapFun = new amapFile.AMapWX({
            key: 'be66e5ad6a733e0131fb8931ad796e60'
        });
        myAmapFun.getRegeo({
            success: function(data) {
                that.setData({
                    latitude: data[0].latitude,
                    longitude: data[0].longitude,
                    textData: data[0],
                })
            },
            fail: function(info) {
                console.log(info)
            }
        });

        //从localStorage中获取session id
        wx.getStorage({
            key: 'PHPSESSID',
            success: function(res) {
                if (res.data != '') {
                    app.globalData.PHPSESSID = res.data;
                    var userNumber = '';
                    if (app.globalData.isSigned && !that.data.showInfo) {
                        that.setData({
                            showWait: true
                        })
                    }
                    if (!that.data.showInfo) {
                        //检查用户是否在登录状态
                        wx.request({
                            url: 'https://www.jluibm.cn/jluibm-wx/check_login.php?request=getNumber',
                            method: "GET",
                            header: {
                                'content-Type': 'application/json',
                                'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID,
                                'UA': 'WeChat_SmallProgram'
                            },
                            success: function(res) {
                                console.log(res);
                                if (res.data.number != null) {
                                    //已登录
                                    app.globalData.userNumber = res.data.number;
                                }
                            },
                            error: function(err) {
                                console.log(err);
                                wx.showToast({
                                    title: '网络开小差啦~',
                                    icon: 'loading',
                                    duration: 1500,
                                    mask: false
                                });
                            }
                        });
                    }
                }
            }
        });
    },
    showMarkerInfo: function(data, i) {
        var that = this;
        that.setData({
            textData: {
                name: data[i].name,
                desc: data[i].address
            }
        });
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

    sign: function() {
        var that = this;
        var isLogged = false;
        if (app.globalData.userNumber != '') {
            isLogged = true;
        }
        //是否已登录
        if (!isLogged) {
            wx.showModal({
                title: '提示',
                content: '先登录才能签到哟！',
                showCancel: 'false',
                success: function() {
                    wx.navigateTo({
                        url: '../signin/signin',
                    })
                }
            });

        } else {
            //检查有没有可签到的活动
            wx.request({
                url: 'https://www.jluibm.cn/jluibm-wx/activity.php?request=check',
                method: "GET",
                header: {
                    'content-Type': 'application/json',
                    'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID,
                    'UA': 'WeChat_SmallProgram'
                },
                success: function(res) {
                    wx.showToast({
                        title: '请稍后',
                        icon: 'loading',
                        duration: 500
                    })
                    if (res.data.message == "has_active") {
                        //有正在进行的活动，可以签到
                        wx.scanCode({
                            // onlyFromCamera: true,
                            success: function(res) {
                                //扫码结果
                                var href = res.result;
                                //href为扫码结果
                                var timestamp = Date.parse(new Date());
                                timestamp = timestamp / 1000;
                                //timestamp为系统目前的时间
                                var terminal = href.match(/\&terminal=(.*?)$/)[1];
                                terminal = parseInt(terminal);
                                //terminal为签到截止时间
                                var userNumber = app.globalData.userNumber;
                                var submitTime = util.formatTime(new Date()).substring(11, 19);
                                var latitude = that.data.latitude;
                                var longitude = that.data.longitude;
                                if (terminal >= timestamp) {
                                    //签到尚未结束
                                    wx.request({
                                        url: 'https://' + href + "&number=" + userNumber + "&submitTime=" + submitTime + "&longitude=" + longitude + "&latitude=" + latitude,
                                        method: "GET",
                                        header: {
                                            'content-Type': 'application/json',
                                            'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID,
                                            'UA': 'WeChat_SmallProgram'
                                        },
                                        success: function(sign_info) {
                                            wx.hideToast()
                                            if (sign_info.data.message == 'success') {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '签到成功！',
                                                    showCancel: 'false',
                                                    success: function() {},
                                                });
                                            } else if (sign_info.data.message == 'already_signed') {
                                                wx.hideToast()
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '你已签到，不要重复签到哟！',
                                                    showCancel: 'false',
                                                    success: function() {},
                                                });
                                            } else {
                                                wx.hideToast()
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '出错啦，再试一次吧！',
                                                    showCancel: 'false',
                                                    success: function() {},
                                                });
                                            }
                                        },
                                        error: function(sign_err) {
                                            wx.hideToast()
                                            wx.showToast({
                                                title: '网络开小差啦~',
                                                icon: 'loading',
                                                duration: 1500,
                                                mask: false
                                            });
                                            console.log(sign_err);
                                        }
                                    })
                                } else {
                                    wx.hideToast()
                                    wx.showModal({
                                        title: '提示',
                                        content: '签到已经结束啦！',
                                        showCancel: false,
                                    })
                                }
                            },
                            error: function(err) {
                                wx.hideToast()
                                console.log(err);
                                wx.showToast({
                                    title: '网络开小差啦~',
                                    icon: 'loading',
                                    duration: 1500,
                                    mask: false
                                });
                            }
                        });
                    }
                    //没有正在进行的活动或网络出错
                    else {
                        wx.showModal({
                            title: '提示',
                            content: '目前没有需要签到的活动哟',
                            showCancel: 'false',
                        })
                    }
                },
                error: function(err) {
                    console.log(err);
                    wx.showToast({
                        title: '网络开小差啦~',
                        icon: 'loading',
                        duration: 1500,
                        mask: false
                    });
                },
            });
        }

    }

})