<template>
  <div id="app">

    <div class="piano-container">
        <div  v-for="note in notes" :key="note"  class="white-note" @click="playNote(note)">
        
          <div v-if="note[0] !== 'E' && note[0] !== 'B'" class="black-note" @click.stop="playNote(convertToBlackNote(note))">
            <div style="margin-top: 7vh">
            {{convertToBlackNote(note)}}
            </div>
          </div>

          <div style="margin-top: 17vh">
            {{note}}
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
      sampler: Object,
      
      notes: ["C3", "D3", "E3", "F3", "G3", "A3", "B3",
                   "C4", "D4", "E4", "F4", "G4", "A5", "B5",
                   "C5", "D5", "E5", "F5", "G5", "A6", "B6"],

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
  },

  methods: {
    playNote(note) {
      this.sampler.triggerAttackRelease(note, "2n");
    },

    convertToBlackNote(note){
      return note[0] + "#" + note[1]; 
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
}

.black-note {
  position: absolute;
  height: 65%;
  width: 65%;
  left: 68%;
  z-index: 1;
  background: #777;
}

</style>
