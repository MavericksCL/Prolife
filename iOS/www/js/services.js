angular.module('Recalcine.services', [])

/**
 * @doc Service
 * @name $setting
 * @description
 * Servicio para manejar las traducciones
 */
    .factory("$localization", ["LOCALE", function(locale){
      return {
        get: function(name){
          if (typeof name == 'string') {
            var names = name.split('.');
            var now = 0;
            var locales = locale;
            try {
              while (names.length > 0) {
                locales = locales[names[0]];
                now++;
                names.shift();
              }
            }catch(e){
              locales = name;
            }
            if(typeof locales == 'undefined') locales = name;
            return locales;
          }
        }
      }
    }])

/**
 * @doc Service
 * @name $setting
 * @description
 * Lee las configuraciones de la app
 */
    .factory("$setting", ["SETTINGS", function(setting){
      return {
        get: function(name){
          if (typeof name == 'string') {
            var names = name.split('.');
            var now = 0;
            var locales = setting;
            try {
              while (names.length > 0) {
                locales = locales[names[0]];
                now++;
                names.shift();
              }
            }catch(e){
              locales = name;
            }
            if(typeof locales == 'undefined') locales = name;
            return locales;
          }
        }
      }
    }])

/**
 * @doc Service
 * @name $localStorage
 * @description
 * Maneja el localStorage
 */
    .factory('$localStorage', ["$q", "$log", function($q, $log) {
      if (window.localStorage) {
        var localStorage = window.localStorage;
        return {
          getJSON: function ($name, withPromise) {
            if(typeof withPromise == 'undefined' || typeof withPromise == 'null') withPromise = false;
            if(!withPromise) {
              try {
                var name = localStorage.getItem($name);
                if ((typeof name != "undefined") && (typeof name != "null") && (name != "undefined")){
                  return angular.fromJson(name);
                } else {
                  return undefined
                }
              } catch ($e) {
                $log.error("Error al obtener el item: "+$name);
                $log.error($e);
                return undefined
              }
            }else{
              var q = $q.defer();
              try {
                var name = localStorage.getItem($name);
                if (typeof name != "undefined" && typeof name != "null" && (name != "undefined")) {
                  name = angular.fromJson(name);
                }
                q.resolve(name);
              } catch ($e) {
                $log.error("Error al obtener el item: "+$name);
                $log.error($e);
                q.reject();
              }
              return q.promise;
            }
          },
          setJSON: function ($name, $value, withPromise) {
            if(typeof withPromise == 'undefined' || typeof withPromise == 'null') withPromise = false;
            if(!withPromise) {
              try {
                localStorage.setItem($name, angular.toJson($value));
              } catch ($e) {
                $log.error("Error al ingresar el item: "+$name);
                $log.error($e);
                return undefined
              }
            }else{
              var q = $q.defer();
              try {
                localStorage.setItem($name, angular.toJson($value));
                q.resolve("OK");
              } catch ($e) {
                $log.error("Error al ingresar el item: "+$name);
                $log.error($e);
                q.reject();
              }
              return q.promise;
            }
          },
          get: function ($name) {
            return localStorage.getItem($name)
          },
          set: function ($name, $value) {
            return localStorage.setItem($name, $value)
          },
          remove: function($name){
            try {
              localStorage.removeItem($name)
            }catch(e){

            }
          }
        }
      }
    }])

/**
 * @doc Service
 * @name $profile
 * @description
 * Obtiene y maneja el perfil del usuario
 */
    .factory("$profile", ["$q", "$localStorage", "$log", "$state", function($q, $localStorage, $log, $state){
      var $profile = {
        logout: function(state){
          $localStorage.remove("profile");
          if(state) $state.go(state);
          return true;
        },
        login: function($userData){
          $localStorage.setJSON("profile", $userData);
          return angular.toJson($userData);
        },
        set: function(item, value){
          var profile = $localStorage.getJSON("profile");
          if(profile){
            profile[item] = value
            $localStorage.setJSON("profile", profile);
          }else{
            $log.error("No se puede setear un usuario que no existe")
          }
        },
        get: function(item, withPromise){
          if(typeof withPromise == 'undefined' || typeof withPromise == 'null') withPromise = true;
          if(withPromise) {
            var q = $q.defer();
            var profile = $localStorage.getJSON("profile");
            if (profile) {
              q.resolve(profile[item]);
            } else {
              q.reject();
              //$log.debug("No existe usuario");
            }
            return q.promise;
          }else{
            var profile = $localStorage.getJSON("profile");
            if (profile) {
              return profile[item];
            } else {
              //$log.debug("No se obtener algún usuario");
            }
          }
        },
        isLogued: function(){
          var profile = $localStorage.getJSON("profile");
          if(profile){
            return true;
          }else{
            return false;
          }
        },
        redirect: function(state){
          $state.go(state);
        }
      };
      return $profile;
    }])

/**
 * @doc Service
 * @name $policies
 * @description
 * Obtiene politicas y maneja permisos
 */
    .factory("$policies", ["POLICIES", "$profile", function(policies, $profile){
      var $policies = {
        check: function(toCheck){
          var perfiles = $profile.get("perfiles", false);
          if(!perfiles) return false;
          var check = toCheck.split(".");
          var menus = [];
          for(index in perfiles){
            var perfil = policies[perfiles[index]];
            if(typeof(perfil) == 'undefined'){
              return true;
            }else{
              menus = menus.concat(perfil[check[0]]);
            }
          }
          check.shift();
          if(menus.indexOf(check[0]) >= 0){
            return true;
          }

          return false;
        },
        get: function(toCheck){
          var perfiles = $profile.get("perfiles", false);
          if(!perfiles) return false;
          var check = toCheck.split(".");
          var items = [];
          for(index in perfiles){
            var perfil = policies[perfiles[index]];
            if(typeof(perfil) == 'undefined'){
              return true;
            }else{
              items = items.concat(perfil[check[0]]);
            }
          }
          check.shift();
          return items;
        }
      };
      return $policies;
    }])

/**
 * @doc Service
 * @name $api
 * @description
 * Request an url to endpoint
 */
    .factory("$api", ["$http", "$log", "$profile", "SERVER", function($http, $log, $profile, server){
      var logued = $profile.isLogued();
      return {
        get: function(url, data){
          var data = data || {};
          if(url.indexOf("/") == 0) url = url.substr(1);
          if(logued && !data.usuaToken && $profile.get("token", false)) data.usuaToken = $profile.get("token", false);
          $log.log(data);
          return $http.get(server.url+url, { params: data });
        },
        post: function(url, data){
          var data = data || {};
          if(url.indexOf("/") == 0) url = url.substr(1);
          if(logued && !data.usuaToken && $profile.get("token", false)) data.usuaToken = $profile.get("token", false);
          $log.log(data);
          return $http.post(server.url+url, data);
        }
      }
    }])

/**
 * @doc Service
 * @name $remote
 * @description
 * Obtiene informacion desde una url y guarda su contenido
 */
    .factory("$remote", ["$api", "$q", "$localStorage", "$timeout", function($api, $q, $localStorage, $timeout){
      return {
        update: function(name, url, data){
          var def = $q.defer();
          $api.post(url, data).success(function(res){
            try{
              def.resolve(res);
              $localStorage.setJSON(name, res);
            }catch(e){

            }
          }).error(function(err){
          });
          return def.promise;
        },
        get: function(name, url, data){
          var def = $q.defer();
          var item = $localStorage.getJSON(name);
          if(item){
            $timeout(function(){def.notify(item)}, 250);
            this.update(name, url, data).then(function (res) {
              def.resolve(res);
            });
          }else {
            this.update(name, url, data).then(function (res) {
              def.resolve(res);
            });
          }
          return def.promise;
        },
        clean: function(name){
          $localStorage.remove(name);
        }
      }
    }])
  /* Cordova Geolocation */
    .factory("$geolocation", ["$q", "$localStorage", function($q, $localStorage){
      var cacheLocation = {
        lat: 0,
        long: 0
      };
      if(typeof google != "undefined"){ var geocode = new google.maps.Geocoder(); }
      return {
        getCurrentPosition: function (options) {
          var q = $q.defer();
          var lastLocation = $localStorage.getJSON("location");
          if(lastLocation){
            q.notify(lastLocation);
          }
          navigator.geolocation.getCurrentPosition(function (result) {
            lastLocation = {
              lat: result.coords.latitude,
              long: result.coords.longitude
            };
            $localStorage.setJSON("location", lastLocation);
            q.resolve(lastLocation);
          }, function (err) {
            q.reject(err);
          }, options);
          return q.promise;
        },

        watchPosition: function (options) {
          var q = $q.defer();
          var lastLocation = $localStorage.getJSON("location");
          var watchID = navigator.geolocation.watchPosition(function (result) {
            var locationStored = $localStorage.getJSON("location");
            if(locationStored){
              q.notify(locationStored);
            }
            lastLocation = {
              lat: result.coords.latitude,
              long: result.coords.longitude
            };
            $localStorage.setJSON("location", lastLocation);
            q.notify(lastLocation);
          }, function (err) {
            q.reject(err);
          }, options);

          q.promise.cancel = function () {
            navigator.geolocation.clearWatch(watchID);
          };

          q.promise.clearWatch = function (id) {
            navigator.geolocation.clearWatch(id || watchID);
          };

          q.promise.watchID = watchID;

          return q.promise;
        },

        geocode: function(lat, long){
          var q = $q.defer();
          if(geocode) {
            geocode.geocode({'latLng': new google.maps.LatLng(lat, long)}, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                q.resolve(results[0].formatted_address);
              }
            });
          }
          return q.promise;
        },

        clearWatch: function (watchID) {
          return navigator.geolocation.clearWatch(watchID);
        }
      };
    }])

  /* Cordova Camera */
    .factory('$cordovaCamera', ['$q', function ($q) {

      return {
        getPicture: function (options) {
          var q = $q.defer();

          if (!navigator.camera) {
            q.resolve(null);
            return q.promise;
          }

          navigator.camera.getPicture(function (imageData) {
            q.resolve(imageData);
          }, function (err) {
            q.reject(err);
          }, options);

          return q.promise;
        },

        cleanup: function () {
          var q = $q.defer();

          navigator.camera.cleanup(function () {
            q.resolve();
          }, function (err) {
            q.reject(err);
          });

          return q.promise;
        }
      };
    }])

/**
 * @doc Service
 * @name $toast
 * @description
 * Extiende de $ionicLoading, para timeout y otros agregados
 */
    .factory('$toast', ["$setting", "$log", "$ionicLoading", "$localization", "$timeout", function ($setting, $log, $ionicLoading, $localization, $timeout) {
      var _loading_icon = '<ion-spinner icon="ios"></ion-spinner><br/>';
      var _process_icon = '<ion-spinner icon="ripple"></ion-spinner><br/>';
      var _sending_icon = '<ion-spinner icon="ios"></ion-spinner></i><br/>';

      function show(text, interval){
        if(text){
          _show(text);
        }else{
          _show($localization.get("main.LOADING_TEXT"));
        }

        if(!interval){
          interval = $setting.get("toastTime");
        }

        if(interval>0){
          $timeout(function(){
            hide()
          }, interval);
        }
      }

      function loading(text){
        _show(_loading_icon + (text ? text : $localization.get("main.LOADING_TEXT")));
      }

      function process(text){
        _show(_process_icon + (text ? text : $localization.get("main.PROCESSING_TEXT")));
      }

      function sending(text){
        _show(_sending_icon + (text ? text : $localization.get("main.SENDING_TEXT")));
      }

      function _show(text){
        var cfg = text ? {template: text} : null;

        $ionicLoading.show(cfg);
      }

      function hide(){
        $ionicLoading.hide();
      }

      return {
        show: show,
        loading: loading,
        process: process,
        sending: sending,
        hide: hide
      }

    }])
    ;