<template>
    <v-dialog persistent v-model="recordingState.saveRecordingDialog" max-width="400px">
      <v-card>
        <v-card-title>Save recording</v-card-title>

        <v-card-text>
          <audio controls style="width: 100%; min-width: 200px;"> </audio> 

          <v-text-field label="Song name" v-model="songName"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>

          <v-btn style="margin: 5px" dark @click="handleCancel()">
            Cancel
          </v-btn>

          <v-btn style="margin: 5px" dark @click="handleSave()">
            Save
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { recordingState } from "@/store/consts/states.js";
import { SET_SAVE_RECORDING_DIALOG } from "@/store/consts/mutations.js";

export default {
  data: () => {
    return {
      songName : "",
    };
  },

  methods: {
    ...mapActions(recordingState, ['saveSong']),

    handleCancel(){
      this.$store.commit(recordingState + "/" + SET_SAVE_RECORDING_DIALOG, false);
    },

    handleSave(){
      if(this.songName === "")
        this.songName = "default name";

      this.saveSong(this.songName);

      this.songName = "";
    }
  },

  computed: {
    ...mapState([recordingState])
  }
}
</script>