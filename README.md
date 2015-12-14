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
* Firmar el apk: `cd Android && jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../Publish/prolife.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk prolife_key`
* Ingresar la clave del certificado.
* Alinear el archivo: `zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/android-release-signed.apk`
* Archivo compilado en `platforms/android/build/outputs/apk/android-release-signed.apk`

###### Certificado
* Keystore: `prolife.keystore`
* Indice de la llave: `prolife_key`
* Clave del almacen de llaves y clave de la llave prolife_key: `prolife!1234`

##### iOS 