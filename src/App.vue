<template>
  <div id="app" data-app>
    <canvas style="background: url('./images/black.jpg')"> </canvas>
    <piano>  </piano>
  </div>
</template>

<script>
import Piano from "./components/Piano";
import CanvasMessage from "./utils/CanvasMessages"
import { mapState } from 'vuex';

export default {
  components : { Piano },
  data: () => {
    return {

    }
  },

  mounted() {
    // this.$nextTick(function () {
      
    // })
  },  

  created(){
    window.addEventListener("resize", this.resizeCanvas);
  },

  destroyed() {
    window.removeEventListener("resize", {});
  },

  methods: {
    resizeCanvas() {
      const pianoHeight = document.getElementById("piano-container").getBoundingClientRect().height;
      const height = window.innerHeight - pianoHeight + 1;
      const width = window.innerWidth;

      this.canvasState.worker.postMessage({ messageType : CanvasMessage.RESIZE, height, width});
    },
  },

  computed:{
    ...mapState(['canvasState'])
  }
 

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
