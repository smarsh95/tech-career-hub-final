<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" absolute dark fab top right color="orange">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary" flat>
          <v-btn icon dark @click="dialog = false" right>
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Edit Company Profile</v-toolbar-title>
        </v-toolbar>
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
    </v-dialog>
  </v-row>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

export default {
  data() {
    return {
      dialog: "",
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
    setFields() {
      this.companyName = this.employerUser.companyName;
      this.companyOverview = this.employerUser.companyOverview;
      this.companyVision = this.employerUser.companyVision;
      this.companyValues = this.employerUser.companyValues;
      this.companyAchievements = this.employerUser.companyAchievements;
      this.skillsDesired = this.employerUser.skillsDesired;
      this.companyCareerPathsOffered = this.employerUser.companyCareerPathsOffered;
      this.careerPaths = this.employerUser.careerPaths;
      //this.due = this.employerUser.due;
    },
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
            this.$emit("profileAdded");
            console.log("Document successfully updated");
          });
        this.snackbar = "true";
      }
    }
  },
  computed: {
    formattedDate() {
      return this.due ? format(parseISO(this.due), "do MMM yyyy") : "";
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
          console.log(this.employerUser.id);
          this.setFields();
        });
      });
  }
};
</script>

<style>
.infoStyle {
  font-family: brandon-grotesque, sans-serif;
  font-weight: 300;
  font-style: normal;
  color: #4b696f !important;
}
</style>