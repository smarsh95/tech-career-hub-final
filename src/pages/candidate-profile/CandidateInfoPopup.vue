<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="my-2" caption dark color="blue" v-bind="attrs" v-on="on">View</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline mt-2 mb-4">  {{ candidateUser.firstName.charAt(0).toUpperCase() + candidateUser.firstName.slice(1) + " " + candidateUser.lastName.charAt(0).toUpperCase() + candidateUser.lastName.slice(1)}}</span>
        </v-card-title>
        <v-card-text><strong>Bio:</strong> {{ candidateUser.bio }}</v-card-text>
         <v-card-text><strong>Location:</strong> {{ candidateUser.location }}</v-card-text>
        <v-card-text><strong>Top Skills:</strong> {{ candidateUser.topSkills }}</v-card-text>
        <v-card-text><strong>Work Experiences:</strong> {{ candidateUser.workExperience }}</v-card-text>
        <v-card-text>
          <strong>Career Paths Of Interest:</strong> {{ candidateUser.careerPaths.toString().replace(/,/g, ", ") }}
        </v-card-text>
         <v-card-text><strong>Available From:</strong> {{ candidateUser.due }}</v-card-text>
         <div>
        <v-btn class="ml-5 mb-6" caption dark color="blue"
        @click="redirectToProfile()">View Profile</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
//import db from "@/firebase/init";
export default {
  data() {
    return {
      dialog: false,
      
    };
  },
  props: {
    candidateUser: Object
  },
  methods: {
    redirectToProfile(){
      this.$router.push({
          path: "/CandidateProfile/" + this.candidateUser.id
        });
    }
    /*
    loadCandidateData() {
      //console.log("employerID: " + this.candidateUser.employerId);
      db.collection("employerUsers")
        .where("username", "==", this.candidateUser.employerId.toLowerCase())
        .get()
        .then(snapshot => {
            //console.log(snapshot)
          snapshot.forEach(document => {
            this.firstName= document.get("firstName"); 
            this.lastName = document.get("lastName");
            this.bio = document.get("bio");
            this.topSkills = document.get("topSkills"); 
            this.workExperience = document.get("workExperience");
            this.careerPaths = document.get("careerPaths");

            //console.log("store" + this.companyValues);
          });
        });
    }*/
  }
};
</script>

<style>
.infoStyle {
  font-family: brandon-grotesque, sans-serif;
  font-weight: 300;
  font-style: normal;
  color:#4b696f !important;
}

</style>