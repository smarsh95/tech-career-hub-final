<template>
  <v-card flat style="max-width: 600px; margin:auto;">
    <v-snackbar v-model="snackbar" absolute top color="primary">
      <span>Your Profile is now complete!</span>
      <v-icon dark>mdi-checkbox-marked-circle</v-icon>
    </v-snackbar>

    <v-card-title
      class="display-1 mt-10 mb-5 pl-2 justify-left blue-grey--text font-weight-light"
    >Your Tech Wizard Candidate Profile</v-card-title>

    <v-form ref="form" @submit.prevent="submit">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="firstName"
              color="orange darken-2"
              label="First name"
              required
              :rules="inputRules"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="lastName"
              color="orange darken-2"
              label="Last name"
              required
              :rules="inputRules"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="bio" color="teal" :rules="inputRules">
              <template v-slot:label>
                <div>
                  Bio
                  <small>(optional)</small>
                </div>
              </template>
            </v-textarea>
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="topSkills" label="Top Skills" color="orange"></v-text-field>
          </v-col>

           <v-col cols="12" lg="12">
            <v-text-field v-model="workExperience" label="Work Experience" color="orange"></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" lg="12">
            <v-slider v-model="age" color="orange" label="Age" min="1" max="100" thumb-label></v-slider>
          </v-col>

          <v-col cols="12" sm="6" lg="12">
            <v-select
              v-model="careerPaths"
              :items="paths"
              label="Select"
              multiple
              hint="Choose your desired Career Paths"
              persistent-hint
            ></v-select>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-btn text>Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn text color="primary" type="submit">Complete Profile</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
//import CandidateProfile from '@/pages/candidate-profile/CandidateProfile.vue'

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      bio: "",
      topSkills: "",
      age: "",
      workExperience: "",
      careerPaths: [],
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
      candidateUser: null,
      profile: null
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        db.collection("candidateUsers")
          .doc(this.candidateUser.id)
          .update({
            firstName: this.firstName,
            lastName: this.lastName,
            bio: this.bio,
            topSkills: this.topSkills,
            age: this.age,
            careerPaths: this.careerPaths,
            workExperience: this.workExperience
          })
          .then(() => {
            this.loading = false;
            this.$emit("profileAdded");
            console.log("Document successfully updated");
          });
        this.snackbar = "true";

        this.$router.push({
          path: "/CandidateProfile/" + this.candidateUser.id
        });
      }
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
          console.log(this.candidateUser.id);
        });
      });

    //profile data
    /*
    console.log(this.$route)
    ref
      .doc({path: '/candidateProfile/:id', component: CandidateProfile})
      .get()
      .then(candidateUser => {
        this.profile = candidateUser.data();
      });
    */
  }
};
</script>

<style>
.v-main__wrap {
  background-color: #3e5769;
}
</style>
