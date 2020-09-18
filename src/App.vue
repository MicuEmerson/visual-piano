<template>
  <div id="app" data-app>
    <canvas style="background: url('./images/black.jpg')"> </canvas>
    <piano>  </piano>
  </div>
</template>

<script>
import Piano from "./components/Piano";
import CanvasMessage from "./utils/CanvasMessages"
import { mapState, mapActions } from 'vuex';

export default {
  components : { Piano },
  data: () => {
    return {

    }
  },

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

      const height = window.innerHeight - pianoContainerDimensions.height + 1;
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
  text-align: center;
}


#app {
  height: 100%;
  width: 100%;
  /* margin: 0 17%; */
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
</style>
