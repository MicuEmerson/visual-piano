var canvas = null;
var ctxWorker = null;
var speed = 0; //asta o as fie constanta pt toate notele(reactangle), 
              // care pot sa i-o dau din mesaj in functie de cat de rapida sa fie (ex: velocity 50%, 100%, 120% etc)
              // dar deocamdata las constant


// Waiting to receive the OffScreenCanvas
onmessage = function(e) {
  const {canvas, messageType, height, width} = e.data;
  
  if(messageType === "INIT"){
    handleInit(canvas);
  } else if(messageType === "RESIZE"){
    handleResize(height, width);
  }
 
}

function handleResize(height, width){
  canvas.height = height;
  canvas.width = width;
}

function handleInit(canvasData){
  canvas = canvasData;
  ctxWorker = canvas.getContext("2d");
  // console.log("contenxttt",ctxWorker);
  // console.log("canvasss",canvas);
  
  startCounting();
  setInterval(function() {
    speed = 0;
  }, 4500);
}

// Start the counter for Canvas B
function startCounting() {
  setInterval(function() {
    speed++;
    redrawCanvas();
  }, 10);
}

function redrawCanvas() {
  // ctxWorker.clearRect(0, 0, canvas.width, canvas.height);
  ctxWorker.fillStyle = "blue";
  ctxWorker.clearRect(202, speed - 1, 36, 40);
  ctxWorker.fillRect(202, speed, 36, 40);

  ctxWorker.clearRect(10, speed - 1, 36, 40);
  ctxWorker.fillRect(10, speed, 36, 40);

  // ctxWorker.clearRect(0, (speed - 1) * 2, canvas.width, canvas.height);
  // ctxWorker.fillRect(30,speed * 2, 25, 40);

  // ctxWorker.clearRect(0, (speed - 1) * 3, canvas.width, canvas.height);
  // ctxWorker.fillRect(60,speed * 3, 25, 40);

}