<template>
  <v-card flat style="max-width: 600px; margin:auto;">
    <v-snackbar v-model="snackbar" absolute top color="primary">
      <span>Your Profile is now complete!</span>
      <v-icon dark>mdi-checkbox-marked-circle</v-icon>
    </v-snackbar>

    <v-card-title
      class="display-1 mt-10 mb-5 pl-2 mx-6 pt-8 justify-left blue-grey--text font-weight-light"
    >Your Company Profile</v-card-title>

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
            <v-text-field
              v-model="companyLocation"
              label="Company Location"
              color="orange"
              :rules="inputRules"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="companyOverview" color="teal" :rules="inputRules" required>
              <template v-slot:label>
                <div>Company Overview</div>
              </template>
            </v-textarea>
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="companyVision" color="teal" :rules="inputRules" required>
              <template v-slot:label>
                <div>Company Vision</div>
              </template>
            </v-textarea>
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="companyValues" color="teal" :rules="inputRules" required>
              <template v-slot:label>
                <div>Company Values</div>
              </template>
            </v-textarea>
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="companyAchievements" color="teal" :rules="inputRules" required>
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
              :rules="inputRules"
              required
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
              required
            ></v-select>
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
          <v-col id="cancelBtn">
            <v-card-actions>
              <v-btn text>Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="primary" type="submit" :disabled="!formIsValid">Complete Profile</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
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
  </v-card>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  data() {
    return {
      companyName: "",
      companyLocation: "",
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
      profile: null,
      terms: false,
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

    };
  },
  computed: {
    formIsValid() {
      return (
        this.companyName &&
        this.companyLocation &&
        this.companyOverview &&
        this.companyVision &&
        this.companyValues &&
        this.companyAchievements &&
        this.companyCareerPathsOffered &&
        this.tcChecked
      );
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        db.collection("employerUsers")
          .doc(this.employerUser.id)
          .update({
            companyName: this.companyName,
            companyLocation: this.companyLocation,
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
          console.log("ID: " + this.employerUser.id);
        });
      });
  }
};
</script>

<style>
.v-main__wrap {
  background-color: #3e5769;
}
#cancelBtn {
  padding-left: 4px !important;
}
</style>


