<template>
    <v-overlay :value="playlistState.isLoading">
        <v-progress-circular indeterminate> </v-progress-circular>
        <b> Loading... </b>
    </v-overlay>
</template>

<script>
import { mapState } from 'vuex';

export default {
    
  computed: {
    ...mapState(['playlistState'])
  }
  
}
</script>

<style>
 
</style>