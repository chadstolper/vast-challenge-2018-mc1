<template>
  <div id="app">
    <transition name="fade-down" appear>
      <app-header></app-header>
    </transition>

    <div class="container-fluid" id="components">
    <!-- Main View -->
    <transition name="fade-up" mode="out-in" appear>
      <div class="row" v-if="currentView === 'Main View'" :key="'main'">
        <div class="col-md-1">
            <app-list :contains="'Kasios'" :items="kasiosFileNames"></app-list>
        </div>

        <div class="col-md-2">
            <app-list :contains="'Species'" :items="speciesNames" ></app-list>
        </div>

          <div class="col-md-5">
            <app-map-container :kasiosLocations="kasiosLocations" :dataNest="dataNest"></app-map-container>
          </div>

          <div class="col-md-4" id="audioContainer">
            <app-audio-container :contains="'Kasios'" :representative-data="kasiosLocations"></app-audio-container>
            <app-audio-container :contains="'Species'" :representativeData="representativeSpecies"></app-audio-container>
          </div>
      </div>

      <!-- Month View -->
      <div class="row" v-if="currentView === 'Month View'" :key="'month'">
        <div class="col-md-2">
            <app-list :contains="'Species'" :items="speciesNames" ></app-list>
        </div>

        <div class="col-lg-10">
          <app-month-container :monthNest="monthNest"></app-month-container>
        </div>
      </div>

      <!-- Yearly View -->
      <div class="row" v-if="currentView === 'Year View'" :key="'year'">
        <div class="col-md-2">
            <app-list :contains="'Species'" :items="speciesNames" 
            :current-view="currentView"></app-list>
        </div>

        <div class="col-lg-10">
          <app-year-container :dataNest="dataNest"></app-year-container>
        </div>
      </div>
    </transition>
    </div>
  </div> 
</template>

<script>
  // Import components and both event busses
  import Header from './components/Header.vue';
  import List from './components/List.vue'
  import MapContainer from './components/MapContainer.vue'
  import AudioContainer from './components/AudioContainer.vue'
  import MonthContainer from './components/MonthContainer.vue'
  import YearContainer from './components/YearContainer.vue'
  import { kasiosEventBus } from './main';
  import { speciesEventBus } from './main';

  // Import D3
  import * as d3 from 'd3'

  export default {
    name: 'app',
    components: {
      'app-header': Header,
      'app-list': List,
      'app-map-container' : MapContainer,
      'app-audio-container' : AudioContainer,
      'app-month-container' : MonthContainer,
      'app-year-container' : YearContainer
    }, 
    data: function () {
        return {
          allBirds: null,
          testBirds: null,
          rawPredictions: null,
          currentView: "Main View"
        };
    }, 
    mounted: async function() {
      // Extract data from CSVs using D3 and store them in data variables
      this.allBirds = await d3.csv("/data/AllBirdsv4-refined.csv");
      this.testBirds = await d3.csv("/data/test-birds-location.csv");
      this.rawPredictions = await d3.csv("/data/aggregate_predictions.csv")
    }, 
    computed: {
      // Compute an array of kasios recording locations for the map to render markers with
      kasiosLocations() {
        if(this.testBirds) {
          let locations = [];
          // For each entry in the test-birds-location.csv:
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
      // Main data object (nested by year) used for primary heatmap
      dataNest() {
        // Prevents null/undefined errors
        if(!this.allBirds) {
          return []
        }
        // Format data from csv
        this.allBirds.forEach(function (d) {
          d.Day = d.Date.slice(3, 5);
          d.Month = d.Date.slice(0, 2);
          d.Year = d.Date.slice(6);
          d.X = +d.X;
          d.Y = +d.Y;
          d.Species = d.English_name;
        })
        // Nest data first by species, then by year (asc.)
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
      // Second data object (nested by month) used for monthly view
      monthNest() {
        // Prevents null/undefined errors
        if(!this.allBirds) {
          return []
        }
        // Nest data first by species, then by month (asc.)
        var nestedData = d3.nest(this.allBirds)
          .key(function (d) {
            return d.Species
          })
          .key(function (d) {
            return d.Month
          }).sortKeys(d3.ascending)
          .entries(this.allBirds)
        
        return nestedData;
      },
      // Array of all species names for species list
      speciesNames() {
        var speciesNames = []
        this.dataNest.forEach(function (d) {
          speciesNames.push(d.key);
        })
        return speciesNames;
      },
      // Array of all Kasios Furniture file names for Kasios list
      kasiosFileNames() {
        var fileNames = [];
        for(var i = 1; i <= 15; i++) { // 15 file names, starting with 1
          fileNames.push("" + i);
        }
        return fileNames;
      },
      // Load prediction data from csv
      predictions() {
        // Prevents null/undefined errors
        if(!this.rawPredictions) {
          return []
        }
        // Format the prediction percentages
        this.rawPredictions.forEach(function (d) {
          d.first = +d.first_confidence;
          d.second = +d.second_confidence;
          d.third = +d.third_confidence;
          d.first_confidence = Math.round(d.first_confidence * 100) + "%";
          d.second_confidence = Math.round(d.second_confidence * 100) + "%";
          d.third_confidence = Math.round(d.third_confidence * 100) + "%";
          if(d.model_Agreement === "0/7") {
            d.unknown = true;
          } else {
            d.unknown = false;
          }
        })
        // Nest data based on ID
        var nestedPredictions = d3.nest(this.rawPredictions) 
          .key(function (d) {
            return d.ID
          }).entries(this.rawPredictions)

        console.log(nestedPredictions);
        return nestedPredictions;
      },
      // Metadata on each representative species recording
      representativeSpecies() {
        // Prevents null/undefined errors
        if(!this.allBirds) {
          return [];
        }
        function filterCriteria(d) {
          return d.Representative !== "";
        }
        var repSpeciesData = this.allBirds.filter(filterCriteria);
        return repSpeciesData;
      },
    },
    created() {
      // When an item is selected in the Kasios list, highlight the predictions in the Species list
      kasiosEventBus.$on('itemWasSelected', (item) => {
        var index = this.predictions.findIndex(file => file.key === item.value);
        speciesEventBus.$emit('highlightPredictions', this.predictions[index].values[0]);
      });

      speciesEventBus.$on('viewChanged', (view) => {
        this.currentView = view;
      })
    },
    methods: {
      toggleView() {
        // If the Audio interface is currently displayed
        if(this.currentView === "Audio")
          this.currentView = "Month"; // toggle to the Month interface
        
        else // If the Month interface is currently displayed
          this.currentView = "Audio"; // toggle to the Audio interface
      },
    }
  }
</script>

<style>
  @import "../node_modules/leaflet/dist/leaflet.css";

  #app {
    font-family: 'Nunito', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100vh;
    overflow: hidden;
  }

  .leaflet-bottom {
    display: none;
  }

  .month .leaflet-left {
    display: none;
  }

  .year .leaflet-left {
    display: none;
  }

  /*=== Leaflet transitions and css animations ===*/

  .fade-up-enter-active, .fade-up-leave-active {
    transition: all 0.8s;
    animation-delay: 0s;
  }
  .fade-up-enter, .fade-up-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translate3d(0, 15px, 0);
  }
  .fade-up-fast-enter-active, .fade-up-fast-leave-active {
    transition: all 0.5s;
    animation-delay: 0s;
  }
  .fade-up-fast-enter, .fade-up-fast-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
  }
  .fade-down-enter-active, .fade-down-leave-active {
    transition: all 0.7s;
  }
  .fade-down-enter, .fade-down-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }
  /*=== Scrollbar css for longer audio files ===*/
  #audioContainer ::-webkit-scrollbar {
    height: 4px;
  }

  #audioContainer ::-webkit-scrollbar-track {
      background: #dddddd ; 
  }

  #audioContainer ::-webkit-scrollbar-thumb {
      background: #21618C;
  }

  #audioContainer ::-webkit-scrollbar-thumb:hover {
      background: #1C5377; 
  }
</style>