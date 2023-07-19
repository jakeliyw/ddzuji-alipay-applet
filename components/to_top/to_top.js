Component({
	mixins:[],
	data:{
		
	},
	props:{
		showBtn:true, // 返回顶部按钮
		// onTopBtn:(data) => { //data是父组件通过方法传递过来的数据
		// 	console.log('props',data)
		// }
	},
	didMount() { // 组件创建完毕时触发
		
	},
	deriveDataFromProps(){
		const props = this.props;
		
		this.setData({ showBtn: props.showBtn })
	},	
	methods:{
		bindTap(e) { // 调用父组件中的方法 onTopBtn必须以on开头
			this.props.onTopBtn(e);  //传递 props 中暴露的 方法 
		}
	},
})