<template>
  <v-card flat style="max-width: 600px; margin:auto;">
    <v-snackbar v-model="snackbar" absolute top color="primary">
      <span>Your Profile is now complete!</span>
      <v-icon dark>mdi-checkbox-marked-circle</v-icon>
    </v-snackbar>

    <v-card-title
      class="display-1 mt-10 mb-5 pl-2 mx-6 pt-8 justify-left blue-grey--text font-weight-light"
    >Your Tech Wizard Employer Profile</v-card-title>

    <v-form ref="form" @submit.prevent="submit">
      <v-container>
        <v-row class="mx-4">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="companyName"
              color="orange darken-2"
              label="Company Name"
              required
              :rules="inputRules"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="companyOverview" color="teal" :rules="inputRules">
              <template v-slot:label>
                <div>Company Overview</div>
              </template>
            </v-textarea>
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="companyVision" color="teal" :rules="inputRules">
              <template v-slot:label>
                <div>Company Vision</div>
              </template>
            </v-textarea>
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="companyValues" color="teal" :rules="inputRules">
              <template v-slot:label>
                <div>Company Values</div>
              </template>
            </v-textarea>
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="companyAchievements" color="teal" :rules="inputRules">
              <template v-slot:label>
                <div>Company Achievements</div>
              </template>
            </v-textarea>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="skillsDesired"
              label="Skills Desired From Candidates"
              color="orange"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="companyCareerPathsOffered"
              :items="paths"
              label="Select"
              multiple
              hint="We offer jobs in the following Career Paths"
              persistent-hint
            ></v-select>
          </v-col>
          <v-col id="cancelBtn">
            <v-card-actions>
              <v-btn text>Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="primary" type="submit">Complete Profile</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  data() {
    return {
      companyName: "",
      companyOverview: "",
      companyVision: "",
      companyValues: "",
      companyAchievements: "",
      skillsDesired: "",
      companyCareerPathsOffered: [],
      paths: [
        "Embedded Systems",
        "IT Security",
        "Web Development",
        "Research",
        "Database Devellopment",
        "UX/UI",
        "iOS Development",
        "Android Development"
      ],
      inputRules: [v => v.length >= 3 || "Minimum length is 3 characters"],
      snackbar: false,
      EmployerUser: null,
      profile: null
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        db.collection("employerUsers")
          .doc(this.employerUser.id)
          .update({
            companyName: this.companyName,
            companyOverview: this.companyOverview,
            companyVision: this.companyVision,
            companyValues: this.companyValues,
            companyAchievements: this.companyAchievements,
            companyCareerPathsOffered: this.companyCareerPathsOffered
          })
          .then(() => {
            this.loading = false;
            this.$emit("companyProfileAdded");
            console.log("Document successfully updated");
          });
        this.snackbar = "true";

        this.$router.push({
          path: "/EmployerProfile/" + this.employerUser.id
        });
      }
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
          console.log('ID: ' + this.employerUser.id);
        });
      });
  }
};
</script>

<style>
.v-main__wrap {
  background-color: #3e5769;
}
#cancelBtn{
  padding-left: 4px !important;
}
</style>


