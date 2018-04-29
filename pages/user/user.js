//user.js 用户个人信息
var app = getApp();
var util = require('../../utils/util.js');
var amapFile = require('../../libs/amap-wx.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showWait: false,
        showInfo: false,
        showWeather: false,
        name: '',
        number: '',
        college: '',
        major: '',
        gender: '',
        grade: '',
        weather: {},
        userPicPath: '../../images/user-offline.png'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var myAmapFun = new amapFile.AMapWX({key: 'be66e5ad6a733e0131fb8931ad796e60'});
        myAmapFun.getWeather({
            success: function (data) {
                that.setData({weather: data.liveData, showWeather: true})
            },
            fail: function (info) {
                console.log(info)
            }
        });

        wx.getStorage({
            key: 'PHPSESSID',
            success: function (res) {
                if (res.data != '') {
                    app.globalData.PHPSESSID = res.data;
                    var userNumber = '';
                    if (app.globalData.isSigned && !that.data.showInfo) {
                        that.setData({showWait: true})
                    }
                    if (!that.data.showInfo) {
                        wx.request({
                            url: 'https://www.jluibm.cn/jluibm-wx/check_login.php',
                            method: "GET",
                            data: {
                                request: "getNumber"
                            },
                            header: {
                                'content-Type': 'application/json',
                                'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
                            },
                            success: function (res) {
                                if (res.data.number == null) {
                                    that.setData({showInfo: false});
                                } else {
                                    var getNumber = res.data.number;
                                    var getName = '';
                                    var getCollege = '';
                                    var getMajor = '';
                                    var getGender = '';
                                    var getGrade = '';
                                    wx.request({
                                        url: 'https://www.jluibm.cn/jluibm-wx/user-info.php',
                                        method: "GET",
                                        data: {
                                            number: getNumber
                                        },
                                        header: {
                                            'content-Type': 'application/json',
                                            'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
                                        },
                                        success: function (res) {
                                            getName = res.data.name;
                                            getNumber = res.data.number;
                                            getCollege = res.data.college;
                                            getMajor = res.data.major;
                                            getGender = res.data.gender;
                                            getGrade = res.data.grade;
                                            if (getGender == "male") {
                                                getGender = "男";
                                            } else {
                                                getGender = "女";
                                            }
                                            if (getGrade == 1) {
                                                getGrade = "大一";
                                            } else if (getGrade == 2) {
                                                getGrade = "大二";
                                            } else if (getGrade == 3) {
                                                getGrade = "大三";
                                            } else {
                                                getGrade = "大四";
                                            }

                                            that.setData({
                                                name: getName,
                                                number: getNumber,
                                                college: getCollege,
                                                major: getMajor,
                                                gender: getGender,
                                                grade: getGrade,
                                                showInfo: true,
                                                userPicPath: 'https://www.jluibm.cn/userPicUpload/' + getNumber + '.png',
                                                showWait: false
                                            });
                                            app.globalData.userNumber = getNumber;
                                        },
                                        fail: function (err) {
                                            console.log(err);
                                        }

                                    });
                                }
                            },
                            error: function (err) {
                                console.log(err);
                            }
                        });
                    }
                }
            }
        });
    },

    userLogin: function () {
        wx.navigateTo({url: '/pages/signin/signin'});
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        var userNumber = '';
        if (app.globalData.isSigned && !that.data.showInfo) {
            that.setData({showWait: true});
        }
        if (!that.data.showInfo) {
            wx.request({
                url: 'https://www.jluibm.cn/jluibm-wx/check_login.php',
                method: "GET",
                data: {
                    request: "getNumber"
                },
                header: {
                    'content-Type': 'application/json',
                    'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
                },
                success: function (res) {
                    if (res.data.number == null) {
                        that.setData({showInfo: false});
                    } else {
                        var getNumber = res.data.number;
                        var getName = '';
                        var getCollege = '';
                        var getMajor = '';
                        var getGender = '';
                        var getGrade = '';
                        wx.request({
                            url: 'https://www.jluibm.cn/jluibm-wx/user-info.php',
                            method: "GET",
                            data: {
                                number: getNumber
                            },
                            header: {
                                'content-Type': 'application/json',
                                'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
                            },
                            success: function (res) {
                                getName = res.data.name;
                                getNumber = res.data.number;
                                getCollege = res.data.college;
                                getMajor = res.data.major;
                                getGender = res.data.gender;
                                getGrade = res.data.grade;
                                if (getGender == "male") {
                                    getGender = "男";
                                } else {
                                    getGender = "女";
                                }
                                if (getGrade == 1) {
                                    getGrade = "大一";
                                } else if (getGrade == 2) {
                                    getGrade = "大二";
                                } else if (getGrade == 3) {
                                    getGrade = "大三";
                                } else {
                                    getGrade = "大四";
                                }

                                that.setData({
                                    name: getName,
                                    number: getNumber,
                                    college: getCollege,
                                    major: getMajor,
                                    gender: getGender,
                                    grade: getGrade,
                                    showInfo: true,
                                    userPicPath: 'https://www.jluibm.cn/userPicUpload/' + getNumber + '.png',
                                    showWait: false
                                });
                                app.globalData.userNumber = getNumber;
                            },
                            fail: function (err) {
                                console.log(err);
                            }

                        });
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},

    logout: function () {
        var that = this;
        wx.request({
            url: 'https://www.jluibm.cn/jluibm-wx/check_login.php',
            method: "GET",
            data: {
                request: "getNumber"
            },
            header: {
                'content-Type': 'application/json',
                'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
            },
            success: function (res) {
                if (res.data.number == null) {
                    that.setData({
                        showInfo: false,
                        name: '',
                        number: '',
                        college: '',
                        major: '',
                        gender: '',
                        grade: 'getGrade',
                        userPicPath: 'https://www.jluibm.cn/userPicUpload/' + getNumber + '.png'
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '确定要退出登录吗？',
                        showCancel: 'true',
                        success: function (e) {
                            if (e.confirm) {
                                var getNumber = res.data.number;
                                var getName = '';
                                var getCollege = '';
                                var getMajor = '';
                                var getGender = '';
                                var getGrade = '';
                                wx.request({
                                    url: 'https://www.jluibm.cn/jluibm-wx/check_login.php',
                                    method: "GET",
                                    data: {
                                        request: "logout"
                                    },
                                    header: {
                                        'content-Type': 'application/json',
                                        'Cookie': 'PHPSESSID=' + app.globalData.PHPSESSID
                                    },
                                    success: function (res) {
                                        if (res.data.message == "success logout") {
                                            app.globalData.PHPSESSID = '';
                                            app.globalData.userNumber = '';
                                            wx.setStorage({key: "PHPSESSID", data: ''})
                                            wx.setStorage({key: "userNumber", data: ''})
                                            that.setData({
                                                showInfo: false,
                                                name: '',
                                                number: '',
                                                college: '',
                                                major: '',
                                                gender: '',
                                                grade: '',
                                                userPicPath: '../../images/user-offline.png'
                                            });
                                            wx.showToast({title: '退出成功！', icon: 'success', duration: 1500})
                                        } else {
                                            wx.showToast({title: '出错啦，再试一次吧', icon: 'loading', duration: 1500})
                                        }
                                    },
                                    fail: function (err) {
                                        console.log(err);
                                    }

                                });
                            }
                            if (e.cancel) {
                                wx.showToast({title: '取消成功', icon: 'success', duration: 1500, mask: true})
                            }
                        },
                        fail: function () {
                            wx.showToast({title: '取消成功', duration: 1500, mask: true})
                        }
                    })

                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
})