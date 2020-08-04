<template>
  <div>
    <button @click="toggle">{{ toggleButtonText }}</button>
  </div>
</template>

<script>
import { Sampler, Transport } from "tone";

const SAMPLE_BASE_URL = "./samples/";

export default {
  data() {
    return {
      playing: false,
      currentNoteIndex: 0,
      sampler: Object,
      music: [
        ["C2", "D#2", "G2", "C3", "G2", "D#2"], // Cm (i)
        ["B1", "D2", "G2", "B2", "G2", "D2"], // G (V)
        ["A#1", "D2", "F2", "A#2", "F2", "D2"], // Bb (VII)
        ["A1", "C2", "F2", "A2", "F2", "C2"], // F (V / VII)
        ["G#1", "C2", "D#2", "G#2", "D#2", "C2"], // Ab (VI)
        ["G1", "C2", "D#2", "G2", "D#2", "C2"], // Cm (i)
        ["F#1", "C2", "D#2", "F#2", "D#2", "C2"], // F#dim7 (vii° / V)
        ["G1", "C2", "D2", "G2", "D2", "B1"] // Gsus4 (?) -> G (V)
      ],
      samples: [
        ["A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1"],
        ["G1", "G#1", "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2"],
        ["F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3"],
        ["D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4"]
      ]
    };
  },

  created() {
    this.music = this.music.flat();

    const sampleMap = this.samples.flat().reduce((acc, val) => {
      acc[val] = `${val.replace("#", "s")}.mp3`;
      return acc;
    }, {});

    Transport.bpm.value = 120;

    this.sampler = new Sampler(
      sampleMap,
      () => {
        this.sampler.release = 12;
        this.sampler.toDestination();
        Transport.scheduleRepeat(time => {
          this.sampler.triggerAttackRelease(this.activeNote, "8n");

          this.step();
        }, "8n");
      },
      SAMPLE_BASE_URL
    );
  },

  methods: {
    step() {
      if (++this.currentNoteIndex > this.music.length - 1) {
        this.currentNoteIndex = 0;
      }
    },

    toggle() {
      if (this.playing) {
        Transport.pause();
      } else {
        Transport.start();
      }

      this.playing = !this.playing;
    }
  },

  computed: {
    toggleButtonText() {
      return this.playing ? "Pause music" : "Play music";
    },

    activeNote() {
      return this.music[this.currentNoteIndex];
    }
  }
};
</script>

<style scoped>
button {
  padding: 1rem;
}
</style>