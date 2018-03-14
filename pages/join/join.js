var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/WxValidate.js';
var Validate = ""
var collegeData = require('../../data/collegeData.js');
var majorData = require('../../data/majorData.js');
Page({
    data: {
        array: ["大一", "大二", "大三", "大四"],
        inputCollege: '',
        college: [],
        bindCollege: [],
        inputMajor: '',
        major: [],
        bindMajor: [],
        languages: [
            { name: 'cpp', value: 'C/C++' },
            { name: 'algorithm', value: '算法' },
            { name: 'web', value: 'Web开发' },
            { name: 'linux', value: 'Linux' },
            { name: 'java', value: 'Java' }
        ],
        userNumber: '',
        index: 0,
        submitSuccess: false,
        showErrMsg: '',
        errorMsg: '',
    },
    onLoad: function (options) {
        var collegeList = [];
        for (var index in collegeData.collegeData) {
            collegeList.push(collegeData.collegeData[index].name);
        }
        this.setData({
            college: collegeList
        })


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
                chinese: true,
                equalToNumber: 'number'
            },
            major: {
                required: true,
                chinese: true,
                major: 'college'
            },
            grade: {
                equalToGrade: 'number'
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
                chinese: '请输入正确的学院名称',
                equalToNumber: '选择的学院与学号不相符'
            },
            major: {
                required: '请输入专业',
                chinese: '请输入正确的专业名称',
                major: '选择的专业与学院不相符'
            },
            grade: {
                equalToGrade: '选择的年级与学号不相符'
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
        this.WxValidate = new WxValidate(rules, messages)
        //验证输入的学院是否合法
        var hasMajor = 0;
        this.WxValidate.addMethod("major", (value, param) => {
            var targetCollege = this.WxValidate.scope.detail.value[param];
            console.log(value)
            console.log(targetCollege)
            for (var index in majorData.majorData) {
                if (majorData.majorData[index].college == targetCollege) {
                    //检查该学院中有没有所选的专业
                    var majorList = majorData.majorData[index].major;
                    for (var i in majorList) {
                        if (majorList[i] == value) {
                            console.log(majorList[i]);
                            hasMajor = 1;
                            break;
                        }
                        else {
                            hasMajor = 0;
                        }
                    }
                    console.log(hasMajor)
                }
            }
            return this.WxValidate.optional(value) || hasMajor
        }, "");


        this.WxValidate.addMethod("equalToGrade", (value, param) => {
            var grade = this.WxValidate.scope.detail.value[param].substring(2, 4);
            if (value == "大一") {
                value = 1;
            } else if (value == "大二") {
                value = 2;
            } else if (value == "大三") {
                value = 3;
            } else if (value == "大四") {
                value = 4;
            }
            //每年需要改一次
            if (grade == "17") {
                grade = 1;
            }
            else if (grade == "16") {
                grade = 2;
            }
            else if (grade == "15") {
                grade = 3;
            }
            else if (grade == "14") {
                grade = 4;
            }
            return this.WxValidate.optional(value) || grade == value
        }, "");
        var code = "";
        this.WxValidate.addMethod("equalToNumber", (value, param) => {
            var targetCode = this.WxValidate.scope.detail.value[param].substring(0, 2);

            for (var index in collegeData.collegeData) {
                if (collegeData.collegeData[index].name == value) {
                    code = collegeData.collegeData[index].code;
                }
            }
            return this.WxValidate.optional(value) || code === targetCode
        }, "");
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
    bindcollege: function (e) {
        var prefix = e.detail.value//用户实时输入值
        var newSource = []//匹配的结果
        if (prefix != "") {
            this.data.college.forEach(function (e) {
                if (e.indexOf(prefix) != -1) {
                    newSource.push(e)
                }
            })
        }
        if (newSource.length != 0) {
            this.setData({
                bindCollege: newSource
            });

        } else {
            this.setData({
                bindCollege: [],
                major: []
            });
        }
    },
    collegeitemtap: function (e) {
        this.setData({
            inputCollege: e.target.id,
            bindCollege: []
        });
        var collegeSelected = e.target.id;
        var majorList = [];
        for (var index in majorData.majorData) {
            if (collegeSelected == majorData.majorData[index].college) {
                majorList = majorData.majorData[index].major;
            }
        }
        this.setData({
            major: majorList
        })
    },

    bindmajor: function (e) {
        var prefix = e.detail.value//用户实时输入值
        var newSource = []//匹配的结果
        if (prefix != "") {
            this.data.major.forEach(function (e) {
                if (e.indexOf(prefix) != -1) {
                    newSource.push(e)
                }
            })
        }
        console.log(newSource)
        if (newSource.length != 0) {
            this.setData({
                bindMajor: newSource
            })
        } else {
            this.setData({
                bindMajor: []
            })
        }
    },
    majoritemtap: function (e) {
        this.setData({
            inputMajor: e.target.id,
            bindMajor: []
        })
    },
    formSubmit: function (e) {
        var that = this;
        const params = e.detail.value
        // 传入表单数据，调用验证方法  
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList
            //提示信息  
            console.log(error);
            this.setData({
                errorMsg: error[0].msg,
                showErrMsg: 'showError',
            });
            return false
        }
        this.setData({
            errorMsg: '',
            showErrMsg: '',
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
                            number: e.detail.value.number,
                        },
                        header: {
                            'content-Type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        success: function (res) {
                            console.log('success');
                            console.log(res.data);
                            if (res.data.message == "has joined") {
                                wx.showModal({
                                    title: '提示',
                                    content: '你已经成员了，不需要重复报名了！',
                                    showCancel: 'false',
                                });
                            } else if (res.data.message == "not found") {
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
                        mask: true
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