<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="my-2"
          caption
          dark
          color="blue"
          v-bind="attrs"
          v-on="on"
          @click="loadEmployerData"
        >View</v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary" flat>
          <v-btn icon dark @click="dialog = false" right>
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Company Profile</v-toolbar-title>
        </v-toolbar>
        <v-card-title>
          <span
            class="headline mt-2 mb-4"
          >{{ employerUser.companyName }} for {{ employerUser.companyName.charAt(0).toUpperCase() + employerUser.companyName.slice(1) }}</span>
        </v-card-title>
        <v-card-text>
          <strong>Company Overview:</strong>
          {{ employerUser.companyOverview }}
        </v-card-text>
        <v-card-text>
          <strong>Company Values:</strong>
          {{ employerUser.companyValues }}
        </v-card-text>
        <v-card-text>
          <strong>Company Vision:</strong>
          {{ employerUser.companyVision }}
        </v-card-text>
        <v-card-text>
          <strong>Company Career Paths:</strong>
          {{ employerUser.companyCareerPathsOffered.toString().replace(/,/g, ", ") }}
        </v-card-text>
        <v-btn class="ml-5 mb-6" caption dark color="blue" @click="redirectToProfile()">View Profile</v-btn>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import db from "@/firebase/init";
export default {
  data() {
    return {
      dialog: false,
      jobs: []
    };
  },
  props: {
    employerUser: Object
  },
  methods: {
    redirectToProfile(){
      this.$router.push({
          path: "/EmployerProfile/" + this.employerUser.id
        })
    },
    loadEmployerData() {
      //console.log("employerID: " + this.employerUser.employerId);
      db.collection("jobs")
        .where("employerId", "==", this.employerUser.username.toLowerCase())
        .get()
        .then(snapshot => {
          //console.log(snapshot)
          snapshot.forEach(document => {
            this.jobs.push(document.data());
            //console.log("store" + this.companyValues);
          });
        });
    }
  }
};
</script>

<style>
</style>