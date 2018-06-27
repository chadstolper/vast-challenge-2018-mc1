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
        // eslint-disable-next-line
        crs: L.CRS.Simple,
        currentControl: 'range',
        selectedPoint: '',
        selectedRange: [],
        selectedHistory: [],
        heatmapData: [],
        historyData: [],
        heatmap: null,
        history: null,
        showHistory: false
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
      // Event listeners to reactively change heatmap data when 
      // controls in HeatmapControls.vue are modified by user
      speciesEventBus.$on('selectionToggled', (control) => {
        this.currentControl = control;
      });
      speciesEventBus.$on('pointChanged', (point) => {
        this.selectedPoint = point;
      });
      speciesEventBus.$on('rangeChanged', (range) => {
        this.selectedRange = range;
      });
      speciesEventBus.$on('toggleHistory', (truthValue) => {
        this.showHistory = truthValue;
      });
      speciesEventBus.$on('historyChanged', (range) => {
        this.selectedHistory = range;
      });
    },
    mounted() {
      // Create map variable for heatLayers to be apended to
      let map = this.$refs.map.mapObject;
      map.setView([0, 0], 0);

      // History heatmap: (rendered first to appear below the regular heatmap)
      // eslint-disable-next-line
      let history = L.heatLayer(this.$data.historyData, {
        minOpacity: 0.85,
        radius: 13,
        maxZoom: 6,
        gradient: {
          0: '#fafafa',
          .75: '#808080',
          1: '#7F221F'
        }
      }).addTo(map);
      this.$data.history = history;

      // Regular heatmap layer:
      // eslint-disable-next-line
      let heatmap = L.heatLayer(this.$data.heatmapData, {
        minOpacity: 0.95,
        radius: 13,
        maxZoom: 6,
        blur: 12,
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
    },
    watch: {
      // Redraw the heatmap whenever the current control (range vs point) is changed
      currentControl() {
         this.redrawHeatmap(false);
      },
      // Redraw the heatmap whenever the selected range changes
      selectedRange() {
        this.redrawHeatmap(false);
      },
      // Redraw the heatmap whenever the selected point changes
      selectedPoint() {
        this.redrawHeatmap(false);
      },
      // If showHistory is true, redraw the heatmap when the range changes
      selectedHistory() {
        if(this.showHistory)
          this.redrawHeatmap(true);
      },
      // Either draw the history heatmap or remove it's data when showHistory is toggled
      showHistory() {
        if(this.showHistory)
          this.redrawHeatmap(true);
        else {
          this.historyData = [];
          this.history.setLatLngs(this.historyData);
        }
      },
      // Resets entire map when deselecting a species from the list
      speciesData() {
        if(typeof this.speciesData === "undefined")
          this.heatmapData = [];
          this.heatmap.setLatLngs(this.heatmapData);
          this.historyData = [];
          this.history.setLatLngs(this.historyData);
      }
    },
    methods: {
      // 
      redrawHeatmap(history) {
        // Handles drawing the data for the history heatmap
        if(history) {
          this.historyData = [];
          // Collect bounding indexes of species data based off of the selectedHistory
          let index1 = this.speciesData.values.findIndex(year => year.key === this.selectedHistory[0]);
          let index2 = this.speciesData.values.findIndex(year => year.key === this.selectedHistory[1]);
          // Loop through and add each year from selectedRange to history heatmap
          for(i = index1; i <= index2; i++) {
            this.addYearToHeatmap(i, history);
          }
          // Redraw history heatmap layer with newly modified historyData
          this.history.setLatLngs(this.historyData);
        } else { // Handles drawing the data for the regular heatmap
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
          // Redraw heatmap/history heatmap
            this.heatmap.setLatLngs(this.heatmapData);
          }
      },
      addYearToHeatmap(index, history) {
        var vm = this; // Needed because using 'this' in forEach refers to recording
        this.speciesData.values[index].values.forEach(function(recording) {
          if(!history) // Push data to regular heatmap
            vm.heatmapData.push([(recording.Y * 2.5) - 250, (recording.X * 2.5) - 250]);
          else // Or push data to history heatmap
            vm.historyData.push([(recording.Y * 2.5) - 250, (recording.X * 2.5) - 250]);
        });
      }
    }
  }
</script>

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
