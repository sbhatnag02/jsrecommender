# Data Visualization Tool & JavaScript Recommender

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.4.

## Configuring Firebase Project & Console Information in Angular Project
### Firebase Account Setup
- Go to https://firebase.google.com and sign in with your google account
- Select 'Go to Console'
- Press 'Create a Project'
- Enter the required information for the project (name, analytics settings, etc.) and then press create project
- To the right of the project overview menu, on the left-hand side of the screen, click on settings and select project settings
![Go to Project Settings](https://github.com/sbhatnag02/jsrecommender/blob/master/readme_images/navigateToSettings.png)
- Scroll to the bottom of the page and add a web development platform to the project
![Add a Web Development Platform](https://github.com/sbhatnag02/jsrecommender/blob/master/readme_images/addWebDevProject.png)
- Enter an App Nickname, press register app, then press continue to console
- Scroll back down to the bottom of the settings page. In the 'Firebase SDK Snippet' section, select Config and copy the code below
![Get the Firebase Config Key](https://github.com/sbhatnag02/jsrecommender/blob/master/readme_images/getConfigKey.PNG)
### Entering Config Information into Angular Project
- Under the app source code, in the *environment.ts* class, paste the firebaseConfig into the file. Do the same in the *environment.prod.ts* file if you intend on deploying the app
![Paste the Config Key into the Angular Project](https://github.com/sbhatnag02/jsrecommender/blob/master/readme_images/configKeyToAngularProject.PNG)
- Go to the *app.module.ts* class. Import the *AngulareFireModule* from '@angular/fire'. Make sure the angular fire npm package has been installed beforehand.
- Add the line below to the imports in your *app.module.ts* class
![Import the AngularFireModule with the Correct Config Information](https://github.com/sbhatnag02/jsrecommender/blob/master/readme_images/importAngularFireModule.PNG)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
