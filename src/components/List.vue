<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item" id="listTitle">{{ contains }}</li>
    <app-list-item v-for="(item, i) in items" 
          :key="i" 
          :value="item"
          :selectedItemInList="selectedItem"
          :isA="contains"
    ></app-list-item>
  </ul>
</template>

<script>
  import ListItem from './ListItem.vue'
  import { kasiosEventBus } from '../main';
  import { speciesEventBus } from '../main';

  export default {
    name: 'List',
    created() {
      // Setup event listeners for selecting ListItems within kasios and species lists
      if(this.contains === "Kasios") {
        kasiosEventBus.$on('itemWasSelected', (item) => {
          this.selectedItem = item.value;
        });
        // Send deselect value to all children ListItems
        kasiosEventBus.$on('itemWasDeselected', () => {
          this.selectedItem = '';
        });
        // Deselect item from Kasios list when view is changed
        speciesEventBus.$on('viewChanged'), () => {
            this.selectedItem = '';
            kasiosEventBus.$emit('itemWasDeselected');
        }
      } else if(this.contains === "Species") {
        speciesEventBus.$on('itemWasSelected', (item) => {
          this.selectedItem = item.value;
        });
        speciesEventBus.$on('itemWasDeselected', () => {
          this.selectedItem = '';
        });
      }
    },
    props: {
      contains: String,
      items: Array,
    },
    data: function() {
      return {
        selectedItem: ''
      }
    },
    components: {
      'app-list-item' : ListItem
    }
}
</script>

<style scoped>
  #listTitle {
    font-size: 20px;
    text-align: left;
  }
  li {
    white-space: nowrap;
  }
</style>
