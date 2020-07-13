<template>
  <div class="employerList">
    <v-container class="my-5">

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
        v-for="employerUser in filteredEmployerUsers"
        :key="employerUser.companyName"
        class="my-4 mx-2"
        color="#2F4858"
      >
        <v-row row wrap :class="'py-3 px-6'">
          <v-col cols="12" md="6" lg="6">
            <div class="caption grey--text text--lighten-1 font-weight-bold text-uppercase">Company Name:</div>
            <div class="white--text">{{ employerUser.companyName }}</div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text text--lighten-1 font-weight-bold text-uppercase">Career Paths Offered:</div>
            <div
              class="white--text"
            >{{ employerUser.companyCareerPathsOffered.toString().replace(/,/g, ", ") }}</div>
          </v-col>
          <v-col xs="2">
            <div>
              <!--v-btn color="blue" dark :class="`${job.status} caption my-2`">{{job.status}}</v-btn-->
              <EmployerInfoPopup :employerUser="employerUser" />
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
import EmployerInfoPopup from "@/pages/employer-profile/EmployerInfoPopup.vue";

export default {
  components: {
    EmployerInfoPopup
  },
  data() {
    return {
      employerUsers: [], 
      search: ""
    };
  },
  methods: {
    sortBy(prop) {
      this.employerUsers.sort((a, b) =>
        a[prop].toUpperCase() < b[prop].toUpperCase() ? -1 : 1
      )
    }, 
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
  }, 
  computed: {
    filteredEmployerUsers: function(){
      return this.employerUsers.filter((employerUser) => {
        return employerUser.companyName.match(this.search)
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