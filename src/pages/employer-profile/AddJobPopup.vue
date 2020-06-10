<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500" >
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
</template>

<script>
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import db from '@/firebase/init.js'

export default {
  data() {
    return {
      jobTitle: "",
      companyName: "", 
      description: "",
      requiredSkills: "",
      due: null,
      dialog: false, 
      snackbar: false,
      inputRules: [
          v => v.length >= 3 || 'Minimum length is 3 characters'
      ], 
      loading: false, 
      
    }
  }, 
  methods: {
      submit() {
          if(this.$refs.form.validate()) {
            this.loading = true;
            const job = {
                jobTitle: this.jobTitle, 
                companyName: this.companyName, 
                due: format(parseISO(this.due), 'do MMM yyyy'), 
                status: 'open'
            }
            db.collection('jobs').add(job).then(() => {
                this.loading = false;
                this.dialog = false;
                this.$emit('jobAdded')
            })
          } 
      }
  }, 
  computed: {
      formattedDate() {
          return this.due ? format(parseISO(this.due), 'do MMM yyyy') : '' 
      }
  }
};
</script>