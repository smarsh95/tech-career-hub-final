
<template>
  <div class="cards">
    <v-container class="my-2" fluid>
      <v-row>
        <v-col>
          <v-row :align="alignment" :justify="justify">
            <v-card class="ma-3 mx-4" max-width="437px" v-for="card in cards" :key="card.title">
              <v-img
                class="white--text align-start"
                height="200px"
                :src="card.src"
                gradient="to top, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              >
              <v-card-title class="font-weight-light card-title" v-text="card.title"></v-card-title>
              </v-img>
              <v-card-actions>
                <v-btn text color="grey darken-2" v-text="card.buttonText"></v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    cards: [
        {
        title: "Find Your Dream Tech Job",
        buttonText: "Get Hired",
        src: "/StudentTwo.jpeg"
      },
      {
        title: "Meet Our Tech Graduates",
        buttonText: "Start Hiring",
        src: "/StartUp.jpeg"
      },
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
  })
};
</script>

<style>
/*.card-title{
  text-shadow: 0px 0px 5px #000000;
}*/

</style>







 
 










  

