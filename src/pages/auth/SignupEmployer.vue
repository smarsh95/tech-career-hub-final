<template>
  <div class="signupEmployer">
    <v-container class="mx-auto mt-6">
      <v-row justify="center">
        <v-col xs="12" sm="8" md="8" lg="6" class="text-center">
          <v-card class="pa-4">
            <v-card-title class="headline blue-grey--text justify-center">Signup for Employers</v-card-title>
            <v-form class="px-6 py-3 user-actions">
              <v-text-field
                label="Company Name:"
                v-model="companyName"
                type="text"
                name="companyName"
                id="companyName"
                required
              ></v-text-field>
              <v-text-field
                label="Email:"
                v-model="email"
                type="email"
                name="email"
                id="employer-email"
                required
              ></v-text-field>
              <v-text-field label="Password:" v-model="password" type="password" name="password"></v-text-field>
              <v-text-field label="Username:" v-model="username" type="text" name="username"></v-text-field>
              <p v-if="feedback" class="orange--text text--darken-2 text-center">{{ feedback }}</p>
              <div class="my-4">
                <v-btn class="block rounded blue-grey lighten-1 white--text" @click="signup">Signup</v-btn>
              </div>
            </v-form>
            <p class="subtitle-1">
              You want to sign up as a Candidate?&nbsp;
              <router-link :to="{ name: 'SignupCandidate' }">Click Here</router-link>
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import slugify from "slugify";
import db from "@/firebase/init";
import firebase from "firebase";
//import functions from 'firebase/functions'

export default {
  name: "SignupEmployer",
  data() {
    return {
      companyName: null,
      email: null,
      password: null,
      username: null,
      feedback: null,
      slug: null
    };
  },
  methods: {
    signup() {
      if (this.username && this.email && this.password) {
        this.slug = slugify(this.username, {
          replacement: "-",
          remove: /[$*_+~.()#'!"\-:@]/g,
          lower: true
        });
        let checkUsername = firebase.functions().httpsCallable("checkUsername");
        checkUsername({ slug: this.slug }).then(result => {
          console.log(result);
          if (!result.data.unique) {
            this.feedback = "This username already exists";
          } else {
            firebase
              .auth()
              .createUserWithEmailAndPassword(this.email, this.password)
              .then(cred => {
                db.collection("employerUsers")
                  .doc(this.slug)
                  .set({
                    username: this.username.toLowerCase(),
                    user_id: cred.user.uid
                  });
              })
              .then(() => {
                const addEmployerRole = firebase
                  .functions()
                  .httpsCallable("AddEmployerRole");
                addEmployerRole({ email: this.email }).then(result => {
                  console.log(result);
                  this.$router.push({ name: "EmployerProfileForm" });
                });
              })
              .catch(err => {
                console.log(err);
                this.feedback = err.message;
              });
            this.feedback = "This username is free to use";
          }
        });
        console.log(this.slug);
      } else {
        this.feedback = "you must enter all fields!";
      }
    }
  }
};
</script>

<style>
.v-main__wrap {
  background-color: #F1EFE8 !important;
}
</style>