<template>
<div id="piano-container">
    <!-- <audio controls> </audio> -->
   
     <!-- @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  ----- DASHBOARD ----- @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-->
     <div class="piano-dashboard">
      <!-- v-if -->
      <template v-if="showConfig">
        <div class="piano-dashboard-buttons-group">
          <button class="piano-dashboard-button" @click="editKeys = !editKeys; showKeys = true">
            <template v-if="!editKeys">Edit Keys</template>
            <template v-else>Save Keys</template>
          </button>
 
          <div class="piano-dashboard-div-select piano-dashboard-button">
            <label>Start Octave:</label>
            <select size="3" v-model="config.startOctave" class="piano-dashboard-select">
              <option
                class="piano-dashboard-select-option"
                v-for="option in startOctavesSelect"
                :value="option"
                :key="option"
              >{{ option }}</option>
            </select>
          </div>
 
          <div class="piano-dashboard-div-select piano-dashboard-button">
            <label>End Octave:</label>
            <select size="3" v-model="config.endOctave" class="piano-dashboard-select">
              <option
                class="piano-dashboard-select-option"
                v-for="option in endOctavesSelect"
                :value="option"
                :key="option"
              >{{ option }}</option>
            </select>
          </div>
        </div>
 
        <button class="piano-dashboard-button" @click="showConfig = !showConfig">
          <v-icon class="paino-dashboard-icon" size="3vw">mdi-window-close</v-icon>
        </button>
      </template>
 
      <!-- v-if -->
      <template v-else>
        <div class="piano-dashboard-buttons-group" style="flex:1">
          <button class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-record</v-icon>
          </button>
          <button class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-play</v-icon>
          </button>
          <button class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-stop</v-icon>
          </button>
        </div>
 
        <div class="piano-dashboard-screen">
          <select size="3" v-model="config.endOctave" class="piano-dashboard-screen-list">
            <option
              v-for="option in endOctavesSelect"
              :value="option"
              :key="option"
            >Hello {{ option }}</option>
          </select>
        </div>
 
        <div class="piano-dashboard-buttons-group" style="flex: 1; justify-content: flex-end">
          <button class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-playlist-music</v-icon>
          </button>
 
          <button @click="showNotes = !showNotes" class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-music-note</v-icon>
          </button>
 
          <button @click="showKeys = !showKeys" class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-keyboard-outline</v-icon>
          </button>
 
          <button class="piano-dashboard-button" @click="showConfig = !showConfig">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-cogs</v-icon>
          </button>
        </div>
      </template>
    </div>


    <!-- @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  ----- KEYBOARD ----- @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-->
    <div class="piano-keyboard">

        <div v-for="(noteObject, index) in notes" :key="index"
          class="white-note" :class="[noteObject.pressed ? 'white-note-pressed' : '']"
          :style="{'width': whiteNoteWidthSize + '%'}" 
          @mousedown="playNoteMouse(noteObject)" @mouseup="removePressedKeyMouse(noteObject)"
          @mouseleave="removePressedKey(noteObject)" @mouseover="playNoteHover(noteObject)">
           
          <div v-if=(noteObject.blackNote) 
            class="black-note" :class="[noteObject.blackNote.pressed ? 'black-note-pressed' : '']" 
            @mousedown.stop="playNoteMouse(noteObject.blackNote)" @mouseup.stop="removePressedKeyMouse(noteObject.blackNote)"
            @mouseleave.stop="removePressedKey(noteObject.blackNote)" @mouseover.stop="playNoteHover(noteObject.blackNote)">

            <div class="key-group">
             <template v-if="showKeys">
                <input :disabled="editKeys !== true" v-model="noteObject.blackNote.key" class="key-input key-input-on-black-note"/>
              </template>

              <template v-if="showNotes">
                <div class="key-text key-text-on-black-note">
                  {{noteObject.blackNote.note}}
                </div>
              </template>
            </div>
          </div> 

          <div class="key-group"> 
            <template v-if="showKeys" >
              <input :disabled="editKeys !== true" class="key-input"
                :value="noteObject.key"
                @input="changeInput($event.target.value, noteObject, index)"/>
            </template>

            <template v-if="showNotes">
              <div class="key-text">
                {{noteObject.note}}
              </div>
            </template>
          </div>
         
        </div>
    </div>
</div>
</template>

<script>
import { Midi } from "@tonejs/midi"

const SAMPLE_BASE_URL = "./samples/1/";

export default {
    
  data: () => {
    return {

      // TONEJS
      sampler: { type: window.Tone.Sampler, default: {} },
      tone : { type: window.Tone, default: {}},
      
      // RECORDING STUFF
      recorder: {},
      recordedChunks: [],
      recordedMap: {},
      recordedArray: [],
      startRecordTime: 0,
      endRecordTime: 0,
      isRecording: false,
      songUrlName : "bach_846.mid",

      // CONFIG STUFF
      showConfig : false,
      config: {
        startOctave: 0,
        endOctave: 6,
        startNote: "C",
        endNote: "B",
      },
      editKeys : false,
      showKeys : false,
      showNotes: false,
      isMousePressed: false,
      isShiftPressed: false,
      whiteNoteWidthSize: 0,
      playing: false,

      notesIndexesByKey: {},
      notes : [],

      allOctavesSelect: [],

      allNotesSelect: [],

      samples: [
          ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1"],
          ["G1", "G#1", "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2"],
          ["F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3"],
          ["D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4"],
          ["D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"],
          ["C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5"],
          ["A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6"],
          ["G#6", "A6", "A#6", "B6"]
      ],

      //46 keys
      allKeys:[
        '`', `1`, '2', '3', '4', '5', '6', '7', '8', '9', '10', '0', '-', '=',
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';',
        'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'
      ],

      allNotes:['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      allOctaves:[0, 1, 2, 3, 4, 5, 6]
    };
  },

  created() {
    this.tone = window.Tone;
    this.generateNotes();
    this.generateNotesIndexesByKey();

    const SAMPLE_MAP = this.samples.flat().reduce((acc, val) => {
        acc[val] = `${val.replace("#", "s")}.mp3`;
        return acc;
    }, {});

    this.sampler = new this.tone.Sampler({
      urls: SAMPLE_MAP,
      onload : () => {},
      baseUrl: SAMPLE_BASE_URL
    }).toDestination();

    const dest  = this.tone.context.createMediaStreamDestination();
    this.recorder = new MediaRecorder(dest.stream);
    this.sampler.connect(dest);

    window.addEventListener("keydown", e => {
      const key = e.key;
      const index = this.notesIndexesByKey[key];

      if(index != undefined){
        const noteObject = this.notes[index].key === key ? this.notes[index] : this.notes[index].blackNote;
        this.playNote(noteObject);
      }
    });

    window.addEventListener("keyup", e => {
      const key = e.key;
      const index = this.notesIndexesByKey[key];

      if(index != undefined){
        const noteObject = this.notes[index].key === key ? this.notes[index] : this.notes[index].blackNote;
        this.removePressedKey(noteObject);
      }

    });

    window.onmouseup = () => {
      this.isMousePressed = false;
    }
  },

  destroyed() {
    window.removeEventListener('keydown', () => {});
    window.removeEventListener('keyup', () => {});
    window.removeEventListener('onmouseup', () => {});
  },

  watch: {
    config:{
      handler: function () {
          this.generateNotes();
          this.generateNotesIndexesByKey();
      },
      deep: true,
    }
  },

  methods: {
    togglePlayback() {
      //TODO, add break
      if (this.playing) {
        console.log("stop");
        this.tone.Transport.stop();
        this.tone.Transport.cancel();
      } else {
        console.log("start");
        this.tone.Transport.start()
      }

      this.playing = !this.playing
    },

    startRecording(){
      this.recordedChunks.length = 0;
      this.recordedArray.length = 0;
      this.recorder.start();
      this.recorder.ondataavailable = e => this.recordedChunks.push(e.data);

      this.isRecording = true;
      this.startRecordTime = new Date().getTime();
    },

    stopRecording(){
      this.recorder.stop();
      this.recorder.onstop = evt => {
        let blob = new Blob(this.recordedChunks, { type: 'audio/ogg; codecs=opus' });
        document.querySelector('audio').src = URL.createObjectURL(blob);
      };
      this.isRecording = false;
      this.endRecordTime = new Date().getTime();

      if(this.recordedArray.length != 0){
        
        this.recordedArray[0].time = this.recordedArray[0].startTime - this.startRecordTime;
        this.recordedArray[0].duration = this.recordedArray[0].endTime - this.recordedArray[0].startTime;

        for(let i = 1; i < this.recordedArray.length; i++){
          this.recordedArray[i].time = this.recordedArray[i - 1].time + this.recordedArray[i].startTime - this.recordedArray[i - 1].startTime; 
          this.recordedArray[i].duration = this.recordedArray[i].endTime - this.recordedArray[i].startTime;
        }
      }

      for(let i = 0 ; i < this.recordedArray.length; i++){
        this.recordedArray[i].time /= 1000;
        this.recordedArray[i].duration /= 1000;
      }

      console.log("Recordedddd array", this.recordedArray);

      this.playMyRecord();
    },

    playRecord(){

      if(this.songUrlName === 'bach_850_format0.mid') {
        this.songUrlName = 'bach_846.mid';
      } else {
        this.songUrlName = 'bach_850_format0.mid';
      }
      
      const now = 0;

      Midi.fromUrl("/audio/" + this.songUrlName)
          .then(midi => {
            midi.tracks.forEach(track => {
              track.notes.forEach(note => {

                console.log("intra aici?");
                this.tone.Transport.schedule(() => {
                  console.log(note.name, note.duration, note.velocity, this.sampler);
                  this.sampler.triggerAttackRelease(
                    note.name,
                    note.duration,
                    this.tone.now(),
                    note.velocity
                  );
                }, note.time + now)

                let currentNote = null;

                for (let i of this.notes) {
                    if(i.note === note.name){
                      currentNote = i;
                      break;
                    } 
                    else if(i.blackNote && i.blackNote.note === note.name){
                      currentNote = i.blackNote;
                      break;
                    }
                }
                
                this.tone.Transport.schedule(time => {
                  this.tone.Draw.schedule(() => {
                    currentNote.pressed = true;
                  }, time)
                }, note.time + now)

                this.tone.Transport.schedule(time => {
                  this.tone.Draw.schedule(() => {
                    currentNote.pressed = false;
                  }, time)
                }, note.time + note.duration + now)

              })
            })
        })
    },

    playMyRecord(){
      const now = 0;

      console.log("AM INTRAT IN PLAY RECORD");
      this.recordedArray.forEach(note => {
          
          this.tone.Transport.schedule(() => {
            console.log("BAI, nu intri?");
            this.sampler.triggerAttackRelease(note.noteName, "2n", this.tone.now());
          }, note.time + now)

          let currentNote = null;
          for (let i of this.notes) {
              if(i.note === note.noteName){
                currentNote = i;
                break;
              } 
              else if(i.blackNote && i.blackNote.note === note.noteName){
                currentNote = i.blackNote;
                break;
              }
          }

          console.log("DAR AICI INTRI?");

                      
          this.tone.Transport.schedule(time => {
            this.tone.Draw.schedule(() => {
              currentNote.pressed = true;
            }, time)
          }, note.time + now)

          this.tone.Transport.schedule(time => {
            this.tone.Draw.schedule(() => {
              currentNote.pressed = false;
            }, time)
          }, note.time + note.duration + now)

      })
    },

    playNote(noteObject) {
        if(!noteObject.pressed && !this.editKeys){
          this.sampler.triggerAttackRelease(noteObject.note, "2n");
          noteObject.pressed = true;
          
          if(this.isRecording){
            this.recordedMap[noteObject.note] = {
                noteName: noteObject.note,
                startTime: new Date().getTime(),
                endTime: null
            };
          }

        }
    },

    playNoteMouse(noteObject) {
      this.isMousePressed = true;
      this.playNote(noteObject);
    },

    playNoteHover(noteObject) {
      if(this.isMousePressed){
        this.playNote(noteObject);
      }
    },

    removePressedKey(noteObject) {
      noteObject.pressed = false;
      
      if(this.isRecording){

        if(this.recordedMap[noteObject.note] != undefined){
          
          const noteName = this.recordedMap[noteObject.note].noteName;
          const startTime = this.recordedMap[noteObject.note].startTime;
          const endTime = new Date().getTime();

          delete this.recordedMap[noteObject.note];

          this.recordedArray.push({ noteName, startTime, endTime });          
        }
      }
    },

    removePressedKeyMouse(noteObject) {
      this.isMousePressed = false
      this.removePressedKey(noteObject);
    },

    generateNotes(){
      this.notes.length = 0; // we clear the array but the reference remains the same
      let keyIndex = 0;
      let noteIndex = this.allNotes.indexOf(this.config.startNote);
    
      for(let octave = this.config.startOctave; octave <= this.config.endOctave; octave++) {

          while(noteIndex < this.allNotes.length) {
            const currentNote = this.allNotes[noteIndex];

            let newNote = {
              note: currentNote + octave,
              key: this.allKeys[keyIndex++],
              pressed: false,
            }

            if(currentNote != 'B' && currentNote!= 'E') {
              let blackNote = {
                note: currentNote + "#" + octave,
                key: this.allKeys[keyIndex++],
                pressed: false,
              }

              newNote["blackNote"] = blackNote;
            }

            this.notes.push(newNote);

            if(octave === this.config.endOctave && currentNote === this.config.endNote){
              break;
            }

            noteIndex++;
          }

          noteIndex = 0;
      }

      this. whiteNoteWidthSize = 100 / this.notes.length;
    },

    generateNotesIndexesByKey() {
      this.notesIndexesByKey.length = 0; // we clear the array but the reference remains the same

      for(let i = 0; i < this.notes.length; i++){
        this.notesIndexesByKey[this.notes[i].key] = i;

        if(this.notes[i].blackNote != undefined){
          this.notesIndexesByKey[this.notes[i].blackNote.key] = i;
        } 
      }
    },
    
    changeInput(value, noteObject, index) {
      delete this.notesIndexesByKey[noteObject.key];
      noteObject.key = value;
      this.notesIndexesByKey[noteObject.key] = index;      
    }
  },

  computed: {
    startOctavesSelect: function() {
      return this.allOctaves.slice(0, this.config.endOctave);
    },

    endOctavesSelect: function() {
      return this.allOctaves.slice(this.allOctaves[this.config.startOctave], this.allOctaves.length);
    }
  }
}
</script>

<style>
#piano-container {
  width: 100%;
  background-color: black;
  border-radius: 10px;
  box-shadow: 0.6vw 0.6vw 0.8vw 0 rgba(255, 255, 255, 0.2) inset,
    -0.4vw -0.4vw 0.6vw 0 rgba(0, 0, 0, 0.25) inset;
  padding: 0 1%;
}
 
.piano-keyboard {
  position: relative;
  height: 20vw; /* set height according to width size */
  width: 100%;
}
 
.white-note {
  display: flex;
  justify-content: center;
  float: left;
  position: relative;
  cursor: pointer;
  color: black;
  height: 98%;
  width: 4.761%;
  border-left: 1px solid #bbb;
  border-bottom: 1px solid #bbb;
  border-right: 1px solid #333;
  border-radius: 0 0 5px 5px;
  box-shadow: 0px 0px 0px rgba(255, 255, 255, 0.8) inset,
    -2px -5px 3px #ccc inset, 0 0 3px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to bottom, #eee 0%, #fff 100%);
}
 
.white-note-pressed {
  border-left: 1px solid #999;
  border-bottom: 1px solid #999;
  border-right: 1px solid #777;
  box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1) inset,
    -5px 5px 20px rgba(0, 0, 0, 0.2) inset, 0 0 3px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to bottom, #fff 0%, #e9e9e9 100%);
}
 
.black-note {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: absolute;
  cursor: pointer;
  height: 65%;
  width: 65%;
  left: 68%;
  z-index: 1;
  color: white;
  border-radius: 0 0 3px 3px;
  box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
    0 -5px 2px 3px rgba(0, 0, 0, 0.5) inset, 0 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #555, #222);
}
 
.black-note-pressed {
  box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
    0 -2px 2px 3px rgba(0, 0, 0, 0.5) inset, 0 1px 2px rgba(0, 0, 0, 0.5);
  background: linear-gradient(to bottom, #333, #222);
}
 
.key-group {
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.8vw;
  font-size: 1.2vw;
}
 
.key-text {
  margin-top: 0.8vw;
}
 
.key-text-on-black-note {
  transform: rotate(-90deg);
  margin: 0.8vw 0;
  margin-top: 1vw;
}
 
.key-input {
  text-align: center;
  width: 2em;
  border: 1px solid #aaaaaa;
  color: inherit;
  font-size: 1vw;
}
 
.key-input:disabled {
  background: inherit;
  border: none;
  color: inherit;
}
 
.key-input-on-black-note {
  background-color: rgb(60, 60, 60);
  border: 1px solid rgb(80, 80, 80);
}
 
.piano-dashboard {
  height: 9vw; /* set height according to width size */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
 
.piano-dashboard-button {
  height: 70%;
  border: none;
  border-radius: 5%;
  margin: 0.5em 0.5em;
  box-shadow: 0 -5px 2px rgba(0, 0, 0, 0.8) inset, 0 2px 4px rgba(0, 0, 0, 0.7);
  background-color: #333;
 
  color: gainsboro;
  font-size: 1.2vw;
  padding: 0.8em;
  text-transform: uppercase;
  height: 65%;
}
 
.paino-dashboard-icon {
  color: gainsboro !important;
}
 
.piano-dashboard-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 7vw;
  width: 30%;
  background-color: #eeeeee;
  box-shadow: -0.35vw -0.35vw black inset, -0.45vw -0.45vw 0.45vw black inset,
    0.35vw 0.35vw black inset, 0.45vw 0.45vw 0.45vw black inset;
  padding: 0.8vw;
}
 
.piano-dashboard-screen-list {
  width: 100%; 
  height: 100%;
}
 
.piano-dashboard-screen-list::-webkit-scrollbar {
  width: 1px;
}
 
.piano-dashboard-buttons-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}
 
.piano-dashboard-div-select {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
 
.piano-dashboard-select {
  margin-left: 0.5em;
  cursor: pointer;
  border-radius: 4px;
  display: inline-block;
  font: inherit;
  line-height: 1.5em;
  -webkit-appearance: none;
  -moz-appearance: none;
}
 
.piano-dashboard-select::-webkit-scrollbar {
  width: 12px;
}
 
.piano-dashboard-select::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
 
.piano-dashboard-select::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
 
.piano-dashboard-select-option {
  color: white;
}
 
select:focus {
  outline: 0;
}
 
button:focus {
  outline: 0;
}
 
input:focus {
  outline: 0;
}

</style>