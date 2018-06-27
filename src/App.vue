<template>
  <div id="app">
    <transition name="fade-down" mode="out-in" appear>
      <app-header class="" :current-view="currentView"></app-header>
    </transition>
    <div class="container-fluid">
      <div class="row">
        <transition name="fade-up" mode="out-in" appear>
          <div class="col-md-1 " v-if="currentView === 'Main View'">
            <app-list :contains="'Kasios'" :items="kasiosFileNames"></app-list>
          </div>
        </transition>
        <transition name="fade-up" mode="out-in" appear>
          <div class="col-md-2">
            <app-list :contains="'Species'" :items="speciesNames"></app-list>
          </div>
        </transition>
        <transition name="fade-up" mode="out-in" appear>
          <div class="col-md-5" v-if="currentView === 'Main View'">
            <app-map-container :kasiosLocations="kasiosLocations" :dataNest="dataNest"></app-map-container>
          </div>
        </transition>
        <transition name="fade-up" mode="out-in" appear>
          <div class="col-md-10" v-if="currentView === 'Month View'">
            <app-month-container :monthNest="monthNest"></app-month-container>
          </div>
        </transition>
        <transition name="fade-up" mode="out-in" appear>
          <div class="col-lg-4" v-if="currentView === 'Main View'">
            <app-audio-container :contains="'Kasios'" class=""></app-audio-container>
            <app-audio-container :contains="'Species'" class=""></app-audio-container>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from './components/Header.vue';
  import List from './components/List.vue'
  import MapContainer from './components/MapContainer.vue'
  import AudioContainer from './components/AudioContainer.vue'
  import MonthContainer from './components/MonthContainer.vue'
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
      'app-month-container' : MonthContainer
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
      this.allBirds = await d3.csv("/data/AllBirdsv4-refined.csv");
      this.testBirds = await d3.csv("/data/test-birds-location.csv");
      this.rawPredictions = await d3.csv("/data/aggregate_predictions.csv")
    }, 
    computed: {
      kasiosLocations() {
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
      // Main data object (nested by year) used for primary heatmap
      dataNest() {
        // Prevents null/undefined errors
        if(!this.allBirds) {
          return []
        }
        // Format data from csv
        this.allBirds.forEach(function (d) {
          d.Day = d.Date.slice(3, 6);
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
        for(var i = 1; i < 16; i++) {
          fileNames.push("" + i);
        }
        return fileNames;
      },
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
          d.first
        })
        // Nest data based on ID
        var nestedPredictions = d3.nest(this.rawPredictions) 
          .key(function (d) {
            return d.ID
          }).entries(this.rawPredictions)

        return nestedPredictions;
      }
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
          // toggle to the Month interface
          this.currentView = "Month";
        else // If the Month interface is currently displayed
          // toggle to the Audio interface
          this.currentView = "Audio";
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

  .fade-up-enter-active, .fade-up-leave-active {
    transition: all 1s;
  }
  .fade-up-enter, .fade-up-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translate3d(0, 2%, 0);
  }
  .fade-down-enter-active, .fade-down-leave-active {
    transition: all 0.7s;
  }
  .fade-down-enter, .fade-down-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  /*==== FADE IN UP ===*/
  /* thanks to https://fabriceleven.com/dev/quickly-add-css-fade-in-animations/ */
  @-webkit-keyframes fadeInUp {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 10%, 0);
      transform: translate3d(0, 10%, 0);
    }
  
    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 10%, 0);
      transform: translate3d(0, 10%, 0);
    }
 
    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
  .fadeInUp {
    -webkit-animation-name: fadeInUp;
    animation-name: fadeInUp;
  }
  /*=== FADE IN DOWN ===*/
  @-webkit-keyframes fadeInDown {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
  
    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
  @keyframes fadeInDown {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
  
    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
 
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
}
  /*=== Trigger  ===*/
  .animate {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  
  /*=== DELAYS ===*/
  .one {
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  animation-delay: 0.4s;
  }
  
  .two {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
  }
  
  .three {
  -webkit-animation-delay: 1.2s;
  -moz-animation-delay: 1.2s;
  animation-delay: 1.2s;
  }
  
  .four {
  -webkit-animation-delay: 1.6s;
  -moz-animation-delay: 1.6s;
  animation-delay: 1.6s;
  }

  .five {
  -webkit-animation-delay: 2s;
  -moz-animation-delay: 2s;
  animation-delay: 2s;
  }

  .leaflet-bottom {
    display: none;
  }

  .month .leaflet-left {
    display: none;
  }
</style>