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
        <div class="col-md-5">
          <app-map-container :kasiosLocations="kasiosLocations" :dataNest="dataNest"></app-map-container>
        </div>
        <div class="col-lg-4">
          <app-audio-container :contains="'Kasios'"></app-audio-container>
          <!-- <app-audio-container :contains="'Species'"></app-audio-container> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from './components/Header.vue';
  import List from './components/List.vue'
  import MapContainer from './components/MapContainer.vue'
  import AudioContainer from './components/AudioContainer.vue'

  // Import D3
  import * as d3 from 'd3'

  export default {
    name: 'app',
    components: {
      'app-header': Header,
      'app-list': List,
      'app-map-container' : MapContainer,
      'app-audio-container' : AudioContainer
    }, 
    data: function () {
        return {
          allBirds: null,
          testBirds: null
        };
    }, 
    mounted: async function() {
      this.allBirds = await d3.csv("/data/AllBirdsv4-refined.csv");
      this.testBirds = await d3.csv("/data/test-birds-location.csv");
    }, 
    computed: {
      kasiosLocations: function() {
        if(this.testBirds) {
          let locations = [];
          this.testBirds.forEach(function (d) {
            // Format data correctly (String -> int)
            d.X = +d.X;
            d.Y = +d.Y;
            // Create object for rendering markers and push to locations array
            let location = { name: d.ID, latlng: [(d.Y * 2.5) - 250, (d.X * 2.5) - 250],
                             x: d.X, y: d.Y };
            locations.push(location);
          })
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
  @import "../node_modules/leaflet/dist/leaflet.css";
  .leaflet-fake-icon-image-2x {
    background-image: url(../node_modules/leaflet/dist/images/marker-icon-2x.png);
  }
  .leaflet-fake-icon-shadow {
    background-image: url(../node_modules/leaflet/dist/images/marker-shadow.png);
  }

  #app {
    font-family: 'Nunito', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100vh;
  }
</style>