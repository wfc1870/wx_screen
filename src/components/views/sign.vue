<template lang="html">
  <div class="wrapper">
    <div class="header">
      <h2>
      微信大屏幕-签到{{test}}
    </h2>
      <div class="num-t left">
        <p><em class="messageTotal" id="messageTotal">0</em><span>人签到</span></p>
      </div>
    </div>
    <div class="fl-layer checkin-pop">
      <ul class="heads-list clearfix">

      </ul>
      <div class="activity-btn-group">
        <div class="qiandao" title="签到" rel='wall'>
          <em></em>
          <p>签到</p>
        </div>
        <div class="choujiang" title="抽奖" rel='lottery' @click = "getTest">
          <em></em>
          <p>抽奖</p>
        </div>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
    };
  },
  computed: {},
  ready: function () {
  },
  attached: function () {},
  methods: {
    getTest: function () {
      $(".choujiang").css("color", "red");
    }
  },
  components: {}
};
</script>

<style lang="css">

</style>
