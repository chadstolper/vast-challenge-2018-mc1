<template>
  <div id="app">
    <app-header></app-header>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-1">
          <app-list :contains="'Kasios'" :items="kasiosFileNames"></app-list>
        </div>
        <div class="col-md-2">
          <app-list :contains="'Species'" :items="speciesNames"></app-list>
        </div>
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
  import List from './components/List.vue'
  import Heatmap from './components/Heatmap.vue'
  import Audio from './components/Audio.vue'

  // Import D3
  import * as d3 from 'd3'

  export default {
    name: 'app',
    components: {
      'app-header': Header,
      'app-list': List,
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
      console.log(this.allBirds);
      console.log(this.testBirds);
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
        if(!this.allBirds) {
          return []
        }
          this.allBirds.forEach(function (d) {
            d.Day = d.Date.slice(3, 6);
            d.Month = d.Date.slice(0, 2);
            d.Year = d.Date.slice(6);
            d.X = +d.X;
            d.Y = +d.Y;
            d.Species = d.English_name;
          })
        
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
      },
      speciesNames: function() {
        var speciesNames = []
        this.dataNest.forEach(function (d) {
          speciesNames.push(d.key);
        })
        return speciesNames;
      },
      kasiosFileNames: function() {
        var fileNames = [];
        for(var i = 1; i < 16; i++) {
          fileNames.push("" + i);
        }
        return fileNames;
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