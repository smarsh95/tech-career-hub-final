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
              v-model="form.first"
              :rules="rules.name"
              color="orange darken-2"
              label="First name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.last"
              :rules="rules.name"
              color="orange darken-2"
              label="Last name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="form.bio" color="teal">
              <template v-slot:label>
                <div>
                  Bio
                  <small>(optional)</small>
                </div>
              </template>
            </v-textarea>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="form.topSkills" label="Top Skills" color="orange"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-slider
              v-model="form.age"
              :rules="rules.age"
              color="orange"
              label="Age"
              min="1"
              max="100"
              thumb-label
            ></v-slider>
          </v-col>
          <v-col cols="12">
            <v-checkbox v-model="form.terms" color="green">
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
        </v-row>
      </v-container>
      <v-card-actions>
        <v-btn text @click="resetForm">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn :disabled="!formIsValid" text color="primary" type="submit">Complete Profile</v-btn>
      </v-card-actions>
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
</template>
<script>
export default {
  data() {
    const defaultForm = Object.freeze({
      first: "",
      last: "",
      topSkills: "",
      bio: "",
      age: null,
      terms: false
    });
    return {
      form: Object.assign({}, defaultForm),
      rules: {
        name: [val => (val || "").length > 0 || "This field is required"]
      },
      conditions: false,
      content: "",
      snackbar: false,
      terms: false,
      defaultForm
    };
  },
  computed: {
    formIsValid() {
      return this.form.first && this.form.last && this.form.terms;
    }
  },
  methods: {
    resetForm() {
      this.form = Object.assign({}, this.defaultForm);
      this.$refs.form.reset();
    },
    submit() {
      console.log(this.first, this.last, this.bio, this.age, this.topSkills);
      this.snackbar = true;
      this.resetForm();
    }
  }
};
</script>
