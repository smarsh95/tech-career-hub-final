<template>
  <div>
    <v-row align="center" justify="center">
      <v-col lg="8" md="6" sm="10" class="ma-3">
        <v-slide-group v-model="model" class="py-4 px-0 slideGroup">
          <v-slide-item v-for="careerPath in careerPaths" :key="careerPath.id">
            <v-card :color="'#2F4858'" class="ma-6" height="520" width="420">
              <v-row align="center" justify="center">
                <v-col>
                  <h1
                    class="white--text mt-4 mx-4 text-center cardTitle font-weight-thin"
                  >{{careerPath.id.toUpperCase()}}</h1>
                </v-col>
                <v-card-text>
                  <h2 class="white--text text-center cardText">{{careerPath.shortDescription}}</h2>
                </v-card-text>
                <div>
                  <!--v-btn color="blue" dark :class="`${job.status} caption my-2`">{{job.status}}</v-btn-->
                  <CareerPathsPopup :careerPath="careerPath"/>
                </div>
              </v-row>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import db from "@/firebase/init";
import CareerPathsPopup from "@/pages/techCareers/CareerPathsPopup.vue";
export default {
   components: {
    CareerPathsPopup
  },
  data() {
    return {
      careerPaths: [],
      model: null,
      dense: false
    };
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
.cardText {
  font-family: sofia-pro-soft, sans-serif;
  font-weight: 400;
  font-style: normal;
  line-height: 1.5;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: none;
  font-size: 1.3em;
}

.cardTitle {
  font-family: gothic-open-shaded, sans-serif;
  font-weight: 400;
  font-style: normal;
}

h1 {
  margin-bottom: 0 !important;
}
</style>