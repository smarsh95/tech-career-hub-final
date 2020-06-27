<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="my-2" caption dark color="blue" v-bind="attrs" v-on="on" @click="loadCompanyData">View Job</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline mt-2 mb-4">  {{ job.jobTitle }} for {{ job.companyName.charAt(0).toUpperCase() + job.companyName.slice(1) }}</span>
        </v-card-title>
        <v-card-text><strong>Salary:</strong> {{ job.salary.toString().replace(/,/g, ", ") }}</v-card-text>
        <v-card-text><strong>Job Location:</strong> {{ job.location }}</v-card-text>
        <v-card-text><strong>Job Type:</strong> {{ job.jobType.toString().replace(/,/g, ", ") }}</v-card-text>
        <v-card-text>
          <strong>Job Description:</strong> {{ job.description }}
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-text><strong>Programming Languages:</strong> {{ job.programmingLanguages.toString().replace(/,/g, ", ") }}</v-card-text>
        <v-card-text><strong>Frameworks:</strong> {{ job.frameworks.toString().replace(/,/g, ", ") }}</v-card-text>
        <v-card-text class="pb-2"><strong>Application Closing Date:</strong> {{ job.due }} </v-card-text>
        <v-card-title>
          <span class="headline mb-4">More Company Infos:</span>
        </v-card-title>
        <v-card-text><strong>Company Name:</strong> {{ companyName }}</v-card-text>
        <v-card-text><strong>Company Overview:</strong> {{ companyOverview }}</v-card-text>
        <v-card-text><strong>Company Values:</strong> {{ companyValues }}</v-card-text>
        <v-card-text><strong>Company Vision:</strong> {{ companyVision }}</v-card-text>
        <v-card-text><strong>Company Career Paths:</strong> {{ companyCareerPathsOffered.toString().replace(/,/g, ", ") }}</v-card-text>

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
      companyName: "",
      companyOverview: "",
      companyValues: "",
      companyVision: "", 
      companyCareerPathsOffered: "",
      employerUser: ""
    };
  },
  props: {
    job: Object
  },
  methods: {
    loadCompanyData() {
      //console.log("employerID: " + this.job.employerId);
      db.collection("employerUsers")
        .where("username", "==", this.job.employerId.toLowerCase())
        .get()
        .then(snapshot => {
            //console.log(snapshot)
          snapshot.forEach(document => {
            this.companyName = document.get("companyName"); 
            this.companyOverview = document.get("companyOverview");
            this.companyValues = document.get("companyValues");
            this.companyVision = document.get("companyVision"); 
            this.companyCareerPathsOffered = document.get("companyCareerPathsOffered");

            //console.log("store" + this.companyValues);
          });
        });
    }
  }
};
</script>