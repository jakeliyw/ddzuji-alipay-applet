Component({
  mixins: [],
  data: {
    appInfo:getApp(),
  },
  props: {
    kefuisShow: true,
  },
  didMount() {
    this.$page.kefu = this;
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    pingTaiPhone() {//平台客服
      let app = getApp();
      my.makePhoneCall({
        number: app.globalData.service_phone,
      });
    },
    closekefu() {
      this.props.onHideKefu();
    },
  },
});
