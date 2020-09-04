<template>
    <div class="piano-dashboard">
      <!-- v-if -->
      <template v-if="dashboardState.showConfig">
        <div class="piano-dashboard-buttons-group">
          <button class="piano-dashboard-button" @click="editKeys()">
            <template v-if="!dashboardState.editKeys">Edit Keys</template>
            <template v-else>Save Keys</template>
          </button>
 
          <div class="piano-dashboard-change-octave piano-dashboard-button">
            <label>Start Octave:</label>
            <div class="piano-octave-ctrl">
              <v-icon :disabled="dashboardState.startOctave == 0" @click="setStartOctave(dashboardState.startOctave - 1)"
                class="paino-dashboard-icon arrow-icon" size="1.8vw">
                mdi-chevron-up
              </v-icon>
              <div>{{dashboardState.startOctave}}</div>
              <v-icon :disabled="dashboardState.endOctave - dashboardState.startOctave <= 1" @click="setStartOctave(dashboardState.startOctave + 1)"
                class="paino-dashboard-icon arrow-icon" size="1.8vw">
                mdi-chevron-down
              </v-icon>
            </div>
          </div>
 
          <div class="piano-dashboard-change-octave piano-dashboard-button">
            <label>End Octave:</label>
             <div class="piano-octave-ctrl">
              <v-icon :disabled="dashboardState.endOctave - dashboardState.startOctave <= 1" @click="setEndOctave(dashboardState.endOctave - 1)"
                class="paino-dashboard-icon arrow-icon" size="1.8vw">
                mdi-chevron-up
              </v-icon>
              <div>{{dashboardState.endOctave}}</div>
              <v-icon :disabled="dashboardState.endOctave == dashboardState.maxEndOctave" @click="setEndOctave(dashboardState.endOctave + 1)"
                class="paino-dashboard-icon arrow-icon" size="1.8vw">
                mdi-chevron-down
              </v-icon>
            </div>
          </div>
        </div>
 
        <button class="piano-dashboard-button" @click="showConfig()">
          <v-icon class="paino-dashboard-icon" size="3vw">mdi-window-close</v-icon>
        </button>
      </template>
 
      <!-- v-else -->
      <template v-else>
        <div class="piano-dashboard-buttons-group" style="flex:1">
          <button style="position: relative" class="piano-dashboard-button" @click="handleRecording()">
            <div :style="{background: recordLight}" class="record-light"/>
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-record</v-icon>
          </button>
          <button class="piano-dashboard-button" @click="togglePlay()">
            <v-icon class="paino-dashboard-icon" size="3vw">{{playIcon}}</v-icon>
          </button>
          <button class="piano-dashboard-button" @click="stopPlaying()">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-stop</v-icon>
          </button>
        </div>
 
        <div class="piano-dashboard-screen">
          <select size="3" v-model="currentSongPlaylist" class="piano-dashboard-screen-list">
            <option
              v-for="(option, index) in playlistState.songs"
              :value="option"
              :key="index"
            >{{ option.name }}</option>
          </select>
        </div>
 
        <div class="piano-dashboard-buttons-group" style="flex: 1; justify-content: flex-end">
          <!-- <button class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-playlist-music</v-icon>
          </button> -->
 
          <button @click="showNotes()" class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-music-note</v-icon>
          </button>
 
          <button @click="showKeys()" class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-keyboard-outline</v-icon>
          </button>
 
          <button @click="showConfig()" class="piano-dashboard-button" >
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-cogs</v-icon>
          </button>
        </div>
      </template>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data: () => {
    return {
      
     
    }
  },

  methods:{
    togglePlay() {
        if (this.dashboardState.playing) {
          this.toneState.tone.Transport.pause();
        } else {
          this.toneState.tone.Transport.start()
        }

        this.$store.commit("dashboardState/SET_PLAYING", !this.dashboardState.playing);
    },

    stopPlaying() {
        this.$store.dispatch("playlistState/stopPlaying", "");
    },

    handleRecording(){
      this.recordingState.isRecording ? this.stopRecording() : this.startRecording();
    },

    ...mapActions('recordingState', ['startRecording', 'stopRecording']),

    editKeys(){
      this.$store.commit("dashboardState/SET_EDIT_KEYS", !this.dashboardState.editKeys);
      this.$store.commit("dashboardState/SET_SHOW_KEYS", !this.dashboardState.showKeys);
    },

    showConfig(){
      this.$store.commit("dashboardState/SET_SHOW_CONFIG", !this.dashboardState.showConfig);
    },

    showKeys(){
      this.$store.commit("dashboardState/SET_SHOW_KEYS", !this.dashboardState.showKeys);
    },

    showNotes(){
      this.$store.commit("dashboardState/SET_SHOW_NOTES", !this.dashboardState.showNotes);
    },

    setStartOctave(value){
        this.$store.dispatch("dashboardState/changeStartOctave", value)
    },

    setEndOctave(value){
        this.$store.dispatch("dashboardState/changeEndOctave", value)
    }

  },

  computed: {
    ...mapState(['dashboardState', 'toneState', 'playlistState', 'recordingState']),

    startOctavesSelect: function() {
      return this.dashboardState.allOctaves.slice(0, this.dashboardState.endOctave);
    },

    endOctavesSelect: function() {
      return this.dashboardState.allOctaves.slice(this.dashboardState.allOctaves[this.dashboardState.startOctave], this.dashboardState.allOctaves.length);
    },
    
    recordLight : function() {
      return this.recordingState.isRecording ? "linear-gradient(-45deg, green, rgb(152,251,152,0.7))" : "linear-gradient(-45deg, red, rgb(240,128,128,0.7))";
    },

    playIcon: function() {
      return this.dashboardState.playing ? 'mdi-pause' : 'mdi-play';
    },

    currentSongPlaylist: {
      get () {
        return this.playlistState.currentSong;
      },
      set (value){
        this.$store.dispatch("dashboardState/changeStartOctave", 0);
        this.$store.dispatch("dashboardState/changeEndOctave", this.dashboardState.maxEndOctave);
        this.$store.dispatch("playlistState/stopPlaying", value);
      }
    }
  }
}

</script>

<style>

.piano-dashboard {
  height: 9vw; /* set height according to width size */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.piano-dashboard-button {
  height: 70%;
  border: none;
  border-radius: 5%;
  margin: 0.5em 0.5em;
  box-shadow: 0 -5px 2px rgba(0, 0, 0, 0.8) inset, 0 2px 4px rgba(0, 0, 0, 0.7);
  background-color: #333;
 
  color: gainsboro;
  font-size: 1.2vw;
  padding: 0.8em;
  text-transform: uppercase;
  height: 65%;
}
 
.paino-dashboard-icon {
  color: gainsboro !important;
}

.piano-octave-ctrl {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
 
.piano-dashboard-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 7vw;
  width: 30%;
  background-color: #eeeeee;
  box-shadow: -0.35vw -0.35vw black inset, -0.45vw -0.45vw 0.45vw black inset,
    0.35vw 0.35vw black inset, 0.45vw 0.45vw 0.45vw black inset;
  padding: 0.9vw;
}
 
.piano-dashboard-screen-list {
  width: 100%; 
  height: 100%;
}

.piano-dashboard-screen-song {
  height: 33.33%;
  font-size: 1.5vw;
}
 
.piano-dashboard-screen-list::-webkit-scrollbar {
  width: 1px;
}
 
.piano-dashboard-buttons-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}
 
.piano-dashboard-change-octave{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
 
.piano-dashboard-select {
  margin-left: 0.5em;
  cursor: pointer;
  border-radius: 4px;
  display: inline-block;
  font: inherit;
  line-height: 1.5em;
  -webkit-appearance: none;
  -moz-appearance: none;
}
 
.piano-dashboard-select::-webkit-scrollbar {
  width: 12px;
}
 
.piano-dashboard-select::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
 
.piano-dashboard-select::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
 
.piano-dashboard-select-option {
  color: white;
}

.arrow-icon {
  cursor: pointer;
}

.arrow-icon:hover {
  color:#ffb200 !important;
}

.record-light {
  position: absolute !important;
  right: 0.5vw;
  top: 0.5vw;
  width: 0.7vw;
  height: 0.7vw;
  border-radius: 50%;
    box-shadow:
    0 0 0.5vw 0.1vw rgba(255,255,255,0.4),
    inset 0 0 0.25vw rgba(255,255,255,0.6)
}

</style>
