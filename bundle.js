/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.connectPoints = undefined;

	var _mapPoint = __webpack_require__(1);

	var _mapPoint2 = _interopRequireDefault(_mapPoint);

	var _traveling_salesman_algorithm = __webpack_require__(2);

	var _coords = __webpack_require__(3);

	var _coords2 = _interopRequireDefault(_coords);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }



	$(function () {
	  var canvas = document.getElementById("canvas");
	  var ctx = canvas.getContext("2d");

	  var points = [];

	  var map = initMap();
	  var markers = _coords2.default[2].map(function (c) {
	    return new google.maps.Marker({ position: c, label: 'WH', map: map });
	  });
	  var pathData = [];
	  var currentPath = void 0;

	  $("#canvas").mousedown(function (e) {

	    var pos = getMousePos(canvas, e);
	    points.push(new _mapPoint2.default(pos.x, pos.y));
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    points.forEach(function (point) {
	      ctx.beginPath();
	      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
	      ctx.stroke();
	      ctx.beginPath();
	    });
	  });

	  $('#clear-map').click(function () {
	    markers.forEach(function (mark) {
	      return mark.setMap(null);
	    });
	    markers = [];
	    currentPath ? currentPath.setMap(null) : null;
	  });

	  $('#presets').change(function () {
	    markers.forEach(function (mark) {
	      return mark.setMap(null);
	    });
	    if ($(this).val() == 0) {
	      markers = [];
	    } else {
	      markers = _coords2.default[$(this).val()].map(function (c) {
	        return new google.maps.Marker({ position: c,label: 'WH', map: map });
	      });
	    }
	    currentPath ? currentPath.setMap(null) : null;
	    if ($(this).val() == 2) {
	      map.setZoom(11);map.setCenter({ lat: 28.7521, lng: 77.1166 });
	    }
	    else if ($(this).val() == 1) {
	      map.setZoom(5);map.setCenter({ lat: 28.7521, lng: 77.1166 });
	    }
	    else {
	      map.setZoom(2);
	    }
	  });

	  // run algorithm for points on the map
	  $('#runGoog').click(function () {

	    // diasable button until animation is complete
	    if (markers.length > 0) {
	      (function () {
	        $(":input").attr("disabled", true);

	        currentPath ? currentPath.setMap(null) : null;
	        var p = markers.map(function (mark) {
	          return { lat: mark.position.lat(), lng: mark.position.lng() };
	        });
	        markers.forEach(function (mark) {
	          return mark.setMap(null);
	        });
	        p.push({ lat: markers[0].position.lat(), lng: markers[0].position.lng() });
	        var route = new google.maps.Polyline({
	          path: p,
	          geodesic: true,
	          strokeColor: '#FF0000',
	          strokeOpacity: 1.0,
	          strokeWeight: 2
	        });
	        var thePath = route.getPath();
	        var algoAnswer = (0, _traveling_salesman_algorithm.googAlgo)(thePath.getArray(), parseInt($('#display-num-evals').html()));
	        var paths = algoAnswer.routes;
	        var distances = algoAnswer.distances;

	        var _loop = function _loop(i) {
	          var poly = new google.maps.Polyline({
	            path: paths[i],
	            geodesic: true,
	            strokeColor: '#FF0000',
	            strokeOpacity: 1.0,
	            strokeWeight: 2
	          });
	          setTimeout(function () {
	            poly.setMap(map);setTimeout(function () {
	              poly.setMap(null);
	            }, 250);
	          }, i * 250);
	        };

	        for (var i = 0; i < paths.length; i++) {
	          _loop(i);
	        }

	        var bestRoute = paths[paths.length - 1];
	        bestRoute.push(bestRoute[0]);
	        var bestPath = new google.maps.Polyline({
	          path: bestRoute,
	          geodesic: true,
	          strokeColor: '#FF0000',
	          strokeOpacity: 1.0,
	          strokeWeight: 2
	        });
	        currentPath = bestPath;

	        setTimeout(function () {
	          bestPath.setMap(map);$(":input").attr("disabled", false);
	        }, paths.length * 250);
	      })();
	    }
	  });

	  $('#num-evals').change(function () {
	    var scale = (Math.log(100000) - Math.log(100)) / 100;
	    var value = Math.floor(Math.exp(Math.log(100) + scale * $(this).val()) + 1);
	    $('#display-num-evals').html(value);
	  });

	  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let labelIndex = 0;

	  google.maps.event.addListener(map, 'click', function (event) {
	    var marker = new google.maps.Marker({ position: event.latLng, label: labels[labelIndex++ % labels.length], map: map });
	    markers.push(marker);
	  });
	});

	function getMousePos(canvas, evt) {
	  var rect = canvas.getBoundingClientRect();
	  return {
	    x: evt.clientX - rect.left,
	    y: evt.clientY - rect.top
	  };
	}

	function initMap() {
	  var geocoder = new window.google.maps.Geocoder();

	  var map = new window.google.maps.Map(document.getElementById('map'), {
	    zoom: 10,
	    center: { lat: 28.7521, lng: 77.1166 },
	    scrollwheel: true
	  });
	  return map;
	}

	var connectPoints = exports.connectPoints = function connectPoints(context, points) {
	  context.fillStyle = randColor();
	  var currPoints = points.slice(0);
	  currPoints.push(points[0]);
	  context.moveTo(currPoints[0].x, currPoints[0].y);
	  for (var i = 1; i < currPoints.length - 1; i++) {
	    var p2 = currPoints[i];
	    context.lineTo(p2.x, p2.y);
	    context.fill();
	  }
	  context.stroke();
	};

	var randHex = function randHex() {
	  return '0123456789ABCDEF'[Math.floor(16 * Math.random())];
	};
	var randColor = function randColor() {
	  return '#' + [1, 2, 3, 4, 5, 6].map(randHex).join('');
	};

},
function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var mapPoint = function mapPoint(x, y) {
	  _classCallCheck(this, mapPoint);

	  this.x = x;
	  this.y = y;
	};

	exports.default = mapPoint;

},
function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var connectPoints = exports.connectPoints = function connectPoints(context, points) {
	  // context.beginPath()
	  for (var i = 0; i < points.length - 1; i++) {
	    var p1 = points[i];
	    var p2 = points[i + 1];
	    context.moveTo(p1.x, p1.y);
	    context.lineTo(p2.x, p2.y);
	    context.stroke();
	  }
	};

	var distance = exports.distance = function distance(pointOne, pointTwo) {
	  return Math.sqrt(Math.pow(pointOne.x - pointTwo.x, 2) + Math.pow(pointOne.y - pointTwo.y, 2));
	};

	var tourDistance = exports.tourDistance = function tourDistance(tour) {
	  var d = 0;
	  tour.forEach(function (a, i) {
	    if (i < tour.length - 1) {
	      d += distance(a, tour[i + 1]);
	    }
	  });
	  return d + distance(tour[0], tour[tour.length - 1]);
	};

	function shuffle(array) {
	  var i = 0,
	      j = 0,
	      temp = null;

	  for (i = array.length - 1; i > 0; i -= 1) {
	    j = Math.floor(Math.random() * (i + 1));
	    temp = array[i];
	    array[i] = array[j];
	    array[j] = temp;
	  }
	}

	var googAlgo = exports.googAlgo = function googAlgo(tour, nfe) {
	  var distances = [];
	  var routes = [];
	  shuffle(tour);
	  var count = 0;
	  nfe = 20000;
	  var temp = 10000;
	  var measureTour = tour.slice(0);
	  measureTour.push(measureTour[0]);
	  var bestD = google.maps.geometry.spherical.computeLength(measureTour);
	  var bestTour = tour;
	  var prob = void 0;
	  for (var i = 0; i < nfe; i++) {
	    var newTour = bestTour.slice(0);
	    var idxA = Math.floor(Math.random() * tour.length);
	    var idxB = Math.floor(Math.random() * tour.length);
	    var low = Math.min(idxA, idxB);
	    var high = Math.max(idxA, idxB);
	    newTour.splice.apply(newTour, [low, high - low].concat(_toConsumableArray(newTour.slice(low, high).reverse())));
	    var measureNewTour = newTour.slice(0);
	    measureNewTour.push(measureNewTour[0]);
	    var newTourDistance = google.maps.geometry.spherical.computeLength(measureNewTour);
	    if (temp > .0001) {
	      prob = Math.min(1, Math.pow(Math.E, (bestD - newTourDistance) / temp));
	    } else {
	      prob = 0;
	    }
	    var rand = Math.random();
	    if (rand < prob) {
	      count++;
	    }
	    if ((newTourDistance < bestD || rand < prob) && newTourDistance !== bestD) {
	      bestTour = newTour;
	      bestD = newTourDistance;
	      distances.push(bestD);
	      if (i % 10 === 0) {
	        routes.push(bestTour);
	      }
	    }
	    temp = 100 * Math.pow(.99, i);
	  }
	  routes.push(bestTour);
	  distances.push(bestD);
	  return { routes: routes, distances: distances };
	};

},
function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  1: [{ lat: 28.7521, lng: 77.1166 }],
	  2: [{ lat: 28.7521, lng: 77.1166 }],
	  3: [{ lat: 28.7521, lng: 77.1166 }]
	};

}
]);
//# sourceMappingURL=bundle.js.map
