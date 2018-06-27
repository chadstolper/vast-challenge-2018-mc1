<template>
  <!-- <transition name="fade-up" mode="out-in" appear> -->
  <div id="monthMap">
    <h6>{{ month.key }}</h6>
    <l-map ref="map" :minZoom="minZoom" :crs="crs">
      <l-image-overlay :url="src" :bounds="bounds"></l-image-overlay>
    </l-map>
  </div>
  <!-- </transition> -->
</template>

<script>
  import { LMap, LImageOverlay, LMarker, LLayerGroup } from 'vue2-leaflet';
  import { speciesEventBus } from '../main';
  import 'leaflet.heat';

  export default {
    name: 'MonthMap',
    props: {
      // monthData: Object,
      // availableMonths: Array,
      month: Object
    },
    data() {
      return {
        src:'/data/Lekagul-Roadways-2018.bmp',
        bounds: [[-75,-75], [75,75]],
        minZoom: 0,
        // eslint-disable-next-line
        crs: L.CRS.Simple,
        heatmapData: [],
        heatmap: null
      }
    },
    components: {
      LMap,
      LImageOverlay,
      LMarker,
      LLayerGroup
    },
    mounted() {
      // Create map variable for heatLayers to be apended to
      let map = this.$refs.map.mapObject;
      map.setView([0, 0], 0);

      // disable drag and zoom handlers
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      
      // Regular heatmap layer:
      // eslint-disable-next-line
      let heatmap = L.heatLayer(this.$data.heatmapData, {
        minOpacity: 1,
        radius: 4,
        maxZoom: 1,
        blur: 0.8,
        gradient: {
          1: '#ffffe0',
          .8: '#ffb886',
          .6: '#ff888d',
          .4: '#ff4892',
          .2: '#21618c',
          0:'#21618c'
        }
      }).addTo(map);
      this.$data.heatmap = heatmap;

      this.drawHeatmap();
      // var vm = this; // Needed because using 'this' in forEach refers to recording
      //   this.month.value.forEach(function(recording) {
      //     console.log(recording);
      //     vm.heatmapData.push([(recording.Y * 0.75) - 75, (recording.X * 0.75) - 75])
      //   });
      //   // Redraw heatmap/history heatmap
      //   this.heatmap.setLatLngs(this.heatmapData);
    },
    watch: {
      // Resets entire map when deselecting a species from the list
      month() {
        this.drawHeatmap();
      }
    },
    methods: {
      drawHeatmap() {
        // Reset heatmap data
       if(this.heatmapData != []) {
         this.heatmapData = [];
         this.heatmap.setLatLngs(this.heatmapData);
       }

        if(this.month.value != null) {
        var vm = this; // Needed because using 'this' in forEach refers to recording
        console.log(this.month.value);
        this.month.value.values.forEach(function(recording) {
          vm.heatmapData.push([(recording.Y * 0.75) - 75, (recording.X * 0.75) - 75])
        });
        // Redraw heatmap/history heatmap
        this.heatmap.setLatLngs(this.heatmapData);
        }
      }
      // addYearToHeatmap(index, history) {
      //   var vm = this; // Needed because using 'this' in forEach refers to recording
      //   this.sData.values[index].values.forEach(function(recording) {
      //     if(!history) // Push data to regular heatmap
      //       vm.heatmapData.push([(recording.Y * 2.5) - 250, (recording.X * 2.5) - 250]);
      //     else // Or push data to history heatmap
      //       vm.historyData.push([(recording.Y * 2.5) - 250, (recording.X * 2.5) - 250]);
      //   });
      // }
    }
  }
</script>

<style scoped>
  #monthMap {
    width: 150px;
    height: 150px;
    margin: 5px 20px 5px 20px;
    position: relative;
    display: inline-block;
  }

</style>
