<template>
  <div id="controls">
    <!-- Text -->
    <h6 v-if="selectedSpecies === ''">Please select a species</h6>
    <h6 v-else-if="toggleText === 'point'">Years displayed: {{ rangeSlider.value[0] }}-{{ rangeSlider.value[1] }}
          <span style="font-size : 12px"> ({{ numRecords }} record<span v-if="numRecords != 1">s</span>)</span>
    </h6>
    <h6 v-else>Year displayed: {{ pointSlider.value }}
          <span style="font-size : 12px"> ({{ numRecords }} record<span v-if="numRecords != 1">s</span>)</span>
    </h6>
    
    <!-- Buttons -->
    <div class="btn-group" role="group" id="toggle" aria-label="Controls">
        <button type="button" class="btn btn-light btn-sm"
                @click="toggleHistory"
                :class="{disabled : selectedSpecies === ''}">{{ historyText }} history
        </button>
        <button type="button" class="btn btn-light btn-sm"
                @click="toggleSlider"
                :class="{disabled : selectedSpecies === ''}">Toggle {{ toggleText }} 
        </button>
    </div>

    <!-- Sliders -->
    <vue-slider ref="rangeSlider" class="slider"
                v-if="toggleText === 'point'" 
                v-bind="rangeSlider" 
                v-model="rangeSlider.value"
    ></vue-slider>
    <vue-slider ref="pointSlider" class="slider" 
                v-else v-bind="pointSlider" 
                v-model="pointSlider.value"
    ></vue-slider>

    <!-- History text & slider -->
    <transition name="history" mode="out-in">
        <h6 v-if="historyText === 'Hide'">Comparing with: {{ historySlider.value[0] }}-{{ historySlider.value[1] }}
              <span style="font-size : 12px"> ({{ numHistory }} record<span v-if="numHistory != 1">s</span>)</span>
        </h6>
    </transition>
    <transition name="history" mode="out-in">
        <vue-slider ref="historySlider" class="slider"
                    v-if="historyText === 'Hide'" 
                    v-bind="historySlider" 
                    v-model="historySlider.value"
        ></vue-slider>
    </transition>
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
        // vueSlider data for primary range slider
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
        // vueSlider data for primary point selector
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
          },
          tooltipStyle: {
            "backgroundColor": "#21618C",
            "borderColor": "#21618C"
          }
        },
        // vueSlider data for history range slider
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
        historyText: "Show",
        numRecords: 0,
        numHistory: 0
      }
    },
    watch: {
      selectedSpecies() {
        // If species is selected, then:
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
        } else { // If species is deselected, then:
          // Disable sliders
          this.rangeSlider.disabled = true;
          this.pointSlider.disabled = true;
          this.historySlider.disabled = true;
          // Reset history range slider to not appear
          this.historyText = "Show";
          speciesEventBus.$emit('historyChanged', this.selectedHistory);
        }
      },
      // Slider range/point selection watchers: used to update data fed into heatmap(s)
      selectedRange() {
        speciesEventBus.$emit('rangeChanged', this.selectedRange);
      },
      selectedPoint() {
        speciesEventBus.$emit('pointChanged', this.selectedPoint);
      },
      selectedHistory() {
        speciesEventBus.$emit('historyChanged', this.selectedHistory);
      },
    },
    methods: {
      // Triggered on clicking the "Toggle Range/Point" button
      toggleSlider() {
        // If a species is selected:
        if(this.selectedSpecies != '') {
           // Switch contol to point selector and set its initial value
          if(this.toggleText === "point") {
            this.toggleText = "range"; // Switch toggleText of button to "range"
            this.pointSlider.value = this.rangeSlider.value[0];
            // Emit event to indicate heatmap data should be modified to be a single year (point)
            speciesEventBus.$emit('selectionToggled', 'point');
          }
          else { // Switch control to range
            this.toggleText = "point";
            // Emit event to indicate heatmap data should be modified to be a range of years
            speciesEventBus.$emit('selectionToggled', 'range');
          }
        }
      },
      // Triggered on clicking the "Show/Hide History" button
      toggleHistory() {
        // If a species is selected
        if(this.selectedSpecies != '') {
           // Enable history range slider
          if(this.historyText === "Show") {
            this.historyText = "Hide";
            // Emit event to indicate history heatmap should be drawn on the map
            speciesEventBus.$emit('toggleHistory', true);
             // Switch contol to point selector and set its initial value
            if(this.toggleText === "point") {
              this.toggleText = "range"; // Switch toggleText of button to "range"
              this.pointSlider.value = this.rangeSlider.value[0];
              // Emit event to indicate heatmap data should be modified to be a single year (point)
              speciesEventBus.$emit('selectionToggled', 'point');
            }
          }
          else { // Disable history range slider
            this.historyText = "Show";
            // Emit event to indicate history heatmap should disappear 
            speciesEventBus.$emit('toggleHistory', false);
            if(this.toggleText === "range") {
              this.toggleText = "point";
              // Emit event to indicate heatmap data should be modified to be a range of years
              speciesEventBus.$emit('selectionToggled', 'range');
            }
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
    created() {
      speciesEventBus.$on('numberRecordsUpdated', (num) => {
        this.numRecords = num;
      });
      speciesEventBus.$on('numberHistoryUpdated', (num) => {
        this.numHistory = num;
      });
    },
    components: {
      vueSlider
    }
  }
</script>

<style scoped>
  #controls {
    margin: auto;
    position: relative;
    top: 25px;
    background-color:whitesmoke;
    border-radius: 5px;
    height: 125px;
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
  .history-enter-active, .history-leave-active {
    transition: all 0.8s;
  }
  .history-enter, .history-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(15px);
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
