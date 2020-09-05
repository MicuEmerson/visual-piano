var canvas = null;
var ctxWorker = null;
var speed = 0;

// Waiting to receive the OffScreenCanvas
onmessage = function(e) {
  canvas = e.data.canvas;
  ctxWorker = canvas.getContext("2d");
  console.log("contenxttt",ctxWorker);
  console.log("canvasss",canvas);
  
  startCounting();
  setInterval(function() {
    speed = 0;
  }, 3500);

}

// Start the counter for Canvas B
function startCounting() {
  setInterval(function() {
    redrawCanvas();
    speed++;
  }, 5);
}

function redrawCanvas() {
  ctxWorker.clearRect(0, 0, canvas.width, canvas.height);
  ctxWorker.fillStyle = "blue";
  ctxWorker.fillRect(0,speed,25,40);
  ctxWorker.fillRect(30,speed+speed,25,40);
  ctxWorker.fillRect(60,speed,25,40);
  ctxWorker.fillRect(90,speed,25,40);
  ctxWorker.fillRect(120,speed,25,40);
  ctxWorker.fillRect(150,speed,25,40);
  ctxWorker.fillRect(180,speed,25,40);
  ctxWorker.fillRect(210,speed,25,40);
  ctxWorker.fillRect(240,speed,25,40);
  ctxWorker.fillRect(270,speed,25,40);
  ctxWorker.fillRect(300,speed,25,40);
  ctxWorker.fillRect(330,speed,25,40);

  ctxWorker.fillRect(500,speed+speed,25,40);
  ctxWorker.fillRect(530,speed*3,25,40);
  ctxWorker.fillRect(560,speed,25,40);
  ctxWorker.fillRect(590,speed,25,40);
  ctxWorker.fillRect(620,speed,25,40);
  ctxWorker.fillRect(650,speed,25,40);
  ctxWorker.fillRect(680,speed,25,40);
  ctxWorker.fillRect(710,speed,25,40);
  ctxWorker.fillRect(740,speed,25,40);
  ctxWorker.fillRect(770,speed,25,40);
  ctxWorker.fillRect(800,speed,25,40);
  ctxWorker.fillRect(830,speed,25,40);
}