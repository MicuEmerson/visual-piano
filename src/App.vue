<template>
  <div id="app">
    
    <piano> </piano>
    
    
  </div>
</template>

<script>
import { Sampler } from "tone";
import Piano from "./components/Piano";

const SAMPLE_BASE_URL = "./samples/1/";

export default {
  components : { Piano },
  data: () => {
    return { };
  },
  methods: {
   
  }
  
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
