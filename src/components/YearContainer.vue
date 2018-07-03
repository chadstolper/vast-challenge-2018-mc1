<template>
    <div id="yearContainer">
        <transition name="fade-up-fast" mode="out-in" appear>
        <h4 v-if="selectedSpecies === ''">Please select a species</h4>
        <div>
          <transition-group name="grid" tag="app-small-map">
          <app-small-map v-if="yearData != null"
          v-for="year in yearData"
          :key="year.key"
          :timeUnit="year"
          class="year"></app-small-map>
          </transition-group >
        </div>
        </transition>
    </div>
</template>

<script>
  import { speciesEventBus } from '../main';
  import SmallMap from './SmallMap.vue';

  export default {
    name: 'YearContainer',
    props: {
      dataNest: Array,
      selectedSpecies: String
    },
    data() {
      return {
        // selectedSpecies: '',
        speciesData: null,
        availableYears: [],
        yearData: null,
        includeBlankYears: true
      }
    },
    created() {
      // Listen for item selected/deselected from the Species list
      speciesEventBus.$on('itemWasSelected', (item) => {
        this.selectedSpecies = item.value;
      });
      speciesEventBus.$on('itemWasDeselected', () => {
        // Reset all values 
        this.selectedSpecies = '';
        this.yearData = null;
        this.availableYears = [];
        this.speciesData = null;
      });
      speciesEventBus.$on('toggleEmpty', (value) => {
        console.log(value);
        this.includeBlankYears = !this.includeBlankYears;
      });

      if(this.selectedSpecies != '') {
        this.updateSpeciesData();
      }
    },
    components: {
      'app-small-map': SmallMap
    },
    watch: {
      // When a species is selected, assign speciesData to its corresponding data from dataNest
      selectedSpecies: function() {
        this.updateSpeciesData();
      },
      // When speciesData is updated, deterine available years of data and create yearData array
      speciesData: function() {
        if(this.speciesData != undefined) {
          var years = [];
          this.speciesData.values.forEach(function(year) {
            if(year.key != "00")
              years.push(year.key);
          });
          this.availableYears = years;
        
          // yearData:
          this.calculateYearlyData();
        }
      },
      // When the checkbox in the species list is toggled, hide blank years
      includeBlankYears: function() {
        this.calculateYearlyData();
      }
    },
    methods: {
      calculateYearlyData() {
        var data = [];
        var firstYear = this.availableYears[0];
        var counter = 0; // used to access speciesData

        // Using a for-loop with 12 iterations ensures every species selection has the same format 
        for(var i = firstYear; i <= 2018; i++) {
          // If this month of data is available, then push it to data
          if(this.availableYears.includes(i + "")) {
            data.push({key: i + "", value: this.speciesData.values[counter]});
            counter++; // increment index counter
          } else if(this.includeBlankYears) { // If no data is available, push an empty object to data
            data.push({key: i + "", value: null});
          }
        }
        this.yearData = data;
      },
      updateSpeciesData() {
        var index = this.dataNest.findIndex(species => species.key === this.selectedSpecies);
        this.speciesData = this.dataNest[index];
      }
    }
  }
</script>

<style scoped>
  #yearContainer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
    max-height: 90vh;
  }
  .leaflet-left {
    display: none;
  }
  h4 {
    margin: 0 auto;
    text-align: center;
    margin-top: 30px;
  }
  .grid-enter, .grid-leave-to {
    opacity: 0;
    transform: translateY(40px);
  }
  .grid-leave-active {
    position: absolute;
  }

</style>
