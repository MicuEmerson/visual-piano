var canvas = null;
var context = null;
var animationSpeed = 10 // the animation speed in ms
var playingState = 3 // 1 = play, 2 = pause , 3 = stop
var waterfall = false // variable to indicate the animation, from top to bottom (waterfall) = true,  or from bottom to top = false
var noteColors = {
  whiteNoteColor: "#1eb7eb",
  blackNoteColor: "#f9bb2d"
}

var canvasDataIndexesByNote = null; // map where we keep positions of X coordonates for every note 
                                    // ex:(key = noteName (C4, C#3, etc), value = x positon of that note in the screen);
var whiteNoteWidth = null; 
var blackNoteWidth = null;

var dataMap = {}; // Helper map where we keep handleStartDrawnNote info like (setInterval reference, heigh of the note, yPosition of the note)
                  // We need this because in the handleStopDrawnNote we use this info to clearout the setInterval from handleStartDrawnNote 
                  // and to get the final height of the note + yPosition and after we start again a setInterval with this data
var allIntervalRefs = [];

onmessage = function(e) {
  const {canvas, messageType, resizeData, drawNote, playing, colors} = e.data;

  if(messageType === "INIT"){
    handleInit(canvas);
  } else if(messageType === "RESIZE"){
    handleResize(resizeData);
  } else if(messageType === "START_DRAW_NOTE"){
    handleStartDrawnNote(drawNote);
  } else if(messageType === "STOP_DRAW_NOTE"){
    handleStopDrawnNote(drawNote);
  } else if(messageType === "PAUSE_SONG"){
    playingState = playing;
    handleSetWaterfall(true);
  } else if(messageType === "STOP_SONG"){
    handleStopSong();
  } else if(messageType === "CHANGE_COLOR"){
    noteColors = colors;
  }
}

function handleInit(canvasData){
  canvas = canvasData;
  context = canvas.getContext("2d");
}

function handleResize({height, width, whiteWidth, blackWidth, array}){
  canvas.height = height;
  canvas.width = width;
  canvasDataIndexesByNote = array;
  whiteNoteWidth = whiteWidth;
  blackNoteWidth = blackWidth;
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function handleSetWaterfall(val){
  waterfall = val;
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function handleStopSong(){
  playingState = 3;
  handleSetWaterfall(false);
  clearAllInterval();
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function clearAllInterval(){
  allIntervalRefs.forEach(interval => clearInterval(interval));
  allIntervalRefs.splice(0, allIntervalRefs.length);
}


function handleStartDrawnNote(drawNote){
  const {noteName, forBlackNote} = drawNote;

  dataMap[noteName] = {};
  dataMap[noteName].noteHeight = 1;
  dataMap[noteName].yPosition = waterfall ? 0 : canvas.height;

  let noteSetInterval = setInterval(function() {

    if(!waterfall){
      --dataMap[noteName].yPosition;
      ++dataMap[noteName].noteHeight;
    }

    if(waterfall && playingState === 1){
      ++dataMap[noteName].noteHeight;
    }

    if(waterfall && playingState === 3) {
      clearInterval(noteSetInterval);
      context.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      drawAnimationNote(noteName, forBlackNote, dataMap[noteName].yPosition, dataMap[noteName].noteHeight);
    }

  }, animationSpeed);

  allIntervalRefs.push(noteSetInterval);
  
  dataMap[noteName].noteSetInterval = noteSetInterval;
}

function handleStopDrawnNote(drawNote){
  const {noteName, forBlackNote} = drawNote;

  clearInterval(dataMap[noteName].noteSetInterval);
  
  let yPosition = dataMap[noteName].yPosition;
  let noteHeight = dataMap[noteName].noteHeight;

  let noteSetInterval = setInterval(function() {

    if(!waterfall){
      --yPosition;
    }

    if(waterfall && playingState === 1){
        ++yPosition;
    }

    if(waterfall && yPosition >= canvas.height + noteHeight){
      clearInterval(noteSetInterval);
    }
    else if(!waterfall && yPosition + noteHeight < 0){
      clearInterval(noteSetInterval);
    }
    else if(waterfall && playingState === 3) {
      clearInterval(noteSetInterval);
      context.clearRect(0, 0, canvas.width, canvas.height);
    } 
    else {
      drawAnimationNote(noteName, forBlackNote, yPosition, noteHeight);
    }

  }, animationSpeed);

  allIntervalRefs.push(noteSetInterval);
}

function drawAnimationNote(noteName, forBlackNote, yPosition, noteHeight) {
  context.fillStyle = forBlackNote ?  noteColors.blackNoteColor : noteColors.whiteNoteColor;
 
  let noteWidth = forBlackNote ? blackNoteWidth : whiteNoteWidth;
  let finalYPosition = yPosition;

  if(waterfall){
    finalYPosition -= 2;
  } else {
    finalYPosition += 2;
  }

  context.clearRect(canvasDataIndexesByNote[noteName],
      finalYPosition,
      noteWidth,
      noteHeight);
  
  let offsetForXPosition = noteWidth * 0.2 / 2;
  noteWidht = noteWidth * 0.8;

  context.fillRect(canvasDataIndexesByNote[noteName] + offsetForXPosition, 
      yPosition,
      noteWidht,
      noteHeight - 2);
}
