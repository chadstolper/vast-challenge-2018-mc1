<template>
  <div class="container-fluid" id="AudioContainer" >
      <h5>{{ contains }} Audio: {{selectedAudioFile}}</h5>
      <AudioPlayer :audioFile="selectedAudioFile"
      :baseDirectory="baseAudioDirectory"
      :contains="contains"></AudioPlayer>
  </div>
</template>

<script>
  import Audio from './Audio.vue'
  import { kasiosEventBus } from '../main';
  import { speciesEventBus } from '../main';

  export default {
    name: 'AudioContainer',
    created() {
      this.selectedAudioFile = null;
      // Setup event listeners for selecting ListItems within kasios and species lists
      if(this.contains === "Kasios") {
        this.baseAudioDirectory = '/data/test-birds-from-kasios-mp3/';
        kasiosEventBus.$on('itemWasSelected', (item) => {
          this.selectedAudioFile = item.value;
        });
        // Send deselect value to all children ListItems
        kasiosEventBus.$on('itemWasDeselected', () => {
          this.selectedAudioFile = null;
        });
      } else if(this.contains === "Species") {
        this.baseAudioDirectory = '/data/species-mp3/';
        speciesEventBus.$on('itemWasSelected', (item) => {
          this.selectedAudioFile = item.value;
        });
        speciesEventBus.$on('itemWasDeselected', () => {
          this.selectedAudioFile = null;
        });
      }
    },
    props: {
      contains: String,
    },
    data: function() {
      return {
        selectedAudioFile: String,
        baseAudioDirectory: String,
      }
    },
    components: {
      'AudioPlayer' : Audio
    }
}
</script>

<style scoped>
  #AudioContainer {
    margin: auto;
    margin-top: 10px;
    width: 100%;
    background-color:whitesmoke;
    border-radius: 5px;
  }
  h5 {
    padding: 10px 0 5px 0;
  }
</style>
