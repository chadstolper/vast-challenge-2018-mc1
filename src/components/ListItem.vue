<template>
  <li class="list-group-item" 
      style="cursor: pointer"
      :class="[{selected: selected}, {kasios: isA==='Kasios'},
      {faded: isA==='Species' && !isPrediction && kasiosSelected}]"
      @click="selectItem">
      {{ value }}
      <transition name="slide-fade">
      <span v-if="isPrediction" class="badge badge-pill badge-dark"
            :style="{'background-color' : bgColor}">{{ predictionValue }}</span>
      <span v-if="isUnknown" class="badge badge-pill badge-warning" 
      title="We could not produce an accurate prediction
      for this species from the historical recordings
      and do not believe this is a local species.
      Please feel free to listen to the audio
      and find a match.">?</span>
      </transition>
  </li>
</template>

<script>
  import { kasiosEventBus } from '../main';
  import { speciesEventBus } from '../main';

  export default {
  name: 'ListItem',
  props: {
    value: String,
    selectedItemInList: null,
    isA: String
  },
  data: function() {
    return {
      selected: false,
      isPrediction: false,
      predictionValue: 0,
      bgColor: '',
      kasiosSelected: false,
      isUnknown: false
    }
  },
  methods: {
    selectItem() {
      // If not already selected send appropriate event to parent List
      if (this.selected == false){
        if(this.isA === "Kasios") {
          kasiosEventBus.$emit('itemWasSelected', this);
        }
        else if(this.isA === "Species")
          speciesEventBus.$emit('itemWasSelected', this);
      }
      // If this Item is already selected send Deselect event to parent List
      else {
        if(this.isA === "Kasios") {
          kasiosEventBus.$emit('itemWasDeselected');
        }
        else if(this.isA === "Species")
          speciesEventBus.$emit('itemWasDeselected');
      }
    },
    predictionColor(value) {
      var gradient = [
        [ 0, [33, 97, 140] ],
        [ 100, [204,51,51] ]
      ]
      var firstcolor = gradient[0][1];
      var secondcolor = gradient[1][1];
      this.bgColor = 'rgb('+this.pickHexValue(secondcolor,firstcolor,value).join()+')';
    },
    pickHexValue(color1, color2, weight) {
      var p = weight;
      var w = p * 2 - 1;
      var w1 = (w/1+1) / 2;
      var w2 = 1 - w1;
      var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
      Math.round(color1[1] * w1 + color2[1] * w2),
      Math.round(color1[2] * w1 + color2[2] * w2)];
      return rgb;
    }
  },
  watch: {
    selectedItemInList: function() {
      if (this.selectedItemInList === this.value){
        this.selected = true;
      }
      else{
        this.selected = false;
      }
    }
  },
  created() {
    kasiosEventBus.$on('itemWasDeselected', () => {
      if(this.isPrediction) {
        this.isPrediction = false;
        this.predictionValue = 0;
      }
      this.isUnknown = false;
      this.kasiosSelected = false;
    });
    speciesEventBus.$on('highlightPredictions', (prediction) => {
      if(this.isA === "Species") {
        this.kasiosSelected = true;
        if(this.isPrediction) {
          this.isPrediction = false;
          this.predictionValue = 0;
        }
        if(this.value === prediction.first_guess) {
          this.isPrediction = true;
          this.predictionValue = prediction.first_confidence;
          this.predictionColor(prediction.first);
        } else if(this.value === prediction.second_guess) {
          this.isPrediction = true;
          this.predictionValue = prediction.second_confidence;
          this.predictionColor(prediction.second);
        } else if(this.value === prediction.third_guess) {
          this.isPrediction = true;
          this.predictionValue = prediction.third_confidence;
          this.predictionColor(prediction.third);
        } 
      }
      if(this.isA === "Kasios") {
        if(prediction.unknown === true) {
          if(prediction.ID === this.value)
          this.isUnknown = true;
          console.log(this);
        } else {
          this.isUnkown = false;
        }
      }
    });
    speciesEventBus.$on('viewChanged', () => {
      if(this.isPrediction) {
        this.isPrediction = false;
        this.predictionValue = 0;
      }
      this.kasiosSelected = false;
      // speciesEventBus.$emit('itemWasSelected', this);
    });
    kasiosEventBus.$on('itemWasSelected', (item) => {
      if(this.isUnknown && this != item) {
        this.isUnknown = false;
      }
    })
  }
}
</script>

<style scoped>
  .list-group-item {
    padding: 3px 1px 3px 0px;
    text-align: left;
    transition: 1s;
  }
  .kasios {
    text-align: center;
  }
  .faded {
    opacity: 0.6;
  }
  .selected {
    /*background-color: rgba(33, 97, 140, 0.1);*/
    background-color: whitesmoke;
  }
  /* .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  } */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(5px);
    opacity: 0;
  }
</style>
