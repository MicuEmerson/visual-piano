<template>
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
 
    };
  },

  created() {
    this.createSampler();
    this.createRecorder();    
  },
 
  methods: {
    ...mapActions('toneState', ['createSampler']),
    ...mapActions('recordingState', ['createRecorder']),
    

    playRecord(){

      if(this.songUrlName === 'bach_850_format0.mid') {
        this.songUrlName = 'bach_846.mid';
      } else {
        this.songUrlName = 'bach_850_format0.mid';
      }
      
      const now = 0;

      Midi.fromUrl("/audio/" + this.songUrlName)
          .then(midi => {
            midi.tracks.forEach(track => {
              track.notes.forEach(note => {

                console.log("intra aici?");
                this.tone.Transport.schedule(() => {
                  console.log(note.name, note.duration, note.velocity, this.sampler);
                  this.sampler.triggerAttackRelease(
                    note.name,
                    note.duration,
                    this.tone.now(),
                    note.velocity
                  );
                }, note.time + now)

                let currentNote = null;

                for (let i of this.notes) {
                    if(i.note === note.name){
                      currentNote = i;
                      break;
                    } 
                    else if(i.blackNote && i.blackNote.note === note.name){
                      currentNote = i.blackNote;
                      break;
                    }
                }
                
                this.tone.Transport.schedule(time => {
                  this.tone.Draw.schedule(() => {
                    currentNote.pressed = true;
                  }, time)
                }, note.time + now)

                this.tone.Transport.schedule(time => {
                  this.tone.Draw.schedule(() => {
                    currentNote.pressed = false;
                  }, time)
                }, note.time + note.duration + now)

              })
            })
        })
    },
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