<template>
  <div class="container-fluid" id="header">
    <div class="col-lg-12">
      <img src="/data/logo.png"/>
      <h3 style="text-align:left; display: inline-block">Audio Explorer</h3>
      <h6 style="float:right; padding: 8px 0 0 0; display: inline-block">Created by Colin Scruggs and Cameron Henkel</h6>
            <div class="btn-group" role="group" id="toggle" aria-label="Controls">
          <button type="button" class="btn btn-light btn-sm"
                  @click="toggleView"
                  :class="{active : currentView === 'Main View'}">Main View
          </button>
          <button type="button" class="btn btn-light btn-sm"
                  @click="toggleView"
                  :class="{active : currentView === 'Month View'}">Month View
          </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { speciesEventBus } from '../main';

  export default {
    name: 'Header',
    props: {
      currentView: String
    },
    methods: {
      toggleView() {
        if(this.currentView==="Main View") {
          speciesEventBus.$emit('viewChanged', "Month View");
        }
        else {
          speciesEventBus.$emit('viewChanged', "Main View");
        }
      }
    }
  }
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #header {
    margin: 0 auto;
    padding: 10px 0 0 0;
    background-color: whitesmoke;
    z-index: 9000;
  }
  img {
    position: relative;
    height:45px;
    margin-right: 7px;
    bottom: 5px;
    padding: 5px;
  }
  #toggle {
    float: right;
    display: inline-block;
    margin-right: 30px;
  }
  .faded {
    opacity: 0.6;
  }
</style>