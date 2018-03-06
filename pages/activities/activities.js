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
        var myAmapFun = new amapFile.AMapWX({ key: 'be66e5ad6a733e0131fb8931ad796e60' });
        myAmapFun.getRegeo({
            success: function(data) {
                console.log(data);
                that.setData({
                    latitude: data[0].latitude,
                    longitude: data[0].longitude,
                    textData: data[0],
                })
            },
            fail: function(info) {
                console.log(info)
            }
        })
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
        console.log(app.globalData.userNumber);
        if (app.globalData.userNumber != '') {
            isLogged = true;
        }
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
            wx.request({
                url: 'https://www.jluibm.cn/jluibm-wx/activity.php',
                method: "GET",
                data: {
                    request: 'check'
                },
                header: {
                    'content-Type': 'application/json',
                    'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID,
                },
                success: function(res) {
                    wx.showToast({
                        title: '请稍后',
                        icon: 'loading',
                        duration: 500
                    })
                    console.log(res);
                    if (res.data.message == "has_active") {
                        //有正在进行的活动，可以签到
                        wx.scanCode({
                            // onlyFromCamera: true,
                            success: function(res) {
                                console.log(app.globalData.userNumber);
                                //扫码结果
                                var href = res.result;
                                var timestamp = Date.parse(new Date());
                                timestamp = timestamp / 1000;
                                var terminal = href.match(/\&terminal=(.*?)$/)[1];
                                terminal = parseInt(terminal);
                                var userNumber = app.globalData.userNumber;
                                var submitTime = util.formatTime(new Date()).substring(11, 19);
                                var latitude = that.data.latitude;
                                var longitude = that.data.longitude;
                                if (terminal >= timestamp) {
                                    wx.request({
                                        url: 'https://' + href + "&number=" + userNumber + "&submitTime=" + submitTime + "&location=" + longitude + "/" + latitude,
                                        method: "GET",
                                        data: {},
                                        header: {
                                            'content-Type': 'application/json',
                                            'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID,
                                        },
                                        success: function(sign_info) {
                                            wx.hideToast()
                                            console.log(sign_info);
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
                                            wx.showModal({
                                                title: '提示',
                                                content: '出错啦，再试一次吧！',
                                                showCancel: 'false',
                                                success: function() {},
                                            });
                                            console.log("failed");
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
                                console.log("failed");
                            }
                        });
                    }
                    //没有正在进行的活动或出错
                    else {
                        wx.showModal({
                            title: '提示',
                            content: '目前没有需要签到的活动哟',
                            showCancel: 'false',
                        })
                    }
                },
                error: function(err) {
                    console.log("failed");
                },
            });
        }

    }

})