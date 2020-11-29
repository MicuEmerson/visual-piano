<template>
    <div style="position: relative">
        <v-progress-linear v-if="!recordingState.isRecording" style="position: absolute" color="#ffb200" :value="playingPercent"> </v-progress-linear>
        <div style="position: absolute; top: 8px; right: 8px; color: white">
            {{ currentTime }} 
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { PlayingState } from '../utils/PlayingState';
import Timer  from "../utils/SetTimeoutTimer"

export default {
    data: () => {
        return {
            playingPercent: 0,
            counter: 0,
        }
    },

    created() {
        if (this.recordingState.isRecording) {
            this.handleRecording();
        }
        else {
            this.handlePlaySong();
        }
    },

    methods: {
        handlePlaySong() {
            this.$store.commit("playlistState/ADD_TIMER", 
                new Timer(() => {
                    let interval = setInterval(() => {
                        if(this.menuState.playing === PlayingState.PLAY) {
                            this.playingPercent = this.counter * 100 / this.playlistState.currentSongDuration;
                            this.counter = this.counter + 0.25 * this.menuState.speed / 100;

                            if (this.counter >= this.playlistState.currentSongDuration) {
                                clearInterval(interval);
                            }
                        }
                    }, 250 * this.menuState.speed / 100);
                }, this.canvasState.waterfallDelay)
            );
        },

        handleRecording() {
            let interval = setInterval(() => {
                this.counter += 1;

                if (!this.recordingState.isRecording) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    },

    computed: {
        ...mapState([ 'playlistState', 'canvasState', 'menuState', 'recordingState' ]),
        
        currentTime: function() {
            const counterFloor = Math.floor(this.counter);
            let minutes = Math.floor(counterFloor/ 60);
            let seconds = counterFloor % 60;

            if (minutes <= 9){
                minutes = '0' + minutes;
            }

            if (seconds <= 9) {
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;
        }
    }
}
</script>

<style>


</style>