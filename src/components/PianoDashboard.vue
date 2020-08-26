<template>
    <div class="piano-dashboard">
      
      <!-- <audio controls> </audio> -->

      <!-- v-if -->
      <template v-if="dashboardState.showConfig">
        <div class="piano-dashboard-buttons-group">
          <button class="piano-dashboard-button" @click="editKeys()">
            <template v-if="!dashboardState.editKeys">Edit Keys</template>
            <template v-else>Save Keys</template>
          </button>
 
          <div class="piano-dashboard-div-select piano-dashboard-button">
            <label>Start Octave:</label>
            <select size="3" v-model="startOctave" class="piano-dashboard-select">
              <option
                class="piano-dashboard-select-option"
                v-for="option in startOctavesSelect"
                :value="option"
                :key="option"
              >{{ option }}</option>
            </select>
          </div>
 
          <div class="piano-dashboard-div-select piano-dashboard-button">
            <label>End Octave:</label>
            <select size="3" v-model="endOctave" class="piano-dashboard-select">
              <option
                class="piano-dashboard-select-option"
                v-for="option in endOctavesSelect"
                :value="option"
                :key="option"
              >{{ option }}</option>
            </select>
          </div>
        </div>
 
        <button class="piano-dashboard-button" @click="showConfig()">
          <v-icon class="paino-dashboard-icon" size="3vw">mdi-window-close</v-icon>
        </button>
      </template>
 
      <!-- v-else -->
      <template v-else>
        <div class="piano-dashboard-buttons-group" style="flex:1">
          <button class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-record</v-icon>
          </button>
          <button class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-play</v-icon>
          </button>
          <button class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-stop</v-icon>
          </button>
        </div>
 
        <div class="piano-dashboard-screen">
          <select size="3" v-model="dashboardState.endOctave" class="piano-dashboard-screen-list">
            <option
              v-for="option in endOctavesSelect"
              :value="option"
              :key="option"
            >Hello {{ option }}</option>
          </select>
        </div>
 
        <div class="piano-dashboard-buttons-group" style="flex: 1; justify-content: flex-end">
          <button class="piano-dashboard-button">
            <v-icon class="paino-dashboard-icon" size="3vw">mdi-playlist-music</v-icon>
          </button>
 
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
import { mapState } from 'vuex';

export default {
  data: () => {
    return {
        
    }
  },

  methods:{
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

  },

  computed: {
    startOctavesSelect: function() {
      return this.dashboardState.allOctaves.slice(0, this.dashboardState.endOctave);
    },

    endOctavesSelect: function() {
      return this.dashboardState.allOctaves.slice(this.dashboardState.allOctaves[this.dashboardState.startOctave], this.dashboardState.allOctaves.length);
    },
    
    ...mapState(['dashboardState']),

    startOctave: {
      get () {
        return this.dashboardState.startOctave;
      },
      set (value) {
        this.$store.dispatch("dashboardState/changeStartOctave", value)
      }
    },

    endOctave: {
      get () {
        return this.dashboardState.endOctave;
      },
      set (value) {
        this.$store.dispatch("dashboardState/changeEndOctave", value)
      }
    },


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
  padding: 0.8vw;
}
 
.piano-dashboard-screen-list {
  width: 100%; 
  height: 100%;
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
 
.piano-dashboard-div-select {
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
</style>
