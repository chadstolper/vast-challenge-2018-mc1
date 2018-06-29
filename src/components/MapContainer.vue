<template>
    <div id="mapContainer">
      <app-map :kasiosLocation="kasiosLocation" :speciesData="speciesData" :availableYears="availableYears"></app-map>
      <app-map-controls :selectedSpecies="selectedSpecies" :availableYears="availableYears" id="controls"></app-map-controls>
    </div>
</template>

<script>
  import { kasiosEventBus } from '../main';
  import { speciesEventBus } from '../main';
  import Map from './Map.vue';
  import MapControls from './MapControls.vue';

  export default {
    name: 'MapContainer',
    props: {
      kasiosLocations: Array,
      dataNest: Array
    },
    data() {
      return {
        selectedKasios: '',
        selectedSpecies: '',
        kasiosLocation: null,
        speciesData: null,
        availableYears: []
      }
    },
    created() {
      // Listen for item selected/deselected from the Kasios list
      kasiosEventBus.$on('itemWasSelected', (item) => {
          this.selectedKasios = item.value;
      });
      kasiosEventBus.$on('itemWasDeselected', () => {
          this.selectedKasios = '';
      });
      // Listen for item selected/deselected from the Species list
      speciesEventBus.$on('itemWasSelected', (item) => {
          this.selectedSpecies = item.value;
      });
      speciesEventBus.$on('itemWasDeselected', () => {
          this.selectedSpecies = '';
      });
    },
    components: {
      'app-map': Map,
      'app-map-controls': MapControls
    },
    watch: {
      selectedKasios: function() {
        this.kasiosLocation = this.kasiosLocations[parseInt(this.selectedKasios) - 1];
      },
      // When a species is selected, assign speciesData to its corresponding data from dataNest
      selectedSpecies: function() {
        var index = this.dataNest.findIndex(species => species.key === this.selectedSpecies);
        this.speciesData = this.dataNest[index];
      },
      // When speciesData is updated, determine the available years of data
      speciesData: function() {
        if(this.speciesData != undefined) {
          var years = [];
          this.speciesData.values.forEach(function(year) {
            if(year.key != "00")
              years.push(year.key);
          });
          this.availableYears = years;
        }
      }
    }
  }
</script>

<style scoped>
  #mapContainer {
    width: 100%;
    height: 100%;
  }
</style>
