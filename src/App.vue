<template>
  <div id="app">
    
    <div class="piano-container">
        <div class="white-note" v-for="nota in whiteNotes" :key="nota" @click="ataca(nota)">
          <div style="margin-top: 40px;">
            {{nota}}
          </div>
        </div>
    </div>
    
  </div>
</template>

<script>


import { Sampler } from "tone";

export default {

  data: () => {
    return {
      sampler: Object,

      whiteNotes: ["C3", "D3", "E3", "F3", "G3", "A3", "B3",
                   "C4", "D4", "E4", "F4", "G4", "A5", "B5",
                   "C5", "D5", "E5", "F5", "G5", "A6"],

      blackNotes: ["C#3", "D#3", "F#3", "G#3", "A#3",
                   "C#4", "D#4", "F#4", "G#4", "A#4",
                   "C#5", "D#5", "F#5", "G#5", "A#5"]
    };
  },

  created() {
    this.sampler = new Sampler({
        urls: {
          A0:"A0.mp3", A1: "A1.mp3", A2: "A2.mp3", A3: "A3.mp3", A4: "A4.mp3", A5: "A5.mp3", A6: "A6.mp3", A7: "A7.mp3",
          C1: "C1.mp3", C2: "C2.mp3", C3: "C3.mp3", C4: "C4.mp3", C5: "C5.mp3", C6: "C6.mp3", C7: "C7.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();
  },

  methods: {
    ataca(nota) {
      this.sampler.triggerAttackRelease(nota, 2.5);
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
  margin-left: 30%;
  margin-top: 20%;
  display: flex;
  background: gray;
  border: 1px solid black;
  height: 100px;
  width: 700px;
  display:flex;
  /* justify-content: space-between; */
  overflow: hidden;
  position: relative;
}

.white-note {
 background: white;
 border: 2px solid black;
 overflow: hidden;
 text-align: center;
 flex:1 0;
}

</style>
