<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" absolute dark fab top right color="green">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary" flat>
          <v-btn icon dark @click="dialog = false" right>
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Edit Profile</v-toolbar-title>
        </v-toolbar>
        <v-form ref="form" @submit.prevent="submit" class>
          <v-container>
            <v-row class="mx-4">
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
                <v-textarea v-model="bio" color="teal">
                  <template v-slot:label>
                    <div>
                      Bio
                      <small>(optional)</small>
                    </div>
                  </template>
                </v-textarea>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="location"
                  label="Location"
                  color="orange"
                  :rules="inputRules"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="topSkills"
                  label="Top Skills"
                  color="orange"
                  :rules="inputRules"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="workExperience" label="Work Experience" color="orange"></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-slider v-model="age" color="orange" label="Age" min="1" max="100" thumb-label></v-slider>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="careerPaths"
                  :items="paths"
                  label="Select"
                  multiple
                  hint="Choose your desired Career Paths"
                  persistent-hint
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-menu max-width="290">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="formattedDate"
                      label="Available From"
                      v-on="on"
                      :rules="inputRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="due"></v-date-picker>
                </v-menu>
              </v-col>

              

              <v-col cols="12">
                <v-card-actions>
                  <v-btn text>Cancel</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn right text color="primary" type="submit">Update Profile</v-btn>
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
//import CandidateProfile from '@/pages/candidate-profile/CandidateProfile.vue'
export default {
  data() {
    return {
      dialog: "",
      firstName: "",
      lastName: "",
      bio: "",
      topSkills: "",
      age: "",
      location: "",
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
      due: "",
      inputRules: [v => v.length >= 3 || "Minimum length is 3 characters"],
      snackbar: false,
      profile: null,
      candidateUser: null,
    };
  },
  /*props: {
    candidateUser: Object
  },*/
  methods: {
    setFields() {
      this.firstName = this.candidateUser.firstName;
      this.lastName = this.candidateUser.lastName;
      this.bio = this.candidateUser.bio;
      this.topSkills = this.candidateUser.topSkills;
      this.age = this.candidateUser.age;
      this.location = this.candidateUser.location;
      this.workExperience = this.candidateUser.workExperience;
      this.careerPaths = this.candidateUser.careerPaths;
      //this.due = this.candidateUser.due;
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        db.collection("candidateUsers")
          .doc(this.candidateUser.id)
          .update({
            firstName: this.firstName,
            lastName: this.lastName,
            bio: this.bio,
            due: format(parseISO(this.due), "do MMMM yyyy"),
            location: this.location,
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
      }
    }
  },
  computed: {
    formattedDate() {
      return this.due ? format(parseISO(this.due), "do MMM yyyy") : "";
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
          this.setFields();
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
.infoStyle {
  font-family: brandon-grotesque, sans-serif;
  font-weight: 300;
  font-style: normal;
  color: #4b696f !important;
}
</style>