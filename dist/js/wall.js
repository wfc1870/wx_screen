/**
 * Created by sunhongjian on 16-6-15.
 */
var SingletonTester = (function () {
  //单例实例
  var instance;
  //单例方法
  function SignWall(opts) {
    var opts = opts || {};
    this.opts = {
      ACTIVITY_NAME: "activityId",
      MAX_COUNT: 1000, //最大展示人数
      SPEED: 30000, //滚动速度(ms)
      SHOW_SPEED: 500,
      normalPic: "../img/avatar/a1.jpg"
    };
    for (var i in opts) {
      this.opts[i] = opts[i];
    }
    this.init();
  }
  //构造函数
  SignWall.prototype = {
    per: 0, //请求接口次数
    personNum: 0,
    perLength: 0,
    trafficList: [],
    init: function () {
      var self = this;
      self.getPersonData();
      self.holdScroll();
      var apiTimer = setInterval(function () {
        self.getPersonData();
      }, self.opts.SPEED);
      var showTimer = setInterval(function () {
        if (self.per < self.personNum) {
          self.getTraffic();
        }
      }, self.opts.SHOW_SPEED);
    },
    holdScroll: function () {
      $(".heads-list ").scrollTop($(".heads-list").scrollHeight);
    },
    getTraffic: function () {
      var self = this;
      console.log(self.per);
      var id = self.trafficList[self.per];
      $.ajax({
        type: "GET",
        url: GETPERSONURL,
        data: {
          id: id
        }
      }).then(function (data) {
        self.per++;
        if (data.traffic) {
          var name = data.traffic.nickname ? data.traffic.nickname : "游客",
            avatar = data.traffic.avatar ? data.traffic.avatar : self.opts.normalPic;
          self._personAdd(avatar, name);
        }
      });
    },
    getPersonData: function () {
      //获取当前活动id用作请求参数
      var self = this;
      var actId = getQueryString(this.opts.ACTIVITY_NAME);
      //获取用户成员具体信息
      $.ajax({
        type: "GET",
        url: GETURL,
        data: {
          activityId: actId,
          prized: 999,
          type: 2
        }
      }).then(function (data) {
        for (var i = self.personNum; i < data.participators.length; i++) {
          self.trafficList.push((data.participators[i].trafficId));
          self.personNum++;
        }
      });
    },
    //添加签到成员*头像,昵称
    _personAdd: function (avatar, name) {
      var $sign = $(".heads-list");
      var $messageTotal = $("#messageTotal");
      var _per = this.personNum;
      var _html = '<li class="animated swing">' +
        '<a href="javascript:void(0);">' +
        '<img class="checkin-avatar checkinAvatar" src="' + avatar + '">' +
        '</a>' +
        '<span class="checkin-name checkinName">' + name + '</span>' +
        '</li>';
      $sign.append(_html);
      $messageTotal.text(_per);
    }
  };
  //返回对象
  return {
    getInstance: function (opts) {
      if (instance === undefined) {
        instance = new SignWall(opts);
      }
      return instance;
    }
  };
})();
