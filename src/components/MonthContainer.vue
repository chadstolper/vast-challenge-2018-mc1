<template>
    <div id="monthContainer">
        <transition name="fade-up" mode="out-in" appear>
        <h4 v-if="selectedSpecies === ''">Please select a species</h4>
        <div>
          <app-month-map v-if="monthData != null"
          v-for="month in monthData"
          :key="month.key"
          :month="month"
          class="month"></app-month-map>
        </div>
        </transition>
    </div>
</template>

<script>
  import { speciesEventBus } from '../main';
  import MonthMap from './MonthMap.vue';

  export default {
    name: 'MonthContainer',
    props: {
      monthNest: Array
    },
    data() {
      return {
        selectedSpecies: '',
        speciesData: null,
        months: ['January', 'Februrary', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'],
        availableMonths: [],
        monthData: null
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
        this.monthData = null;
        this.availableMonths = [];
        this.speciesData = null;
      });
    },
    components: {
      'app-month-map': MonthMap
    },
    watch: {
      // When a species is selected, assign speciesData to its corresponding data from monthNest
      selectedSpecies: function() {
        var index = this.monthNest.findIndex(species => species.key === this.selectedSpecies);
        this.speciesData = this.monthNest[index];
      },
      // When speciesData is updated, deterine available months of data and create monthData array
      speciesData: function() {
      if(this.speciesData != undefined) {
        // availableMonths:
        var months = [];
        this.speciesData.values.forEach(function(month) {
          if(month.key != "0/") {
            months.push(parseInt(month.key));
          }
        });
        this.availableMonths = months;
        
        // monthData:
        var data = [];
        // Using a for-loop with 12 iterations ensures every species selection has the same format 
        for(var i = 1; i <= 12; i++) {
          // If this month of data is available, then push it to data
          if(this.availableMonths.includes(i)) {
            data.push({key: this.months[i - 1], value: this.speciesData.values[i-1]});
          } else { // If no data is available, push an empty object to data
            data.push({key: this.months[i - 1], value: null});
          }
        }
        this.monthData = data;
        }
      }
    }
  }
</script>

<style scoped>
  #monthContainer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .leaflet-left {
    display: none;
  }
  h4 {
    margin: 0 auto;
    text-align: center;
    margin-top: 30px;
  }
  .month {
    margin: auto;
  }
</style>
