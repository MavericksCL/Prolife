/*
  █████╗ ██╗      ██████╗ ██╗   ██╗██╗███╗   ███╗   ██╗ ██████╗
 ██╔══██╗██║     ██╔═══██╗██║   ██║██║████╗ ████║   ██║██╔═══██╗
 ███████║██║     ██║   ██║██║   ██║██║██╔████╔██║   ██║██║   ██║
 ██╔══██║██║     ██║▄▄ ██║██║   ██║██║██║╚██╔╝██║   ██║██║   ██║
 ██║  ██║███████╗╚██████╔╝╚██████╔╝██║██║ ╚═╝ ██║██╗██║╚██████╔╝
 ╚═╝  ╚═╝╚══════╝ ╚══▀▀═╝  ╚═════╝ ╚═╝╚═╝     ╚═╝╚═╝╚═╝ ╚═════╝
 Project: ProLife (Ex Recalcine)
 Version: 1.2.0
 ----------------------------------
 Desarrollado por AlquimIO | 2015  */

angular.module('Recalcine', ['ionic','ngCordova', 'lbServices', 'Recalcine.controllers', 'Recalcine.directives', 'Recalcine.services', 'ngIOS9UIWebViewPatch'/*'ngMockE2E'*/])


	.constant("SERVER", {
		"url": "http://recalcine.cloudapp.net:3000/api",
		"port": "80"
	})

	.constant("MENU", [])

	.constant("POLICIES", {
	})

	.constant("LOCALE", {
		"MESSAGE": {
			"LOGIN_FAILED": "Error de usuario o contraseña",
			"LOGIN_CORRECT": "Ingreso correcto",
			"SENDING": "Enviando...",
			"SAVING": "Enviando...",
			"LOADING": "Cargando...",
			"ERROR_PROCESSING": "Error al procesar",
			"DELETE_SUCCESS": "Se borró correctamente",
			"DELETE_ERROR": "Error durante el borrado",
			"ADD_SUCCESS": "Agregado Correctamente",
			"UPDATE_SUCCESS": "Editado Correctamente",
			"UPDATE_ERROR": "Error al intentar editar",
			"EDIT_SUCCESS": "Editado Correctamente",
			"ALREADY_EXIST": "Ya existe el medicamento",
			"CANCEL": "Cancelar",
			"ADD": "Agregar",
			"ACCEPT": "Aceptar",
			"SAVE": "Guardar",
			"SEARCHING": "Buscando...",
			"USER_CREATED": "Usuario creado correctamente",
			"FORM_ERROR": "Error en los datos ingresados",
			"USERNAME_OR_EMAIL_EXIST": "El usuario o email ya existen",
			"GEOLOCALING": "Geolocalizando...",
			"GEOLOCATED": "Geolocalizado",
			"NO_GEOLOCATED": "No se pudo geolocalizarte"
		},
		"LOGOUT": {
			"CONFIRM_TITLE": "Cerrar sesión",
			"CONFIRM_CONTENT": "¿Estás seguro?",
			"CONFIRM_CANCEL": "Cancelar",
			"CONFIRM_OK": "Aceptar"
		},
		"START": {
			"LOGIN": "Ingresar",
			"REGISTER": "Registrarse"
		},
		"LOGIN": {
			"TITLE": "Ingreso",
			"USERNAME": "Nombre de usuario",
			"PASSWORD": "Contraseña",
			"EMAIL": "Correo electrónico",
			"LOGIN": "Iniciar sesión",
			"RECOVERY": "Recuperar contraseña"
		},
		"RECOVERY": {
			"TITLE": "RESTABLECER CONTRASEÑA",
			"INFO": "Ingresa el correo electrónico asociado a tu cuenta.",
			"EMAIL": "E-mail",
			"RECOVERY": "Restablecer",
			"CORRECT": "Hemos enviado un correo electrónico con las instrucciones para crear una nueva clave de acceso.",
			"AGAIN": "No he recibido el correo electrónico"
		},
		"REGISTER": {
			"TITLE": "Registro",
			"USERNAME": "Nombre de usuario",
			"EMAIL": "Email",
			"PASSWORD": "Contraseña",
			"NEXT": "Siguiente",
			"REMOVE": "Borrar",
			"DIAGNOSIS": "Diagnóstico",
			"MEDICINE": "Medicamento",
			"OK": "OK",
			"SKIP": "Omitir",
			"ACCEPT": "Aceptar",
			"ADD_RECALCINE": "Agregar medicamento Recalcine",
			"ADD_OTHER": "Agregar otro medicamento",
			"ADD": "Agregar",
			"NAME_MEDICINE": "Nombre del medicamento",
			"TERMS": {
				"TITLE": "Términos y Condiciones",
				"SUBTITLE": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
				"CONTENT": ""
			}
		},
		"HOME": {
			"LOGOUT": "Desconectar"
		},
		"OTHER": {
			"CONTACT": {
				"LIST": {
					"TITLE": "Contactos"
				}
			},
			"MEDICINE": {
				"LIST": {
					"TITLE": "Medicamentos"
				},
				"ADD": {
					"TITLE": "Agregar Medicamento"
				},
				"EDIT": {
					"TITLE": "Editar Medicamento"
				}
			},
			"PROFILE": {
				"EDIT": {
					"TITLE": "Editar Perfil"
				}
			}
		},
		"MAIN": {
			"TITLE": "Cargando...",
			"TABS": {
				"EMERGENCY": "Emergencia",
				"SEARCH": " Buscar",
				"ALARM": "Recordatorio"
			},
			"SIDEMENU": {
				"ALERT_MEDICINE": "Alerta Medicamento",
				"ALERT_STOCK": "Alerta Stock",
				"EDIT_CONTACTS": "Editar Contactos",
				"EDIT_MEDICINES": "Editar Medicamentos",
				"LOGOUT": "Cerrar sesión"
			},
			"PROFILE": {
				"NAME": "Nombre",
				"LASTNAME": "Apellido",
				"EMAIL": "E-mail",
				"IMAGE": "Imágen",
				"DIAGNOSIS": "Diagnóstico"
			},
			"EMERGENCY": {
				"HOME": {
					"TITLE": "Emergencia",
					"ADD": "Agrega contactos <br />de emergencia",
					"NOTIFY": "Notificar a todos <br/>mis Contactos"
				},
				"ADD": {
					"TITLE": "Agregar Contacto"
				},
				"EDIT": {
					"TITLE": "Editar Contacto",
					"REMOVE": "Eliminar Contacto"
				},
				"PROGRESS": {
					"TITLE": "Emergecia Activa",
					"CONTACTING": "CONTACTANDO A",
					"ERROR": "No existe contactos"
				},
				"CONTACT_NAME": "Nombre Contacto",
				"CONTACT_KIND": {
					"NONE": "Tipo de Contacto",
					"CHILD": "Hijo/a"
				},
				"CONTACT_PHONE": "Teléfono",
				"CONTACT_NOTIFY": "Notificar vía"
			},
			"MEDICINE": {
				"HOME": {
					"TITLE": "Medicamentos"
				},
				"SEARCH": {
					"TITLE": "Buscar"
				}
			},
			"ALARM": {
				"HOME": {
					"TITLE": "Recordatorio",
					"ADD": "Agrega Medicamentos"
				},
				"ADD": {
					"TITLE": "Ingresar Medicamento"
				},
				"EDIT": {
					"TITLE": "Editar Medicamento",
					"REMOVE": "Eliminar Medicamento"
				},
				"MEDICINES": {
					"NO_RECALCINE": "No Recalcine",
					"OTHER": "Otro",
					"TITLE_RECALCINE": "Medicamento Recalcine"
				},
				"MEDICINE": "Medicamento",
				"KIND": "Forma Farmacéutica",
				"DOSIS": "Dosis",
				"FREQUENCY": "Frecuencia",
				"QUANTITY": "Cantidad total envase",
				"INIT_HOUR": "Hora de Inicio"
			}
		}
	})

	.constant("SETTINGS", {
		"toastTime": 2500,
		"debug": true,
		"debugvisible": true
	})

	.run(function(SERVER, SETTINGS, $rootScope, $q, $ionicHistory ,$cordovaSplashscreen, $timeout, $ionicPlatform, $ionicSideMenuDelegate, $geolocation, $location, $toast, $localization, $profile, $state, $policies, $interval, $localStorage, $cordovaDialogs, $cordovaLocalNotification, $cordovaNetwork, LoopBackAuth) {
		$ionicPlatform.ready(function() {
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				StatusBar.styleLightContent();
			}
			if (window.plugin && window.plugin.notification) {
				window.plugin.notification.local.setDefaults({
					autoCancel: true
				});

				if (window.device && window.device.platform === 'iOS') {
					window.plugin.notification.local.registerPermission();
				}

				window.plugin.notification.local.on('click', function (notification) {
					$timeout(function () {
						$rootScope.$broadcast('cordovaLocalNotification:click', notification);
					});
				});

				window.plugin.notification.local.on('trigger', function (notification) {
					$timeout(function () {
						$rootScope.$broadcast('cordovaLocalNotification:trigger', notification);
					});
				});
			}
			$timeout(function(){
				$cordovaSplashscreen.hide();
			}, 2000)

			document.addEventListener("pause", function() {
				$rootScope.$broadcast("$lifecycle:pause")
			});
			document.addEventListener("resume", function() {
				$rootScope.$broadcast("$lifecycle:resume")
			});
		});

		$rootScope.debug_visible = SETTINGS.debugvisible;

		var interval = $interval(function(){
			if($cordovaNetwork.isOnline() && typeof google != "undefined"){
				var jsElm = document.createElement("script");
				// set the type attribute
				jsElm.type = "application/javascript";
				// make the script element load file
				jsElm.src = "http://maps.google.com/maps/api/js?sensor=false&language=en";
				// finally insert the element to the body element in order to load the script
				document.body.appendChild(jsElm);
				$interval.cancel(interval);
			}
		}, 500);


		// Check if logued in
		var path = $location.path();
		var logued = $profile.isLogued();
		var kind = $profile.get("kind", false);

		$rootScope.$on("$stateChangeSuccess", function(e, t, ta, f, fa){
			$rootScope.state = t;
			var welcome = $localStorage.get("welcome");
			logued = $profile.isLogued();
			var kind = $profile.get("kind", false);
			try{
				$ionicSideMenuDelegate.toggleLeft(false);
			}catch(e){

			}
			if (logued) {
				if (t.name == "start.main" || t.name == "start.login" || t.name == "start.recovery" || t.name == "start.step-a" || t.name == "start.step-b"
					|| t.name == "start.step-b" || t.name == "start.list-medicine" || t.name == "start.recalcine-medicine" || t.name == "start.other-medicine") {
					if(welcome !== false || welcome != 'false'){
						$location.path("/main/dash/home");
						$state.go("main.dash.home");
					}else {
						$location.path("/welcome/a");
						$state.go("welcome.a");
					}
				}
				if (t.name == 'main.dash.home' || t.name == 'main.search.home' || t.name == 'main.alarm.home' ){
					if(welcome !== false && welcome != 'false'){
						$location.path("/welcome/a");
						$state.go("welcome.a");
					}
					$rootScope.tabItemHide = false;
				}else{
					$rootScope.tabItemHide = true;
				}
				$rootScope.setting = $localStorage.getJSON("setting", false) || {
						alert_m: true,
						alert_s: true
					};
				$localStorage.setJSON("setting", $rootScope.setting);
			} else {
				var exist = $rootScope.register;
				if(exist) exist = $rootScope.register.username || $rootScope.register.email || $rootScope.register.password;
				if(t.name == "start.step-b"){
					if(!exist){
						$location.path("/start/step-a");
						$state.go("start.step-a");
						return;
					}
				}
				if(t.name == "start.step-c"){
					if(!exist){
						$location.path("/start/step-a");
						$state.go("start.step-a");
						return;
					}
				}
				if(t.name == "start.list-medicine"){
					if(!exist){
						$location.path("/start/step-a");
						$state.go("start.step-a");
						return;
					}
				}
				if(t.name == "start.recalcine-medicine"){
					if(!exist){
						$location.path("/start/step-a");
						$state.go("start.step-a");
						return;
					}
				}
				if(t.name == "start.other-medicine"){
					if(!exist){
						$location.path("/start/step-a");
						$state.go("start.step-a");
						return;
					}
				}
				if (t.name != "start.main" && t.name != "start.login" && t.name != "start.recovery" && t.name != "start.step-a" && t.name != "start.step-b"
					&& t.name != "start.step-c" && t.name != "start.list-medicine" && t.name != "start.recalcine-medicine" && t.name != "start.other-medicine") {
					$location.path("/start/main");
					$state.go("start.main");
				}
			}
		});
		// Utils
		$rootScope.logout = function(){
			$cordovaDialogs.confirm(
				$localization.get("LOGOUT.CONFIRM_TITLE"),
				$localization.get("LOGOUT.CONFIRM_CONTENT"), [$localization.get("LOGOUT.CONFIRM_CANCEL"),$localization.get("LOGOUT.CONFIRM_OK")])
				.then(function(buttonIndex) {
					// no button = 0, 'OK' = 1, 'Cancel' = 2
					var btnIndex = buttonIndex;
					if(btnIndex == 2){
						$profile.logout();
						$rootScope.user = undefined;
						$rootScope.contacts = [];
						$rootScope.alarmMedicine = {};
						$rootScope.myMedicines = [];
						$rootScope.alarms = [];
						$rootScope.recordatorios = [];
						$localStorage.remove("contacts");
						$localStorage.remove("welcome");
						$localStorage.remove("alarms");
						$localStorage.remove("setting");
						$localStorage.remove("settingSave");
						$localStorage.remove("recordatorios");
						$localStorage.remove("medicines");
						$localStorage.remove("$LoopBack$accessTokenId");
						$localStorage.remove("$LoopBack$currentUserId");
						LoopBackAuth.clearUser();
						try {
							$rootScope.setting.alert_m = false;
							$rootScope.setting.alert_s = false;
						}catch(e){}
						try {
							$cordovaLocalNotification.clearAll();
							$cordovaLocalNotification.cancelAll();
						}catch(e){}
						$profile.redirect("start.main");
					}
				});
		};
		$rootScope.policies = function(base, id){
			return $policies.check(base+"."+id);
		};

		$rootScope.toggleLeft = function(isOpen) {
			if(typeof isOpen != 'undefined'){
				$ionicSideMenuDelegate.toggleLeft(isOpen);
			}else{
				$ionicSideMenuDelegate.toggleLeft();
			}
		};

		$rootScope.setNotification = function(kind, minutes){
			minutes = minutes || 5;
			var defer = $q.defer();
			var alarms = $localStorage.getJSON('alarms', false);
			var notifiesSaved = [];
			var notifications = [];
			var start = 0;
			var rightNow = new Date();
			_.defer(function(){
				if (kind == 'alarms') {
					$rootScope.removeNotification("alarms");
					if($rootScope.setting.alert_m) {
						alarms = _.filter(alarms, function (o) {
							var time = new Date(o.time);
							var now = new Date();
							return time >= now;
						});
						if( notifiesSaved.length > 0) {
							start = notifiesSaved[notifiesSaved.length - 1].id || 0;
						}else{
							start = 0;
						}
						_.forEach(alarms, function (v, k) {
							var h = new Date(v.time);
							h.setMinutes(h.getMinutes() - minutes);
							var index = _.findIndex(notifiesSaved, {
								title: 'Recuerda tomar ' + v.medicine,
								firstAt: h.toISOString()
							});
							if(index < 0) {
								if(h.getTime() > rightNow.getTime()) {
									notifications.push({
										id: parseInt(_.uniqueId()) + parseInt(start),
										title: 'Recuerda tomar ' + v.medicine,
										text: 'Aún te quedan ' + new Number(v.pre),
										at: h,
										data: {kind: 'medicine', idAlarm: v.idAlarm}
									});
								}
							}
							if(k == (alarms.length-1)){
								try {
									var notis = angular.copy(notifiesSaved);
									notis.push(notifications);
									notis = _.flattenDeep(notis);
									$cordovaLocalNotification.schedule(notifications);
								} catch (e) {
									throw "No se pudieron agregar las notificaciones.";
								}
							}
						});
					}
				}
				if (kind == 'stock') {
					$rootScope.removeNotification("stock");
					if($rootScope.setting.alert_s) {
						alarms = _.filter(alarms, function (o) {
							var time = new Date(o.time);
							var now = new Date();
							return time >= now;
						});
						if( notifiesSaved.length > 0) {
							start = notifiesSaved[notifiesSaved.length - 1].id || 0;
						}else{
							start = 0;
						}
						_.forEach(alarms, function(v, k){
							var h = new Date(v.time);
							h.setMinutes(h.getMinutes());
							if(v.pre <= 5) {
								var index = _.findIndex(notifiesSaved, {
									title: 'Alerta de Stock: ' + v.medicine,
									text: 'Te quedan ' + new Number(v.pre) + " comprimidos",
									firstAt: h.toISOString()
								});
								if(index < 0) {
									if(h.getTime() > rightNow.getTime()) {
										notifications.push({
											id: parseInt(_.uniqueId()) + parseInt(start),
											title: 'Alerta de Stock: ' + v.medicine,
											text: 'Te quedan ' + new Number(v.pre) + " comprimidos",
											at: h,
											data: {kind: 'stock', idAlarm: v.idAlarm}
										})
									}
								}
							}
							if(k == (alarms.length-1)){
								try {
									var notis = angular.copy(notifiesSaved);
									notis.push(notifications);
									notis = _.flattenDeep(notis);
									$localStorage.setJSON("notifications", notis, false);
									$cordovaLocalNotification.schedule(notifications);
								} catch (e) {
									throw "No se pudieron agregar las notificaciones.";
								}
							}
						});

					}
				}
			});
			return defer.promise;
		};
		$rootScope.removeNotification = function(kind){
			var notifies = $localStorage.getJSON("notifications", false);
			var defer = $q.defer();
			try{
				if(kind == 'alarms') {
					cordova.plugins.notification.local.getScheduled(function (notifications) {
						var notis = _.filter(notifications, function (o) {
							var data = angular.fromJson(o.data);
							return data.kind == 'medicine';
						});
						var clear = [];
						_.forEach(notis, function(v){
							clear.push(v.id);
						});
						console.group("Clear");
						console.log(clear);
						console.groupEnd();
						$cordovaLocalNotification.clear(clear, function () {
						});
						$cordovaLocalNotification.cancel(clear, function () {
						});
					});
				}
				if(kind == 'stock') {
					cordova.plugins.notification.local.getScheduled(function (notifications) {
						var notis = _.filter(notifications, function (o) {
							var data = angular.fromJson(o.data);
							return data.kind == 'stock';
						});
						var clear = [];
						_.forEach(notis, function(v){
							clear.push(v.id);
						});
						console.group("Clear");
						console.log(clear);
						console.groupEnd();
						$cordovaLocalNotification.clear(clear, function () {
						});
						$cordovaLocalNotification.cancel(clear, function () {
						});
					});
				}
			}catch(e){
				//$localStorage.setJSON("notifications", notisLeft, false);
			}
			return defer.promise;
		};

		$rootScope.generateNumber = function(i){
			return new Array(i);
		};

		$rootScope.back = function(i){
			$ionicHistory.goBack(i || -1);
		};

		$rootScope.$watch('setting', function(n, o){
			if(n) {
				if (n.alert_m) {
					try {
						$rootScope.setNotification('alarms');
					}catch(e){
						$rootScope.setting.alert_m = false;
					}
				}else{
					$rootScope.removeNotification('alarms');
				}
			//
				if (n.alert_s){
					try {
						$rootScope.setNotification('stock');
					}catch(e){
						$rootScope.setting.alert_s = false;
					}
				}else{
					$rootScope.removeNotification('stock');
				}
			}
		}, true);

		$interval(function(){
			logued = $profile.isLogued();
			if(logued){
				$rootScope.setNotification('stock');
				$rootScope.setNotification('alarms');
			}else{

			}
		}, 60000*24);


		$rootScope.$on('$cordovaLocalNotification:click',
			function (event, notification, state) {
				$rootScope.notificationActives = $rootScope.notificationActives || [];
				var data = angular.fromJson(notification.data);
				if($rootScope.notificationActives.indexOf(notification.id) == -1) {
					if (data.kind == "medicine") {
						$state.go("main.alarm.home");
						$location.path("/main/alarm/home");
						$rootScope.openState = "main.alarm.home";
					}
					if (data.kind == "stock") {
						$state.go("main.search.home");
						$location.path("/main/search/home");
						$rootScope.openState = "main.search.home";
					}
					$rootScope.notificationActives.push(notification.id);
				}
			});
	})

	.filter('locale', ["LOCALE", "$interpolate", "$sce", function(locale, $interpolate, $sce) {
		return function(input, object, kind) {
			var name = input || '';
			var out = "";
			try {
				if (typeof name == 'string') {
					var names = name.split('.');
					var now = 0;
					var locales = locale;
					while (names.length > 0) {
						locales = locales[names[0]];
						now++;
						names.shift();
					}
					out = locales;
				}
			}catch(e){
				out = name;
			}
			if(typeof out == 'undefined') out = name;
			if(kind == "html") out = $sce.getTrustedHtml(out);
			out = $interpolate(out, false, false, false);
			if(typeof object == "string"){
				object = object.replace(/'/g, '"');
				object = angular.fromJson(object);
			}
			if(kind == "html") {
				return $sce.getTrustedHtml(out(object || {}));
			}else{
				return out(object || {});
			}
		};
	}])

	.filter('capitalize', function() {
		return function(input, all) {
			return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
		}
	})

	.filter('begin', function(){
		return function(input, number) {
			return _.filter(input, function(o, i){
				if(i >= number){
					return true;
				}else{
					return false;
				}
			})
		}
	})

	.config(function(LoopBackResourceProvider, SERVER) {

		// Use a custom auth header instead of the default 'Authorization'
		LoopBackResourceProvider.setAuthHeader('X-Access-Token');

		// Change the URL where to access the LoopBack REST API server
		LoopBackResourceProvider.setUrlBase(SERVER.url);
	})

	.config(function($ionicConfigProvider){
		$ionicConfigProvider.backButton.previousTitleText(false);
		$ionicConfigProvider.backButton.text('');
		$ionicConfigProvider.views.swipeBackEnabled(false);
	})

	.config(function($animateProvider){
		$animateProvider.classNameFilter(/^(?:(?!no-anim).)*$/);
	})

	.config(function($ionicConfigProvider) {
		$ionicConfigProvider.tabs.position('bottom');
		$ionicConfigProvider.platform.android.navBar.alignTitle('center');
		$ionicConfigProvider.platform.android.views.transition('android');
	})

	.config(function($stateProvider, $urlRouterProvider) {

	  // Ionic uses AngularUI Router which uses the concept of states
	  // Learn more here: https://github.com/angular-ui/ui-router
	  // Set up the various states which the app can be in.
	  // Each state's controller can be found in controllers.js
	  $stateProvider
	      .state('start', {
			  url: '/start',
			  abstract: true,
			  templateUrl: 'templates/start/layout.html'
		  })
		  .state('start.main', {
			  url: '/main',
			  views: {
				  'main': {
					  templateUrl: 'templates/start/main.html',
					  controller: 'StartMainCtrl'
				  }
			  }
		  })
		  .state('start.login', {
			  url: '/login',
			  views: {
				  'main': {
					  templateUrl: 'templates/start/login.html',
					  controller: 'StartLoginCtrl'
				  }
			  }
		  })
		  .state('start.recovery', {
			  url: '/recovery',
			  views: {
				  'main': {
					  templateUrl: 'templates/start/recovery.html',
					  controller: 'StartRecoveryCtrl'
				  }
			  }
		  })
		  .state('start.step-a', {
			  url: '/step-a',
			  views: {
				  'main': {
					  templateUrl: 'templates/start/register.step-a.html',
					  controller: 'StartRegisterStepACtrl'
				  }
			  }
		  })
		  .state('start.step-b', {
			  url: '/step-b',
			  views: {
				  'main': {
					  templateUrl: 'templates/start/register.step-b.html',
					  controller: 'StartRegisterStepBCtrl'
				  }
			  }
		  })
		  .state('start.list-medicine', {
			  url: '/list-medicine',
			  views: {
				  'main': {
					  templateUrl: 'templates/start/register.list-medicine.html',
					  controller: 'StartRegisterListMedicineCtrl'
				  }
			  }
		  })
		  .state('start.recalcine-medicine', {
			  url: '/recalcine-medicine',
			  views: {
				  'main': {
					  templateUrl: 'templates/start/register.recalcine-medicine.html',
					  controller: 'StartRegisterRecalcineMedicineCtrl'
				  }
			  }
		  })
		  .state('start.other-medicine', {
			  url: '/other-medicine',
			  views: {
				  'main': {
					  templateUrl: 'templates/start/register.other-medicine.html',
					  controller: 'StartRegisterOtherMedicineCtrl'
				  }
			  }
		  })
		  .state('start.step-c', {
			  url: '/step-c',
			  views: {
				  'main': {
					  templateUrl: 'templates/start/register.step-c.html',
					  controller: 'StartRegisterStepCCtrl'
				  }
			  }
		  })
		  .state('others', {
			  url: '/others',
			  abstract: true,
			  templateUrl: 'templates/others/layout.html'
		  })
		  .state('others.contactlist', {
			  url: '/contactlist',
			  views: {
				  'main': {
					  templateUrl: 'templates/others/contactlist.html',
					  controller: 'TabDashListCtrl'
				  }
			  }
		  })
		  .state('others.contactedit', {
			  url: '/contactedit/:phone',
			  views: {
				  'main': {
					  templateUrl: 'templates/main/tab.dash.edit.html',
					  controller: 'TabDashEditCtrl'
				  }
			  }
		  })
		  .state('others.medicinelist', {
			  url: '/medicinelist',
			  views: {
				  'main': {
					  templateUrl: 'templates/others/medicinelist.html',
					  controller: 'TabDashMedicineListCtrl'
				  }
			  }
		  })
		  .state('others.medicineedit', {
			  url: '/medicineedit/:id',
			  views: {
				  'main': {
					  templateUrl: 'templates/others/medicineedit.html',
					  controller: 'TabDashMedicineEditCtrl'
				  }
			  }
		  })
		  .state('others.medicineadd', {
			  url: '/medicineadd',
			  views: {
				  'main': {
					  templateUrl: 'templates/others/medicineadd.html',
					  controller: 'TabDashMedicineAddCtrl'
				  }
			  }
		  })
		  .state('others.profileedit', {
			  url: '/profileedit',
			  views: {
				  'main': {
					  templateUrl: 'templates/others/profileedit.html',
					  controller: 'TabDashProfileEditCtrl'
				  }
			  }
		  })
		  .state('main', {
			  url: '/main',
			  abstract: true,
			  templateUrl: 'templates/main/tabs.html'
		  })
		  .state('main.dash', {
			  url: '/dash',
			  abstract: true,
			  views: {
				  'tab-dash': {
					  templateUrl: 'templates/main/tab.dash.html'
				  }
			  }
		  })
		  .state('main.search', {
			  url: '/search',
			  abstract: true,
			  views: {
				  'tab-search': {
					  templateUrl: 'templates/main/tab.search.html'
				  }
			  }
		  })
		  .state('main.alarm', {
			  url: '/alarm',
			  abstract: true,
			  views: {
				  'tab-alarm': {
					  templateUrl: 'templates/main/tab.alarm.html'
				  }
			  }
		  })
		  .state('main.dash.home', {
			  url: '/home',
			  templateUrl: 'templates/main/tab.dash.home.html',
			  controller: 'TabDashHomeCtrl'
		  })
		  .state('main.dash.add', {
			  url: '/add',
			  templateUrl: 'templates/main/tab.dash.add.html',
			  controller: 'TabDashAddCtrl'
		  })
		  .state('main.dash.edit', {
			  url: '/edit',
			  templateUrl: 'templates/main/tab.dash.edit.html',
			  controller: 'TabDashEditCtrl'
		  })
		  .state('main.dash.active', {
			  url: '/active/?:phone',
			  templateUrl: 'templates/main/tab.dash.active.html',
			  controller: 'TabDashActiveCtrl'
		  })
		  .state('main.search.home', {
			  url: '/home',
			  templateUrl: 'templates/main/tab.search.home.html',
			  controller: 'TabSearchHomeCtrl'
		  })
		  .state('main.search.view', {
			  url: '/view/:id',
			  templateUrl: 'templates/main/tab.search.view.html',
			  controller: 'TabSearchViewCtrl'
		  })
		  .state('main.search.do', {
			  url: '/do',
			  templateUrl: 'templates/main/tab.search.do.html',
			  controller: 'TabSearchDoCtrl'
		  })
		  .state('main.alarm.home', {
			  url: '/home',
			  templateUrl: 'templates/main/tab.alarm.home.html',
			  controller: 'TabAlarmHomeCtrl'
		  })
		  .state('main.alarm.add', {
			  url: '/add',
			  templateUrl: 'templates/main/tab.alarm.add.html',
			  controller: 'TabAlarmAddCtrl'
		  })
		  .state('main.alarm.edit', {
			  url: '/edit/:token',
			  templateUrl: 'templates/main/tab.alarm.edit.html',
			  controller: 'TabAlarmEditCtrl'
		  })
		  .state('main.alarm.medicines', {
			  url: '/medicines',
			  templateUrl: 'templates/main/tab.alarm.medicines.html',
			  controller: 'TabAlarmMedicinesCtrl'
		  })
		  .state('main.alarm.recalcinemedicines', {
			  url: '/recalcinemedicines',
			  templateUrl: 'templates/main/tab.alarm.medicines.recalcines.html',
			  controller: 'TabAlarmMedicinesRecalcineCtrl'
		  })
		  .state('welcome', {
			  url: '/welcome',
			  abstract: true,
			  templateUrl: 'templates/welcome/step.layout.html',
			  controller: 'WelcomeCtrl'
		  })
		  .state('welcome.a', {
			  url: '/a',
			  templateUrl: 'templates/welcome/step.a.html'
		  })
		  .state('welcome.b', {
			  url: '/b',
			  templateUrl: 'templates/welcome/step.b.html'
		  })
		  .state('welcome.c', {
			  url: '/c',
			  templateUrl: 'templates/welcome/step.c.html'
		  })
	  ;
	  $urlRouterProvider.otherwise('/start/main');

	});
