<template>
  <div id="app">

    <button @click="editKeys = !editKeys; showKeys = true"> 
        <template v-if="!editKeys"> edit keys </template>
        <template v-else> save keys </template>
    </button>

    <button @click="showNotes = !showNotes"> show notes </button>

    <button @click="showKeys = !showKeys"> show keys </button>

    <div class="piano-container">
        <div v-for="(note, index) in notes" v-if="displayNote(notes[index])" :key="index"
          class="white-note" :class="[pressed[index] ? 'white-pressed' : '']" 
          @mouseleave="removePressedKey(index)" @mousedown="playNote(index); isMousePressed=true"
          @mouseup="removePressedKey(index); isMousePressed=false" @mouseover="playNoteHover(index)">

          <div v-if="index < notes.length - 1 && !['B','E'].includes(notes[index][0])" 
            class="black-note" :class="[pressed[index + 1] ? 'black-pressed' : '']" 
            @mouseleave.stop="removePressedKey(index + 1)" @mousedown.stop="playNote(index + 1); isMousePressed=true"
            @mouseup.stop="removePressedKey(index + 1); isMousePressed=false" @mouseover.stop="playNoteHover(index + 1)">

            <div style="margin-top: 7vh">
              <template v-if="showKeys">
                <input :disabled="editKeys !== true" v-model="keys[index + 1]" class="key-input"/>
              </template>
              <template v-if="showNotes">
                {{notes[index + 1]}}
              </template>
            </div>

          </div>

          <div style="margin-top: 17vh">
            <template v-if="showKeys">
              <input :disabled="editKeys !== true" v-model="keys[index]" class="key-input"/>
            </template>
            <template v-if="showNotes">
              {{notes[index]}}
            </template>
          </div>
        </div>
    </div> 

  </div>
</template>

<script>
import { Sampler } from "tone";

const SAMPLE_BASE_URL = "./samples/1/";

export default {

  data: () => {
    return {
      sampler: {
        type: Sampler,
        default: {},
      },

      editKeys : false,
      showKeys : false,
      showNotes: false,
      isMousePressed: false,
      
      notes: [
            "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
            "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
            "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5"
      ],

      keys: [
            "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z",
            "x", "c", "v", "b", "n", "m", ",", ".", "/", "q", "w", "e",
            "r", "t", "y", "u", "i", "o", "p", "[", "]", "1", "2", "3"
      ],

      pressed: [
        false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false,
      ],


      samples: [
          ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1"],
          ["G1", "G#1", "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2"],
          ["F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3"],
          ["D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4"],
          ["D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"],
          ["C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5"],
          ["A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6"],
          ["G#6", "A6", "A#6", "B6"]
      ]

    };
  },

  created() {
    const SAMPLE_MAP = this.notes.flat().reduce((acc, val) => {
      acc[val] = `${val.replace("#", "s")}.mp3`;
      return acc;
    }, {});

    this.sampler = new Sampler({
      urls: SAMPLE_MAP,
      onload : () => {},
      baseUrl: SAMPLE_BASE_URL
    }).toDestination();


    //TODO, add this window events to be more specific for piano component
    window.addEventListener("keydown", e => {
      const index = this.keys.indexOf(e.key);
      if(index != -1){
        this.playNote(index);
      }
    });

    window.addEventListener("keyup", e => {
      const index = this.keys.indexOf(e.key);
      if(index != -1){
        this.removePressedKey(index);
      }
    });

    window.onmouseup = () => {
      this.isMousePressed = false;
    }

    // window.onmousedown = () => {
    //   this.isMousePressed = true;
    // }

  },

  destroyed() {
    window.removeEventListener('keydown', () => {});
    window.removeEventListener('keyup', () => {});
  },

  methods: {
    playNote(index) {
      if(!this.editKeys){
        this.addPressedKey(index);
        this.sampler.triggerAttackRelease(this.notes[index], "2n");
      }
    },

     playNoteHover(index) {
      if(this.isMousePressed){
        this.playNote(index);
      }
    },

    convertToBlackNote(note) {
      return note[0] + "#" + note[1]; 
    },

    displayNote(note) {
      return note[1] !== '#';
    },

    addPressedKey(index){
      this.$set(this.pressed, index, true);
    },

    removePressedKey(index){
      this.$set(this.pressed, index, false);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.piano-container {
  position: absolute;
  top: 300px;
  left: calc(50% - 600px);
  border: 5px solid black;
  height: 205px;
  overflow: hidden;
}

.white-note {
  height: 100%;
  width: 60px;
  float: left;
  position: relative;
  background: white;
  overflow: visible;
  border-right: 1px solid black;
  color: #000000;
}

.white-pressed{
  background: lightgray !important;
}

.black-note {
  position: absolute;
  height: 65%;
  width: 65%;
  left: 68%;
  z-index: 1;
  background: #777;
  color: white;
}

.black-pressed {
  background: black;
}

.key-input {
  text-align: center;
  width: 25px;
  background: inherit;
  border: 1px solid black;
  color: inherit;
}

.key-input:disabled{
  background: inherit;
  border: none;
  color: inherit;
}

* {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10+ and Edge */
  user-select: none; /* Standard syntax */
}
</style>
