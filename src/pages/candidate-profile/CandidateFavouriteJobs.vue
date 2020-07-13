<template>
  <div class="jobDashboard">
    <v-container class="my-5">
      <h1 class="display-1 mb-7 ml-3 text-start">My Favourite Jobs</h1>
      <v-col cols="12" sm="6" md="3" class="pt-0 pb-0">
        <v-text-field label="Search By Job Title" outlined v-model="search" dense></v-text-field>
      </v-col>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn small text color="light-grey" @click="sortBy('favourite.jobTitle')" v-on="on">
            <v-icon left small>mdi-folder</v-icon>
            <span class="caption text-lowercase">By Job Title</span>
          </v-btn>
        </template>
        <span>Sort Jobs By Title</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn small text color="light-grey" @click="sortBy('companyName')" v-on="on">
            <v-icon left small>mdi-account</v-icon>
            <span class="caption text-lowercase">By Company Name</span>
          </v-btn>
        </template>
        <span>Sort Jobs By Company Name</span>
      </v-tooltip>

      <v-card
        v-for="favourite in favourites"
        :key="favourite.jobTitle"
        class="my-4 mx-2"
        color="#2F4858"
      >
        <v-row row wrap :class="`py-3 px-6 job ${favourite.status}`">
          <v-col cols="12" md="6" lg="6">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Job Title</div>
            <div class="white--text">{{ favourite.jobTitle }}</div>
          </v-col>
          <v-col xs="2">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Company Name</div>
            <div class="white--text">{{ favourite.companyName }}</div>
          </v-col>
          <v-col xs="2">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Closing Date</div>
            <div class="white--text">{{ favourite.due }}</div>
          </v-col>
          <v-col xs="2">
            <div>
              <!--v-btn color="blue" dark :class="`${job.status} caption my-2`">{{job.status}}</v-btn-->
              <JobInfoPopup :job="favourite" />
            </div>
          </v-col>
          <v-col xs="2">
            <div>
              <v-btn
                @click="deleteFavouriteItem(favourite.jobTitle)"
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
import JobInfoPopup from "@/pages/jobs/JobInfoPopup.vue";

export default {
  components: {
    JobInfoPopup
  },
  data() {
    return {
      search: "",
      candidateUser: null,
      favourites: []
    };
  },
  methods: {
    sortBy(prop) {
      this.favourites.sort((a, b) =>
        a[prop].toUpperCase() < b[prop].toUpperCase() ? -1 : 1
      );
    },
    deleteFavouriteItem(itemTitle) {
      var index = 0;
      for(index; index < this.favourites.length; index++){
          if (this.favourites[index].jobTitle == itemTitle) break;
      }

      this.favourites.splice(index, 1);
      let ref = db
        .collection("candidateUsers")
        .doc(this.candidateUser.username);
      ref.update({ favourites: this.favourites });
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
          if (!this.candidateUser.favourites) {
            console.log("There are no favourites listed yet");
            this.favourites = [];
          } else {
            this.favourites = this.candidateUser.favourites;
          }
          ref.doc(this.candidateUser.id).onSnapshot(res => {
            this.candidateUser = res.data();
            this.favourites = this.candidateUser.favourites;
          });
        });
      });
  },
  computed: {
    filteredJobs: function() {
      return this.favourites.filter(job => {
        return job.jobTitle.match(this.search);
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


