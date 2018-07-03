<template>
  <div id="smallMap" :class="{faded : empty}">
    <h6>{{ timeUnit.key }}<span style="font-size : 12px"> ({{ numRecords }} record<span v-if="numRecords != 1">s</span>)</span></h6>
    <l-map ref="map" :minZoom="minZoom" :crs="crs" >
      <l-image-overlay :url="src" :bounds="bounds"></l-image-overlay>
    </l-map>
  </div>
</template>

<script>
  import { LMap, LImageOverlay, LMarker, LLayerGroup } from 'vue2-leaflet';
  import 'leaflet.heat';

  export default {
    name: 'SmallMap',
    props: {
      timeUnit: Object
    },
    data() {
      return {
        src:'/data/Lekagul-Roadways-2018.bmp',
        bounds: [[-87,-87], [87,87]],
        minZoom: 0,
        // eslint-disable-next-line
        crs: L.CRS.Simple,
        heatmapData: [],
        heatmap: null,
        numRecords: 0
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

      // Disable drag and zoom handlers
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
    },
    watch: {
      // Resets entire map when deselecting a species from the list
      timeUnit() {
        this.drawHeatmap();
      }
    },
    methods: {
      drawHeatmap() {
        // Reset heatmap data
       if(this.heatmapData != []) {
         this.heatmapData = [];
         this.heatmap.setLatLngs(this.heatmapData);
         this.numRecords = 0;
       }

        if(this.timeUnit.value != null) {
        var vm = this; // Needed because using 'this' in forEach refers to recording

        // Extract each recording location from the given month or year of data
        this.timeUnit.value.values.forEach(function(recording) {
          vm.heatmapData.push([(recording.Y * 0.87) - 87, (recording.X * 0.87) - 87])
          vm.numRecords++; // Increment numRecords
        });
        // Redraw heatmap/history heatmap
        this.heatmap.setLatLngs(this.heatmapData);
        }
      }
    },
    computed: {
      // Used to dynamically apply the .faded CSS class on maps with 0 records
      empty: function() {
          if(this.numRecords === 0)
            return true;
          else 
            return false;
        }
    }
  }
</script>

<style scoped>
  #smallMap {
    width: 174px;
    height: 174px;
    margin: 5px 20px 5px 20px;
    display: inline-block;
    transition: 0.5s;
    -moz-transition: 0.5s;
  }
  .faded {
    opacity: 0.2;
    transition: 0.5s;
    -moz-transition: 0.5s;
  }

</style>
