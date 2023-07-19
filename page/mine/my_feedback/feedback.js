Page({
	data: {
		inputValue: '', // 输入框输入的内容
		textArea: '',
		user_phone: '', // 用户手机号
		isfeedback: false,// 反馈弹框
	},
	bindKeyInput(e) { // 手机号
		this.setData({
			inputValue: e.detail.value
		})
	},
	bindTextArea(e) { // 多行文本描述
		this.setData({
			textArea: e.detail.value
		})
	},
	submit() { // 提交

		let app = getApp();
		let vm = this;

		if (this.data.textArea === '') {
			my.showToast({
				content: '客官，请填写反馈问题～',
				duration: 800
			});
			return;
		}
		if (this.data.inputValue.length == '') {
			my.showToast({
				content: '客官,请填写手机号~',
				duration: 800
			});
			return;
		}
		if (this.data.inputValue.length > 0 && this.data.inputValue.length < 11) {
			my.showToast({
				content: '客官,手机号格式不正确 ~',
				duration: 800
			});
			return;
		}

		// 调用提交反馈的接口
		//console.log('123', this.data.textArea, this.data.inputValue);

		my.request({
			url: app.globalData.testUrl + '/Api/my/addSuggestion',
			method: 'POST',
			data: {
				user_phone: vm.data.inputValue,
				suggestion_text: vm.data.textArea,
				zm_user_id: app.globalData.user_id

			},

			success: (res) => {
				console.log('返回建议', res);
				if (res.data.status == '1001') {

					vm.setData({
						isfeedback: true
					})

				} else if (res.data.status == '1002') {

					my.showToast({
						content: res.data.msg,
						duration: 800
					})
				}
			}
		});
	},
	onLoad() {
		// 获取本地存储中用户手机号
		my.getStorage({
			key: 'userInfo',
			success: (res) => {
				this.setData({
					user_phone: res.data.phone
				})
			}
		})
	},
	back() {
		my.navigateBack({
			delta: 1
		})
	}


});
