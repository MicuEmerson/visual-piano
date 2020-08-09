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
  box-sizing: border-box
}

body, html {
  height: 100%;
  margin: 0;
  text-align: center;
}

#app {
  height: 100%;
  margin: 0 17%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
