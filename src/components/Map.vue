<template>
  <div id="map">
    <l-map ref="map" :minZoom="minZoom" :crs="crs">
      <l-image-overlay :url="src" :bounds="bounds"></l-image-overlay>
      <l-marker v-if="kasiosLocation != null" :lat-lng="kasiosLocation.latlng" :icon="'/data/icons/marker.png'">
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
        // Leaflet data
        src:'/data/Lekagul-Roadways-2018.bmp',
        bounds: [[-250,-250], [250,250]],
        minZoom: 0,
        // eslint-disable-next-line
        crs: L.CRS.Simple,
        // Indicates whether range or point is toggled
        currentControl: 'range',
        // Selected data for MapControls
        selectedPoint: '',
        selectedRange: [],
        selectedHistory: [],
        // Data for heatmaps (calculated)
        heatmapData: [],
        historyData: [],
        // Stores the Leaflet.heat layer object references
        heatmap: null,
        history: null,
        // Controls whether the history slider is shown
        showHistory: false,
        // Calculated and passed to MapControls
        numRecords: 0,
        numHistory: 0
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
        return;
      });
      speciesEventBus.$on('pointChanged', (point) => {
        this.selectedPoint = point;
        return;
      });
      speciesEventBus.$on('rangeChanged', (range) => {
        this.selectedRange = range;
        return;
      });
      speciesEventBus.$on('toggleHistory', (truthValue) => {
        this.showHistory = truthValue;
        return;
      });
      speciesEventBus.$on('historyChanged', (range) => {
        this.selectedHistory = range;
        return;
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
        this.heatmapData = [];
        this.heatmap.setLatLngs(this.heatmapData);
        this.historyData = [];
        this.history.setLatLngs(this.historyData);
      }
    },
    methods: {
      // Method that calculates data to be drawn on the map based off year(s) selected in controls
      redrawHeatmap(history) {
        if(this.speciesData != undefined) {
          // Handles drawing the data for the history heatmap
          if(history) {
            this.numHistory = 0;
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
            speciesEventBus.$emit('numberHistoryUpdated', this.numHistory);
          } else { // Handles drawing the data for the regular heatmap
            this.heatmapData = [];
            this.numRecords = 0;

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
            speciesEventBus.$emit('numberRecordsUpdated', this.numRecords);
            }
        }
      },
      // Updates either heatmap's data array for display
      addYearToHeatmap(index, history) {
        var vm = this; // Needed because using 'this' in forEach refers to recording
        this.speciesData.values[index].values.forEach(function(recording) {
          if(!history) { // Push data to regular heatmap {
            vm.heatmapData.push([(recording.Y * 2.5) - 250, (recording.X * 2.5) - 250]);
            vm.numRecords++;
          }
          else { // Or push data to history heatmap
            vm.historyData.push([(recording.Y * 2.5) - 250, (recording.X * 2.5) - 250]);
            vm.numHistory++;
          }
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
  }
</style>
