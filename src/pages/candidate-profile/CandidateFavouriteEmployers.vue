<template>
  <div class="jobDashboard">
    <v-container class="my-5">
      <h1 class="display-1 mb-7 ml-3 text-start">My Favourite Employers</h1>

      <v-col cols="12" sm="6" md="3" class="pt-0 pb-0">
        <v-text-field label="Search By Company" outlined v-model="search" dense></v-text-field>
      </v-col>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn small text color="light-grey" @click="sortBy('employerName')" v-on="on">
            <v-icon left small>mdi-folder</v-icon>
            <span class="caption text-lowercase">By Employer Name</span>
          </v-btn>
        </template>
        <span>Sort Employers By Name</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn small text color="light-grey" @click="sortBy('careerPathsOffered')" v-on="on">
            <v-icon left small>mdi-account</v-icon>
            <span class="caption text-lowercase">By Career Paths Offered</span>
          </v-btn>
        </template>
        <span>Sort Employers By Career Paths Offered</span>
      </v-tooltip>

      <v-card
        v-for="favouriteEmployer in favouriteEmployers"
        :key="favouriteEmployer.companyName"
        class="my-4 mx-2"
        color="#2F4858"
      >
        <v-row row wrap :class="`py-3 px-6 job ${favouriteEmployer.status}`">
          <v-col cols="12" md="6" lg="6">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Company Name:</div>
            <div class="white--text">{{ favouriteEmployer.companyName }}</div>
          </v-col>
          <v-col xs="2">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Career Paths Offered:</div>
            <div
              class="white--text"
            >{{ favouriteEmployer.companyCareerPathsOffered.toString().replace(/,/g, ", ") }}</div>
          </v-col>
          <v-col xs="2">
            <div>
              <!--v-btn color="blue" dark :class="`${job.status} caption my-2`">{{job.status}}</v-btn-->
              <EmployerInfoPopup :employerUser="favouriteEmployer" />
            </div>
          </v-col>
          <v-col xs="2">
            <div>
              <v-btn
                @click="deleteFavouriteItem(favouriteEmployer.companyName)"
                class="mx-2 my-1"
                fab
                dark
                small
                color="grey"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import EmployerInfoPopup from "@/pages/employer-profile/EmployerInfoPopup.vue";

export default {
  components: {
    EmployerInfoPopup
  },
  data() {
    return {
      employerUsers: [],
      search: "",
      favouriteEmployers: [],
      snackbar: false
    };
  },
  methods: {
    sortBy(prop) {
      this.favouriteEmployers.sort((a, b) =>
        a[prop].toUpperCase() < b[prop].toUpperCase() ? -1 : 1
      );
    },
    deleteFavouriteItem(itemTitle) {
      var index = 0;
      for (index; index < this.favouriteEmployers.length; index++) {
        if (this.favouriteEmployers[index].companyName == itemTitle) break;
      }

      this.favouriteEmployers.splice(index, 1);
      let ref = db
        .collection("candidateUsers")
        .doc(this.candidateUser.username);
      ref.update({ favouriteEmployers: this.favouriteEmployers });
      this.snackbar = "true";
    }
  },
  created() {
    let ref = db.collection("candidateUsers");
    // get current user
    ref
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          (this.candidateUser = doc.data()), (this.candidateUser.id = doc.id);
          if (!this.candidateUser.favouriteEmployers) {
            console.log("There are no favourites listed yet");
            this.favouriteEmployers = [];
          } else {
            this.favouriteEmployers = this.candidateUser.favouriteEmployers;
          }
          ref.doc(this.candidateUser.id).onSnapshot(res => {
            this.candidateUser = res.data();
            this.favouriteEmployers = this.candidateUser.favouriteEmployers;
          });
        });
      });
  },
  computed: {
    filteredJobs: function() {
      return this.favouriteEmployers.filter(job => {
        return job.companyName.match(this.search);
      });
    }
  }
};
</script>

<style>
.v-main__wrap {
  background-color: #78909c;
}
.v-application .display-1 {
  font-family: brandon-grotesque, sans-serif;
  font-weight: 300;
  font-style: normal;
  color: #4b696f !important;
}
</style>


