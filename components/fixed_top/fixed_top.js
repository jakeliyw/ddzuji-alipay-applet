Component({
	mixins:[],
	data:{
	
	},
	props:{
		is_fixed:false, // 返回顶部按钮
		fixed_tab_data:[],
	
		onItem:(data) => { //data是父组件通过方法传递过来的数据
		//	console.log('props',data)
		}
	},
	didMount() { // 组件创建完毕时触发
	 //	console.log("组件加载")
	},
  didUpdate(e){

      
  },
	deriveDataFromProps(){
		const props = this.props;
		// console.log('传递的数距',props);
		this.setData({
			is_fixed: props.is_fixed,
			fixed_tab_data:props.fixed_tab_data
		})
	},	
	methods:{
		bindTap(e) { // 调用父组件中的方法 onTopBtn必须以on开头
			// console.log('子组件点击',e,this.props.fixed_tab_data);
			let index = e.target.dataset.id;
			let cate_id = e.target.dataset.proId;
			let cate_name = e.target.dataset.cateName;
			let obj = {index:index,cate_id:cate_id,cate_name:cate_name};
			this.props.onItem(obj);  //传递 props 中暴露的 方法 
			
			this.props.fixed_tab_data.forEach((item,index) => {
				item.checked = false;
			});
			this.props.fixed_tab_data[index].checked = true;
			this.setData({
				fixed_tab_data:this.props.fixed_tab_data,
       
			})
		}
	},
})