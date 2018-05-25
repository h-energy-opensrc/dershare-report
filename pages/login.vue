<template>
  <section class="login-view sans-serif pa3 ma3">
    <div>
      <h3 class="title"> Login</h3>
      <p class="ma2"> 사용자 로그인 </p>
      <div class="mv2  measure">
        <label for="name" class="f6 b db mb2"> 사용자 이메일 </label>
        <input type="text" v-model="userId" id="id" class="input-reset ba b--black-20 pa2 mb2 db w-100" aria-describedby="name-desc">
      </div>
      <div class="mv2  measure">
        <label for="name" class="f6 b db mb2"> 비밀번호 </label>
        <input type="password" v-model="userPW" id="pw" class="input-reset ba b--black-20 pa2 mb2 db w-100" aria-describedby="name-desc">
      </div>
      <button @click="login">Login</button>
      <button @click="logout">Logout</button>
      <div id="firebaseui-auth-container"></div>
    </div>
    <div>
      <h3 class="title"> Sign up </h3>
      <p class="ma2"> 사용자 등록 </p>
      <div class="mv2  measure">
        <label for="name" class="f6 b db mb2"> 사용자 이메일 </label>
        <input type="text" v-model="userId" id="id" class="input-reset ba b--black-20 pa2 mb2 db w-100" aria-describedby="name-desc">
      </div>
      <div class="mv2  measure">
        <label for="name" class="f6 b db mb2"> 비밀번호 </label>
        <input type="password" v-model="userPW" id="pw" class="input-reset ba b--black-20 pa2 mb2 db w-100" aria-describedby="name-desc">
      </div>
    </div>
    <div>
      <div id="sign-in-status"></div>
      <div id="sign-in"></div>
      <div id="account-details"></div>
    </div>
  </section>
</template>
<script>
// if (process.browser) {
//   var firebaseui = require("firebaseui");
// }

import { firebase_, auth } from "~/plugins/fbConn";

export default {
  methods: {
    login() {
      var email = "pbshop1001@gmail.com";
      var password = "runy1001";
      auth.signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    },
    logout() {
      auth.signOut();
    },
    createAcc() {}
  },
  mounted() {
    auth.onAuthStateChanged(
      function(user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var uid = user.uid;
          var phoneNumber = user.phoneNumber;
          var providerData = user.providerData;
          user.getIdToken().then(function(accessToken) {
            document.getElementById("sign-in-status").textContent = "Signed in";
            document.getElementById("sign-in").textContent = "Sign out";
            document.getElementById(
              "account-details"
            ).textContent = JSON.stringify(
              {
                displayName: displayName,
                email: email,
                emailVerified: emailVerified,
                phoneNumber: phoneNumber,
                photoURL: photoURL,
                uid: uid,
                accessToken: accessToken,
                providerData: providerData
              },
              null,
              "  "
            );
          });
        } else {
          // User is signed out.
          document.getElementById("sign-in-status").textContent = "Signed out";
          document.getElementById("sign-in").textContent = "Sign in";
          document.getElementById("account-details").textContent = "null";
        }
      },
      function(error) {
        console.log(error);
      }
    );
  }
};
</script>
<style>
.login-view {
  max-width: 960px;
  margin: 0 auto;
}
</style>