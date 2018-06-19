<template>
  <div id="app">
    <app-header></app-header>
    <div class="container-fluid">
      <div class="row">
        <p v-for="(location, i) in kasiosLocations" :key="i">{{location[0]}},{{location[1]}}</p>
        <app-list-kasios>
        </app-list-kasios>
        <app-list-species></app-list-species>
        <app-heatmap></app-heatmap>
        <div class="col-lg-4">
          <app-audio></app-audio>
          <app-audio></app-audio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from './components/Header.vue';
  import ListKasios from './components/ListKasios.vue'
  import ListSpecies from './components/ListSpecies.vue'
  import Heatmap from './components/Heatmap.vue'
  import Audio from './components/Audio.vue'

  // Import D3
  import * as d3 from 'd3'

  export default {
    name: 'app',
    components: {
      'app-header': Header,
      'app-list-kasios': ListKasios,
      'app-list-species': ListSpecies,
      'app-heatmap' : Heatmap,
      'app-audio' : Audio
    }, 
    data: function () {
        return {
          allBirds: null,
          testBirds: null,
          mapSizeMultiple: 1
        };
    }, 
    mounted: async function() {
      this.allBirds = await d3.csv("/data/AllBirdsv4-refined.csv");
      this.testBirds = await d3.csv("/data/test-birds-location.csv");
    }, 
    computed: {
      kasiosLocations: function() { // TODO: make these a data object
        if(this.testBirds) {
          let locations = [];
          this.testBirds.forEach(function (d) {
            d.ID = +d.ID;
            d.X = +d.X;
            d.Y = +d.Y;
            let location = [d.Y, d.X]; // LatLng format (y, x) for Leaflet markers
            locations.push(location);
          })
          console.log(locations);
          return locations;
        }
      },
      dataNest: function() {
        if(this.allBirds) {
          let birds = [];
          this.allBirds.forEach(function (d) {
            console.log("poopity scoop");
            d.Day = d.Date.slice(3, 6);
            d.Month = d.Date.slice(0, 2);
            d.Year = d.Date.slice(6);
            d.X = +d.X;
            d.Y = +d.Y;
            d.Species = d.English_name;
          })
          console.log(this.allBirds);
        }
        //Nest data first by species, then by year (asc.)
        var nestedData = d3.nest(this.allBirds)
          .key(function (d) {
            return d.Species
          })
          .key(function (d) {
            return d.Year
          }).sortKeys(d3.ascending)
          .entries(this.allBirds)

        console.log(nestedData);
        return nestedData;
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100vh;
  }
</style>