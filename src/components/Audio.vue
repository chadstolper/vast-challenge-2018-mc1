<template>
  <div id="audio">
      <div id="waveform">
        <p v-if="audioFile==null">Please select an audio file</p>
      </div>
      <div class="btn-group">
        <button type="button" class="btn btn-primary" @click="play">Play / Pause</button>
      </div>
  </div>
</template>

<script>
  import * as WaveSurfer from 'wavesurfer';

  export default {
    name: 'Audio',
    props: {
      baseDirectory: String,
      audioFile: String,
    },
    watch: {
      audioFile: function() {
        this.waveTest.load(this.baseDirectory + this.audioFile + '.mp3');
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.waveTest = WaveSurfer.create({
          container: '#waveform',
          scrollParent: true,
          waveColor: 'grey',
          progressColor: 'black',
        })
      })
    },
    methods: {
      play () {
        this.waveTest.playPause()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #audio {
    margin: auto;
    /* height: 0; */
    width: 100%;
    background-color:lightgray;
  }
</style>
