<template>
  <div id="app" data-app>
    <pianoMenu> </pianoMenu>
    <canvas style="background: url('./images/black.jpg')"> </canvas>
    <piano>  </piano>
  </div>
</template>

<script>
import PianoMenu from "./components/PianoMenu";
import Piano from "./components/Piano";
import CanvasMessage from "./utils/CanvasMessages"
import { mapState, mapActions } from 'vuex';

export default {
  components : { Piano, PianoMenu },
 
  created(){
    window.addEventListener("resize", this.resize);

    this.$root.$on("resize_canvas_notes", ()  => {
      this.resize();
    });
  },

  destroyed() {
    window.removeEventListener("resize", {});
  },

  methods: {
    ...mapActions('canvasState', ['setDrawingDataForCanvas', 'resizeCanvas']),

    resize() {
      // documnet.getElementById/getElementsByClassName are took from Piano.vue and PianoKeyboard.vue because they are already rendered in resize event eventually happens.
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
  margin: 0 !important;
  padding: 0 !important;
  overflow-y: hidden !important;
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

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
  border-radius: 2px;
}

</style>
