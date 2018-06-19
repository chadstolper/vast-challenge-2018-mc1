<template>
  <div class="col-lg-5" id="actual">
    <div id="map">HELLO</div>
  </div>
</template>

<script>
export default {
  name: 'Heatmap'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #map {
    margin: auto;
    width: 100%;
    background-color:plum;
  }
  #actual {
    background-color: pink;
    /* height: 100vh; */
  }
</style>
