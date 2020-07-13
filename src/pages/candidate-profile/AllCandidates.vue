<template>
  <div class="candidateList">
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
          <v-col cols="12" md="6" lg="6">
            <div class="caption grey--text font-weight-bold text-uppercase">Name:</div>
            <div class="white--text">{{ candidateUser.firstName + " " + candidateUser.lastName }}</div>
          </v-col>
          <v-col xs="3">
            <div class="caption grey--text font-weight-bold text-uppercase">Top Skills:</div>
            <div class="white--text">{{ candidateUser.topSkills }}</div>
          </v-col>
          <v-col xs="3">
            <div class="caption grey--text font-weight-bold text-uppercase">Careers of Interest:</div>
            <div class="white--text">{{ candidateUser.careerPaths.toString().replace(/,/g, ", ") }}</div>
          </v-col>
          <v-col xs="2">
            <div>
              <!--v-btn color="blue" dark :class="`${job.status} caption my-2`">{{job.status}}</v-btn-->
              <CandidateInfoPopup :candidateUser="candidateUser" />
            </div>
          </v-col>
          <v-col xs="2">
            <div>
              <v-btn class="mx-2 my-1" fab dark small color="pink">
                <v-icon dark>mdi-star</v-icon>
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
import CandidateInfoPopup from "@/pages/candidate-profile/CandidateInfoPopup.vue";

export default {
  components: {
    CandidateInfoPopup
  },
  data() {
    return {
      candidateUsers: [], 
      search: ""
    };
  },
  methods: {
    sortBy(prop) {
      console.log(this.candidateUsers)
      this.candidateUsers.sort((a, b) => (a[prop].toUpperCase() < b[prop].toUpperCase() ? -1 : 1));
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
  }, 
  computed: {
    filteredCandidateUsers: function(){
      return this.candidateUsers.filter((candidateUser) => {
        if(candidateUser.topSkills) return candidateUser.topSkills.match(this.search);
        return;
      })
    }
  }
};
</script>

<style>
.project.ongoing {
  border-left: 4px solid orange;
}
.project.overdue {
  border-left: 4px solid tomato;
}
.v-chip.view {
  background: lightblue !important;
}
.v-chip.ongoing {
  background: #ffaa2c !important;
}
.v-chip.overdue {
  background: #fc5c65 !important;
}
.v-main__wrap {
  background-color: #78909c;
}
</style>