//参与活动人员列表信息
var GETURL = "http://10.6.28.135:10519/business-service-activity/activity/tgh/participators",
  GETACTIVITYURL = "http://10.6.28.135:10519/business-service-activity/activity/tgh/for_open",
  GETBINGOURL = "http://10.6.28.135:10519/business-service-activity/activity/tgh/winner",
  //参与活动人员详细信息
  GETPERSONURL = "http://10.6.28.135:10501/business-service-core/traffic/info";
//url参数获取
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = location.search.substr(1).match(reg);
  if (r != null) return unescape(decodeURI(r[2]));
  return null;
}
//全屏
(function () {
  var viewFullScreen = document.getElementById("view-fullscreen");
  if (viewFullScreen) {
    viewFullScreen.addEventListener("click", function () {
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
    cancelFullScreen.addEventListener("click", function () {
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
var actId = getQueryString('activityId');

function getActivityInfo(callback) {
  $.ajax({
    type: "GET",
    url: GETURL,
    data: {
      activityId: actId,
      prized: 5,
      type: 2
    },
    success: function (data) {
      var len = data.participators.length;
      var json = data.participators;
      getActivityPersons(json, len, function (arr) {
        callback(arr);
      });
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
      success: function (data) {
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
      error: function () {

      }
    });
  }
}

$(".activity-btn-group").find('div').click(function(){
  var rel = $(this).attr("rel");
  window.location.href = rel+'.html?activityId='+actId;
});
