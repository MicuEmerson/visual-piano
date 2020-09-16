var canvas = null;
var ctxWorker = null;
var startingPosition = 0; // y position of start drawning the note
var animationSpeed = 10 // the animation speed in ms
var playingState = 3 // 1 = play, 2 = pause , 3 = stop
var waterfall = true // variable to indicate the animation, from top to bottom (waterfall) = true,  or from bottom to top = false 

var canvasDataIndexesByNote = null; // map where we keep positions of X coordonates for every note 
                                    // ex:(key = noteName (C4, C#3, etc), value = x positon of that note in the screen);
var whiteNoteWidth = null; 
var blackNoteWidth = null;

var dataMap = {}; // Helper map where we keep handleStartDrawnNote info like (setInterval reference, heigh of the note, yPosition of the note)
                  // We need this because in the handleStopDrawnNote we use this info to clearout the setInterval from handleStartDrawnNote 
                  // and to get the final height of the note + yPosition and after we start again a setInterval with this data

onmessage = function(e) {
  const {canvas, messageType, height, width, drawningData, drawNote, playing, waterfall} = e.data;
  if(messageType === "INIT"){
    handleInit(canvas);
  } else if(messageType === "RESIZE"){
    handleResize(height, width);
  } else if(messageType === "SET_DRAWING_DATA"){
    handleSetDrawingData(drawningData);
  } else if(messageType === "START_DRAW_NOTE"){
    handleStartDrawnNote(drawNote);
  } else if(messageType === "STOP_DRAW_NOTE"){
    handleStopDrawnNote(drawNote);
  } else if(messageType === "PAUSE_SONG"){
    playingState = playing;
  } else if(messageType === "STOP_SONG"){
    playingState = 3;
  }
}

function handleInit(canvasData){
  canvas = canvasData;
  ctxWorker = canvas.getContext("2d");
  startingPosition = 0;
}

function handleResize(height, width){
  canvas.height = height;
  canvas.width = width;
  startingPosition = 0;
  ctxWorker.clearRect(0, 0, canvas.width, canvas.height);
}

function handleSetDrawingData(data){
  canvasDataIndexesByNote = data.array;
  whiteNoteWidth = data.whiteWidth;
  blackNoteWidth = data.blackWidth;
  ctxWorker.clearRect(0, 0, canvas.width, canvas.height);
}

function handleStartDrawnNote(drawNote){
  const {noteName, forBlackNote} = drawNote;

  dataMap[noteName] = {};
  dataMap[noteName].noteHeight = 1;
  dataMap[noteName].yPosition = startingPosition;

  let noteSetInterval = setInterval(function() {

    if(playingState === 1){
      ++dataMap[noteName].noteHeight;
    } 

    if(playingState === 3) {
      clearInterval(noteSetInterval);
      ctxWorker.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      drawAnimationNote(noteName, forBlackNote, dataMap[noteName].yPosition, dataMap[noteName].noteHeight);
    }

  }, animationSpeed);
  
  dataMap[noteName].noteSetInterval = noteSetInterval;
}

function handleStopDrawnNote(drawNote){
  const {noteName, forBlackNote} = drawNote;
  
  clearInterval(dataMap[noteName].noteSetInterval);
  
  let yPosition = dataMap[noteName].yPosition;
  let noteHeight = dataMap[noteName].noteHeight;

  let noteSetInterval = setInterval(function() {
    
    if(playingState === 1){
      ++yPosition;
    }

    if((yPosition >= canvas.height + noteHeight)){
      clearInterval(noteSetInterval);

    } else if(playingState === 3) {
      clearInterval(noteSetInterval);
      ctxWorker.clearRect(0, 0, canvas.width, canvas.height);

    } else {
      drawAnimationNote(noteName, forBlackNote, yPosition, noteHeight);
    }

  }, animationSpeed);

}

function drawAnimationNote(noteName, forBlackNote, yPosition, noteHeight) {
  ctxWorker.fillStyle = forBlackNote ?  "red" : "blue";
  let noteWidth = forBlackNote ? blackNoteWidth : whiteNoteWidth;
 
  ctxWorker.clearRect(canvasDataIndexesByNote[noteName],
      yPosition - 1,
      noteWidth,
      noteHeight);
  
  let offsetForXPosition = noteWidth * 0.2 / 2;
  noteWidht = noteWidth * 0.8;

  ctxWorker.fillRect(canvasDataIndexesByNote[noteName] + offsetForXPosition, 
      yPosition,  
      noteWidht,
      noteHeight);
}
