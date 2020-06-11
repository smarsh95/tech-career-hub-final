const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.checkUsername = functions.https.onCall((data, context) => {

    const ref = admin.firestore().collection('users').doc(data.slug); 
    return ref.get().then(doc => {
        return { unique: !doc.exists }
    }).catch(err => {
        throw new functions.https.HttpsError('failed to connect');
    });
});

//adding user based authentication

exports.AddEmployerRole = functions.https.onCall((data, context) => {
  // get user and add custom claim (employer)
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      employer: true
    })
  }).then(() => {
    return {
      message: `Success! ${data.email} has been made an employer`
    }
  }).catch(err => {
    return err; 
  })
})

exports.AddCandidateRole = functions.https.onCall((data, context) => {
  // get user and add custom claim (candidate)
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      candidate: true
    })
  }).then(() => {
    return {
      message: `Success! ${data.email} has been made a candidate`
    }
  }).catch(err => {
    return err; 
  })
})



  
  


