<template>
  <!-- <nav class="navbar fixed-top navbar-light bg-light">
    <a class="navbar-brand" href="#">
      <h3>Audio Explorer</h3>
    </a>
    <span class="navbar-text">
      Created by Colin Scruggs and Cameron Henkel
    </span>
  </nav> -->
  <div class="container-fluid" id="header">
    <div class="col-lg-12">
      <h3 style="text-align:left; display: inline-block">Audio Explorer</h3>
      <h6 style="float:right; padding: 8px 0 0 0; display: inline-block">Created by Colin Scruggs and Cameron Henkel</h6>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Header'
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #header {
    margin: 0 auto;
    padding: 10px 0 0 0;
    background-color: whitesmoke;
    /* -webkit-box-shadow: 0px 6px 31px -1px rgba(204,204,204,0.33);
    -moz-box-shadow: 0px 6px 31px -1px rgba(204,204,204,0.33);
    box-shadow: 0px 6px 31px -1px rgba(204,204,204,0.33); */
    z-index: 9000;
  }
</style>