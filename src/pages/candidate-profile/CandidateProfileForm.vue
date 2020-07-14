<template>
  <v-container>
    <v-snackbar v-model="snackbar" absolute top color="primary">
      <span>Your Profile is now complete!</span>
      <v-icon dark>mdi-checkbox-marked-circle</v-icon>
    </v-snackbar>
    <v-card flat style="max-width: 600px; margin:auto;">
      <v-card-title
        class="display-1 mt-10 pl-2 mx-6 pt-8 justify-left blue-grey--text font-weight-light"
      >Your Profile</v-card-title>

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
              <v-text-field v-model="location" label="Location" color="orange" :rules="inputRules"></v-text-field>
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

            <v-col cols="12" class="pb-0">
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

            <v-col cols="12" class="pt-0">
              <v-checkbox v-model="tcChecked" color="green">
                <template v-slot:label>
                  <div @click.stop>
                    Do you accept the
                    <a href="javascript:;" @click.stop="terms = true">terms</a>
                    and
                    <a
                      href="javascript:;"
                      @click.stop="conditions = true"
                    >conditions?</a>
                  </div>
                </template>
              </v-checkbox>
            </v-col>

            <v-col cols="12">
              <v-card-actions>
                <v-btn text @click="resetForm">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn right text color="primary" type="submit" :disabled="!formIsValid">Complete Profile</v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <v-dialog v-model="terms" width="70%">
        <v-card>
          <v-card-title class="title">Terms</v-card-title>
          <v-card-text v-for="n in 5" :key="n">{{ content }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="purple" @click="terms = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="conditions" width="70%">
        <v-card>
          <v-card-title class="title">Conditions</v-card-title>
          <v-card-text v-for="n in 5" :key="n">{{ content }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="purple" @click="conditions = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
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
      due: null,
      inputRules: [v => v.length >= 3 || "Minimum length is 3 characters"],
      snackbar: false,
      candidateUser: null,
      profile: null,
      terms: false,
      conditions: false,
      tcChecked: false,
      content: 'Lorem Ipsum'
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

        this.$router.push({
          path: "/CandidateProfile/" + this.candidateUser.id
        });
      }
    }, 
     resetForm () {
          this.firstName = "",
          this.lastName = "",
          this.bio = "",
          this.due = "",
          this.location = "",
          this.topSkills = "",
          this.age = "",
          this.workExperience = "",
          this.careerPaths = "",
          this.tcChecked = false
      },
  },
  computed: {
    formattedDate() {
      return this.due ? format(parseISO(this.due), "do MMM yyyy") : "";
    },
    formIsValid () {
        return (
          this.firstName &&
          this.lastName &&
          this.due &&
          this.location &&
          this.topSkills &&
          this.age &&
          this.workExperience &&
          this.careerPaths &&
          this.tcChecked
        )
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
