<template>
  <div id="app">

    <button @click="editKeys = !editKeys"> edit keys </button>

    <div class="piano-container"> 
        <div v-for="(note, index) in notes" v-if="displayNote(notes[index])" :key="index" class="white-note" @click="playNote(notes[index])">
          
          <div v-if="index < notes.length - 1 && !['B','E'].includes(notes[index][0])" class="black-note" @click.stop="playNote(notes[index + 1])">
            <div style="margin-top: 7vh">
              <input :disabled="editKeys !== true" v-model="keys[index + 1]" class="key-input"/>
            </div>
          </div>  

          <div style="margin-top: 17vh">
            <input :disabled="editKeys !== true" v-model="keys[index]" class="key-input"/> 
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


    // document.addEventListener('keydown ', e => {
    //   console.log(e);
    // });

    window.addEventListener("keydown", e => {
      const index = this.keys.indexOf(e.key);
      if(index != -1)
        this.playNote(this.notes[index]);
    });

    // window.addEventListener("keyup", e => {
		//   console.log(String.fromCharCode(e.keyCode));
		//   console.log(e.keyCode);
    // });
  },

  destroyed() {
	  window.removeEventListener('keydown', () => {});
  },

  methods: {
    playNote(note) {
      if(!this.editKeys)
        this.sampler.triggerAttackRelease(note, "2n");
    },

    convertToBlackNote(note){
      return note[0] + "#" + note[1]; 
    },

    displayNote(note){
      return note[1] !== '#';
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
  color: black;
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

.key-input {
  /* border: none; */
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


</style>
