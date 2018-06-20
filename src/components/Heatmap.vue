<template>
    <div id="map"></div>
</template>

<script>
  import { kasiosEventBus } from '../main';
  import { speciesEventBus } from '../main';
  import 'leaflet';
  import * as heat from 'leaflet.heat';

  const L = window.L;

  export default {
    name: 'Heatmap',
    data() {
      return {
        map: [],
        markers: null
      }
    },
    mounted() {
      // Craete map object (no tiles)
      const map = L.map('map', {
        crs: L.CRS.Simple
      });

      // Create and fit bounds (background image is initally 200x200 pixels)
      let bounds = [
        [0, 0],
        [400, 400]
      ];
      map.fitBounds(bounds);

      // Add Lekugal Natural Reserve map as image overlay
      L.imageOverlay('/data/Lekagul-Roadways-2018.bmp', bounds).addTo(map);

      this.map = map;
}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #map {
    margin: auto;
    width: 400px;
    height: 400px;
    background-color:plum;
  }
</style>
