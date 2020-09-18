<template>
<div style="width: 100%;">
    <div class="top-nav">
        <div style="flex:1; display: flex; justify-content: space-between">
            <v-icon class="paino-icon">mdi-piano</v-icon>
            <div style="display: flex; align-items: center">
                <div @click="handleRecording()" :style="{background: recordLight}" class="record-icon"/>
                <button @click="togglePlay()"><v-icon class="paino-icon">{{playIcon}}</v-icon></button>
                <button @click="stopPlaying()"><v-icon class="paino-icon">mdi-stop</v-icon></button>
            </div>
        </div>
        <div class="screen">
            <v-select
                v-model="currentSongPlaylist" 
                :items="playlistState.songs"
                item-text="name"
                :menu-props="{ auto: true, maxHeight: 50 }"
                return-object
                hide-details
                solo
            ></v-select>
        </div>
        <div style="flex: 1;  display: flex; justify-content: space-between"> 
            <div style="display: flex;">
                <button @click="showNotes()"><v-icon class="paino-icon">mdi-music-note</v-icon></button>
                <button @click="showKeys()"><v-icon class="paino-icon">mdi-keyboard-outline</v-icon></button>
            </div>
            <button @click="showConfig()"><v-icon class="paino-icon">{{configIcon}}</v-icon></button>
        </div>
    </div>
    <div v-if="dashboardState.showConfig" class="sub-top-nav"> 

    <v-container text-xs-center fluid style="padding: 0 12px !important">
        <v-row justify="center" align="center">
            <v-col cols="12" sm="4"> 
                <div @click="editKeys()" class="config config-button" :style="{fontSize: fontSize + 'em', minHeight: 5 * fontSize + 'em'}">
                    <template v-if="!dashboardState.editKeys">Edit Keys</template>
                    <template v-else>Save Keys</template>
                </div>
            </v-col>

            <v-col cols="12" sm="4">
                <div class="config" :style="{fontSize: fontSize + 'em', minHeight: 5 * fontSize + 'em'}">
                    <label>Start Octave:</label>
                    <div>
                        <v-icon :disabled="dashboardState.startOctave == 0" @click="setStartOctave(dashboardState.startOctave - 1)"
                            class="paino-icon arrow-icon" size="1.8vw">
                            mdi-chevron-up
                        </v-icon>
                        <div>{{dashboardState.startOctave}}</div>
                        <v-icon :disabled="dashboardState.endOctave - dashboardState.startOctave <= 1" @click="setStartOctave(dashboardState.startOctave + 1)"
                            class="paino-icon arrow-icon" size="1.8vw">
                            mdi-chevron-down
                        </v-icon>
                    </div>
                </div>
            </v-col>

            <v-col cols="12" sm="4"> 
                <div class="config" :style="{fontSize: fontSize + 'em', minHeight: 5 * fontSize + 'em'}">
                    <label>End Octave:</label>
                    <div>
                    <v-icon :disabled="dashboardState.endOctave - dashboardState.startOctave <= 1" @click="setEndOctave(dashboardState.endOctave - 1)"
                        class="paino-icon arrow-icon" size="1.8vw">
                        mdi-chevron-up
                    </v-icon>
                    <div>{{dashboardState.endOctave}}</div>
                    <v-icon :disabled="dashboardState.endOctave == dashboardState.maxEndOctave" @click="setEndOctave(dashboardState.endOctave + 1)"
                        class="paino-icon arrow-icon" size="1.8vw">
                        mdi-chevron-down
                    </v-icon>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
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

        playIcon: function() {
            return this.dashboardState.playing ? 'mdi-pause' : 'mdi-play';
        },

        configIcon: function() {
            return this.dashboardState.showConfig ? 'mdi-chevron-up' : 'mdi-chevron-down'
        },

        recordLight : function() {
            return this.recordingState.isRecording ? "linear-gradient(-45deg, green, rgb(152,251,152,0.7))" : "linear-gradient(-45deg, red, rgb(240,128,128,0.7))";
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
        },

        fontSize() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return 0.7;
                default: return 0.8;
            }
        }
    }
}
</script>

<style>

.top-nav {
    display: flex;
    background-color: #111111;
}

.sub-top-nav {
    display: flex;
    background-color: #222;
    color: gainsboro;
    position: absolute;
    z-index: 1;
    width: 100%;
}

.top-nav .screen {
    display: flex; 
    align-items: center;
    justify-content: center;
    width: 30%;
    margin: 5px;
}

.paino-icon {
  color: gainsboro !important;
  margin: 0 5px;
}

.paino-icon:hover {
  color:#ffb200 !important;
}

.arrow-icon {
  cursor: pointer;
}

.arrow-icon:hover {
  color:#ffb200 !important;
}

.config {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #111111;
    height: 100%;
    border-radius: 0.5em;
}

.config-button {
    cursor: pointer;
}

.config-button:hover {
    color:#ffb200;
}

.record-icon {
    cursor: pointer;
    width: 1em;
    height: 1em;
    margin: 0 5px;
    border-radius: 50%;
        box-shadow:
        0 0 0.5vw 0.1vw rgba(255,255,255,0.4),
        inset 0 0 0.25vw rgba(255,255,255,0.6)
}

.v-text-field.v-text-field--solo .v-input__control {
    min-height: 0 !important;
}

.v-list-item {
    min-height: 0 !important;   
}

.v-text-field.v-text-field--solo .v-input__control {
    height: 2em;
    font-size: 0.8em;
}

.v-list-item .v-list-item__title, .v-list-item .v-list-item__subtitle{
    font-size: 0.8em;
}

.v-icon.v-icon{
    font-size: 2em;
}  

</style>