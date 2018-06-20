<template>
  <div id="controls">
    <h5 v-if="selectedSpecies === ''">Please select a species</h5>
    <h5 v-else-if="showRange === 'range'">Years displayed: {{ rangeSlider.value[0] }}-{{ rangeSlider.value[1] }}</h5>
    <h5 v-else>Year displayed: {{ pointSlider.value }}</h5>
    <button type="button" class="btn btn-light"
            @click="toggleSlider"
            id="toggle"
            :class="{disabled : selectedSpecies === ''}">Toggle {{ showRange }} 
    </button>
    <vue-slider ref="rangeSlider" 
                v-if="showRange === 'range'" 
                v-bind="rangeSlider" 
                v-model="rangeSlider.value"
    ></vue-slider>
    <vue-slider ref="pointSlider" 
                v-else v-bind="pointSlider" 
                v-model="pointSlider.value"
    ></vue-slider>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component';

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
        showRange: "range"
      }
    },
    watch: {
      selectedSpecies: function() {

        if(this.selectedSpecies != '') {
        this.rangeSlider.disabled = false;
        this.pointSlider.disabled = false;
        this.rangeSlider.data = this.availableYears;
        this.pointSlider.data = this.availableYears;
        this.rangeSlider.value = [this.availableYears[0], this.availableYears[this.availableYears.length - 1]];
        } else {
          this.rangeSlider.disabled = true;
          this.pointSlider.disabled = true;
        }
      }
    },
    methods: {
      toggleSlider() {
        if(this.selectedSpecies != '') {
          if(this.showRange === "range") {
            this.showRange = "point";
            this.pointSlider.value = this.rangeSlider.value[0];
          }
          else {
            this.showRange = "range";
          }
        }
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
    top: 30px;
    background-color:whitesmoke;
    border-radius: 5px;
  }
  h5 {
    padding: 10px 0 5px 15px;
    display: inline-block;
  }
  #toggle {
    margin: 5px 15px 5px 0;
    float: right;
  }
</style>
