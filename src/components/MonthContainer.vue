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
          this.selectedSpecies = '';
          this.monthData = null;
          this.availableMonths = [];
          this.speciesData = null;
      });
      // speciesEventBus.$on('viewChanged', () => {
      //   var index = this.monthNest.findIndex(species => species.key === this.selectedSpecies);
      //   this.selectedSpecies = 
      //   this.speciesData = this.monthNest[index];
      // })
    },
    components: {
      'app-month-map': MonthMap
    },
    watch: {
      selectedSpecies: function() {
        var index = this.monthNest.findIndex(species => species.key === this.selectedSpecies);
        this.speciesData = this.monthNest[index];
      },
      speciesData: function() {
        if(this.speciesData != null) {
        var months = [];

        this.speciesData.values.forEach(function(month) {
          if(month.key != "0/") {
            months.push(parseInt(month.key));
          }
        });
        this.availableMonths = months;
        var data = [];
        for(var i = 1; i <= 12; i++) {
          if(this.availableMonths.includes(i)) {
            // console.log
            // console.log(this.availableMonths.includes(i))
            // console.log(this.months[i - 1])
            // console.log(this.speciesData.values[i - 1].values)
            data.push({key: this.months[i - 1], value: this.speciesData.values[i-1]});
          } else {
            data.push({key: this.months[i - 1], value: null});
          }
        }
        this.monthData = data;
        console.log(this.monthData.toString());
        }
      }
    }
  }
</script>

<style scoped>
  #monthContainer {
    width: 100%;
    height: 100%;
  }

  .leaflet-left {
    display: none;
  }

  h4 {
    margin: 0 auto;
    text-align: center;
    margin-top: 30px;
  }
</style>
