<template>
  <li class="list-group-item" 
      style="cursor: pointer"
      :class="{
        selected: selected
        }"
      @click="selectItem">
      {{ value }}
  </li>
</template>

<script>
//TODO: .active and .disabled
//TODO: percentages should be badges (badge badge-primary badge-pill)
export default {
  name: 'ListItem',
  props: {
    value: String,
    selectedItemInList: null,
    isA: String
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
      this.$emit('itemWasSelected', this);
    }
  },
  watch: {
    selectedItemInList: function() {
      if (this.selectedItemInList === this.value){
        this.selected = true;
      }
      else{
        this.selected = false;
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .list-group-item {
    padding: 3px 1px 3px 0px;
    text-align: left;
  }
  .selected{
    background-color: whitesmoke;
    transition: 0.5s;
  }
</style>
