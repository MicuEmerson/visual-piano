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
}
</style>