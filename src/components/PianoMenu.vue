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
                            item-text="name"
                            :menu-props="{ auto: true, maxHeight: 50 }"
                            return-object
                            hide-details
                            solo
                            placeholder="Songs"
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
                                        @click="handleSustain()"
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
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <button
                                        @click="dialog = true"
                                        v-bind="attrs"
                                        v-on="on">
                                    <v-icon class="piano-icon">mdi-information-outline</v-icon>
                                    </button>
                                </template>
                                <span>About</span>
                            </v-tooltip>

                            <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                                <AboutDialog :onClose="onCloseAboutDialog"></AboutDialog>
                            </v-dialog>

                            <button @click="showConfig()"><v-icon class="piano-icon">{{configIcon}}</v-icon></button>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
        
        <SongDurationProgressBar v-if="menuState.playing !== 3 || recordingState.isRecording"></SongDurationProgressBar>

        <v-container text-xs-center fluid :class="menuState.showConfig ? 'height-auto': 'height-zero'" class="sub-top-nav">
            
            <v-row justify="center" align="center">
                <v-col cols="12" sm="4" md="3"> 
                    <div @click="editKeys()" class="config config-button" :style="{fontSize: fontSize + 'em', minHeight: 6 * fontSize + 'em'}">
                        <template v-if="!menuState.editKeys">Edit Keys</template>
                        <template v-else>Save Keys</template>
                    </div>
                </v-col>

                <v-col cols="12" sm="4" md="3"> 
                    <div class="config" :style="{fontSize: fontSize + 'em', minHeight: 6 * fontSize + 'em'}">
                        <label>Volume</label>
                        <v-slider
                            @change="handleVolume"
                            :value="menuState.volume"
                            style="margin-left: 1em"
                            dense
                            hide-details
                            thumb-label
                            min="0"
                            max="100"
                            thumb-size="24"
                            color="#ffb200"
                            track-color="#dcdcdc"
                        ></v-slider>
                    </div>
                </v-col>

                <v-col cols="12" sm="4" md="3"> 
                    <div class="config" :style="{fontSize: fontSize + 'em', minHeight: 6 * fontSize + 'em'}">
                        <label>Speed</label>
                        <v-slider
                            @change="handleSpeed"
                            :value="menuState.speed"
                            style="margin-left: 1em"
                            dense
                            hide-details
                            thumb-label
                            min="30"
                            max="170"
                            thumb-size="24"
                            color="#ffb200"
                            track-color="#dcdcdc"
                        ></v-slider>
                    </div>
                </v-col>

                <v-col cols="12" sm="4" md="3">
                    <div class="config" :style="{fontSize: fontSize + 'em', minHeight: 6 * fontSize + 'em'}">
                       <label>Octave</label>
                        <v-range-slider
                            @change="octaveChanged"
                            :value="menuState.octaves"
                            ticks="always"
                            tick-size="4"
                            style="margin-left: 1em"
                            dense
                            hide-details
                            thumb-label
                            min="1"
                            :max="menuState.maxEndOctave"
                            thumb-size="24"
                            color="#ffb200"
                            track-color="#dcdcdc"
                        ></v-range-slider>
                    </div>
                </v-col>

                <v-col cols="12" sm="4" md="3"> 
                    <div class="config" :style="{fontSize: fontSize + 'em', minHeight: 6 * fontSize + 'em'}">
                        <label style="text-align: center">White note</label>
                        <input style="margin-left: 0.5em; margin-right: 0.5em" :value="menuState.whiteNoteColor" type="color" @change="whiteNoteColorChanged"/>
                        <label style="text-align: center">Black note</label>
                        <input style="margin-left: 0.5em" :value="menuState.blackNoteColor" type="color" @change="blackNoteColorChanged"/>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AboutDialog from './dialogs/AboutDialog';
import SongDurationProgressBar from './SongDurationProgressBar';
import { PlayingState } from "../utils/PlayingState";

export default {
    components: { AboutDialog, SongDurationProgressBar },

    data: () => {
        return {
            sustainImageHover: false,
            dialog: false
        }
    },

    methods:{
        ...mapActions("menuState", ["setPlaying"]),
        ...mapActions('recordingState', ['startRecording', 'stopRecording']),

        togglePlay() {
            if(this.playlistState.currentSong != ""){

                if (this.menuState.playing === PlayingState.PLAY) {
                    this.setPlaying(PlayingState.PAUSE);
                    this.toneState.tone.Transport.pause();
                } else {
                    this.setPlaying(PlayingState.PLAY);
                    this.toneState.tone.Transport.start();
                }
            }
        },

        onCloseAboutDialog() {
            this.dialog = false;
        },
        
        whiteNoteColorChanged: function(e) {
            this.$store.dispatch("menuState/whiteNoteColorChanged", e.target.value)
        },

        blackNoteColorChanged: function(e) {
            this.$store.dispatch("menuState/blackNoteColorChanged", e.target.value)
        },

        stopPlaying() {
            this.$store.dispatch("playlistState/stopPlaying", "");
        },

        handleRecording(){
            this.recordingState.isRecording ? this.stopRecording() : this.startRecording();
        },

        editKeys(){
            this.$store.commit("menuState/SET_EDIT_KEYS", !this.menuState.editKeys);

            if(this.menuState.editKeys  && !this.menuState.showKeys){
                this.$store.commit("menuState/SET_SHOW_KEYS", true);
            } else if(!this.menuState.editKeys) {
                this.$store.commit("menuState/SET_SHOW_KEYS", false);
            }
        },

        showConfig(){
            this.$store.commit("menuState/SET_SHOW_CONFIG", !this.menuState.showConfig);
        },

        showKeys(){
            this.$store.commit("menuState/SET_SHOW_KEYS", !this.menuState.showKeys);
        },

        showNotes(){
            this.$store.commit("menuState/SET_SHOW_NOTES", !this.menuState.showNotes);
        },

        handleSustain(){
            this.$store.commit("menuState/SET_SUSTAIN", !this.menuState.sustain)
        },

        handleVolume(volume){
            this.$store.dispatch("menuState/changeVolume", volume)
        },

        handleSpeed(speed){
            this.$store.dispatch("menuState/changeSpeed", speed)
        },

        octaveChanged: function(value) {
            this.$store.dispatch("menuState/changeOctaves", Object.values(value))
            setTimeout(() => this.$root.$emit("resize_canvas_notes"), 100);
        },
    }, 

    computed: {
        ...mapState(['menuState', 'toneState', 'playlistState', 'recordingState']),

        playIcon: function() {
            return this.menuState.playing === PlayingState.PLAY ? 'mdi-pause' : 'mdi-play';
        },

        playIconTooltip: function() {
            return this.menuState.playing === PlayingState.PLAY ? 'Pause' : 'Play';
        },

        notesIcon: function() {
            return this.menuState.showNotes ? 'mdi-music-note-off' : 'mdi-music-note';
        },

        keyboardIcon: function() {
            return this.menuState.showKeys ? 'mdi-keyboard-off-outline' : 'mdi-keyboard-outline';
        },

        configIcon: function() {
            return this.menuState.showConfig ? 'mdi-chevron-up' : 'mdi-chevron-down'
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
            const imageName = this.menuState.sustain ? 
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
                // this.$store.dispatch("menuState/changeStartOctave", 0);
                // this.$store.dispatch("menuState/changeEndOctave", this.menuState.maxEndOctave);
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