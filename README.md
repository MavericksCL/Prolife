# Prolife
###### (Cordova/Ionic Framework)
---
#### Requerimientos
* ruby `ruby -v`
* npm (node) `node -v`
* Cordova `npm install cordova -g`
* Ionic Framework `npm install ionic -g`
* bower `npm install bower -g`
* SASS `gem install sass`
* Android SDK / Android
* Command Line Tools Package / iOS

#### Preparación
Entra a la carpeta correspondiente para cada plataforma

* `bower install`
* `npm install`
* `ionic setup sass`
* `ionic platform add android` o `ionic platform add ios`

#### Compilación
* Android: `ionic build android`
* iOS `ionic build ios`

#### Producción
##### Android
* Compilar para android en producción: `ionic build android --release`

##### iOS 