// import firebase from '@firebase/app'
// import '@firebase/database'
// import '@firebase/storage'

// const config = {
//     apiKey: "AIzaSyBNiqf21f9wbn6Pnv2kKhhvFv6SM7Z5VpE",
//     authDomain: "bbl-dev.firebaseapp.com",
//     databaseURL: "https://bbl-dev.firebaseio.com",
//     projectId: "bbl-dev",
//     storageBucket: "bbl-dev.appspot.com",
//     messagingSenderId: "713823656240"
//   }
// var fbDatabase, fbStorage

// if (firebase.apps.length === 0) {
//     firebase.initializeApp(config)
//     fbDatabase = firebase.database()
//     fbStorage = firebase.storage()
// }
// // !firebase.apps.length ? firebase.initializeApp(config) : ''

// // // Export the database for components to use.
// // // If you want to get fancy, use mixins or provide / inject to avoid redundant imports.
// export const database = fbDatabase
// export const storage = fbStorage

import * as firebase from 'firebase/app';
import 'firebase/database'
import 'firebase/storage'
import 'firebase/auth'

const config = {
    apiKey: "AIzaSyBqqizAIlO1cMBgi3l7MiweH5V4gy9zCdc",
    authDomain: "postechproject.firebaseapp.com",
    databaseURL: "https://postechproject.firebaseio.com",
    projectId: "postechproject",
    storageBucket: "postechproject.appspot.com",
    messagingSenderId: "344655296032"
}

// var fbDatabase, fbStorage

if (!firebase.apps.length) {
    firebase.initializeApp(config)
    // fbDatabase = firebase.database()
    // fbStorage = firebase.storage()
}
// !firebase.apps.length ? firebase.initializeApp(config) : ''


// // Export the database for components to use.
// // If you want to get fancy, use mixins or provide / inject to avoid redundant imports.
export const database = firebase.database() //fbDatabase
export const storage = firebase.storage()
export const auth = firebase.auth()
export const firebase_ = firebase