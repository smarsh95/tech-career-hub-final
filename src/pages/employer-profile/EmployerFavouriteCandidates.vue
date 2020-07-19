<template>
  <div class="jobDashboard">
    <v-container class="my-5">
      <h1 class="display-1 mb-7 text-center">My Favourite Candidates</h1>

      <v-col cols="12" sm="6" md="3" class="pt-0 pb-0">
        <v-text-field label="Search By Skills" outlined v-model="search" dense></v-text-field>
      </v-col>

       <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn small text color="light-grey" @click="sortBy('firstName')" v-on="on">
            <v-icon left small>mdi-folder</v-icon>
            <span class="caption text-lowercase">By Candidate Name</span>
          </v-btn>
        </template>
        <span>Sort Candidates By Name</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn small text color="light-grey" @click="sortBy('topSkills')" v-on="on">
            <v-icon left small>mdi-account</v-icon>
            <span class="caption text-lowercase">By Top Skills</span>
          </v-btn>
        </template>
        <span>Sort Candidates By Top Skills</span>
      </v-tooltip>

      <v-card
        v-for="favouriteCandidate in filteredCandidates"
        :key="favouriteCandidate.firstName"
        class="my-4 mx-2"
        color="#2F4858"
      >
        <v-row row wrap :class="`py-3 px-6 job ${favouriteCandidate.status}`">
          <v-col cols="12" md="6" lg="6">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Candidate Name:</div>
            <div class="white--text">{{ favouriteCandidate.firstName + " " + favouriteCandidate.lastName }}</div>
          </v-col>
          <v-col xs="2">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Top Skills:</div>
            <div
              class="white--text"
            >{{ favouriteCandidate.topSkills }}</div>
          </v-col>
          <v-col xs="2">
            <div>
              <!--v-btn color="blue" dark :class="`${job.status} caption my-2`">{{job.status}}</v-btn-->
              <CandidateInfoPopup :candidateUser="favouriteCandidate" />
            </div>
          </v-col>
          <v-col xs="2">
            <div>
              <v-btn
                @click="deleteFavouriteItem(favouriteCandidate.id)"
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
import CandidateInfoPopup from "@/pages/candidate-profile/CandidateInfoPopup.vue";

export default {
  components: {
    CandidateInfoPopup
  },
  data() {
    return {
      employerUser: null,
      candidateUsers: [],
      search: "",
      favouriteCandidates: [],
      snackbar: false
    };
  },
  methods: {
    sortBy(prop) {
      this.favouriteCandidates.sort((a, b) =>
        a[prop].toUpperCase() < b[prop].toUpperCase() ? -1 : 1
      );
    },
    deleteFavouriteItem(candidateId) {
      var index = 0;
      for (index; index < this.favouriteCandidates.length; index++) {
        if (this.favouriteCandidates[index].id == candidateId) break;
      }

      this.favouriteCandidates.splice(index, 1);
      let ref = db
        .collection("employerUsers")
        .doc(this.employerUser.id);
      ref.update({ favouriteCandidates: this.favouriteCandidates });
      this.snackbar = "true";
    }
  },
  created() {
    let ref = db.collection("employerUsers");
    // get current user
    ref
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          (this.employerUser = doc.data()), (this.employerUser.id = doc.id);
          if (!this.employerUser.favouriteCandidates) {
            console.log("There are no favourites listed yet");
            this.favouriteCandidates = [];
          } else {
            this.favouriteCandidates = this.employerUser.favouriteCandidates;
          }
          ref.doc(this.employerUser.id).onSnapshot(res => {
            this.employerUser = res.data();
            this.employerUser.id = res.id;
            this.favouriteCandidates = this.employerUser.favouriteCandidates;
          });
        });
      });
  },
  computed: {
    filteredCandidates: function() {
      return this.favouriteCandidates.filter(candidateUser => {
        if(candidateUser.topSkills) return candidateUser.topSkills.toUpperCase().match(this.search.toUpperCase());
        return;
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


