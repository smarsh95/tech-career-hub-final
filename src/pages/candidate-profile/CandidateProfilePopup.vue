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

              <v-col cols="12" class="pt-0">
                <v-checkbox v-model="confirmLocationCapture" color="green">
                  <template v-slot:label>
                    <div @click.stop>
                      Would you be happy to share your
                      <a
                        href="javascript:;"
                        @click.stop="locationPopup = true"
                      >current location</a> with other users?
                    </div>
                  </template>
                </v-checkbox>
              </v-col>

              <v-col cols="12">
                <v-card-actions>
                  <v-btn text @click="deleteAccountPopup = true">Delete Account</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn right text color="primary" type="submit">Update Profile</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <v-dialog v-model="deleteAccountPopup" width="70%">
          <v-card>
            <v-card-title class="title">Delete your Account</v-card-title>
            <v-card-text>Are you sure that you want to delete your account all data associated with it?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="blue" @click="deleteAccountPopup = false">Chancel</v-btn>
              <v-btn text color="blue" @click="deleteAccount">Delete Account</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="locationPopup" width="70%">
          <v-card>
            <v-card-title class="title">Share your Location</v-card-title>
            <v-card-text>{{ locationContent }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="blue" @click="locationPopup = false">Ok</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      locationPopup: false,
      locationContent: "We will store your location to display employers a map of candidate user locations. You can revert your decision anytime by editing your profile.",
      confirmLocationCapture: false,
      geolocation: null,
      deleteAccountPopup: false
    };
  },
  /*props: {
    candidateUser: Object
  },*/
  methods: {
    deleteAccount() {
      let deleteUser = firebase.functions().httpsCallable("DeleteUser");
      deleteUser({ uid: firebase.auth().currentUser.uid }).then(result => {
        if (result.data.success) {
          console.log("User deleted");
          db.collection("candidateUsers")
            .doc(this.candidateUser.id)
            .delete()
            .then(() => {
              db.collection("employerUsers")
                .get()
                .then(snapshot => {
                  snapshot
                    .forEach(doc => {
                      let favourites = doc.data().favouriteCandidates;
                      if (favourites) {
                        for (var i = 0; i < favourites.length; i++) {
                          if (favourites[i].id == this.candidateUser.id) {
                            favourites.splice(i, 1);
                            db.collection("employerUsers")
                              .doc(doc.id)
                              .update({ favouriteCandidates: favourites });
                            break;
                          }
                        }
                      }
                    })
                }).then(() => {
                      firebase
                        .auth()
                        .signOut()
                        .then(() => {
                          this.$router.push({ path: "/" });
                        });
                    });
            });
        } else {
          console.log("ERROR - Deleting user: " + result);
        }
      });
    },

    // Saves the users current location in the database or deletes it depending on the user choice. Wrapped as promise
    saveLocation(deleteLocation) {
      return new Promise((resolve, reject) => {
        var tempGeolocation = null;
        if (!deleteLocation) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
              //find the user record and then update geocoords
              db.collection("candidateUsers")
                .doc(this.candidateUser.id)
                .update({
                  geolocation: {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                  }
                })
                .then(() => {
                  resolve("Success!");
                })
                .catch(() => {
                  reject("Not successfull");
                });
            });
          }
        } else {
          db.collection("candidateUsers")
            .doc(this.candidateUser.id)
            .update({
              geolocation: tempGeolocation
            })
            .then(() => {
              resolve("Success!");
            })
            .catch(() => {
              reject("Rejected.");
            });
        }
      });
    },
    // Set fields of the form to values retrieved from database
    setFields() {
      this.firstName = this.candidateUser.firstName;
      this.lastName = this.candidateUser.lastName;
      this.bio = this.candidateUser.bio;
      this.topSkills = this.candidateUser.topSkills;
      this.age = this.candidateUser.age;
      this.location = this.candidateUser.location;
      this.workExperience = this.candidateUser.workExperience;
      this.careerPaths = this.candidateUser.careerPaths;
      this.confirmLocationCapture = this.candidateUser.confirmLocationCapture;
      this.geolocation = this.candidateUser.geolocation;
      //this.due = this.candidateUser.due;
    },
    // Submit form and save/update the user in the database
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
            workExperience: this.workExperience,
            confirmLocationCapture: this.confirmLocationCapture
          })
          .then(() => {
            console.log("Document successfully updated");
            this.$emit("profileChanged");
            if (this.confirmLocationCapture) {
              // Save Location
              this.saveLocation(false).then(() => {
                this.loading = false;
                this.dialog = false;
                this.snackbar = "true";
              });
            } else {
              // Delete Location
              this.saveLocation(true).then(() => {
                this.loading = false;
                this.dialog = false;
                this.snackbar = "true";
              });
            }
          });
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
          this.setFields(); // Set fields of the form to the retrieved values
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