const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.checkUsername = functions.https.onCall((data, context) => {
  let ref;
  if (data.userType == 'candidate') {
    ref = admin.firestore().collection('candidateUsers').doc(data.slug);
  } else {
    ref = admin.firestore().collection('employerUsers').doc(data.slug);
  }
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

exports.DeleteUser = functions.https.onCall((data, context) => {
  return admin.auth().deleteUser(data.uid)
  .then(function() {
    return { message: 'Successfully deleted user' , success: true};
  })
  .catch(function(error) {
    return { message: 'Error deleting user' , success: false};
  });
})

exports.GetUserEmail = functions.https.onCall((data, context) => {
  return admin.auth().getUser(data.uid)
  .then(userRecord => {
    return { email: userRecord.email }
  })
  .catch(error => {
    return {status: 'error', code: 500, error}
  })
})







