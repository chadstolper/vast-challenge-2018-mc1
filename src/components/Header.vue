<template>
  <div class="container-fluid" id="header">
    <div class="col-lg-12">
      <a href="index.html">
        <img src="/data/logo.png" id="logoImg"/>
        <h3 style="text-align:left; display: inline-block">Audio Explorer</h3>
      </a>
      <img id= "aboutImg" src="/data/icons/about.png" alt="About this project" class="float-right" @click="aboutPage">
        <div class="btn-group" role="group" id="toggle" aria-label="Controls">
          <button type="button" class="btn btn-light btn-sm"
                  @click="toggleView('Main View')"
                  :class="{active : currentView === 'Main View'}">Main View
          </button>
          <button type="button" class="btn btn-light btn-sm"
                  @click="toggleView('Month View')"
                  :class="{active : currentView === 'Month View'}">Month View
          </button>
          <button type="button" class="btn btn-light btn-sm"
                  @click="toggleView('Year View')"
                  :class="{active : currentView === 'Year View'}">Year View
          </button>
        </div>
    </div>
  </div>
</template>

<script>
  import { speciesEventBus } from '../main';

  export default {
    name: 'Header',
    data: function() {
      return {
        currentView: "Main View"
      }
    },
    methods: {
      toggleView(view) {
        speciesEventBus.$emit('viewChanged', view);
        this.currentView = view;
      },
      aboutPage() {
        // Use sweetalret2
        this.$swal({
          title: 'About',
          width: 600,
          imageUrl: '/data/logo.png',
          imageWidth: 100,
          imageHeight: 100,
          html: `Audio Explorer is a data visualization tool 
          that helps researchers analyze location specific audio recordings 
          over time and verify their authenticity.
          <br><br>
          This web app is part of our submission for the 
          <a href="http://www.vacommunity.org/VAST+Challenge+2018+MC1" target="_blank">2018 VAST Challenge. </a>
          <hr>
          <i>The Challenge:</i>
          Kasios Furniture stands accused of using a banned substance in their factory
          and dumping waste material in the northeast region of the nearby wildlife preserve. 
          Ornithologists say this has directly led to a decrease in the population of the local
          Rose-crested Blue Pipit. Kasios refrutes this claim and has provided 15 audio files that they say are of
          recently recorded Pipits from the Preserve and therefore 
          `,
          confirmButtonText: 'First-time user?',
          showCancelButton: true,
          cancelButtonText: 'Close',
          footer: `Special thanks to Dr. Stolper and the 
          <a href="https://www.southwestern.edu/scope/" target="_blank"><p> SCOPE program </p></a> at Southwestern University`,
        })
        .then((result) => {
          if (result.value) {
            this.$swal({
              title: 'Tutorial',
              text: 'How to use the different components of Audio Explorer',
              showConfirmButton: false,
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  #header {
    margin: 0 auto;
    padding: 10px 0 0 0;
    background-color: whitesmoke;
    z-index: 9000;
  }
  #logoImg {
    position: relative;
    height:45px;
    margin-right: 7px;
    bottom: 5px;
    padding: 5px;
  }
  #toggle {
    float: right;
    margin-right: 30px;
  }
  .faded {
    opacity: 0.6;
  }
  a {
    text-decoration: none !important;
    color: #2d3e4f;
  }
  #aboutImg {
    cursor: pointer;
    height: 25px;
    margin: 5px 5px 0 0;
  }
</style>