<template>
  <div id="controls">
    <h6 v-if="selectedSpecies === ''">Please select a species</h6>
    <h6 v-else-if="toggleText === 'point'">Years displayed: {{ rangeSlider.value[0] }}-{{ rangeSlider.value[1] }}</h6>
    <h6 v-else>Year displayed: {{ pointSlider.value }}</h6>
    
    <div class="btn-group" role="group" id="toggle" aria-label="Controls">
        <button type="button" class="btn btn-light"
                @click="toggleHistory"
                :class="{disabled : selectedSpecies === ''}">{{ historyText }} history
        </button>
        <button type="button" class="btn btn-light"
                @click="toggleSlider"
                :class="{disabled : selectedSpecies === ''}">Toggle {{ toggleText }} 
        </button>
    </div>

    <vue-slider ref="rangeSlider" class="slider"
                v-if="toggleText === 'point'" 
                v-bind="rangeSlider" 
                v-model="rangeSlider.value"
    ></vue-slider>
    <vue-slider ref="pointSlider" class="slider" 
                v-else v-bind="pointSlider" 
                v-model="pointSlider.value"
    ></vue-slider>
    <h6 v-if="historyText === 'Hide'">Comparing with: {{ historySlider.value[0] }}-{{ historySlider.value[1] }}</h6>
    <vue-slider ref="historySlider" class="slider"
                v-if="historyText === 'Hide'" 
                v-bind="historySlider" 
                v-model="historySlider.value"
    ></vue-slider>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component';
  import { speciesEventBus } from '../main';

  export default {
    name: 'MapControls',
    props: {
      selectedSpecies: '',
      availableYears: Array
    },
    data() {
      return {
        rangeSlider: {
          value: [],
          width: '90%',
          height: 4,
          dotSize: 12,
          disabled: true,
          show: true,
          tooltip: 'hover',
          piecewise: true,
          data: [],
          useKeyboard: true,
          style: {
            "margin-left" : "30px",
            "transition" : "0.5s"
          },
          processStyle: {
            "backgroundColor": "#21618C"
          },
          tooltipStyle: {
            "backgroundColor": "#21618C",
            "borderColor": "#21618C"
          }
        },
        pointSlider: {
          value: [],
          width: '90%',
          height: 4,
          dotSize: 12,
          disabled: true,
          show: true,
          tooltip: 'hover',
          piecewise: true,
          data: [],
          useKeyboard: true,
          processStyle: {
            "display" : "none"
          },
          style: {
            "margin-left" : "30px"
          }
        },
        historySlider: {
          value: [],
          width: '90%',
          height: 4,
          dotSize: 12,
          disabled: true,
          show: true,
          tooltip: 'hover',
          piecewise: true,
          data: [],
          useKeyboard: true,
          style: {
            "margin-top" : "10px",
            "margin-left" : "30px",
            "transition" : "0.5s"
          },
          processStyle: {
            "backgroundColor": "#cc3333"
          },
          tooltipStyle: {
            "backgroundColor": "#cc3333",
            "borderColor": "#cc3333"
          }
        },
        toggleText: "point",
        historyText: "Show"
      }
    },
    watch: {
      selectedSpecies() {
        // If species is selected, then enable sliders 
        if(this.selectedSpecies != '') {
          // Enable sliders
          this.rangeSlider.disabled = false;
          this.pointSlider.disabled = false;
          this.historySlider.disabled = false;
          // Set their data to the appropriate available years from selected species
          this.rangeSlider.data = this.availableYears;
          this.pointSlider.data = this.availableYears;
          this.historySlider.data = this.availableYears;
          // Reset the displayed data on the sliders
          this.rangeSlider.value = [this.availableYears[0], this.availableYears[this.availableYears.length - 1]];
          this.pointSlider.value = this.rangeSlider.value[0];
          this.historySlider.value = [this.availableYears[0], this.availableYears[this.availableYears.length - 1]];
        } else { // If species is deselected, disable sliders
          this.rangeSlider.disabled = true;
          this.pointSlider.disabled = true;
          this.historySlider.disabled = true;
          this.historyText = "Show";
          speciesEventBus.$emit('historyChanged', this.selectedHistory);
        }
      },
      selectedPoint() {
        speciesEventBus.$emit('pointChanged', this.selectedPoint);
      },
      selectedRange() {
        speciesEventBus.$emit('rangeChanged', this.selectedRange);
      },
      selectedHistory() {
        speciesEventBus.$emit('historyChanged', this.selectedHistory);
      }
    },
    methods: {
      toggleSlider() {
        // If a species is selected
        if(this.selectedSpecies != '') {
          if(this.toggleText === "point") { // Switch contol to point
            this.toggleText = "range";
            this.pointSlider.value = this.rangeSlider.value[0];
            speciesEventBus.$emit('selectionToggled', 'point');
          }
          else { // Switch control to range
            this.toggleText = "point";
            speciesEventBus.$emit('selectionToggled', 'range');
          }
        }
      },
      toggleHistory() {
        // If a species is selected
        if(this.selectedSpecies != '') {
          if(this.historyText === "Show") { // Switch contol to point
            this.historyText = "Hide";
            speciesEventBus.$emit('toggleHistory', true);
          }
          else { // Switch control to range
            this.historyText = "Show";
            speciesEventBus.$emit('toggleHistory', false);
          }
        }
      }
    },
    computed: {
      selectedPoint() {
        return this.pointSlider.value;
      },
      selectedRange() {
        return this.rangeSlider.value;
      },
      selectedHistory() {
        return this.historySlider.value;
      }
    },
    components: {
      vueSlider
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #controls {
    margin: auto;
    position: relative;
    top: 25px;
    background-color:whitesmoke;
    border-radius: 5px;
  }
  h6 {
    padding: 10px 0 0 15px;
    display: inline-block;
  }
  #toggle {
    margin: 5px 15px 5px 0;
    float: right;
  }
  .slider {
    margin: 5px 0 0 0
  }
</style>
