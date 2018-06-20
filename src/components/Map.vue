<template>
  <div id="map">
    <l-map ref="map" :minZoom="minZoom" :crs="crs">
      <l-image-overlay :url="src" :bounds="bounds"></l-image-overlay>
      <l-marker v-if="kasiosLocation != null" :lat-lng="kasiosLocation.latlng">
        <l-popup :content="'Recording ' + kasiosLocation.name + ': [' + kasiosLocation.x + ', ' + kasiosLocation.y + ']'"
        ></l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
  // import { kasiosEventBus } from '../main';
  // import { speciesEventBus } from '../main';
  import { LMap, LImageOverlay, LMarker, LPopup } from 'vue2-leaflet';
  // import 'leaflet.heat';

  export default {
    name: 'Map',
    props: {
      kasiosLocation: Object
    },
    data() {
      return {
        src:'/data/Lekagul-Roadways-2018.bmp',
        bounds: [[-250,-250], [250,250]],
        minZoom: 0,
        crs: L.CRS.Simple
      }
    },
    components: {
      LMap,
      LImageOverlay,
      LMarker,
      LPopup
    },
    mounted() {
      this.$refs.map.mapObject.setView([0, 0], 0);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #map {
    width: 500px;
    height: 500px;
    margin: auto;
    position: relative;
    top: 10px;
    background-color:palegreen;
    border-radius: 5px;
  }
</style>
