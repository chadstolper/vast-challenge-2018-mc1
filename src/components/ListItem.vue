<template>
  <li class="list-group-item" 
      :key="index"
      style="cursor: pointer">
      {{ value }}
  </li>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    value: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .page-header {
    background-color: whitesmoke;
} */
</style>
