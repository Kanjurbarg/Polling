// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBAWbt87SNt9TlkX9vu7z53-2jFLOhbDTQ",
    authDomain: "digi-pollz.firebaseapp.com",
    databaseURL: "https://digi-pollz.firebaseio.com",
    projectId: "digi-pollz",
    storageBucket: "digi-pollz.appspot.com",
    messagingSenderId: "550651498950"
  }
};
