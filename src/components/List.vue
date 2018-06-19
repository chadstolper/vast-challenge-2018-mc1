<template>
  <ul>
    <app-list-item v-for="(item, i) in items" 
          :key="i" 
          :item="item"></app-list-item>
  </ul>
</template>

<script>
  import ListItem from './ListItem.vue'

  export default {
    name: 'List',
    props: {
      contains: String,
      items: Array,
    },
    components: {
      'app-list-item' : ListItem
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
    background-color: salmon;
    height: 100vh;
}
</style>
