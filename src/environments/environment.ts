// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyC7LCTdgviIbiGUUXLHaHg4kYEeRV1PHNE",
    authDomain: "digi-polls.firebaseapp.com",
    databaseURL: "https://digi-polls.firebaseio.com",
    projectId: "digi-polls",
    storageBucket: "digi-polls.appspot.com",
    messagingSenderId: "584334078188"
  }
};
