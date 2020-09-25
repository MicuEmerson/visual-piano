<template>
    <div id="piano-menu" style="width: 100%">
        <v-container fluid class="top-nav">
            <v-row style="align-items: center">
                <v-col cols="12" md="4" class="no-default-vertical-padding"> 
                    <div class="buttons-section">
                        <div class="button-group">
                            <v-icon class="piano-icon">mdi-piano</v-icon>
                        </div>

                        <div class="button-group">
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

                <v-col cols="12" md="4" class="no-default-vertical-padding"> 
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

                <v-col cols="12" md="4" class="no-default-vertical-padding"> 
                    <div class="buttons-section"> 
                        <div class="button-group">
                             <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button 
                                        @click="showNotes()"
                                        v-bind="attrs"
                                        v-on="on">
                                        <v-icon class="piano-icon">{{notesIcon}}</v-icon>
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
                                        <v-icon class="piano-icon">{{keyboardIcon}}</v-icon>
                                    </button>
                                </template>
                                <span>Keys</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button 
                                        class="sustain-button"
                                        @click="handleSutain()"
                                        v-bind="attrs"
                                        v-on="on">

                                        <img :src="getSustainImage" 
                                            @mouseover="sustainImageHover = true"
                                            @mouseleave="sustainImageHover = false"
                                        />
                                    </button>
                                </template>
                                <span>Sustain</span>
                            </v-tooltip>
                        </div>

                        <div class="button-group">
                            <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                                <template v-slot:activator="{ on, attrs }">
                                    <button
                                        v-bind="attrs"
                                        v-on="on">
                                    <v-icon class="piano-icon">mdi-information-outline</v-icon>
                                    </button>
                                </template>
                                
                                <AboutDialog :onClose="onCloseAboutDialog"></AboutDialog>
                            </v-dialog>

                            <button @click="showConfig()"><v-icon class="piano-icon">{{configIcon}}</v-icon></button>
                        </div>
                    </div>
                </v-col>
            </v-row>

            <v-row style="position: relative">
                <v-progress-linear style="position: absolute" color="#ffb200" :value="playingPercent"> </v-progress-linear>
            </v-row>

             <v-row style="position: relative">
                <div style="position: absolute; top: 8px; right:8px; color: white">
                    {{ playingPercent }}:{{ playingPercent }} 
                </div>
            </v-row>
        </v-container>

        <v-container text-xs-center fluid :class="dashboardState.showConfig ? 'height-auto': 'height-zero'" class="sub-top-nav">
            
            <v-row justify="center" align="center">
                <v-col cols="12" sm="4" md="3"> 
                    <div @click="editKeys()" class="config config-button" :style="{fontSize: fontSize + 'em', minHeight: 6 * fontSize + 'em'}">
                        <template v-if="!dashboardState.editKeys">Edit Keys</template>
                        <template v-else>Save Keys</template>
                    </div>
                </v-col>

                <v-col cols="12" sm="4" md="3"> 
                    <div class="config" :style="{fontSize: fontSize + 'em', minHeight: 6 * fontSize + 'em'}">
                        <label>Volume</label>
                        <v-slider
                            style="margin-left: 1em"
                            dense
                            hide-details
                            thumb-label
                            min="0"
                            max="100"
                            thumb-size="24"
                            color="#ffb200"
                            track-color="#dcdcdc"
                            v-model="volume"
                        ></v-slider>
                    </div>
                </v-col>

                <v-col cols="12" sm="4" md="3"> 
                    <div class="config" :style="{fontSize: fontSize + 'em', minHeight: 6 * fontSize + 'em'}">
                        <label>Speed</label>
                        <v-slider
                            style="margin-left: 1em"
                            dense
                            hide-details
                            thumb-label
                            min="0"
                            max="100"
                            thumb-size="24"
                            color="#ffb200"
                            track-color="#dcdcdc"
                            v-model="speed"
                        ></v-slider>
                    </div>
                </v-col>

                <v-col cols="12" sm="4" md="3">
                    <div class="config" :style="{fontSize: fontSize + 'em', minHeight: 6 * fontSize + 'em'}">
                       <label>Octave</label>
                        <v-range-slider
                            @change="octaveChanged"
                            v-model="octaves"
                            style="margin-left: 1em"
                            dense
                            hide-details
                            thumb-label
                            min="1"
                            max="7"
                            thumb-size="24"
                            color="#ffb200"
                            track-color="#dcdcdc"
                        ></v-range-slider>
                    </div>
                </v-col>

                <v-col cols="12" sm="4" md="3"> 
                    <div class="config" :style="{fontSize: fontSize + 'em', minHeight: 6 * fontSize + 'em'}">
                        <label>White note</label>
                        <input style="margin-left: 0.5em; margin-right: 0.5em" :value="dashboardState.whiteNoteColor" type="color" @change="whiteNoteColorChanged"/>
                        <label>Black note</label>
                        <input style="margin-left: 0.5em" :value="dashboardState.blackNoteColor" type="color" @change="blackNoteColorChanged"/>
                    </div>
                </v-col>
            </v-row>
        </v-container>

        <!-- <v-overlay :value="isLoading">
            <button @click="isLoading=false"> Close </button>
            <v-progress-circular indeterminate>
            </v-progress-circular>
        </v-overlay> -->
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AboutDialog from './AboutDialog';

export default {
    components: { AboutDialog },

    data: () => {
        return {
            isLoading: false,
            sustainImageHover: false,
            isPlaying: false,
            playingPercent: 0,
            dialog: false,
            volume: 100,
            speed: 50,
            octaves: []
        }
    },

    created() {
        this.octaves = [ this.dashboardState.startOctave, this.dashboardState.endOctave ]
    },

    methods:{
        ...mapActions("dashboardState", ["setPlaying"]),
        ...mapActions('recordingState', ['startRecording', 'stopRecording']),

        togglePlay() {
            if(this.playlistState.currentSong != ""){

                if (this.dashboardState.playing) {
                    this.toneState.tone.Transport.pause();
                } else {
                    this.toneState.tone.Transport.start()
                }

                this.setPlaying();
            }
        },

        onChangeSong: function() {
            this.isLoading = true;
        },

        onCloseAboutDialog: function() {
            this.dialog = false;
        },

        whiteNoteColorChanged: function(e) {
            this.$store.dispatch("dashboardState/whiteNoteColorChanged", e.target.value)
        },

        blackNoteColorChanged: function(e) {
            this.$store.dispatch("dashboardState/blackNoteColorChanged", e.target.value)
        },

        stopPlaying() {
            this.$store.dispatch("playlistState/stopPlaying", "");
        },

        handleRecording(){
            this.recordingState.isRecording ? this.stopRecording() : this.startRecording();
        },

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

        handleSutain(){
             this.$store.commit("dashboardState/SET_SUSTAIN", !this.dashboardState.sustain)
        },

        octaveChanged: function(value) {
            this.octaves = Object.values(value);
            this.setStartOctave(Math.min(...this.octaves));
            this.setEndOctave(Math.max(...this.octaves));
        },

        setStartOctave(value){
            this.$store.dispatch("dashboardState/changeStartOctave", value)
            setTimeout(() => this.$root.$emit("resize_canvas_notes"), 100);
        },

        setEndOctave(value){
            this.$store.dispatch("dashboardState/changeEndOctave", value)
            setTimeout(() => this.$root.$emit("resize_canvas_notes"), 100);
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

        notesIcon: function() {
            return this.dashboardState.showNotes ? 'mdi-music-note-off' : 'mdi-music-note';
        },

        keyboardIcon: function() {
            return this.dashboardState.showKeys ? 'mdi-keyboard-off-outline' : 'mdi-keyboard-outline';
        },

        configIcon: function() {
            return this.dashboardState.showConfig ? 'mdi-chevron-up' : 'mdi-chevron-down'
        },

        recordLight: function() {
            return this.recordingState.isRecording ? "linear-gradient(-45deg, green, rgb(152,251,152,0.7))" : "linear-gradient(-45deg, red, rgb(240,128,128,0.7))";
        },

        fontSize() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return 0.7;
                default: return 0.8;
            }
        },

        getSustainImage: function() {
            const imageName = this.dashboardState.sustain ? 
                    this.sustainImageHover ? 
                        'sustain-on-hover' :
                        'sustain-on' :
                    this.sustainImageHover ? 
                        'sustain-off-hover' :
                        'sustain-off' 

            return require('../assets/' + imageName + '.png');
        },

        currentSongPlaylist: {
            get () {
                return this.playlistState.currentSong;
            },
            set (value){
                // this.$store.dispatch("dashboardState/changeStartOctave", 0);
                // this.$store.dispatch("dashboardState/changeEndOctave", this.dashboardState.maxEndOctave);
                this.$store.dispatch("playlistState/stopPlaying", value);
            }
        }
    }
}
</script>

<style>

.top-nav {
    background-color: var(--v-primary-base);
    padding: 2px 12px !important;
}

.sub-top-nav {
    display: flex;
    background-color: var(--v-secondary-base);
    color: var(--v-text-base);
    position: absolute;
    z-index: 1;
    width: 100%;
    padding: 0 12px !important;
}

.height-auto {
    overflow: hidden;
    transition: max-height 1s;
    max-height: 355px;
}

.height-zero {
    overflow: hidden;
    transition: max-height 1s;
    max-height: 0;
}

.top-nav .screen {
    margin: 5px 0;
}

.top-nav .buttons-section {
    display: flex; 
    justify-content: space-between; 
    align-items: center;
}

.top-nav .buttons-section .button-group {
    display: flex; 
    align-items: center;
}

.piano-icon {
    color: var(--v-text-base) !important;
    margin: 0 5px;
}

.piano-icon:hover {
    color:var(--v-accent-base) !important;
}

.config {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--v-primary-base);
    height: 100%;
    border-radius: 0.5em;
    padding: 0 2em;
}

.config-button {
    cursor: pointer;
}

.config-button:hover {
    color:var(--v-accent-base);
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
    font-size: 1.5em;
}  

.v-slider__thumb-label {
    color: var(--v-primary-base) !important;
}

</style>