// canvasState
export const initCanvas = "initCanvas";
export const resizeCanvas = "resizeCanvas";
export const startDrawNote = "startDrawNote"
export const stopDrawNote = "stopDrawNote";
export const pauseOrResumeSong = "pauseOrResumeSong";
export const stopSong = "stopSong";
export const changeNoteColors = "changeNoteColors";

//keyboardState
export const playNote = "playNote";
export const playNoteMouse = "playNoteMouse";
export const playNoteHover = "playNoteHover"
export const removePressedKey = "removePressedKey";
export const removePressedKeyMouse = "removePressedKeyMouse";
export const changeInput = "changeInput";
export const generateNotes = "generateNotes";
export const generateNotesIndexesByKey = "generateNotesIndexesByKey";

//menuState
export const changeOctaves = "changeOctaves";
export const changeVolume = "changeVolume";
export const changeSpeed = "changeSpeed";
export const setPlaying = "setPlaying";
export const stopPlaying = "stopPlaying";  // and playlistState
export const whiteNoteColorChanged = "whiteNoteColorChanged";
export const blackNoteColorChanged = "blackNoteColorChanged";

//playlistState
export const changeSong = "changeSong";
export const clearTimes = "clearTimes";
export const pauseTimers = "pauseTimers";
export const resumeTimers = "resumeTimers";
export const prepareNotes = "prepareNotes";
export const prepareSong = "prepareSong";

//recordingState
export const createRecorder = "createRecorder";
export const recordMidiNote = "recordMidiNote";
export const startRecording = "startRecording";
export const stopRecording = "stopRecording";
export const saveSong = "saveSong";

//toneState
export const createSampler = "createSampler";
export const connectSampler = "connectSampler";

