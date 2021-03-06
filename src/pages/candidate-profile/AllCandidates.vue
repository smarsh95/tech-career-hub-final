<template>
  <div class="candidateList">
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>{{ snackbarMessageToDisplay }}</span>
      <v-btn text color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-container class="my-5">

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
        v-for="candidateUser in filteredCandidateUsers "
        :key="candidateUser.firstName"
        class="my-4 mx-2"
        color="#2F4858"
      >
        <v-row row wrap :class="'py-3 px-6'">
          <v-col cols="12" md="4" lg="4">
            <div class="caption grey--text font-weight-bold text-uppercase">Name:</div>
            <div class="white--text">{{ candidateUser.firstName + " " + candidateUser.lastName }}</div>
          </v-col>
          <v-col xs="6">
            <div class="caption grey--text font-weight-bold text-uppercase">Top Skills:</div>
            <div class="white--text">{{ candidateUser.topSkills }}</div>
          </v-col>
          <v-col xs="6"> 
            <div class="caption grey--text font-weight-bold text-uppercase">Careers of Interest:</div>
            <div class="white--text">{{ candidateUser.careerPaths.toString().replace(/,/g, ", ") }}</div>
          </v-col>
          <v-col>
            <div>
              <!--v-btn color="blue" dark :class="`${job.status} caption my-2`">{{job.status}}</v-btn-->
              <CandidateInfoPopup :candidateUser="candidateUser" />
            </div>
          </v-col>
          <v-col>
            <div class="ml-4 my-2" >
              <v-btn fab dark small color="pink" :class="{ 'mb-4': $vuetify.breakpoint.xsOnly, 'mr-4 mt-4': $vuetify.breakpoint.xs, 'mr-4': $vuetify.breakpoint.smAndUp,}">
                <v-icon @click="addTofavouriteCandidates(candidateUser.id)" dark>mdi-star</v-icon>
              </v-btn>
               <v-btn fab dark small color="blue">
                <v-icon dark @click="displayEmail(candidateUser.user_id)">mdi-message</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>
      <v-dialog v-model="emailPopup" width="70%">
          <v-card>
            <v-card-title class="title">Contact this Candidate</v-card-title>
            <v-card-text>To get in touch with this candidate please contact the candidate via email: {{ candidateEmail }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="blue" @click="emailPopup = false">Ok</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-container>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from 'firebase'
import CandidateInfoPopup from "@/pages/candidate-profile/CandidateInfoPopup.vue";

export default {
  components: {
    CandidateInfoPopup
  },
  data() {
    return {
      candidateUsers: [], 
      candidateUser: [],
      employerUser: null,
      search: "", 
      favouriteCandidates: [],
      snackbar: false,
      snackbarMessageToDisplay: '',
      candidateEmail: '',
      emailPopup: false,
    };
  },
  methods: {
    displayEmail(user_id){
      let getEmail = firebase.functions().httpsCallable("GetUserEmail");
      getEmail({ uid: user_id }).then(result => {
        if(result.data.email) {
          this.candidateEmail = result.data.email;
          this.emailPopup = true;
        }
      })
    },
    sortBy(prop) {
      console.log(this.candidateUsers)
      this.candidateUsers.sort((a, b) => (a[prop].toUpperCase() < b[prop].toUpperCase() ? -1 : 1));
    },
    addTofavouriteCandidates(id) {
      var candidateUserToAdd;
      this.candidateUsers.forEach(candidateUser => {
        if (candidateUser.id == id) {
          candidateUserToAdd = candidateUser;
          console.log('Candidate User found');
        }
      });
      if (!this.favouriteCandidates.includes(candidateUserToAdd)) {
        this.favouriteCandidates.push(candidateUserToAdd);
        let ref = db.collection("employerUsers").doc(this.employerUser.id);
        ref.update({ favouriteCandidates: this.favouriteCandidates });
        this.snackbarMessageToDisplay = 'All done! ' + candidateUserToAdd.firstName + ' has been added to your candidate Favourites!';
      }else{
        this.snackbarMessageToDisplay =  candidateUserToAdd.firstName + ' is already in your favourites list.';
      }
      this.snackbar = "true";
    }
  },
  created() {
    db.collection("candidateUsers").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.candidateUsers.push({
            ...change.doc.data(),
            id: change.doc.id
          })
        }
      })
      console.log(this.candidateUsers)
    })
      let refEmployer = db.collection("employerUsers");
    // get current user
    refEmployer
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          (this.employerUser = doc.data()), (this.employerUser.id = doc.id);
          if (!this.employerUser.favouriteCandidates) {
            console.log("There are no favourite Candidates listed yet");
            this.favouriteCandidates = [];
          } else {
            this.favouriteCandidates = this.employerUser.favouriteCandidates;
          }
        });
      });
  }, 
  computed: {
    filteredCandidateUsers: function(){
      return this.candidateUsers.filter((candidateUser) => {
        if(candidateUser.topSkills) return candidateUser.topSkills.toUpperCase().match(this.search.toUpperCase());
        return;
      })
    }
  }
};
</script>

<style>
.v-main__wrap {
  background-color: #78909c;
}
</style>