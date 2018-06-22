<template>
  <div id="audio">
    <div v-show="audioFile!==null">
      <div :id="containsWaveform">
        <p v-if="audioFile==null">Please select an audio file</p>
      </div>
      <div :id="containsSpectrogram" v-show="showSpec">
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
          {{currentTime}} / {{audioLength}}
        </button>
        <button type="button" class="btn btn-default" @click="showSpec = !showSpec">
          Waveform / Spectrogram toggle
        </button>
      </div>
    </div>
    <div v-if="audioFile===null">Please select an audio file to analyze</div>
  </div>
</template>

<script>
  import * as WaveSurfer from 'wavesurfer';
  import 'wavesurfer/dist/plugin/wavesurfer.spectrogram.min.js';

  export default {
    name: 'Audio',
    props: {
      baseDirectory: String,
      audioFile: null,
      contains: String,
    },
    data: function(){
      return{
        playPauseSymbol: 'media-play',
        audioLength: '00:00',
        currentTime: '00:00',
        showSpec: false,
        waveSurferHeight: 128,
      }
    },
    computed: {
      containsWaveform: function(){
        return this.contains+"Waveform"
      },
      containsSpectrogram: function(){
        return this.contains+"Spectrogram"
      },
    },
    watch: {
      audioFile() {
        this.currentTime = '00:00';
        this.audioLength = '00:00';
        this.playPauseSymbol = 'media-play'
        this.waveSurferInstance.load(this.baseDirectory + this.audioFile + '.mp3');
        var vmWave = this;
        this.waveSurferInstance.on('audioprocess', function () {
          vmWave.currentTime = new Date(Math.round(
            vmWave.waveSurferInstance.getCurrentTime()) * 1000).toISOString().substr(14, 5);
        });
        this.waveSurferInstance.on('ready', function () {
          // Update total audio length when file is loaded
          vmWave.audioLength = new Date(Math.round(
            vmWave.waveSurferInstance.getDuration()) * 1000).toISOString().substr(14, 5);
          // Generate spectrogram object when audio is loaded
          var spectrogram = Object.create(WaveSurfer.Spectrogram);
          spectrogram.init({
            wavesurfer: vmWave.waveSurferInstance,
            container: "#"+vmWave.containsSpectrogram,
            fftSamples: vmWave.waveSurferHeight*2,
          });
        });
      },
    },
    created () {
      this.$nextTick(() => {
        this.waveSurferInstance = WaveSurfer.create({
          container: '#'+this.containsWaveform,
          scrollParent: true,
          normalize: true,
          height: this.waveSurferHeight,
          waveColor: 'grey',
          progressColor: 'black',
        })
      })
    },
    methods: {
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
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #audio {
    margin: auto;
    width: 100%;
    background-color:whitesmoke;
  }
</style>
