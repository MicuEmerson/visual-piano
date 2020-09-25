<template>
<div id="piano-container">
   <pianoKeyboard> </pianoKeyboard>
   <saveSongDialog> </saveSongDialog>
</div> 
</template>

<script>
import PianoKeyboard from "./PianoKeyboard"
import SaveSongDialog from "./SaveSongDialog"
import { mapState, mapActions } from 'vuex';

export default {
  components: { PianoKeyboard, SaveSongDialog },
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
}
</style>