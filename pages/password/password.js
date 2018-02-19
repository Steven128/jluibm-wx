var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/WxValidate.js';
var md5 = require('../../utils/md5');
var Validate = ""

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showErrorMsg: '',
        src: ''
    },

    upload() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const src = res.tempFilePaths[0]
                console.log(src);
                wx.redirectTo({
                    url: '../upload/upload?src=${src}'
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let { avatar } = options
        if (avatar) {
            this.setData({
                src: avatar
            })
        }

        const rules = {
            password: {
                required: true,

            },
            repassword: {
                required: true,
                equalTo: 'password'
            },
            email: {
                required: true,
                email: true
            }
        }
        // 验证字段的提示信息，若不传则调用默认的信息  
        const messages = {
            password: {
                required: '请输入密码',
            },
            repassword: {
                required: '请再次输入密码',
                equalTo: '两次输入密码必须相同'
            },
            email: {
                required: '请输入验证邮箱',
                email: '请输入正确的邮箱地址'
            }
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
        //先提交报名表单数据
        var formData = app.globalData.formData;
        var submitTime = util.formatTime(new Date());
        wx.request({
            url: 'https://www.jluibm.cn/jluibm-wx/form.php',
            method: "POST",
            data: {
                request: 'submit',
                submitTime: submitTime,
                name: formData.name,
                number: formData.number,
                college: formData.college,
                major: formData.major,
                gender: formData.gender,
                grade: formData.grade,
                qq: formData.qq,
                phone: formData.phone,
                languages: formData.languages,
                learned: formData.learned
            },
            header: {
                'content-Type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
                console.log('success');
                console.log(res.data);
                if (res.data == "success") {
                    console.log('success toast');
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 1500,
                        mask: true
                    });
                    app.globalData.userNumber = that.data.userNumber;
                    app.globalData.formData = '';
                    //下面提交密码和邮箱
                    var password = 'JLUIBMclub' + app.globalData.userNumber + e.detail.value.password;
                    password = md5.hex_md5(password);

                    wx.request({
                        url: 'https://www.jluibm.cn/jluibm-wx/set-password.php',
                        method: "POST",
                        data: {
                            number: app.globalData.userNumber,
                            password: password,
                            email: e.detail.value.email
                        },
                        header: {
                            'content-Type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        success: function (res) {
                            console.log('success');
                            console.log(res.data);
                            if (res.data == "success") {
                                console.log('success toast');
                                app.globalData.userNumber = '';
                                wx.showModal({
                                    title: '提交成功',
                                    content: '请尽快确认邮箱',
                                    showCancel: 'false',
                                    success: function () {
                                        wx.navigateTo({
                                            url: '/pages/link/link'
                                        });
                                    }
                                });
                            }
                        },
                        fail: function (err) {
                            console.log(err);
                        }
                    });
                }
                else {
                    wx.showToast({
                        title: '出错啦\n再试一次吧',
                        icon: 'loading',
                        duration: 2000,
                        mask: true
                    })
                }
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
})