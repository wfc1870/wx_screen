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
      // var lucyNumber = Math.round(Math.random() * dataSource.total() + .5) - 1;
      //从后台拉取中奖id
      $.ajax({
        type: "POST",
        url: GETBINGOURL,
        data: {
          activityId: actId,
          prizeLevel: lottery.cqjxnum, //获奖等级
          count: lottery.cqnum
        },
        success: function (data) {
          console.log(data);
          if(data.msg === '目标数量不足！' || data.msg === '抽奖数量超过可抽奖数量！'){
            layer.alert('奖品已抽完');
          }
          var _id = data;
          if (data.prized == null) {
            lottery.drawguy('', '../img/avatar/default.png');
            lottery.endGame = false;
          }
          $.each(data.prized, function (i, item) {
              lottery.removeDrawguy();
              dataSource.matchId(item, function(lucyNumber){
                var luckyGuy = dataSource.get(lucyNumber);
                dataSource.addLuckyGuy(luckyGuy);
                dataSource.remove(lucyNumber);
                if (i === data.prized.length - 1) {
                  lottery.drawguy(luckyGuy.nickname, luckyGuy.avatar);
                }
              });
          });
          lottery.loadAwards();
        }
      });

    },
    remove: function (id) {
      var guy = dataSource.getLuckGuy(id);
      dataSource.removeLuckGuy(id);
      dataSource.add(guy);
    },
    reset: function () {
      // $.each(dataSource.getLuckGuys(), function (i, e) {
      //   dataSource.add(e);
      // });
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
    matchId: function (id , callback) {
      console.log(_arr);
      console.log(id);
      for (var i = 0; i < _arr.length; i++) {
          if (id === _arr[i].trafficId) {
            callback(i);
          }
      }
    },
    clearLuckyGuy: function () {
      _setByStorage('award', []);
    },
    addLuckyGuy: function (guy) {
      console.log(guy);
      var guys = _getFromStorage('award') || [];
      guy.prize = lottery.cqjxtext;
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
    _$cqBtns = $('.cqrs').find('li'),
    _$cqjxBtns = $('.cqjx').find('li'),
    _$resetBtn = $('#resetBtn');

  function _renderPrize() {
    getForOpen(function (data) {
      var data = data.activity.prizes;
      $.each(data, function (i, item) {
        var leveltext = '';
        switch (item.level) {
        case 0:
          leveltext = '特等奖';
          break;
        case 1:
          leveltext = '一等奖';
          break;
        case 2:
          leveltext = '二等奖';
          break;
        case 3:
          leveltext = '三等奖';
          break;
        case 4:
          leveltext = '四等奖';
          break;
        }
        $(".cqjx").find('ul').append('<li value=' + item.level + '><a href="javascript:;">' + leveltext + '</a></li>');
      });
    });
  };
  return {
    endGame: false,
    cqnum: 1, //一次抽取人数
    cqjxnum: '',
    cqjxtext: '',
    init: function () {
      _renderPrize();
      this.bindBtn();
      this.getData();
      //初始化执行一次
    },
    getData: function () {
      var self = this;
      getActivityInfo(function (data) {
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
        if ($("#cqjx_num").text() === '抽取奖项') {
          layer.alert('请选择抽取奖项');
        } else {
          if (!self.endGame) {
            $(this).toggleClass('noshow');
            $(_$endBtn).toggleClass('noshow');
            bingo.start();
          }else{
            layer.alert('该奖项已抽完');
          }
        }
      });
      _$endBtn.on('click', function () {
        $(this).toggleClass('noshow');
        $(_$startBtn).toggleClass('noshow');
        bingo.end();
      });
      _$resetBtn.on('click', function () {
        bingo.reset();
        self.loadAwards();
      });
      _$cqBtns.on('click', function () {
        var _id = $(this).val();
        $('#cq_num').text(_id);
        self.cqnum = _id;
      });
      $(document).on('click', '.cqjx li', function () {
        var _id = $(this).val();
        var _text = $(this).find('a').text();
        $('#cqjx_num').text(_text);
        self.cqjxtext = _text;
        self.cqjxnum = _id;
      });
    },
    //渲染参与者头像
    removeDrawguy: function () {
      var $lotteryGuy = $('#lottery_guy');
      $lotteryGuy.find('.nickname').text('');
      $lotteryGuy.find('img').attr('src', '');
    },
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
        if (element)
          _$awards.append($('<li>').append('<div class="row"><div class="name col-md-7">' + element.nickname + '</div><div class="col-md-5 star-style"> ' + element.prize + '</div>'));
      });
      $.each(user.all(), function (index, element) {
        _$users.append($('<li>').append('<img src="' + element.avatar + '" height="15px"/><span class="name">' + element.nickname + '</span><a href="#" data-id="' + index + '"> <i class="fa fa-remove"> </i></a>'));
      });
    }
  };
};
var lottery = new Lottery();
lottery.init();
