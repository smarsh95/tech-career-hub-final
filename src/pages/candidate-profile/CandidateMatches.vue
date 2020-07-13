<template>
  <v-carousel :show-arrows="false">
    <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.backgroundColour"></v-carousel-item>
  </v-carousel>
</template>

<script>
 export default {
    data () {
      return {
        items: [
          {
            backgroundColour: "red",
          },
          {
            backgroundColour: "pink",
          },
          {
            backgroundColour: "yellow",
          },
          {
            backgroundColour: "blue",
          },
        ],
      }
    },
  }
</script>

<style>
</style>