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
  import { LMap, LImageOverlay, LMarker, LPopup, LLayerGroup } from 'vue2-leaflet';
  import { speciesEventBus } from '../main';
  import 'leaflet.heat';

  export default {
    name: 'Map',
    props: {
      kasiosLocation: Object,
      speciesData: Object,
      availableYears: Array
    },
    data() {
      return {
        src:'/data/Lekagul-Roadways-2018.bmp',
        bounds: [[-250,-250], [250,250]],
        minZoom: 0,
        crs: L.CRS.Simple,
        currentControl: 'range',
        selectedPoint: '',
        selectedRange: [],
        heatmapData: [],
        heatmap: null
      }
    },
    components: {
      LMap,
      LImageOverlay,
      LMarker,
      LPopup,
      LLayerGroup
    },
    created() {
      speciesEventBus.$on('selectionToggled', (control) => {
        this.currentControl = control;
      });
      speciesEventBus.$on('pointChanged', (point) => {
        this.selectedPoint = point;
      });
      speciesEventBus.$on('rangeChanged', (range) => {
        this.selectedRange = range;
      });
    },
    mounted() {
      let map = this.$refs.map.mapObject;
      map.setView([0, 0], 0);
      let heatmap = L.heatLayer(this.$data.heatmapData, {
        minOpacity: 0.75,
        radius: 13,
        maxZoom: 6
      }).addTo(map);
      this.$data.heatmap = heatmap;
    },
    watch: {
      selectedRange() {
        this.redrawHeatmap();
      },
      selectedPoint() {
        this.redrawHeatmap();
      },
      speciesData() {
        if(typeof this.speciesData === "undefined")
          this.heatmapData = [];
          this.heatmap.setLatLngs(this.heatmapData);
      },
      currentControl() {
         this.redrawHeatmap();
      }
    },
    methods: {
      redrawHeatmap() {
        // Reset heatmapData
        this.heatmapData = [];
        if(this.currentControl === 'range') {
          // Collect bounding indexes of species data based off of the selectedRange
          let index1 = this.speciesData.values.findIndex(year => year.key === this.selectedRange[0]);
          let index2 = this.speciesData.values.findIndex(year => year.key === this.selectedRange[1]);
          // Loop through and add each year from selectedRange to heatmapData
          for(var i = index1; i <= index2; i++) {
            this.addYearToHeatmap(i);
          }
        } else if(this.currentControl === 'point') {
          let index = this.speciesData.values.findIndex(year => year.key === this.selectedPoint);
          this.addYearToHeatmap(index);
        }
        // Redraw heatmap
        this.heatmap.setLatLngs(this.heatmapData);
      },
      addYearToHeatmap(index) {
        var vm = this; // Needed because using 'this' in forEach refers to recording
        this.speciesData.values[index].values.forEach(function(recording) {
          vm.heatmapData.push([(recording.Y * 2.5) - 250, (recording.X * 2.5) - 250]);
        });
      }
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
