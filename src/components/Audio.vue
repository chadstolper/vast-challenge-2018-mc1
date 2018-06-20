<template>
  <div id="audio">
    <div v-show="audioFile!==null">
      <div id="waveform">
        <p v-if="audioFile==null">Please select an audio file</p>
      </div>
      <div class="btn-group">
        <button type="button" class="btn btn-default" @click="skipBack">
          <img src="/data/icons/media-skip-backward.svg" alt="Back">
        </button>
        <button type="button" class="btn btn-default" @click="play">
          <img :src="'/data/icons/'+playPauseSymbol+'.svg'" alt="Play / Pause">
        </button>
        <button type="button" class="btn btn-default" @click="skipForward">
          <img src="/data/icons/media-skip-forward.svg" alt="Forward">
        </button>
        <button type="button" class="btn btn-disabled">
          {{currentTimeStamp() }} / {{audioLength}}
        </button>
        <button type="button" class="btn">
          Waveform / Spectrogram toggle
        </button>
      </div>
    </div>
    <div v-if="audioFile===null">Please select an audio file to analyze</div>
  </div>
</template>

<script>
  import * as WaveSurfer from 'wavesurfer';

  export default {
    name: 'Audio',
    props: {
      baseDirectory: String,
      audioFile: null,
    },
    data: function(){
      return{
        playPauseSymbol: 'media-play',
        audioLength: '00',
      }
    },
    watch: {
      audioFile: function() {
        this.playPauseSymbol = 'media-play'
        this.waveSurferInstance.load(this.baseDirectory + this.audioFile + '.mp3');
        this.audioLength = Math.round(this.waveSurferInstance.getDuration());
      }
    },
    computed: {
      
    },
    mounted () {
      this.$nextTick(() => {
        this.waveSurferInstance = WaveSurfer.create({
          container: '#waveform',
          scrollParent: true,
          waveColor: 'grey',
          progressColor: 'black',
        })
      })
    },
    methods: {
      currentTimeStamp: function() {
        if (this.audioFile!==null) {
          return Math.round(this.waveSurferInstance.getCurrentTime());
        }
        else{
          return 0;
        }
      },
      play () {
        this.waveSurferInstance.playPause()
        if(this.waveSurferInstance.isPlaying()==false){
          this.playPauseSymbol = 'media-play'
        }
        else{
          this.playPauseSymbol = 'media-pause'
        }
      },
      skipBack () {
        this.waveSurferInstance.skipBackward()
      },
      skipForward () {
        this.waveSurferInstance.skipForward()
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
    background-color:whitesmoke;
  }
</style>
