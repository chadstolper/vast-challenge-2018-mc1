<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item" id="listTitle">{{ contains }}</li>
    <app-list-item v-for="(item, i) in items" 
          :key="i" 
          :value="item"
          @itemWasSelected="selectedItem = $event"
    ></app-list-item>
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
    data: function() {
      return {
        selectedItem: String
      }
    },
    methods: {
    },
    watch: {
      selectedItem: function() {
        this.$emit('updateSelection', this.selectedItem);
      }
    },
    components: {
      'app-list-item' : ListItem
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #listTitle {
    font-size: 20px;
    text-align: left;
  }
</style>
