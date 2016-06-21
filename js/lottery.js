/**
 * Created by sunhongjian on 16-6-18.
 */

// 抽奖业务层代码
var Bingo = function (dataSource) {
  var timer;
  return {
    start: function () {
      dataSource.total() < 2 || timer || this.avatar();
    },
    end: function () {
      return dataSource.total() < 2 || this.randit();
    },
    avatar: function () {
      var result = Math.round(Math.random() * dataSource.total() + .5) - 1;
      var guy = dataSource.get(result);
      lottery.drawguy(guy.nickname, guy.avatar);

      timer = setTimeout(arguments.callee, 100);
    },
    randit: function () {
      clearTimeout(timer);
      timer = null;

      var lucyNumber = Math.round(Math.random() * dataSource.total() + .5) - 1;
      var luckyGuy = dataSource.get(lucyNumber);
      lottery.drawguy(luckyGuy.nickname, luckyGuy.avatar);

      dataSource.addLuckyGuy(luckyGuy);
      dataSource.remove(lucyNumber);
    },
    remove: function (id) {
      var guy = dataSource.getLuckGuy(id);
      dataSource.removeLuckGuy(id);
      dataSource.add(guy);
    },
    reset: function () {
      $.each(dataSource.getLuckGuys(), function (i, e) {
        dataSource.add(e);
      });
      dataSource.clearLuckyGuy();
    }
  };
};
//数据人员代码
var User = function (_arr) {

  $.each(_arr, function (i, e) {
    e.id = i;
  });

  function _getFromStorage(key) {
    return JSON.parse(window.localStorage.getItem(key) || '[]');
  }

  function _setByStorage(key, val) {
    window.localStorage.setItem(key, JSON.stringify(val));
  }

  function _removeByStorage(key, val) {
    window.localStorage.setItem(key, JSON.stringify(val));
  }

  return {
    clearLuckyGuy: function () {
      _setByStorage('award', []);
    },
    addLuckyGuy: function (guy) {
      var guys = _getFromStorage('award') || [];
      guys.push(guy);
      _setByStorage('award', guys);
    },
    getLuckGuy: function (id) {
      var guys = _getFromStorage('award') || [];
      var guy = null;
      $.each(guys, function (i, e) {
        if (e.id === id) {
          guy = e;
          return;
        }
      });
      return guy;
    },
    getLuckGuys: function () {
      return _getFromStorage('award');
    },
    removeLuckGuy: function (id) {
      var guys = _getFromStorage('award') || [];
      $.each(guys, function (i, e) {
        if (e && e.id === id) {
          guys.splice(i, 1);
          return;
        }
      });
      _setByStorage('award', guys);
    },
    all: function () {
      return _arr;
    },
    add: function (guy) {
      if (!this.maxId) {
        this.maxId = _arr.length;
      }
      guy.id = this.maxId++;
      _arr.push(guy);
    },
    get: function (index) {
      return _arr[index];
    },
    remove: function (index) {
      _arr.splice(index, 1);
    },
    total: function () {
      return _arr.length;
    }
  };
};
var Lottery = function () {
  var _$startBtn = $('#startBtn'),
    _$endBtn = $('#endBtn'),
    _$awards = $('.result .list-unstyled'),
    _$users = $('.users .list-unstyled'),
    _$resetBtn = $('#resetBtn');
  return {
    init: function () {
      this.bindBtn();
      this.getData();
      //初始化执行一次
    },
    getData: function () {
      var self = this;
      getActivityInfo(function (data) {
        console.log(data);
        user = new User(data);
        bingo = new Bingo(user);
        self.loadAwards();
      });
      /*      $.ajax({
              type: "GET",
              url: GETURL,
              data: {activityId:actId,prized:5,type:2},
              success: function (data) {

              }
            });*/
    },
    //绑定事件
    bindBtn: function () {
      var self = this;
      _$startBtn.on('click', function () {
        $(this).toggleClass('noshow');
        $(_$endBtn).toggleClass('noshow');
        bingo.start();
      });
      _$endBtn.on('click', function () {
        $(this).toggleClass('noshow');
        $(_$startBtn).toggleClass('noshow');
        bingo.end();
        self.loadAwards();
      });
      _$resetBtn.on('click', function () {
        bingo.reset();
        self.loadAwards();
      });
    },
    //渲染参与者头像
    drawguy: function (name, url) {
      var $lotteryGuy = $('#lottery_guy');
      $lotteryGuy.find('.nickname').text(name);
      $lotteryGuy.find('img').attr('src', url);
    },
    //渲染中奖者信息
    loadAwards: function () {
      _$awards.html('');
      _$users.html('');
      $.each(user.getLuckGuys(), function (index, element) {
        _$awards.append($('<li>').append('<div class="row"><div class="name col-md-12">' + element.nickname + '</div><div class="col-md-2"><a href="#" data-id="' + element.id + '"> <i class="fa fa-remove"> </div></i></a>'));
      });
      $.each(user.all(), function (index, element) {
        _$users.append($('<li>').append('<img src="' + element.avatar + '" height="15px"/><span class="name">' + element.nickname + '</span><a href="#" data-id="' + index + '"> <i class="fa fa-remove"> </i></a>'));
      });
    }
  };
};
var lottery = new Lottery();
lottery.init();
