import { distance, tourDistance, algo, googAlgo } from './algo';

$(() => {
  //canvas setup
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  let points = [];

  let map = initMap();
  let markers = coords[2].map(c => new google.maps.Marker({position: c, map: map}));
  let pathData = [];
  let currentPath;

  $('#route-tab').click(function () {
    $('#paint').css("display", "none");
    $(this).addClass("active");
  });

  $('#paint-tab').click(function () {
    $('#route').css("display", "none");
    $(this).addClass("active");
    $('#route-tab').removeClass("active");
  });


  $("#canvas").mousedown(e => {
    let pos = getMousePos(canvas, e);
    points.push(new mapPoint(pos.x, pos.y))
    ctx.clearRect(0,0, canvas.width, canvas.height);
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x,point.y,2,0,2*Math.PI);
      ctx.stroke();
      ctx.beginPath();
    });
  });


  $('#clear-map').click(() => {
    markers.forEach(mark => mark.setMap(null));
    markers = [];
    currentPath ? currentPath.setMap(null) : null;
  });

  $('#presets').change(function() {
    markers.forEach(mark => mark.setMap(null));
    if ($(this).val() == 0) {markers = []} else {
      markers = coords[$(this).val()].map(c => new google.maps.Marker({position: c, map: map}));
    }
    currentPath ? currentPath.setMap(null) : null;
    if ($(this).val() == 2) {
      map.setZoom(11); map.setCenter({lat: 37.75534401310656, lng: -122.4203})
    } else {
      map.setZoom(2);
    }
  });

  $('#runGoog').click(function () {

    if (markers.length > 0) {
      $(":input").attr("disabled", true);

      currentPath ? currentPath.setMap(null) : null;
      let p = markers.map(mark => ({lat: mark.position.lat(), lng: mark.position.lng()}));
      markers.forEach(mark => mark.setMap(null));
      p.push({lat: markers[0].position.lat(), lng: markers[0].position.lng()})
      let route = new google.maps.Polyline({
        path: p,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      let thePath = route.getPath();
      let algoAnswer = googAlgo(thePath.getArray(), parseInt($('#display-num-evals').html()));
      let paths = algoAnswer.routes;
      let distances = algoAnswer.distances;

      for (let i = 0; i < paths.length; i++) {
        let poly = new google.maps.Polyline({
          path: paths[i],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        setTimeout(() => {poly.setMap(map); setTimeout(()=>{poly.setMap(null)}, 250)}, i*250);
      }

      let bestRoute = paths[paths.length - 1];
      bestRoute.push(bestRoute[0]);
      let bestPath = new google.maps.Polyline({
        path: bestRoute,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      currentPath = bestPath;
      setTimeout(() => {bestPath.setMap(map);$(":input").attr("disabled", false);}, paths.length * 250);
    }
  });

  $('#num-evals').change(function() {
      let scale = (Math.log(100000) - Math.log(100)) / 100;
      let value = Math.floor(Math.exp(Math.log(100) + scale * ($(this).val()))+1);
      $('#display-num-evals').html(value);
    });

  google.maps.event.addListener(map, 'click', function(event) {
    let marker = new google.maps.Marker({position: event.latLng, map: map});
    markers.push(marker);
  });
});


function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function initMap() {
  let geocoder = new window.google.maps.Geocoder();

  let map = new window.google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: 37.75334401310656, lng: -122.4203},
    scrollwheel: true
  });
  return map;
}


export const connectPoints = (context, points) => {
  // context.clearRect(0,0, canvas.width, canvas.height);
  // context.beginPath();
  context.fillStyle = randColor();
  let currPoints = points.slice(0);
  currPoints.push(points[0]);
  context.moveTo(currPoints[0].x, currPoints[0].y);
  for (let i = 1; i < currPoints.length - 1; i++) {
    let p2 = currPoints[i];
    context.lineTo(p2.x,p2.y);
    context.fill();
    context.
  }
  context.stroke();
  // context.closePath();
}


const randHex = () => '0123456789ABCDEF'[Math.floor(16*Math.random())];
const randColor = () => `#${[1,2,3,4,5,6].map(randHex).join('')}`
