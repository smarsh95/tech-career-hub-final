<template>
<div>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="orange" dark v-on="on">Post a new Job</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline grey lighten-2 blue-grey--text text--darken-1" primary-title>Post A New Job</v-card-title>
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field label="Job Title" v-model="jobTitle" prepend-icon="mdi-briefcase-outline" :rules="inputRules"></v-text-field>
            <v-text-field label="Your Company Name" v-model="companyName" prepend-icon="mdi-account-supervisor" :rules="inputRules"></v-text-field>
            <v-text-field label="Required Skills" v-model="requiredSkills" prepend-icon="mdi-tools" :rules="inputRules"></v-text-field>
            <v-textarea label="Job Description" v-model="description" prepend-icon="mdi-pencil" :rules="inputRules"></v-textarea>
           
            <v-menu max-width="290">
                <template v-slot:activator="{ on }">
                    <v-text-field :value="formattedDate" label="Closing Date" prepend-icon="mdi-calendar-range" v-on="on" ></v-text-field>
                </template>
                <v-date-picker v-model="due"></v-date-picker>
            </v-menu>

            <v-spacer></v-spacer>

            <div class="text-center">
              <v-btn rounded color="primary" dark class="mb-1 mt-1" @click="submit" :loading="loading">Add Job</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  </div>
</template>

<script>
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import db from '@/firebase/init.js'
import firebase from 'firebase'

export default {
  data() {
    return {
      employerUser: null, 
      profile: null,
      jobs: [],
      jobTitle: "",
      companyName: "", 
      description: "",
      requiredSkills: "",
      due: null,
      inputRules: [
          v => v.length >= 3 || 'Minimum length is 3 characters'
      ], 
      loading: false, 
      dialog: false, 
      
    }
  }, 
  methods: {
      submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        if (this.jobs == undefined) {
          this.jobs = [
            {
              jobTitle: this.jobTitle, 
              companyName: this.companyName, 
              due: format(parseISO(this.due), 'do MMM yyyy'), 
              status: 'view'
            }
          ];
        } else {
          this.jobs.push({
            jobTitle: this.jobTitle, 
              companyName: this.companyName, 
              due: format(parseISO(this.due), 'do MMM yyyy'), 
              status: 'view'
          });
        }
        db.collection("employerUsers")
          .doc(this.employerUser.id)
          .update({ jobs: this.jobs  })
          .then(() => {
            console.log("Document successfully updated")
            this.loading = false
            this.dialog = false
            this.$emit("jobHasBeenAdded");
          });
      }
    },
      /*{
          if(this.$refs.form.validate()) {
            this.loading = true;
            const job = {
                jobTitle: this.jobTitle, 
                companyName: this.companyName, 
                due: format(parseISO(this.due), 'do MMM yyyy'), 
                status: 'view'
            }
            db.collection('jobs').add(job).then(() => {
                this.loading = false;
                this.dialog = false;
                this.$emit('jobAdded')
            })
          } 
      }*/
  },
  computed: {
      formattedDate() {
          return this.due ? format(parseISO(this.due), 'do MMM yyyy') : '' 
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
          //console.log(this.candidateUser.id);
          //console.log(this.candidateUser.skills);
          if (!this.employerUser.skills) {
            console.log("There are no jobs listed yet");
            this.jobs = [];
          } else {
            this.jobs = this.employerUser.jobs;
          }
        });
      });
  }
};
</script>

<style>
.v-main__wrap {
  background-color: #3e5769;
}

</style>

