<template>
  <v-app>
    <Navbar />
    <v-main class="mx-0">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  name: "App",

  components: {
    Navbar
  },

  data: () => ({
    //
  })
};
</script>
<style>
.v-main {
  padding-top: 56px !important;

}
 .v-application {
    font-family: sofia-pro-soft, sans-serif;
  }

  .v-application .caption {
    font-family: sofia-pro-soft, sans-serif !important;
  }

  .v-application .display-1 {
    font-family: sofia-pro-soft, sans-serif !important;
  }

  .v-application .subtitle-1 {
     font-family: sofia-pro-soft, sans-serif !important;
  }

  .v-list-item__title {
    font-family: sofia-pro-soft, sans-serif !important;
    overflow: none;
  }


/*.v-application .white--text{
  font-family: roboto, sans-serif !important;
}*/
  
  
</style>

