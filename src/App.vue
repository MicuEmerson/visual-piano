<template>
  <div id="app">
    <piano :startOctave="5" :endOctave="6" :startNote="'A'" :endNote="'B'">  </piano>
  </div>
</template>

<script>
import Piano from "./components/Piano";

export default {
  components : { Piano },
  data: () => {
    return {
      startOctave: 3,
      endOctave: 5,
      startNote: "C",
      endNote: "G",
    }
  },
}
</script>

<style>
* {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10+ and Edge */
  user-select: none; /* Standard syntax */
  box-sizing:border-box
}

body {
  margin:0;
  text-align: center;
}
</style>
