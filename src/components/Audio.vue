<template>
  <div id="audio">
    <div v-show="audioFile!==null">
      <div :id="containsWaveform">
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
        <button type="button" class="btn btn-default" @click="showSpectrogram">
          {{waveSpecButton}}
        </button>
      </div>
    </div>
    <div v-if="audioFile===null">Please select an audio file to analyze</div>
  </div>
</template>

<script>
  import WaveSurfer from 'wavesurfer';

  export default {
    name: 'Audio',
    props: {
      // Properties inherited from the parent Audio Container
      baseDirectory: String,
      audioFile: null,
      contains: String, // Which type of audio it is, Kasios or Species
    },
    data: function(){
      return{
        // Default playback values
        playPauseSymbol: 'media-play',
        audioLength: '00:00',
        currentTime: '00:00',
        showSpec: false,
        waveSurferHeight: 128,
        waveSpecButton: "Show Spectrogram",
      }
    },
    computed: {
      // Assigns unique ids to the divs for waveform and spectrogram
      containsWaveform: function(){
        return this.contains+"Waveform"
      },
    },
    watch: {
      // Update player when new audio file is selected
      audioFile() {
        // Reset default values
        this.showSpec = false
        this.waveSpecButton = "Show Spectrogram"
        this.currentTime = '00:00'
        this.audioLength = '00:00'
        this.playPauseSymbol = 'media-play'

        // Passes Vue instance to callback functions
        var vmWave = this;

        // Load in and draw waveform
        this.waveSurferInstance.load(
          this.baseDirectory + this.audioFile + '.mp3',
          );
        
        // When audio is playing set current time
        this.waveSurferInstance.on('audioprocess', function () {
          vmWave.playPauseSymbol = 'media-pause'
          vmWave.currentTime = new Date(Math.round(
            vmWave.waveSurferInstance.getCurrentTime()) * 1000).toISOString().substr(14, 5);
        });
        
        // Reset playback icon when audio clip finishes
        this.waveSurferInstance.on('finish', function () {
          vmWave.playPauseSymbol = 'media-play'
        });

        // Set total duration
        this.waveSurferInstance.on('ready', function () {
          // Update total audio length when file is loaded
          vmWave.audioLength = new Date(Math.round(
            vmWave.waveSurferInstance.getDuration()) * 1000).toISOString().substr(14, 5);
        });
      },
    },
    created () {
      // Setup wavesurfer on startup for audio playback
      this.$nextTick(() => {
        this.waveSurferInstance = WaveSurfer.create({
          container: '#'+this.containsWaveform,
          pixelRatio: 1, // Helps render faster and makes sure spectrogram fills the same height
          scrollParent: true,
          normalize: true,
          height: this.waveSurferHeight,
          waveColor: 'grey',
          progressColor: 'black',
        })
      })
    },
    methods: {
      // Toggles between play/pause and sets correct icon
      play () {
        this.waveSurferInstance.playPause()
        if(this.waveSurferInstance.isPlaying()==false){
          this.playPauseSymbol = 'media-play'
        }
        else{
          this.playPauseSymbol = 'media-pause'
        }
      },
      // Goes back 2s in the audio on button click
      skipBack () {
        this.waveSurferInstance.skipBackward()
      },
      // Goes forward 2s in the audio on button click
      skipForward () {
        this.waveSurferInstance.skipForward()
      },
      // Toggles whether to show the spectrogram or the waveform
      showSpectrogram () {
        this.showSpec = !this.showSpec
        var waveDivChildren = document.getElementById(this.containsWaveform).childNodes;
        var waveElementChildren = waveDivChildren[0].childNodes;
        var waveCanvas = waveElementChildren[1].getContext('2d');
        if (this.showSpec==true){
          this.waveSpecButton = "Show Waveform"
          this.waveSurferInstance.drawer.clearWave()
          var img = new Image;
          img.onload = function(){
            waveCanvas.drawImage(img,0,0);
          };
          img.src = "/data/spectrograms/"+this.audioFile+'.png';
        }
        else{
          this.waveSpecButton = "Show Spectrogram"
          this.waveSurferInstance.drawer.clearWave()
          this.waveSurferInstance.drawBuffer()
        }
      },
    }
  }
</script>

<style scoped>
  #audio {
    margin: auto;
    width: 100%;
    background-color:whitesmoke;
  }
</style>
