var canvas = null;
var ctxWorker = null;
var startingPosition = 0; // y position of start drawning the note
var animationSpeed = 10 // the animation speed in ms

var canvasDataIndexesByNote = null; // map where we keep positions of X coordonates for every note 
                                    // ex:(key = noteName (C4, C#3, etc), value = x positon of that note in the screen);
var whiteNoteWidth = null; 
var blackNoteWidth = null;

var dataMap = {};

var setIntervalForNotes = {} // map where we keep reference for setInterval for every note
                              // ex:(key = noteName (C4, C#3, etc), value = setInterval reference);

var heightForNotes = {} // map where we keep positions the height for every note (the height is increasing till the note is pressed)
                          // ex:(key = noteName (C4, C#3, etc), value = noteHeight;


onmessage = function(e) {
  const {canvas, messageType, height, width, drawningData, drawNote} = e.data;
  
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
  }
 
}

function handleInit(canvasData){
  canvas = canvasData;
  ctxWorker = canvas.getContext("2d");
  startingPosition = canvas.height;
}

function handleResize(height, width){
  canvas.height = height;
  canvas.width = width;
  startingPosition = height;
}

function handleSetDrawingData(data){
  canvasDataIndexesByNote = data.array;
  whiteNoteWidth = data.whiteWidth,
  blackNoteWidth = data.blackWidth;
}

function handleStartDrawnNote(drawNote){
  const {noteName, forBlackNote} = drawNote;

  dataMap[noteName] = {};
  dataMap[noteName].noteHeight = 0;
  dataMap[noteName].xPosition = startingPosition;

  let noteSetInterval = setInterval(function() {
    drawAnimationNote(noteName, forBlackNote, --dataMap[noteName].xPosition, ++dataMap[noteName].noteHeight);
  }, animationSpeed);
  
  dataMap[noteName].noteSetInterval = noteSetInterval;
}

function handleStopDrawnNote(drawNote){
  const {noteName, forBlackNote} = drawNote;
  
  clearInterval(dataMap[noteName].noteSetInterval);
  
  let xPosition = dataMap[noteName].xPosition;
  let noteHeight = dataMap[noteName].noteHeight;

  let noteSetInterval = setInterval(function() {
    if(--xPosition + noteHeight <= 0){
      clearInterval(noteSetInterval);
    }
    drawAnimationNote(noteName, forBlackNote, xPosition, noteHeight);
  }, animationSpeed);

}

function drawAnimationNote(noteName, forBlackNote, xPosition, noteHeight) {
  ctxWorker.fillStyle = forBlackNote ?  "red" : "blue";

  ctxWorker.clearRect(canvasDataIndexesByNote[noteName] + 8,
      xPosition + 1,
      forBlackNote ? blackNoteWidth : whiteNoteWidth,
      noteHeight);

  ctxWorker.fillRect(canvasDataIndexesByNote[noteName] + 8, //idk why I need to add 8 pixels, TODO: figure out!
      xPosition,
      forBlackNote ? blackNoteWidth : whiteNoteWidth,
      noteHeight);
}