<template>
  <div class="employerList">
    <v-container class="my-5">
      <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
        <span>{{ snackbarMessageToDisplay }}</span>
        <v-btn text color="white" @click="snackbar = false">Close</v-btn>
      </v-snackbar>
      <v-col cols="12" sm="6" md="3" class="pt-0 pb-0">
        <v-text-field label="Search By Location" outlined v-model="search" dense></v-text-field>
      </v-col>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn small text color="light-grey" @click="sortBy('companyName')" v-on="on">
            <v-icon left small>mdi-folder</v-icon>
            <span class="caption text-lowercase">By Company Name</span>
          </v-btn>
        </template>
        <span>Sort Companies By Name</span>
      </v-tooltip>

       <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn small text color="light-grey" @click="sortBy('companyLocation')" v-on="on">
            <v-icon left small>mdi-account</v-icon>
            <span class="caption text-lowercase">By Location</span>
          </v-btn>
        </template>
        <span>Sort Employers By Location</span>
      </v-tooltip>

      <v-card
        v-for="employerUser in filteredEmployerUsers"
        :key="employerUser.companyName"
        class="my-4 mx-2"
        color="#2F4858"
      >
        <v-row row wrap :class="'py-3 px-6'">
          <v-col cols="12" md="6" lg="6">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Company Name:</div>
            <div class="white--text">{{ employerUser.companyName }}</div>
          </v-col>
          <v-col xs="2">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Career Paths Offered:</div>
            <div
              class="white--text"
            >{{ employerUser.companyCareerPathsOffered.toString().replace(/,/g, ", ") }}</div>
          </v-col>
           <v-col xs="2">
            <div
              class="caption grey--text text--lighten-1 font-weight-bold text-uppercase"
            >Location:</div>
            <div
              class="white--text"
            >{{ employerUser.companyLocation }}</div>
          </v-col>
          <v-col xs="2">
            <div>
              <EmployerInfoPopup :employerUser="employerUser" />
            </div>
          </v-col>
          <v-col xs="2">
            <div>
              <v-btn class="mx-2 my-1" fab dark small color="pink">
                <v-icon @click="addTofavouriteEmployers(employerUser.companyName)" dark>mdi-star</v-icon>
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
      employerUser: null,
      search: "",
      snackbar: false,
      snackbarMessageToDisplay: '',
      favouriteEmployers: [],
      candidateUser: null
    };
  },
  methods: {
    sortBy(prop) {
      this.employerUsers.sort((a, b) => (a[prop].toUpperCase() < b[prop].toUpperCase() ? -1 : 1));
    },
    addTofavouriteEmployers(companyName) {
      var employerUserToAdd;
      this.employerUsers.forEach(employerUser => {
        if (employerUser.companyName == companyName) {
          employerUserToAdd = employerUser;
        }
      });
      if (!this.favouriteEmployers.includes(employerUserToAdd)) {
        this.favouriteEmployers.push(employerUserToAdd);
        let ref = db.collection("candidateUsers").doc(this.candidateUser.id);
        ref.update({ favouriteEmployers: this.favouriteEmployers });
        this.snackbarMessageToDisplay = 'All done! ' + employerUserToAdd.companyName + ' has been added to your employer Favourites!';
      }else{
        this.snackbarMessageToDisplay =  employerUserToAdd.companyName + ' is already in your favourites list.';
      }
      this.snackbar = "true";
    }
  },
  created() {
    db.collection("employerUsers").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.employerUsers.push({
            ...change.doc.data(),
            id: change.doc.id
          });
        }
      });
    });

    let refCandidate = db.collection("candidateUsers");
    // get current user
    refCandidate
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          (this.candidateUser = doc.data()), (this.candidateUser.id = doc.id);
          if (!this.candidateUser.favouriteEmployers) {
            console.log("There are no favouriteEmployers listed yet");
            this.favouriteEmployers = [];
          } else {
            this.favouriteEmployers = this.candidateUser.favouriteEmployers;
          }
        });
      });
  },

  computed: {
    filteredEmployerUsers: function() {
      return this.employerUsers.filter(employerUser => {
        if(employerUser.companyLocation) return employerUser.companyLocation.toUpperCase().match(this.search.toUpperCase());
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
</style>