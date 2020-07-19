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
                    <a href="javascript:;" @click.stop="terms = true">Privacy Policy</a>
                  </div>
                </template>
              </v-checkbox>
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
                <v-btn text @click="redirectToHome">Fill out Later</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  right
                  text
                  color="primary"
                  type="submit"
                  :disabled="!formIsValid"
                >Complete Profile</v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

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
      <v-dialog v-model="terms" width="70%">
        <v-card>
          <v-card-title class="title">Privacy Policy</v-card-title>
          <v-card-text>{{ content }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="blue" @click="terms = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="conditions" width="70%">
        <v-card>
          <v-card-title class="title">Conditions</v-card-title>
          <v-card-text>{{ content }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="blue" @click="conditions = false">Ok</v-btn>
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
      content: `Privacy Policy:
This privacy policy ("policy") will help you understand how Tech Wizard ("us", "we", "our") uses and protects the data you provide to us when you visit and use [website] ("website", "service").
We reserve the right to change this policy at any given time, of which you will be promptly updated. If you want to make sure that you are up to date with the latest changes, we advise you to frequently visit this page.
What User Data We Collect
When you visit the website, we may collect the following data:
Your IP address.
Your contact information and email address.
Other information such as interests and preferences.
Data profile regarding your online behavior on our website.
Why We Collect Your Data
We are collecting your data for several reasons:
To better understand your needs.
To improve our services and products.
To send you promotional emails containing the information we think you will find interesting.
To contact you to fill out surveys and participate in other types of market research.
To customize our website according to your online behavior and personal preferences. Safeguarding and Securing the Data
Tech Wizard is committed to securing your data and keeping it confidential. Tech Wizard has done all in its power to prevent data theft, unauthorized access, and disclosure by implementing the latest technologies and software, which help us safeguard all the information we collect online.
Our Cookie Policy
Once you agree to allow our website to use cookies, you also agree to use the data it collects regarding your online behavior (analyze web traffic, web pages you spend the most time on, and websites you visit).
The data we collect by using cookies is used to customize our website to your needs. After we use the data for statistical analysis, the data is completely removed from our systems.
Please note that cookies don't allow us to gain control of your computer in any way. They are strictly used to monitor which pages you find useful and which you do not so that we can provide a better experience for you.
If you want to disable cookies, you can do it by accessing the settings of your internet browser. (Provide links for cookie settings for major internet browsers).
Links to Other Websites
Our website contains links that lead to other websites. If you click on these links Tech Wizard is not held responsible for your data and privacy protection. Visiting those websites is not governed by this privacy policy agreement. Make sure to read the privacy policy documentation of the website you go to from our website.
Restricting the Collection of your Personal Data
At some point, you might wish to restrict the use and collection of your personal data. You can achieve this by doing the following:
When you are filling the forms on the website, make sure to check if there is a box which you can leave unchecked, if you don't want to disclose your personal information.
If you have already agreed to share your information with us, feel free to contact us via email and we will be more than happy to change this for you.
Tech Wizard will not lease, sell or distribute your personal information to any third parties, unless we have your permission. We might do so if the law forces us. Your personal information will be used when we need to send you promotional materials if you agree to this privacy policy.`,
      locationPopup: false,
      locationContent: "We will store your location to display employers a map of candidate user locations. You can revert your decision anytime by editing your profile.",
      confirmLocationCapture: false
    };
  },
  methods: {
    // Saves the users current location in the database. Wrapped as promise
    saveLocation() {
      return new Promise((resolve, reject) => {
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
      });
    },
    redirectToHome() {
      this.$router.push({ name: "Home" });
    },

    // Submit form data -> save data in database, trigger saveLocation method if the user opted-in
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
            this.$emit("profileAdded");
            console.log("Document successfully updated");
            if (this.confirmLocationCapture) {
              this.saveLocation().then(() => {
                this.loading = false;
                this.$router.push({
                  path: "/CandidateProfile/" + this.candidateUser.id
                });
              });
            } else {
              this.loading = false;
              this.$router.push({
                path: "/CandidateProfile/" + this.candidateUser.id
              });
            }
          });
        
      }
    },
    resetForm() {
      (this.firstName = ""),
        (this.lastName = ""),
        (this.bio = ""),
        (this.due = ""),
        (this.location = ""),
        (this.topSkills = ""),
        (this.age = ""),
        (this.workExperience = ""),
        (this.careerPaths = ""),
        (this.tcChecked = false);
    }
  },
  computed: {
    // Format date
    formattedDate() {
      return this.due ? format(parseISO(this.due), "do MMM yyyy") : "";
    },
    // Check if form is valid/refilled out
    formIsValid() {
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
      );
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
