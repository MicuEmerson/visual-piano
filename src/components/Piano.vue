<template>
<div id="piano-container">
   <pianoDashboard> </pianoDashboard> 
   <pianoKeyboard> </pianoKeyboard>
   <saveSongDialog> </saveSongDialog>
</div> 
</template>

<script>
import PianoDashboard from "./PianoDashboard"
import PianoKeyboard from "./PianoKeyboard"
import SaveSongDialog from "./SaveSongDialog"
import { mapState, mapActions } from 'vuex';

export default {
  components: { PianoDashboard, PianoKeyboard, SaveSongDialog },
  data: () => {
    return {

    };
  },

  created() {
    this.createSampler();
    this.createRecorder();    
  },
 
  methods: {
    ...mapActions('toneState', ['createSampler']),
    ...mapActions('recordingState', ['createRecorder']),
  },

  computed: {
    ...mapState(['recordingState'])
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
</style>