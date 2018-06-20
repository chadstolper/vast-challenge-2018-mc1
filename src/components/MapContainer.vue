<template>
    <div id="mapContainer">
      <app-map :kasiosLocation="kasiosLocation"></app-map>
      <app-map-controls></app-map-controls>
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
        kasiosLocation: null
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #mapContainer {
    width: 100%;
    height: 100%;
  }
</style>
