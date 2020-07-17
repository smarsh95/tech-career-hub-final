<template>
  <div class="jobDashboard">
     <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>All done! The job has been deleted from your favouriteJobs!</span>
      <v-btn text color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-container class="my-5">
      <h1 class="display-1 mb-9 text-center">My Favourite Jobs</h1>
      <v-col cols="12" sm="6" md="3" class="pt-0 pb-0">
        <v-text-field label="Search By Job Title" outlined v-model="search" dense></v-text-field>
      </v-col>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn small text color="light-grey" @click="sortBy('favouriteJob.jobTitle')" v-on="on">
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
        v-for="favouriteJob in favouriteJobs"
        :key="favouriteJob.jobTitle"
        class="my-4 mx-2"
        color="#2F4858"
      >
        <v-row row wrap :class="`py-3 px-6 job ${favouriteJob.status}`">
          <v-col cols="12" md="6" lg="6">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Job Title</div>
            <div class="white--text">{{ favouriteJob.jobTitle }}</div>
          </v-col>
          <v-col xs="2">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Company Name</div>
            <div class="white--text">{{ favouriteJob.companyName }}</div>
          </v-col>
          <v-col xs="2">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Closing Date</div>
            <div class="white--text">{{ favouriteJob.due }}</div>
          </v-col>
          <v-col xs="2">
            <div>
              <!--v-btn color="blue" dark :class="`${job.status} caption my-2`">{{job.status}}</v-btn-->
              <JobInfoPopup :job="favouriteJob" />
            </div>
          </v-col>
          <v-col xs="2">
            <div>
              <v-btn
                @click="deleteFavouriteItem(favouriteJob.jobTitle)"
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
      favouriteJobs: [], 
      snackbar: false
    };
  },
  methods: {
    sortBy(prop) {
      this.favouriteJobs.sort((a, b) =>
        a[prop].toUpperCase() < b[prop].toUpperCase() ? -1 : 1
      );
    },
    deleteFavouriteItem(itemTitle) {

      // Iterate over favourite jobs array and find job with matching title -> save index of matching job
      var index = 0;
      for(index; index < this.favouriteJobs.length; index++){
          if (this.favouriteJobs[index].jobTitle == itemTitle) break;
      }

      this.favouriteJobs.splice(index, 1); //delete Job from favourites list
      console.log(this.favouriteJobs);

      let ref = db
        .collection("candidateUsers")
        .doc(this.candidateUser.id);
      ref.update({ favouriteJobs: this.favouriteJobs });
      this.snackbar = "true"
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
          if (!this.candidateUser.favouriteJobs) {
            console.log("There are no favouriteJobs listed yet");
            this.favouriteJobs = [];
          } else {
            this.favouriteJobs = this.candidateUser.favouriteJobs;
          }
          console.log(this.candidateUser.id);
          ref.doc(this.candidateUser.id).onSnapshot(res => {
            this.candidateUser = res.data();
            this.candidateUser.id = res.id;
            this.favouriteJobs = this.candidateUser.favouriteJobs;
          });
        });
      });
  },
  computed: {
    filteredJobs: function() {
      return this.favouriteJobs.filter(job => {
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


