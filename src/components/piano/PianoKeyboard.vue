<template>
    <div id="piano-container">
      <div class="piano-keyboard">
          <div v-for="(noteObject, index) in keyboardState.notes" :key="index"
            class="white-note" :class="[noteObject.pressed ? 'white-note-pressed' : '']"
            :style="{width: keyboardState.whiteNoteWidthSize + '%', background: whiteNoteBackground(noteObject.pressed)}" :data-note="noteObject.note"
            @mousedown="playNoteMouse({index, forBlackNote : false})" @mouseup="removePressedKeyMouse({index, forBlackNote : false})"
            @mouseover="playNoteHover({index, forBlackNote : false})" @mouseleave="removePressedKey({index, forBlackNote : false})">
              
            <div v-if="noteObject.blackNote" 
              class="black-note" :class="[noteObject.blackNote.pressed ? 'black-note-pressed' : '']" 
              :style="{background: blackNoteBackground(noteObject.blackNote.pressed)}" :data-note="noteObject.blackNote.note"
              @mousedown.stop="playNoteMouse({index, forBlackNote : true})" @mouseup.stop="removePressedKeyMouse({index, forBlackNote : true})"
              @mouseover.stop="playNoteHover({index, forBlackNote : true})" @mouseleave.stop="removePressedKey({index, forBlackNote : true})">

              <div class="key-group">
                  <template v-if="menuState.showKeys">
                    <input :disabled="menuState.editKeys !== true" class="key-input key-input-on-black-note"
                    :value="noteObject.blackNote.key"
                    @input="handleInput($event.target.value, noteObject.blackNote.key, index, true)"/>
                  </template>

                  <template v-if="menuState.showNotes">
                    <div class="key-text key-text-on-black-note">
                        {{noteObject.blackNote.note}}
                    </div>
                  </template>
              </div>
            </div> 

            <div class="key-group"> 
              <template v-if="menuState.showKeys" >
                <input :disabled="menuState.editKeys !== true" class="key-input"
                  :value="noteObject.key"
                  @input="handleInput($event.target.value, noteObject.key, index, false)"/>
              </template>

              <template v-if="menuState.showNotes">
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
import { mapState, mapActions } from "vuex";
import { keyboardState, toneState, recordingState, canvasState, menuState } from "@/store/consts/states.js";
import { initCanvas, createSampler, createRecorder, generateNotes , generateNotesIndexesByKey,
  playNote, playNoteMouse, playNoteHover, removePressedKey,
  removePressedKeyMouse, changeInput } from "@/store/consts/actions.js"
import { SET_MOUSE_PRESSED } from "@/store/consts/mutations.js";

const WORKER_FILE_PATH = "/worker.js"

export default {
  
  mounted() {
    const canvas = document.getElementsByTagName("canvas")[0];
    const pianoContainerDimensions = document.getElementById("piano-container").getBoundingClientRect();

    canvas.height = Math.floor(window.innerHeight - pianoContainerDimensions.height + 1);
    canvas.width = Math.floor(pianoContainerDimensions.width);

    const offscreenCanvas = canvas.transferControlToOffscreen();
    this.initCanvas({offscreenCanvas, workerFile : WORKER_FILE_PATH});

    this.$root.$emit("resize_canvas_notes");
  },

  created() {
    this.createSampler();
    this.createRecorder();    
    this.generateNotes();
    this.generateNotesIndexesByKey();

    window.addEventListener("keydown", e => {
      const key = e.key;
      const index = this.keyboardState.notesIndexesByKey[key];

      if(index != undefined && !this.recordingState.saveRecordingDialog) {
        this.playNote({index, forBlackNote : this.keyboardState.notes[index].key === key ? false : true});
      }
    });

    window.addEventListener("keyup", e => {
      const key = e.key;
      const index = this.keyboardState.notesIndexesByKey[key];

      if(index != undefined) {
        this.removePressedKey({index, forBlackNote : this.keyboardState.notes[index].key === key ? false : true});
      }
    });

    window.onmouseup = () => {
       this.$store.commit(keyboardState + "/" + SET_MOUSE_PRESSED, false);
    }
  },

  destroyed() {
    window.removeEventListener('keydown', () => {});
    window.removeEventListener('keyup', () => {});
    window.removeEventListener('onmouseup', () => {});
  },

  methods: {
    ...mapActions(toneState, [createSampler]),

    ...mapActions(recordingState, [createRecorder]),

    ...mapActions(keyboardState, [generateNotes, generateNotesIndexesByKey,
     playNote, playNoteMouse, playNoteHover, removePressedKey, removePressedKeyMouse, changeInput]),

    ...mapActions(canvasState, [initCanvas]),

    handleInput(value, key, index, forBlackNote){
      if(value !== '')
        this.changeInput({value, key, index, forBlackNote});
    },

    whiteNoteBackground: function(pressed){
      return pressed ? this.menuState.whiteNoteColor : 'linear-gradient(to bottom, #eee 0%, #fff 100%)';
    },
    
    blackNoteBackground: function(pressed){
      return pressed ? this.menuState.blackNoteColor : 'linear-gradient(45deg, #555, #222)';
    }
  },

  computed: {
    ...mapState([keyboardState, menuState, recordingState, canvasState]),
  }
}
</script>

<style>

#piano-container {
  width: 100%;
  background-color: black;
}

.piano-keyboard {
  position: relative;
  height: 14vw;
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
}
 
.white-note-pressed {
  border-left: 1px solid #999;
  border-bottom: 1px solid #999;
  border-right: 1px solid #777;
  box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1) inset,
    -5px 5px 20px rgba(0, 0, 0, 0.2) inset, 0 0 3px rgba(0, 0, 0, 0.2);
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
}
 
.black-note-pressed {
  box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
    0 -2px 2px 3px rgba(0, 0, 0, 0.5) inset, 0 1px 2px rgba(0, 0, 0, 0.5);
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

</style>
