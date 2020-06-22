
<template>
  <div class="cards">
    <Navbar />
    <v-container class="my-2" fluid>
      <v-row>
        <v-col>
          <v-row :align="alignment" :justify="justify">
            <v-card class="ma-3 mx-4" max-width="437px" v-for="card in cards" :key="card.title">
              <v-img class="white--text align-start" height="200px" :src="card.src"></v-img>
              <v-card-actions>
                <v-btn text color="grey darken-2" v-text="card.buttonText" :to="card.route"></v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
export default {
  data: () => ({
    cards: [
      {
        buttonText: "Get Hired",
        src: "/StudentTwo.jpeg", 
        route: "/SignupCandidate"
      },
      {
        buttonText: "Start Hiring",
        src: "/StartUp.jpeg", 
        route: "/SignupEmployer"
      }
    ],
    alignmentsAvailable: ["start", "center", "end", "baseline", "stretch"],
    alignment: "center",
    dense: false,
    justifyAvailable: [
      "start",
      "center",
      "end",
      "space-around",
      "space-between"
    ],
    justify: "center"
  }), 
  components: {
    Navbar
  }
};
</script>

<style>
/*.card-title{
  text-shadow: 0px 0px 5px #000000;
}*/

.v-main__wrap {
  background-color: #2b3a41 !important;
}

</style>







 
 










  

