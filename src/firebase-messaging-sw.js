importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

const configure = firebase.initializeApp({
    apiKey: "AIzaSyCrRlBCmUEoXPm4hCIYe2TSMPbgwQTzC0w",
    authDomain: "cobuild-ae278.firebaseapp.com",
    projectId: "cobuild-ae278",
    storageBucket: "cobuild-ae278.firebasestorage.app",
    messagingSenderId: "604077171637",
    appId: "1:604077171637:web:9ce9e97f5de0d2ec382ffc",
    measurementId: "G-PVS87DJJT8",
    vapidKey: "BHGlgvGfzZ9OYAqbp_a_SQEqNnPqmVyszh_nrod8SJNB4BsE-u_JeB19o1WacjWnDSoa-8yriJvJVsUAjK5G4bI"
});
const messaging = firebase.messaging(configure);
messaging.onBackgroundMessage(messaging, (payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle,notificationOptions);
});
