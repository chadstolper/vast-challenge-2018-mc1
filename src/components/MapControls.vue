<template>
  <div id="controls">
    <vue-slider v-model="value"></vue-slider>
  </div>
</template>

<script>
  // import { kasiosEventBus } from '../main';
  // import { speciesEventBus } from '../main';
  import vueSlider from 'vue-slider-component';

  export default {
    name: 'MapControls',
    data() {
      return {
        value: 0
      }
    },
    components: {
      vueSlider
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #controls {
    margin: auto;
    position: relative;
    top: 60px;
    background-color:palegoldenrod;
  }
</style>
