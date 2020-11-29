<template>
  <div id="app" data-app>
    <PianoMenu> </PianoMenu>
    <canvas style="background: url('./canvas_black_background.jpg')"> </canvas>
    <Piano> </Piano>
    <SaveSongDialog> </SaveSongDialog>
    <LoadingDialog> </LoadingDialog>
  </div>
</template>

<script>
import PianoMenu from "./components/PianoMenu";
import Piano from "./components/Piano";
import SaveSongDialog from "./components/dialogs/SaveSongDialog"
import LoadingDialog from "./components/dialogs/LoadingDialog"
import { mapState, mapActions } from 'vuex';

export default {
  components : { Piano, PianoMenu, SaveSongDialog, LoadingDialog },
  
  created(){
    window.addEventListener("resize", this.resize);
    this.$root.$on("resize_canvas_notes", this.resize);
  },

  destroyed() {
    window.removeEventListener("resize", {});
  },

  methods: {
    ...mapActions('canvasState', ['resizeCanvas']),

    /** 
     * document.getElementById/getElementsByClassName are took from Piano.vue and 
     * PianoKeyboard.vue because they are already rendered in resize when event eventually happens
    **/
    resize() {
      const pianoContainerDimensions = document.getElementById("piano-container").getBoundingClientRect();
      const pianoMenuDimensions = document.getElementById("piano-menu").getBoundingClientRect();

      const height = window.innerHeight - pianoContainerDimensions.height - pianoMenuDimensions.height + 1;
      const width = pianoContainerDimensions.width;

      const whiteNotes = document.getElementsByClassName("white-note");
      const blackNotes = document.getElementsByClassName("black-note");

      const whiteWidth = whiteNotes[0].getBoundingClientRect().width;
      const blackWidth = blackNotes[0].getBoundingClientRect().width;

      const array = Array.from(whiteNotes).concat(Array.from(blackNotes));
      const waterfallDelay = height * 10; 

      this.resizeCanvas({height, width, array, whiteWidth, blackWidth, waterfallDelay});
    },
  },
}
</script>

<style>
* {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10+ and Edge */
  user-select: none; /* Standard syntax */
  box-sizing: border-box;
  font-family: "Lucida Console", Courier, monospace;
}

body, html {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-y: hidden;
}
 
#app {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
}

select:focus {
  outline: 0;
}
 
button:focus {
  outline: 0;
}
 
input:focus {
  outline: 0;
} 

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
  border-radius: 2px;
}
</style>
