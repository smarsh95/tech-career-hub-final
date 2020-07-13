<template>
  <div>
    <div class="text-left mx-2">
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on }">
          <v-btn color="blue" dark v-on="on">Add Job</v-btn>
        </template>
        <v-card>
          <v-card-title
            class="headline grey lighten-2 blue-grey--text text--darken-1"
            primary-title
          >Post A New Job</v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="form">
              <v-text-field
                label="Your Company Name"
                v-model="companyName"
                prepend-icon="mdi-warehouse"
                :rules="inputRules"
                class="mt-4 mb-0"
              ></v-text-field>
              <v-text-field
                label="Job Title"
                v-model="jobTitle"
                prepend-icon="mdi-briefcase-outline"
                :rules="inputRules"
                class="mt-4 mb-0"
              ></v-text-field>
              <v-text-field
                label="Location"
                v-model="location"
                prepend-icon="mdi-home-city-outline"
                :rules="inputRules"
                class="my-6"
              ></v-text-field>
              <v-select
                v-model="salary"
                prepend-icon="mdi-cash"
                :items="salaryValues"
                label="Salary"
                hint="Please select the approximate salary range"
                persistent-hint
                class="my-6"
              ></v-select>
              <v-select
                v-model="jobType"
                prepend-icon="mdi-clock"
                :items="jobHours"
                label="Position Type"
                hint="Please select the position type"
                persistent-hint
                class="my-6"
              ></v-select>
              <v-textarea
                label="Job Description"
                v-model="description"
                prepend-icon="mdi-pencil"
                :rules="inputRules"
                class="my-6"
              ></v-textarea>
              <v-select
                v-model="programmingLanguages"
                prepend-icon="mdi-laptop-chromebook"
                :items="listOfProgrammingLanguages"
                label="Programming Languages"
                multiple
                hint="Please select required skills of programming languages"
                persistent-hint
                class="my-6"
              ></v-select>
              <v-select
                v-model="frameworks"
                prepend-icon="mdi-puzzle"
                :items="listOfFrameworks"
                label="Frameworks"
                multiple
                hint="Please select required skills of frameworks"
                persistent-hint
                class="my-6"
              ></v-select>
              <v-text-field
                label="Other Required Skills"
                v-model="otherRequiredSkills"
                prepend-icon="mdi-tools"
                :rules="inputRules"
                class="my-6"
              ></v-text-field>
              <v-menu max-width="290">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :value="formattedDate"
                    label="Closing Date"
                    prepend-icon="mdi-calendar-range"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="due"></v-date-picker>
              </v-menu>

              <v-spacer></v-spacer>

              <div class="text-center">
                <v-btn
                  rounded
                  color="primary"
                  dark
                  class="mb-1 mt-1"
                  @click="submit"
                  :loading="loading"
                >Add Job</v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import db from "@/firebase/init.js";
import firebase from "firebase";

export default {
  data() {
    return {
      employerUser: null,
      profile: null,
      jobs: [],
      companyName: "",
      jobTitle: "",
      location: "",
      salary: "",
      salaryValues: [
        "£15,000 +",
        "£20,000 +",
        "£25,000 +",
        "£30,000 +",
        "£35,000 +",
        "£40,000 +",
        "£50,000 +",
        "£60,000 +",
        "£80,000 +",
        "£100,000 +"
      ],
      jobType: "",
      jobHours: ["Full-Time", "Part-Time"],
      description: "",
      listOfProgrammingLanguages: [
        "Javascript",
        "Phython",
        "Java",
        "C++",
        "Swift",
        "TypeScript",
        "Go",
        "Ruby",
        "R",
        "PHP",
        "Perl",
        "Kotlin",
        "C#",
        "Rust",
        "Scheme",
        "Erlang",
        "Scala",
        "Elixir",
        "Haskell",
        "Other"
      ],
      programmingLanguages: "",
      otherRequiredSkills: "",
      frameworks: "",
      listOfFrameworks: [
        "Vue.js",
        "React.js",
        "Angular.js",
        "ASP.NET MVC",
        "Ruby on Rails",
        "Django",
        "Laravel",
        "Spring",
        "ASP.Net",
        "Express",
        "Other"
      ],
      due: null,
      inputRules: [v => v.length >= 3 || "Minimum length is 3 characters"],
      loading: false,
      dialog: false
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const job = {
          companyName: this.companyName,
          jobTitle: this.jobTitle,
          location: this.location,
          salary: this.salary,
          jobType: this.jobType,
          description: this.description,
          programmingLanguages: this.programmingLanguages,
          frameworks: this.frameworks,
          due: format(parseISO(this.due), "do MMMM yyyy"),
          status: "view",
          employerId: this.employerUser.id
        };
        db.collection("jobs")
          .add(job)
          .then(docRef => {
            this.jobs.push(docRef.id);

            db.collection("employerUsers")
              .doc(this.employerUser.id)
              .update({ jobs: this.jobs })
              .then(() => {
                console.log("Document successfully updated");
                this.loading = false;
                this.dialog = false;
                this.$emit("jobHasBeenAdded");
              });
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
          if (!this.employerUser.jobs) {
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

