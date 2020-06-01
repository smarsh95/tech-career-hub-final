<template>
  <v-card flat style="max-width: 600px; margin:auto;">
    <v-snackbar v-model="snackbar" absolute top color="primary">
      <span>Your Profile is now complete!</span>
      <v-icon dark>mdi-checkbox-marked-circle</v-icon>
    </v-snackbar>
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

          <v-col cols="12" sm="6">
            <v-slider v-model="age" color="orange" label="Age" min="1" max="100" thumb-label></v-slider>
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
import firebaseApp from "@/firebase/init.js";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      bio: "",
      topSkills: "",
      age: "",
      inputRules: [v => v.length >= 3 || "Minimum length is 3 characters"], 
      snackbar: false
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const studentProfile = {
          firstName: this.firstName,
          lastName: this.lastName,
          bio: this.bio,
          topSkills: this.topSkills,
          age: this.age
        };
        firebaseApp
          .collection("studentProfiles")
          .add(studentProfile)
          .then(() => {
            this.loading = false;
            this.$emit("profileAdded");
          });
          this.snackbar = "true";
      }
    }
  }
};
</script>
