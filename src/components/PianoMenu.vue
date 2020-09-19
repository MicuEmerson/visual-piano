<template>
    <div style="width: 100%">
        <v-container fluid class="top-nav">
            <v-row style="align-items: center">
                <v-col cols="12" sm="4" class="no-default-vertical-padding"> 
                    <div class="buttons-section">
                        <v-icon class="piano-icon">mdi-piano</v-icon>

                        <div style="display: flex; align-items: center">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                        <div
                                            @click="handleRecording()" 
                                            v-bind="attrs"
                                            v-on="on"
                                            :style="{background: recordLight}" 
                                            class="record-icon"/>
                                </template>
                                <span>Record</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button 
                                        @click="togglePlay()"
                                        v-bind="attrs"
                                        v-on="on">
                                        <v-icon class="piano-icon">{{playIcon}}</v-icon>
                                    </button>
                                </template>
                                <span>{{playIconTooltip}}</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button 
                                        @click="stopPlaying()"
                                        v-bind="attrs"
                                        v-on="on">
                                        <v-icon class="piano-icon">mdi-stop</v-icon>
                                    </button>
                                </template>
                                <span>Stop</span>
                            </v-tooltip>
                        </div>
                    </div>
                </v-col>

                <v-col cols="12" sm="4" class="no-default-vertical-padding"> 
                    <div class="screen">
                        <v-select
                            v-model="currentSongPlaylist" 
                            :items="playlistState.songs"
                            @change="onChangeSong"
                            item-text="name"
                            :menu-props="{ auto: true, maxHeight: 50 }"
                            return-object
                            hide-details
                            solo
                        ></v-select>
                    </div>
                </v-col>

                <v-col cols="12" sm="4" class="no-default-vertical-padding"> 
                    <div class="buttons-section"> 
                        <div style="display: flex; align-items: center">
                             <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button 
                                        @click="showNotes()"
                                        v-bind="attrs"
                                        v-on="on">
                                        <v-icon class="piano-icon">mdi-music-note</v-icon>
                                    </button>
                                </template>
                                <span>Music notes</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button 
                                        @click="showKeys()"
                                        v-bind="attrs"
                                        v-on="on">
                                        <v-icon class="piano-icon">mdi-keyboard-outline</v-icon>
                                    </button>
                                </template>
                                <span>Keys</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button 
                                        class="sustain-button"
                                        @click="isSustain = !isSustain"
                                        v-bind="attrs"
                                        v-on="on">
                                        <img v-if="isSustain" src="../assets/sustain-on.png"/>
                                        <img v-else src="../assets/sustain-off.png"/>
                                    </button>
                                </template>
                                <span>Sustain</span>
                            </v-tooltip>
                        </div>

                        <button @click="showConfig()"><v-icon class="piano-icon">{{configIcon}}</v-icon></button>
                    </div>
                </v-col>
            </v-row>
        </v-container>

        <v-container text-xs-center fluid :class="dashboardState.showConfig ? 'height-auto': 'height-zero'" class="sub-top-nav">
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
                                class="piano-icon arrow-icon" size="1em">
                                mdi-chevron-up
                            </v-icon>
                            <div>{{dashboardState.startOctave}}</div>
                            <v-icon :disabled="dashboardState.endOctave - dashboardState.startOctave <= 1" @click="setStartOctave(dashboardState.startOctave + 1)"
                                class="piano-icon arrow-icon" size="1em">
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
                            class="piano-icon arrow-icon" size="1em">
                            mdi-chevron-up
                        </v-icon>
                        <div>{{dashboardState.endOctave}}</div>
                        <v-icon :disabled="dashboardState.endOctave == dashboardState.maxEndOctave" @click="setEndOctave(dashboardState.endOctave + 1)"
                            class="piano-icon arrow-icon" size="1em">
                            mdi-chevron-down
                        </v-icon>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>

        <v-overlay :value="isLoading">
            <button @click="isLoading=false"> Close </button>
            <v-progress-circular indeterminate>
            </v-progress-circular>
        </v-overlay>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data: () => {
        return {
            isLoading: false,
            isSustain: false
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

        onChangeSong: function() {
            this.isLoading = true;
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

        playIconTooltip: function() {
            return this.dashboardState.playing ? 'Pause' : 'Play';
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
    background-color: #111111;
    padding: 2px 12px !important;
}

.sub-top-nav {
    display: flex;
    background-color: #222;
    color: gainsboro;
    position: absolute;
    z-index: 1;
    width: 100%;
    padding: 0 12px !important;
}

.height-auto {
    overflow: hidden;
    transition: max-height 1s;
    max-height: 200px;
}

.height-zero {
    overflow: hidden;
    transition: max-height 1s;
    max-height: 0px;
}

.top-nav .screen {
    margin: 5px 0;
}

.top-nav .buttons-section {
    display: flex; 
    justify-content: space-between; 
    align-items: center;
}

.piano-icon {
    color: gainsboro !important;
    margin: 0 5px;
}

.piano-icon:hover {
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

.sustain-button {
    margin: 0 10px; 
    display: flex;
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

.no-default-vertical-padding {
    padding: 0 12px !important
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