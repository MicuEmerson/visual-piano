<template>
  <div id="app">
    <piano>  </piano>
  </div>
</template>

<script>
import Piano from "./components/Piano";

export default {
  components : { Piano },
  data: () => {
    return {
     
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
