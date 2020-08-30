<template>
<!-- <div > 
 <v-btn
    color="primary"
    dark
    @click.stop="dialog = true"
  >
    Open Dialog
  </v-btn>
  <v-dialog
      persistent
      v-model="dialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title>Save recording</v-card-title>

        <v-card-text>
          <audio controls style="width: 100%; min-width: 200px;"> </audio> 
          <v-text-field
            label="Song name"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn
            style="margin: 5px"
            dark
            @click="dialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
          style="margin: 5px"
            dark
            @click="dialog = false"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    </div> -->

<div id="piano-container">
   <audio controls> </audio>
   <pianoDashboard> </pianoDashboard> 
   <pianoKeyboard> </pianoKeyboard> 
</div> 
</template>

<script>
// import { Midi } from "@tonejs/midi"
import PianoDashboard from "./PianoDashboard"
import PianoKeyboard from "./PianoKeyboard"
import { mapState, mapActions } from 'vuex';

export default {
  components: { PianoDashboard, PianoKeyboard },
  data: () => {
    return {
      dialog: true,
    };
  },

  created() {
    this.createSampler();
    this.createRecorder();    
  },
 
  methods: {
    ...mapActions('toneState', ['createSampler']),
    ...mapActions('recordingState', ['createRecorder']),
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