<template>
    <div class="signupEmployer">
        <v-container class="mx-auto mt-6">
        <v-row justify="center">
            <v-col xs="12" sm="8" md="8" lg="6" class="text-center">
            <v-card class="pa-4">
                <v-card-title class="headline blue-grey--text justify-center">Signup for Employers</v-card-title>
                <v-form class="px-6 py-3 admin-actions">
                <v-text-field label="Email:" v-model="email" type="email" name="email" id="admin-email" required></v-text-field>
                <v-text-field label="Password:" v-model="password" type="password" name="password"></v-text-field>
                <v-text-field label="Alias:" v-model="alias" type="text" name="alias"></v-text-field>
                <p v-if="feedback" class="orange--text text--darken-2 text-center">{{ feedback }}</p>
                <div class="my-4">
                    <v-btn class="block rounded blue-grey lighten-1 white--text" @click="signup">Signup</v-btn>
                </div>
                </v-form>
                <p class="subtitle-1">Already have an account?&nbsp;<router-link :to="{ name: 'Login' }">Login</router-link></p>
            </v-card>
            </v-col>
        </v-row>
        </v-container>
    </div>
</template>

<script>
import slugify from 'slugify'
import db from '@/firebase/init'
import firebase from 'firebase'
//import functions from 'firebase/functions'



export default {
    name: 'SignupStudent',
    data(){
        return{
            email: null, 
            password: null, 
            alias: null, 
            feedback: null, 
            slug: null
        }
    }, 
    methods: {
        signup(){
            if(this.alias && this.email && this.password){
                this.slug = slugify(this.alias, {
                    replacement: '-', 
                    remove: /[$*_+~.()#'!"\-:@]/g,
                    lower: true
                })
                let checkAlias = firebase.functions().httpsCallable('checkAlias')
                checkAlias({ slug: this.slug }).then(result => {
                    console.log(result)
                    if(!result.data.unique){
                        this.feedback = 'This alias already exists'
                    } else {
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)  
                        .then(cred => {
                            db.collection('users').doc(this.slug).set({
                                alias: this.alias,  
                                user_id: cred.user.uid 
                            })
                        }).then(() => {
                            this.$router.push({ name: 'Home' })
                        })
                        .catch(err => {
                            console.log(err)
                            this.feedback = err.message
                        })
                        this.feedback = 'This alias is free to use'
                    }
                })
                console.log(this.slug)
            } else {
                this.feedback = "you must enter an all fields!"
            }
        }
    }
}
</script>