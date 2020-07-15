
<template>
  <div class="cards">
    <Navbar />
    <v-container class="mb-2" fluid>
      <v-row align="center" justify="center">
        <v-col lg="6" md="5" sm="6">
          <h1
            class="ma-3 mx-4 text-center font-weight-light customFont heading-1"
          >Find Your Dream Career</h1>
          <h2 class="ma-3 mx-4 text-center text--darken-4 customFontLight">
           We connect Tech Graduates with Tech Companies. We help students to find the right career path and a company that matches with their interests and preferences.  
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="ma-3">
          <v-row :align="alignment" :justify="justify">
            <v-card
              class="mx-4 homeCards"
              max-width="437px"
              v-for="card in cards"
              :key="card.title"
            >
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


import Navbar from "@/components/Navbar";
export default {
  data() {
    return {
      cards: [
        {
          buttonText: "Find your dream job",
          src: "/StudentTwoImg.jpeg",
          route: "/SignupCandidate"
        },
        {
          buttonText: "Find the right tech employees",
          src: "/StartUpImg.jpeg",
          route: "/SignupEmployer"
        }
      ],
      alignment: "center",
      dense: false,
      justify: "center"
    };
  },
  components: {
    Navbar
  },
};
</script>

<style>
/*.card-title{
  text-shadow: 0px 0px 5px #000000;
}*/

h1{
  font-size: 2.4em;
}

.customFont {
  font-family: sofia-pro-soft, sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #4b696f;
}

.customFontLight {
  font-family: sofia-pro, sans-serif;
  font-weight: 300 !important;
  font-style: normal;
  color: #4b696f;
}

.v-main__wrap {
  background-color: #4b696f !important;

}

@media screen and (max-width: 600px) {
  .homeCards {
    max-width: 300px !important;
    margin-bottom: 20px !important;
  }
  .slideGroup {
    padding-top: 0;
    margin-top: 0;
  }
  .v-application .py-4 {
    padding-top: 0;
  }
}

@media only screen and (min-width: 768px) {
  .homeCards {
    margin-bottom: 20px !important;
  }
  .slideGroup {
    padding-top: 0;
    margin-top: 0;
  }
  .v-application .py-4 {
    padding-top: 0;
  }
}
</style>







 
 










  

