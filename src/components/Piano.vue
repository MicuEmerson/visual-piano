<template>
<div id="piano-container">
   <pianoDashboard> </pianoDashboard>
   <pianoKeyboard> </pianoKeyboard>
</div>
</template>

<script>
import { Midi } from "@tonejs/midi"
import PianoDashboard from "./PianoDashboard"
import PianoKeyboard from "./PianoKeyboard"

const SAMPLE_BASE_URL = "./samples/1/";

export default {
  components: { PianoDashboard, PianoKeyboard },
  data: () => {
    return {
      // TONEJS
      sampler: { type: window.Tone.Sampler, default: {} },
      tone : { type: window.Tone, default: {} },
      
      // RECORDING STUFF
      recorder: {},
      recordedChunks: [],
      recordedMap: {},
      recordedArray: [],
      startRecordTime: 0,
      endRecordTime: 0,
      isRecording: false,
      songUrlName : "bach_846.mid",     

    

      allOctavesSelect: [],

      allNotesSelect: [],

      samples: [
          ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1"],
          ["G1", "G#1", "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2"],
          ["F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3"],
          ["D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4"],
          ["D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"],
          ["C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5"],
          ["A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6"],
          ["G#6", "A6", "A#6", "B6"]
      ],

    };
  },

  created() {
    /*
    this.tone = window.Tone;
    this.generateNotes();
    this.generateNotesIndexesByKey();

    const SAMPLE_MAP = this.samples.flat().reduce((acc, val) => {
        acc[val] = `${val.replace("#", "s")}.mp3`;
        return acc;
    }, {});

    this.sampler = new this.tone.Sampler({
      urls: SAMPLE_MAP,
      onload : () => {},
      baseUrl: SAMPLE_BASE_URL
    }).toDestination();

    const dest  = this.tone.context.createMediaStreamDestination();
    this.recorder = new MediaRecorder(dest.stream);
    this.sampler.connect(dest);

    window.addEventListener("keydown", e => {
      const key = e.key;
      const index = this.notesIndexesByKey[key];

      if(index != undefined){
        const noteObject = this.notes[index].key === key ? this.notes[index] : this.notes[index].blackNote;
        this.playNote(noteObject);
      }
    });

    window.addEventListener("keyup", e => {
      const key = e.key;
      const index = this.notesIndexesByKey[key];

      if(index != undefined){
        const noteObject = this.notes[index].key === key ? this.notes[index] : this.notes[index].blackNote;
        this.removePressedKey(noteObject);
      }

    });

    window.onmouseup = () => {
      this.isMousePressed = false;
    }
    */
  },

  destroyed() {
    // window.removeEventListener('keydown', () => {});
    // window.removeEventListener('keyup', () => {});
    // window.removeEventListener('onmouseup', () => {});
  },

 

  methods: {
    togglePlayback() {
      //TODO, add break
      if (this.playing) {
        console.log("stop");
        this.tone.Transport.stop();
        this.tone.Transport.cancel();
      } else {
        console.log("start");
        this.tone.Transport.start()
      }

      this.playing = !this.playing
    },

    startRecording(){
      this.recordedChunks.length = 0;
      this.recordedArray.length = 0;
      this.recorder.start();
      this.recorder.ondataavailable = e => this.recordedChunks.push(e.data);

      this.isRecording = true;
      this.startRecordTime = new Date().getTime();
    },

    stopRecording(){
      this.recorder.stop();
      this.recorder.onstop = evt => {
        let blob = new Blob(this.recordedChunks, { type: 'audio/ogg; codecs=opus' });
        document.querySelector('audio').src = URL.createObjectURL(blob);
      };
      this.isRecording = false;
      this.endRecordTime = new Date().getTime();

      if(this.recordedArray.length != 0){
        
        this.recordedArray[0].time = this.recordedArray[0].startTime - this.startRecordTime;
        this.recordedArray[0].duration = this.recordedArray[0].endTime - this.recordedArray[0].startTime;

        for(let i = 1; i < this.recordedArray.length; i++){
          this.recordedArray[i].time = this.recordedArray[i - 1].time + this.recordedArray[i].startTime - this.recordedArray[i - 1].startTime; 
          this.recordedArray[i].duration = this.recordedArray[i].endTime - this.recordedArray[i].startTime;
        }
      }

      for(let i = 0 ; i < this.recordedArray.length; i++){
        this.recordedArray[i].time /= 1000;
        this.recordedArray[i].duration /= 1000;
      }

      console.log("Recordedddd array", this.recordedArray);

      this.playMyRecord();
    },

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

    playMyRecord(){
      const now = 0;

      console.log("AM INTRAT IN PLAY RECORD");
      this.recordedArray.forEach(note => {
          
          this.tone.Transport.schedule(() => {
            console.log("BAI, nu intri?");
            this.sampler.triggerAttackRelease(note.noteName, "2n", this.tone.now());
          }, note.time + now)

          let currentNote = null;
          for (let i of this.notes) {
              if(i.note === note.noteName){
                currentNote = i;
                break;
              } 
              else if(i.blackNote && i.blackNote.note === note.noteName){
                currentNote = i.blackNote;
                break;
              }
          }

          console.log("DAR AICI INTRI?");

                      
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