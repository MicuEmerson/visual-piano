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
var allNotes = [];

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
  secventialDrawningNotes();
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
  // there is a chance to receive a draw msg after a stop msg (because lack of sync), but we take care of this case with this setTimeout 100ms
  setTimeout(() => {
    playingState = 3;
    clearAllNotes();
    handleSetWaterfall(false);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, 100);
}

function clearAllNotes(){
  allNotes.splice(0, allNotes.length);
}

function handleStartDrawnNote(drawNote){
  const {noteName, forBlackNote} = drawNote;

  allNotes.push({
    noteHeight : 1,
    yPosition : (waterfall ? 0 : canvas.height),
    stop: false,
    noteName,
    forBlackNote
  });
}

function handleStopDrawnNote(drawNote){
  const {noteName} = drawNote;

  // maybe we can optimize?
  for(let i = 0; i < allNotes.length; i++){
    if(allNotes[i].noteName === noteName){
      allNotes[i].stop = true;
    }
  }
}

function secventialDrawningNotes() {
  setInterval(() => {
      allNotes = allNotes.filter(note => {
        if(waterfall){
          return note.yPosition < canvas.height + note.noteHeight;
        }
        else {
          return note.yPosition + note.noteHeight >= 0; 
        }
      });

      for(let i = 0; i < allNotes.length; i++){
        if(allNotes[i].stop === false) {

          if(waterfall === true && playingState === 1){
            allNotes[i].noteHeight += 1;
          } 
          else if(waterfall === false){
            allNotes[i].yPosition -= 1;
            allNotes[i].noteHeight += 1;
          }
          
        } else {
          if(waterfall === true && playingState === 1){
            allNotes[i].yPosition += 1
          } else if(waterfall === false){
            allNotes[i].yPosition -= 1;
          }
        }

        drawAnimationNote(allNotes[i].noteName, allNotes[i].forBlackNote, allNotes[i].yPosition, allNotes[i].noteHeight);
      }
  }, animationSpeed);

}

function drawAnimationNote(noteName, forBlackNote, yPosition, noteHeight) {
  context.fillStyle = forBlackNote ? noteColors.blackNoteColor : noteColors.whiteNoteColor;
 
  let noteWidth = forBlackNote ? blackNoteWidth : whiteNoteWidth;
  let offsetForXPosition = Math.floor(noteWidth * 0.2 / 2);
  let offsetForYPosition = waterfall ? 1 : -1;

  noteWidth = Math.floor(noteWidth * 0.8);

  context.clearRect(canvasDataIndexesByNote[noteName] + offsetForXPosition,
      yPosition - offsetForYPosition,
      noteWidth,
      noteHeight);

  context.fillRect(canvasDataIndexesByNote[noteName] + offsetForXPosition, 
      yPosition,
      noteWidth,
      noteHeight - 1);
}
