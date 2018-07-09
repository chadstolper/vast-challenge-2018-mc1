<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item" id="listTitle">{{ contains }}
      <span v-if="currentView === 'Year View'" id="check">
      <input type="checkbox" name="include" value="true" checked 
        @click="toggleEmpty">
        Include empty</span>
    </li>
    <!-- <li v-if="currentView === 'Year View'" 
        class="list-group-item"
        id="check">
        <input type="checkbox" name="include" value="true">
        Include empty years</li> -->
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
            // this.selectedItem = '';
            // kasiosEventBus.$emit('itemWasDeselected');
        }
      } else if(this.contains === "Species") {
        speciesEventBus.$on('itemWasSelected', (item) => {
          this.selectedItem = item.value;
        });
        speciesEventBus.$on('itemWasDeselected', () => {
          this.selectedItem = '';
        });
        if(this.selected != '') {
          this.selectedItem = this.selected;
        }
      }
    },
    props: {
      contains: String,
      items: Array,
      currentView: String,
      selected: String
    },
    data: function() {
      return {
        selectedItem: '',
        toggle: true
      }
    },
    methods: {
      toggleEmpty() {
        this.toggle = false;
        speciesEventBus.$emit('toggleEmpty', this.toggle);
      }
    },
    watch: {
      selected() {
        this.selectedItem = this.selected;
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
    padding-bottom: 0px;
    /*border: none;*/
  }
  li {
    white-space: nowrap;
  }
  #check {
    /*border: none;*/
    font-size: 12px;
    padding: 4px;
  }

  @media (max-width: 1285px) {
    #listTitle {
      font-size: 16px;
    }
    #check {
      font-size: 10px;
    }
  }

  @media (max-width: 1152px) {
    #listTitle {
      font-size: 14px;
    }
    #check {
      font-size: 8px;
    }
  }
</style>
