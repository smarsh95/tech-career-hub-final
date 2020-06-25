
<template>
  <div class="cards">
    <Navbar />
    <v-container class="mb-2" fluid>
      <v-row align="center" justify="center">
        <v-col lg="6" md="3" sm="6">
          <h1
            class="heading ma-3 mx-4 text-center font-weight-light"
            color="#2F4858"
          >Find Your Dream Career</h1>
          <p class="ma-3 mx-4 text-center text--darken-4 grey--text">
            Are you an IT student and not sure which career path to take? We'll help you to find the career and the company that best suits YOUR interests and preferences.
            <br />Our mission is to connect Tech Graduates with the best Tech Companies.
            <br />
          </p>
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

      <div>
        <v-row align="center" justify="center">
          <v-col lg="8" md="6" sm="10" class="ma-3">
            <v-slide-group v-model="model" class="py-4 px-0 slideGroup">
              <v-slide-item v-for="careerPath in careerPaths" :key="careerPath.id">
                <v-card :color="'#2F4858'" class="ma-4" height="75" width="220">
                  <v-row align="center" justify="center">
                    <v-col>
                      <h3
                        class="white--text mt-3 mx-2 text-center font-weight-light"
                      >{{careerPath.id}}</h3>
                    </v-col>
                  </v-row>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import db from "@/firebase/init";
import Navbar from "@/components/Navbar";
export default {
  data() {
    return {
      careerPaths: [],
      model: null,
      cards: [
        {
          buttonText: "Get Hired",
          src: "/StudentTwoImg.jpeg",
          route: "/SignupCandidate"
        },
        {
          buttonText: "Start Hiring",
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
  created() {
    //fetch data from firestore
    db.collection("careerPaths")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.data());
          let careerPath = doc.data();
          careerPath.id = doc.id;
          this.careerPaths.push(careerPath);
        });
      });
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
</style>







 
 










  

