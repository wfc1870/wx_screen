//参与活动人员列表信息
// var GETURL = "http://10.6.28.135:10519/business-service-activity/activity/tgh/participators",
var BASI_URL = "http://mscrm.huntor.cn",
  GETURL = BASI_URL + "/bs-activity-a-t-p",
  // GETACTIVITYURL = "http://10.6.28.135:10519/business-service-activity/activity/tgh",
  GETACTIVITYURL = BASI_URL + "/bs-activity-a-t",
  // GETBINGOURL = "http://10.6.28.135:10519/business-service-activity/activity/tgh/winner",
  GETBINGOURL = BASI_URL + "/bs-activity-a-t-w",
  //参与活动人员详细信息
  // GETPERSONURL = "http://10.6.28.135:10501/business-service-core/traffic/info",
  GETPERSONURL = BASI_URL + "/bs-core-t-t";

var token = "3db43376-220f-49cb-ae11-9b54663cdc53";
//全屏
(function() {
  var viewFullScreen = document.getElementById("view-fullscreen");
  if (viewFullScreen) {
    viewFullScreen.addEventListener("click", function() {
      var docElm = document.documentElement;
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      }
    }, false);
  }

  var cancelFullScreen = document.getElementById("cancel-fullscreen");
  if (cancelFullScreen) {
    cancelFullScreen.addEventListener("click", function() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }, false);
  }
})();
//获取活动id
var actId = getQueryString('activityId');

function getActivityInfo(callback) {
  $.ajax({
    type: "GET",
    url: GETURL,
    data: {
      activityId: actId,
      prized: 999,
      type: 3
    },
    success: function(data) {
      var len = data.participators.length;
      var json = data.participators;
      getActivityPersons(json, len, function(arr) {
        callback(arr);
      });
    }
  });
}
//获取推广会活动
function getForOpen(callback) {
  $.ajax({
    type: "GET",
    url: GETACTIVITYURL,
    data: {
      token: token,
      id: actId
    },
    success: function(data) {
      callback(data);
    }
  });
}

function getActivityPersons(json, len, callback) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    var id = json[i].trafficId;
    $.ajax({
      type: "GET",
      url: GETPERSONURL,
      data: {
        id: id
      },
      success: function(data) {
        var data = data.traffic;
        if (data) {
          arr.push({
            trafficId: data.id,
            nickname: data.nickname,
            avatar: data.avatar
          });
        } else {
          len--;
        }
        if (arr.length === len) {
          callback(arr);
        }
      },
      error: function() {

      }
    });
  }
}

$(".activity-btn-group").find('.foot-btn').click(function() {
  var rel = $(this).attr("rel");
  window.location.href = rel + '.html?activityId=' + actId;
});
$(function() {
  getForOpen(function(data) {
    var _bg = data.activity.prizeBackgroundUrl;
    var _logoUrl = data.activity.logoUrl;
    if (_bg) {
      $(".blur div").attr("style", 'background-image: url(' + _bg + ')');
      $(".backgroung-img").attr("style", 'background-image: url(' + _bg + ')');
    }
    $(".logo-box").attr("style", 'background-image:url(' + _logoUrl + ')');
    setTimeout(function() {
      $(".loading_con").addClass("hide");
    }, 500);
  });
});
