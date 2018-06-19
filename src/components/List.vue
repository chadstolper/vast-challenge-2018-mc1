<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item" id="listTitle">{{ contains }}</li>
    <app-list-item v-for="(item, i) in items" 
          :key="i" 
          :value="item"
          :selectedItemInList="selectedItem"
          :isA="contains"
    ></app-list-item>
    <!-- @itemWasSelected="selectedItem = $event.value" -->
  </ul>
</template>

<script>
  import ListItem from './ListItem.vue'
  import { kasiosEventBus } from '../main';
  import { speciesEventBus } from '../main';

  export default {
    name: 'List',
    created() {
      if(this.contains === "Kasios") {
        kasiosEventBus.$on('itemWasSelected', (item) => {
          this.selectedItem = item.value;
        });
      } else if(this.contains === "Species") {
        speciesEventBus.$on('itemWasSelected', (item) => {
          this.selectedItem = item.value;
        });
      }
    },
    props: {
      contains: String,
      items: Array,
    },
    data: function() {
      return {
        selectedItem: null
      }
    },
    methods: {
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
