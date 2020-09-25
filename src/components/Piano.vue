<template>
  <div id="piano-container">
    <pianoKeyboard> </pianoKeyboard>
  </div> 
</template>

<script>
import PianoKeyboard from "./PianoKeyboard"
import { mapState, mapActions } from 'vuex';

export default {
  components: { PianoKeyboard },

  created() {
    this.createSampler();
    this.createRecorder();    
  },
 
  methods: {
    ...mapActions('toneState', ['createSampler']),
    ...mapActions('recordingState', ['createRecorder']),
  },
}
</script>

<style>
#piano-container {
  width: 100%;
  background-color: black;
  border-radius: 10px;
  box-shadow: 0.6vw 0.6vw 0.8vw 0 rgba(255, 255, 255, 0.2) inset,
    -0.4vw -0.4vw 0.6vw 0 rgba(0, 0, 0, 0.25) inset;
}
</style>