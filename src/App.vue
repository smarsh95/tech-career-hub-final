<template>
  <v-app >
    <Navbar/>
    <v-main class="mx-0">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'


export default {
  name: 'App',

  components: {
    Navbar
  },

  data: () => ({
    //
  }),
};
</script>
<style>
  .v-main{
    padding-top: 56px !important;
  }
</style>
