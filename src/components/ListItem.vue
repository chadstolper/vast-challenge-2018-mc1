<template>
  <li class="list-group-item" 
      style="cursor: pointer"
      @click="selectItem"
      @updateSelection="isSelected($event)">
      {{ value }}
  </li>
</template>



<script>
//TODO: .active and .disabled
//TODO: percentages should be badges (badge badge-primary badge-pill)
export default {
  name: 'ListItem',
  props: {
    value: String
  },
  data: function() {
    return {
      selected: false,
      isPredition: false,
      predictionValue: 0
    }
  },
  methods: {
    selectItem() {
      //TODO: can handle applying class for styling?
      this.$emit('itemWasSelected', this.value);
    },
    isSelected(selectedValue) {
      console.log("isSelected" + selectedValue)
      if(this.value == selectedValue) {
        this.selected = true;
      } else {
        this.selected = false;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .list-group-item {
    padding: 3px 1px 3px 0px;
    text-align: left;
  }
</style>
