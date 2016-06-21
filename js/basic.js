var GETURL = "http://10.6.28.135:10519/business-service-activity/activity/tgh/participators",
  GETPERSONURL = "http://10.6.28.135:10501/business-service-core/traffic/info";
//url参数获取
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = location.search.substr(1).match(reg);
  if (r != null) return unescape(decodeURI(r[2]));
  return null;
}

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
