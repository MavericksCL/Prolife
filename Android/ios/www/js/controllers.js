angular.module('Recalcine.controllers', [])

	.controller('StartMainCtrl', function($scope){
		$scope.ready = true;

	})
	.controller('StartRecoveryCtrl', function($scope, $toast, $localization, Usuario){
		$scope.sended = false;
		$scope.recover = {
			email: ''
		};
		$scope.recoveryAgain = function(){
			$scope.sended = false;
		};
		$scope.doRecovery = function(form){
			$toast.loading($localization.get("MESSAGE.SENDING"));
			Usuario.resetPassword({email: $scope.recover.email}, function(res){
				$toast.hide();
				if(res.response.code == "RESET_REQ_ERROR"){
					$toast.show("El email ingresado no existe");
				}
				if(res.response.code == "RESET_REQ_SUCC"){
					$toast.show("Un email fue enviado");
					$scope.sended = true;
				}
			});
		}
	})
	.controller('StartLoginCtrl', function($cordovaNetwork, $rootScope, $scope, $toast, $profile, $state, $localStorage, $localization, $log, Usuario, MedicamentoUsuario, Recordatorio, Configuracion){
		$scope.doLogin = function(form){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$toast.loading($localization.get("MESSAGE.SENDING"));
			Usuario.login({email: form.email, password: form.password, rememberMe: true}, function(res){
				$profile.login({user: res.user, token: res.id, id: res.userId});
				$localStorage.set("welcome", false);
				$rootScope.user = {
					name: res.user.nombre,
					lastname: res.user.apellidos,
					email: res.user.email,
					imagen: res.user.imagen,
					username: res.user.username
				};
				$rootScope.contacts = res.user.contactos;
				$localStorage.setJSON("contacts", $rootScope.contacts, false);
				MedicamentoUsuario.find({filter: {where: {usuarioId: res.userId}, include: {relation: "medicamento"}}}).$promise.then(function(red) {
					var medicines = [];
					_.forEach(red, function (v) {
						var medicine = v.medicamento;
						medicine.idRelation = v.id;
						medicines.push(medicine)
					});
					$rootScope.myMedicines = medicines;
					$localStorage.setJSON("medicines", medicines, false);
					Recordatorio.find({filter: {include: {relation: "medicamento"}, where: {usuarioId: $profile.get('id', false)}}}).$promise.then(function(rec){
						_.forEach(rec, function(v, k){
							rec[k] = v;
							rec[k].nombre = v.medicamento.nombre;
							delete rec[k].medicamento;
						});
						$localStorage.setJSON("recordatorios", rec, false);
						$rootScope.recordatorios = rec;
						Configuracion.find({usuarioId: res.userId}).$promise.then(function(res){
							if(res.length > 0){
								$rootScope.setting = {
										alert_m: res[0].alertaMedicamento,
										alert_s: res[0].alertaStock
									};
								$localStorage.setJSON("setting", $rootScope.setting);
								$localStorage.setJSON("settingSave", res[0], false);
							}else {
								$localStorage.setJSON("setting", {
									alert_m: false,
									alert_s: false
								});
							}
							$toast.show($localization.get("MESSAGE.LOGIN_CORRECT"), 1500);
							$state.go("main.dash.home");
							$scope.$broadcast('scroll.refreshComplete');
						});
					}, function(){
						$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
						$scope.$broadcast('scroll.refreshComplete');
					});

				});
			}, function(res){
				$toast.show($localization.get("MESSAGE."+(res.data.error.code || "LOGIN_FAILED")), 1500)
			});
		}
	})
	.controller('StartRegisterStepACtrl', function($rootScope, $scope, $state, $toast, $localization, Usuario, Medicamento){
		$rootScope.register = $rootScope.register || {};
		$rootScope.medicines = Medicamento.find({filter : {where: {recalcine: true}}});
		$scope.setForm = function(form){
			if(form.username && form.email && form.password){
				$rootScope.register.username = form.username;
				$rootScope.register.email = form.email;
				$rootScope.register.password = form.password;
			}else {
				$toast.show($localization.get("MESSAGE.FORM_ERROR"));
			}
			return false;
		};
		$scope.next = function(form){
			$scope.setForm(form);
			$toast.loading($localization.get("MESSAGE.LOADING"));
			Usuario.verificar({username: form.username, email: form.email}, function(res){
				var message = "";
				$toast.hide();
				if(res.response.existeEmail){
					message += "El email ingresado ya existe <br />";
				}
				if(res.response.existeUsername){
					message += "El usuario ingresado ya existe";
				}
				if(res.response.existeEmail || res.existeUsername){
					$toast.show(message);
				}else{
					$state.go("start.step-b");
				}
			});
		}
	})
	.controller('StartRegisterStepBCtrl', function($rootScope, $scope, $state, $toast, $localization){
		$rootScope.register = $rootScope.register || {};
		$scope.omit = function(){
			/* Borrar la data de medicina */
			$rootScope.register.medicines = [];
			$rootScope.register.customMedicines = [];
			$rootScope.register.diagnosis = "";
			/* Ir al paso 3 */
			$state.go("start.step-c");
		};
		$scope.next = function(form){
			/* Go to next step */
			$rootScope.register.diagnosis = form.diagnosis;
			$state.go("start.step-c");
		}
	})
	.controller('StartRegisterListMedicineCtrl', function($rootScope, $scope, $toast, $localization, $state){
		$rootScope.register = $rootScope.register || {};
		$scope.delete = function(medicine){
			$rootScope.register.medicines = $rootScope.register.medicines || [];
			var index = $rootScope.register.medicines.indexOf(medicine);
			if( index >= 0 ) {
				$rootScope.register.medicines.splice(index, 1);
				$toast.show($localization.get("MESSAGE.DELETE_SUCCESS"), 1000);
			}else{
				$toast.show($localization.get("MESSAGE.DELETE_ERROR"), 500);
			}
		};
		$scope.omit = function(){
			/* Borrar la data de medicina */
			$rootScope.register.medicines = [];
			$rootScope.register.customMedicines = [];
			$rootScope.register.diagnosis = "";
			/* Ir al paso 3 */
			$state.go("start.step-c");
		};
	})
	.controller('StartRegisterRecalcineMedicineCtrl', function($rootScope, $scope, $localization, $toast, $state){
		$rootScope.register = $rootScope.register || {};
		$scope.search = {filter: ''};
		$scope.existMedicine = function(medicine){
			$rootScope.register.medicines = $rootScope.register.medicines || [];
			var indexMedicine = _.findIndex($rootScope.register.medicines, {id: medicine.id});
			return !(indexMedicine < 0)
		};
		/*{ id: "55be9c9b675382731096d855"
		 nombre: "Med Recal 1"
		 recalcine: true }*/
		$scope.addMedicina = function(medicine){
			$rootScope.register.medicines = $rootScope.register.medicines || [];
			var indexMedicine = _.findIndex($rootScope.register.medicines, {id: medicine.id});
			if( indexMedicine < 0 ){
				$rootScope.register.medicines.push(medicine);
				$toast.show($localization.get("MESSAGE.ADD_SUCCESS"), 1000);
			}else{
				$rootScope.register.medicines.splice(indexMedicine, 1);
				$toast.show($localization.get("MESSAGE.DELETE_SUCCESS"), 1000);
			}
		}
		$scope.omit = function(){
			/* Borrar la data de medicina */
			$rootScope.register.medicines = [];
			$rootScope.register.customMedicines = [];
			$rootScope.register.diagnosis = "";
			/* Ir al paso 3 */
			$state.go("start.step-c");
		};
	})
	.controller('StartRegisterOtherMedicineCtrl', function($rootScope, $scope, $localization, $cordovaDialogs, $state, $toast){
		$rootScope.register = $rootScope.register || {};
		$rootScope.register.customMedicines = $rootScope.register.customMedicines || [];
		$rootScope.register.medicines = $rootScope.register.medicines || [];
		$scope.newMedicine = {};
		$scope.addMedicine = function(){
			$cordovaDialogs.prompt(
				$localization.get("REGISTER.NAME_MEDICINE"),
				"Nuevo medicamento",
				[$localization.get("MESSAGE.CANCEL"), $localization.get("MESSAGE.ADD")],
				''
			).then(function(result){
					var input = result.input1;
					// no button = 0, 'OK' = 1, 'Cancel' = 2
					var btnIndex = result.buttonIndex;
					if(btnIndex == 2){
						$rootScope.register.customMedicines = $rootScope.register.customMedicines || [];
						$rootScope.register.medicines = $rootScope.register.medicines || [];
						//if ($scope.newMedicine.name.length <= 0) {
						if(result.input1.length <= 0){
							return false;
						} else {
							$scope.newMedicine.name = result.input1;
							if($rootScope.register.medicines.indexOf($scope.newMedicine.name) < 0){
								$rootScope.register.medicines.push({nombre: $scope.newMedicine.name});
								$rootScope.register.customMedicines.push({nombre: $scope.newMedicine.name});
								$toast.show($localization.get("MESSAGE.ADD_SUCCESS"), 1000);
							}else{
								$toast.show($localization.get("MESSAGE.ALREADY_EXIST"), 500);
							}
							$scope.newMedicine.name = "";
							return true;
						}
					}
				});
		};
		$scope.delete = function(medicine){
			$rootScope.register.medicines = $rootScope.register.medicines || [];
			$rootScope.register.customMedicines = $rootScope.register.customMedicines || [];
			var index = $rootScope.register.medicines.indexOf(medicine);
			var indexCustom = $rootScope.register.customMedicines.indexOf(medicine);
			if( index >= 0 ) {
				$rootScope.register.medicines.splice(index, 1);
				$toast.show($localization.get("MESSAGE.DELETE_SUCCESS"), 1000);
			}else{
				$toast.show($localization.get("MESSAGE.DELETE_ERROR"), 500);
			}
			if( indexCustom >= 0 ) {
				$rootScope.register.customMedicines.splice(indexCustom, 1);
			}
		};
		$scope.omit = function(){
			/* Borrar la data de medicina */
			$rootScope.register.medicines = [];
			$rootScope.register.customMedicines = [];
			$rootScope.register.diagnosis = "";
			/* Ir al paso 3 */
			$state.go("start.step-c");
		};
	})
	.controller('StartRegisterStepCCtrl', function($cordovaNetwork, $q, $scope, $rootScope, $toast, $profile, $state, $localization, $log, $localStorage, Usuario, Medicamento, MedicamentoUsuario){
		$scope.loading = false;
		var medicines = $localStorage.getJSON("medicines", false) || [];
		var addMedicine = function(array, user, promise){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			promise = promise || $q.defer();
			if(array) {
				if (array.length > 0) {
					if (array[0].id) {
						MedicamentoUsuario.create({
							usuarioId: user,
							medicamentoId: array[0].id
						}, function (roq) {
							array[0].idRelation = roq.id;
							medicines.push(array[0]);
							$rootScope.myMedicines = medicines;
							$localStorage.setJSON("medicines", medicines, false);
							array.splice(0, 1);
							addMedicine(array, user, promise);
						}, function () {
							$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
						})
					} else {
						Medicamento.create({
							nombre: array[0].nombre,
							recalcine: false
						}, function (res) {
							MedicamentoUsuario.create({
								usuarioId: user,
								medicamentoId: res.id
							}, function (roq) {
								medicines.push({
									idRelation: roq.id,
									id: res.id,
									nombre: res.nombre,
									recalcine: res.recalcine
								});
								$rootScope.myMedicines = medicines;
								$localStorage.setJSON("medicines", medicines, false);
								array.splice(0, 1);
								addMedicine(array, user, promise);
							})
						}, function () {
							$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
						})
					}
				} else {
					promise.resolve();
				}
			}else{
				promise.resolve();
			}
			return promise.promise;
		};
		$scope.accept = function(){
			var register = $rootScope.register;
			$toast.loading($localization.get("MESSAGE.SENDING"));
			$localStorage.setJSON("medicines", register.medicines);
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			Usuario.create({
				username: register.username,
				password: register.password,
				email: register.email,
				diagnostico: register.diagnosis || null
			}, function(res){
				Usuario.login({username: register.username, password: register.password, rememberMe: true}, function(res){
					$localStorage.set("welcome", true);
					addMedicine(register.medicines, res.userId).then(function() {
						$toast.show($localization.get("MESSAGE.LOGIN_CORRECT"), 1500);
						$profile.login({user: res.user, token: res.id, id: res.userId});
						$rootScope.user = {
							name: res.user.nombre,
							lastname: res.user.apellidos,
							email: res.user.email,
							imagen: res.user.imagen,
							username: res.user.username
						};
						$rootScope.contacts = [];
						$localStorage.setJSON("contacts", $rootScope.contacts, false);
						$state.go("welcome.a");
					});
				}, function(){
					$toast.show($localization.get("MESSAGE."+(res.data.error.code || "LOGIN_FAILED")), 1500);
					$state.go("start.step-a");
				});
			}, function(res){
				$toast.show($localization.get("MESSAGE.USERNAME_OR_EMAIL_EXIST"), 1500);
				$state.go("start.step-a");
			});
		}

	})
	.controller('SideMenuCtrl', function($rootScope, $scope, $profile, $toast, $localization, $localStorage, Configuracion, $interval, $log){
		var user = $profile.get("user", false);
		$rootScope.setting = $localStorage.getJSON("setting", false) || {
				alert_m: false,
				alert_s: false
			};

		$rootScope.user = {
			name: user.nombre,
			lastname: user.apellidos,
			email: user.email,
			imagen: user.imagen,
			username: user.username
		};
		$scope.update = function(){
			var user = $profile.get("user", false);
			$rootScope.user = {
				name: user.nombre,
				lastname: user.apellidos,
				email: user.email,
				imagen: user.imagen,
				username: user.username
			}
			$rootScope.setting = $localStorage.getJSON("setting", false) || {
					alert_m: false,
					alert_s: false
				};
		};
		$scope.updateSetting = function(){
			$scope.saveSetting();
		};
		$scope.saveSetting = function(){
			var userId = user.id;
			var alert = {
				alertaStock: $rootScope.setting.alert_s,
				alertaMedicamento: $rootScope.setting.alert_m,
				usuarioId: userId
			};
			var settingSave = $localStorage.getJSON("settingSave", false);
			if(settingSave){
				Configuracion.prototype$updateAttributes({id: settingSave.id}, alert).$promise.then(function(resUpdated){
					settingSave = resUpdated;
					$localStorage.setJSON("settingSave", settingSave, false);
					}, function(){
						$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
					});
			}else{
				Configuracion.create(alert).$promise.then(function(res){
					settingSave = res;
					$localStorage.setJSON("settingSave", settingSave, false);
				}, function(){

				});
			}
			$localStorage.setJSON("setting", $rootScope.setting, false);
		};
		$scope.update();
	})
	.controller('TabDashHomeCtrl', function($cordovaNetwork, $rootScope, $geolocation, $scope, $localStorage, $log,$toast, $localization, $timeout, $profile,$interval,  Usuario){
		$scope.showing = false;
		$rootScope.contacts = [];
		$timeout(function(){
			$geolocation.getCurrentPosition();
		}, 1500);
		if($cordovaNetwork.isOffline()){
			$toast.show("Debes estar conectado para realizar esta acción");
		}else {
			Usuario.findById({id: $profile.get("id", false)}, function (res) {
				if (typeof(res.contactos) != "undefined" && res.contactos != undefined && res.contactos != null) {
					$localStorage.setJSON("contacts", res.contactos, true).then(function (r) {
						$rootScope.contacts = res.contactos;
					});
				} else {
					$rootScope.contacts = [];
					$localStorage.setJSON("contacts", $rootScope.contacts, false);
				}
			}, function () {
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
			});
		}
		$scope.update = function(){
			$localStorage.getJSON("contacts", true).then(function(res){
				if(res == null) res = [];
				if(res == undefined) res = [];
				if(res == "undefined") res = [];
				if(typeof(res) == "undefined") res = [];
				$rootScope.contacts = res || $profile.get("user", false).contactos || [];
			});
		};
		$scope.toggleContacts = function(){
			$scope.showing = !$scope.showing;
		};
		if($profile.isLogued()) {
			$scope.update();
		}
	})
	.controller('TabDashListCtrl', function($cordovaNetwork, $rootScope, $log, $scope, $localStorage, $toast, $localization, $profile, $interval, Usuario){
		if($cordovaNetwork.isOffline()){
			$toast.show("Debes estar conectado para realizar esta acción");
		}else {
			Usuario.findById({id: $profile.get("id", false)}, function (res) {
				if (res.contactos) {
					$localStorage.setJSON("contacts", res.contactos, true).then(function (r) {
						$rootScope.contacts = res.contactos;
					});
				}
			}, function () {
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
			});
		}
		$scope.update = function(){
			$localStorage.getJSON("contacts", true).then(function(res){
				$rootScope.contacts = res || $profile.get("user", false).contactos;
			});
		};
		$scope.update();
		if($profile.isLogued()) {
			$scope.update();
		}
	})
	.controller('TabDashMedicineListCtrl', function($cordovaNetwork, $rootScope, $scope, $cordovaDialogs, $log, $toast, $localization, $localStorage, $profile, $interval, MedicamentoUsuario){
		var id = $profile.get("id", false);

		$scope.updateOnline = function(){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			MedicamentoUsuario.find({filter: {where: {usuarioId: id}, include: {relation: "medicamento"}}}).$promise.then(function(res){
				$scope.medicines = [];
				_.forEach(res, function(v){
					var medicine = v.medicamento;
					medicine.idRelation = v.id;
					$scope.medicines.push(medicine)
				});
				$rootScope.myMedicines = $scope.medicines;
				$localStorage.setJSON("medicines", $scope.medicines, false);
				$scope.$broadcast('scroll.refreshComplete');
			}, function(){
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
		$scope.delete = function(medicine){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$scope.recordatorios = $localStorage.getJSON("recordatorios", false);
			var indexRecordatorio = _.findIndex($rootScope.recordatorios, {medicamentoId: medicine.id});
			if(indexRecordatorio < 0) {
				$scope.medicine = _.findWhere($rootScope.myMedicines, {id: medicine.id});
				var index = _.findIndex($rootScope.myMedicines, {id: medicine.id});
				$cordovaDialogs.confirm(
					'¿Seguro que deseas borrar este medicamento?',
					'Borrar medicamento', [$localization.get("LOGOUT.CONFIRM_CANCEL"), $localization.get("LOGOUT.CONFIRM_OK")])
					.then(function (buttonIndex) {
						// no button = 0, 'OK' = 1, 'Cancel' = 2
						var btnIndex = buttonIndex;
						if (btnIndex == 2) {
							$toast.loading($localization.get("MESSAGE.SENDING"));
							$rootScope.myMedicines.splice(index, 1);
							MedicamentoUsuario.deleteById({id: $scope.medicine.idRelation}).$promise.then(function (res) {
								$localStorage.setJSON("medicines", $rootScope.myMedicines, false);
								$toast.show($localization.get("MESSAGE.DELETE_SUCCESS"));
							}, function () {
								$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
							});
						}
					});
			}else{
				$cordovaDialogs.alert("No puedes borrar el medicamento porque está asociado a un recordatorio", "No se puede borrar", $localization.get("MESSAGE.ACCEPT"));
			}
		};
		$scope.update = function(){
			$localStorage.getJSON("medicines", true).then(function(res){
				$rootScope.myMedicines = res;
			});
		};
		$scope.update();
		$scope.updateOnline();
	})

	/*  */

	.controller('TabDashMedicineAddCtrl', function($cordovaNetwork, $rootScope, $scope, $cordovaDialogs, $profile, $state, $toast, $localization, $localStorage, Medicamento, MedicamentoUsuario){
		$rootScope.recalcines = $localStorage.getJSON("recalcines", false);
		$scope.search = {filter: ''};
		var id = $profile.get("id", false);
		var idMedicine = null;
		$scope.update = function(){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$rootScope.recalcines = $localStorage.getJSON("recalcines", false);
			Medicamento.find({filter : {where: {recalcine: true}}}).$promise.then(function(r){
				$localStorage.setJSON("recalcines", r, false);
				$rootScope.recalcines = r;
				$scope.$broadcast('scroll.refreshComplete');
			}, function(){
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
		var medicines = $localStorage.getJSON("medicines", false);
		$scope.addMedicina = function(medicine){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			if(medicine.nombre){
				$toast.loading($localization.get("MESSAGE.SENDING"));
				Medicamento.find({filter: { where: {nombre: medicine.nombre} }}).$promise.then(function(res){
					if(res.length > 0){
						var index = _.findIndex(medicines, {id: res[0].id});
						idMedicine = res[0].id;
						if(index < 0) {
							MedicamentoUsuario.create({
								usuarioId: id,
								medicamentoId: idMedicine
							}).$promise.then(function (ros) {
									var medicline = {
										idRelation: ros.id,
										id: res[0].id,
										nombre: res[0].nombre,
										recalcine: res[0].recalcine
									};
									medicines.push(medicline);
									$rootScope.myMedicines = medicines;
									$localStorage.setJSON("medicines", medicines, false);
									$toast.show($localization.get("MESSAGE.ADD_SUCCESS"));
									//$state.go("others.medicinelist")
									$rootScope.alarmMedicine = medicine;
									$rootScope.back(-1);
								}, function () {
									$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
								})
						}else{
							$rootScope.myMedicines = medicines;
							$rootScope.alarmMedicine = medicines[index];
							$rootScope.back(-1);
							$toast.show($localization.get("MESSAGE.ADD_SUCCESS"));
						}
					}else{
						var color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
						Medicamento.create({
							nombre: medicine.nombre,
							recalcine: false,
						}, function(ros){
							idMedicine = ros.id;
							MedicamentoUsuario.create({
								usuarioId: id,
								medicamentoId: idMedicine
							}).$promise.then(function(raq){
									medicines.push({
										idRelation: raq.id,
										id: ros.id,
										nombre: ros.nombre,
										recalcine: ros.recalcine
									});
									$rootScope.myMedicines = medicines;
									$localStorage.setJSON("medicines", medicines, false);
									$toast.show($localization.get("MESSAGE.ADD_SUCCESS"));
									//$state.go("others.medicinelist")
									$rootScope.alarmMedicine = medicine;
									$rootScope.back(-1);
								}, function(){
									$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
								})
						}, function(){
							$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
						});
					}
				});
			}
		};
		$scope.other = function(){
			$cordovaDialogs.prompt(
				$localization.get("REGISTER.NAME_MEDICINE"),
				"Nuevo medicamento",
				[$localization.get("MESSAGE.CANCEL"), $localization.get("MESSAGE.ADD")],
				''
			).then(function(res) {
					var input = res.input1;
					// no button = 0, 'OK' = 1, 'Cancel' = 2
					var btnIndex = res.buttonIndex;
					if (btnIndex == 2) {
						$scope.addMedicina({nombre: input});
					}
				});
		};
		$scope.existMedicine = function(medicine){
			var index = _.findIndex(medicines, {id: medicine.id});
			try {
				return index >= 0
			}catch(e){
				return false;
			}
		};
		$scope.update();
	})
	.controller('TabDashMedicineEditCtrl', function($cordovaNetwork, $rootScope, $scope, $profile, $state, $toast, $localization, $stateParams, $cordovaDialogs, $localStorage, Medicamento, MedicamentoUsuario){
		var idMedicine;
		$scope.search = {filter: ''};
		$localStorage.getJSON("medicines", true).then(function(res){
			$scope.medicines = res;
			$scope.medicine = _.findWhere(res, {idRelation: $stateParams.id});
			$scope.medicineIndex = _.findIndex(res, {idRelation: $stateParams.id});
		});

		$scope.delete = function(){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$cordovaDialogs.confirm(
				'¿Seguro que deseas borrar este medicamento?',
				'Borrar medicamento', [$localization.get("LOGOUT.CONFIRM_CANCEL"),$localization.get("LOGOUT.CONFIRM_OK")])
				.then(function(buttonIndex) {
					// no button = 0, 'OK' = 1, 'Cancel' = 2
					var btnIndex = buttonIndex;
					if(btnIndex == 2){
						$toast.loading($localization.get("MESSAGE.SENDING"));
						$scope.medicines.splice($scope.medicineIndex, 1);
						MedicamentoUsuario.deleteById({id: $scope.medicine.idRelation}).$promise.then(function (res) {
							$rootScope.myMedicines = $scope.medicines;
							$localStorage.setJSON("medicines", $scope.medicines, false);
							$toast.show($localization.get("MESSAGE.DELETE_SUCCESS"));
							$state.go("others.medicinelist");
						}, function(){
							$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
						});
					}
				});
		};

		$scope.edit = function(add){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$toast.loading($localization.get("MESSAGE.SENDING"));
			Medicamento.find({filter: { where: {nombre: $scope.medicine.nombre} }}).$promise.then(function(res){
				if(res.length > 0){
					idMedicine = res[0].id;
					MedicamentoUsuario.prototype$updateAttributes({id: $scope.medicine.idRelation}, {
						medicamentoId: idMedicine
					}).$promise.then(function(resUpdated){
						$scope.medicines[$scope.medicineIndex].idRelation = resUpdated.id;
						$scope.medicines[$scope.medicineIndex].id = idMedicine;
						$scope.medicines[$scope.medicineIndex].nombre = $scope.medicine.nombre;

						add.nombre = "";
						add.$setPristine();
						$rootScope.myMedicines = $scope.medicines;
						$localStorage.setJSON("medicines", $scope.medicines, false);
						$toast.show($localization.get("MESSAGE.UPDATE_SUCCESS"));
						$state.go("others.medicinelist");
					}, function(){
							$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
						});
				}else{
					Medicamento.create({
						nombre: $scope.medicine.nombre,
						recalcine: false
					}, function(ros){
						idMedicine = ros.id;
						MedicamentoUsuario.prototype$updateAttributes({id: $scope.medicine.idRelation}, {
							medicamentoId: idMedicine
						}).$promise.then(function(resUpdated){
								$scope.medicines[$scope.medicineIndex].idRelation = resUpdated.id;
								$scope.medicines[$scope.medicineIndex].id = idMedicine;
								$scope.medicines[$scope.medicineIndex].nombre = $scope.medicine.nombre;
								add.nombre = "";
								add.$setPristine();
								$rootScope.myMedicines = $scope.medicines;
								$localStorage.setJSON("medicines", $scope.medicines, false);
								$toast.show($localization.get("MESSAGE.UPDATE_SUCCESS"));
								$state.go("others.medicinelist");
							}, function(){
								$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
							});
					}, function(){
						$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
					});
				}
			});
		}
	})
	/*  */
	.controller('TabDashAddCtrl', function($cordovaNetwork, $rootScope, $scope, $toast, $state, $localization, $timeout, $cordovaCamera, $cordovaContacts, $localStorage, $log, $profile, Usuario){
		var token = $profile.get("token", false);
		var id = $profile.get("id", false);
		$localStorage.getJSON("contacts", true).then(function(res){
			$rootScope.contacts = res || $profile.get("user", false).contactos;
		});
		$scope.toggle = function(form, elm){
			form[elm] = !form[elm];
		};
		$scope.contactData = {};
		$scope.add = function(form){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			token = $profile.get("token", false);
			$toast.loading($localization.get("MESSAGE.SAVING"));
			$localStorage.getJSON("contacts", true).then(function(ctc) {
				ctc = ctc || [];
				var contact = {
					tipo: form.kind,
					telefono: $scope.contactData.telefono,
					sms: form.message || false,
					llamada: form.call || false,
					whatsapp: form.whatsapp || false,
					imagen: form.imagen || false,
					nombre: $scope.contactData.nombre
				};
				if(!contact.imagen) delete contact.imagen;
				ctc.push(contact);
				Usuario.prototype$updateAttributes({id: id}, {contactos: ctc}).$promise.then(function (res) {
					var user = $profile.get("user", false);
					user.contactos = res.contactos;
					$profile.set("user", user, false);
					$rootScope.contacts = res.contactos;
					$localStorage.setJSON("contacts", res.contactos, true).then(function(){
						$toast.show($localization.get("MESSAGE.ADD_SUCCESS"));
						$state.go("main.dash.home");
					});
				}, function(){
					$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
				});
			});
		};

		$scope.listContact = function(form){
			$cordovaContacts.pickContact().then(function (contactPicked) {
				$scope.contactData = {
					nombre: contactPicked.name.formatted,
					telefono: contactPicked.phoneNumbers[0].value || ''
				}
			});
		}

	})
	.controller('TabDashEditCtrl', function($cordovaNetwork, $rootScope, $scope, $stateParams, $localStorage, $timeout, $toast, $state, $localization, $profile, $log, $cordovaDialogs, $cordovaContacts, Usuario) {
		var id = $profile.get("id", false);
		//var picInput = $('.shape-input:visible input#picture');
		$localStorage.getJSON("contacts", true).then(function(res){
			$rootScope.contacts = res || $profile.get("user", false).contactos;
		});
		$localStorage.getJSON("contacts", true).then(function(contacts){
			$rootScope.contacts = contacts;
			$scope.index = _.findIndex(contacts, {telefono: $stateParams.phone});
			$scope.contact = contacts[$scope.index];
		});
		$scope.toggle = function(form, elm){
			form[elm] = !form[elm];
		};
		$scope.edit = function(form){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$rootScope.contacts[$scope.index] = $scope.contact;
			$toast.loading($localization.get("MESSAGE.SAVING"));
			Usuario.prototype$updateAttributes({id: id}, {contactos: $scope.contacts}).$promise.then(function (res) {
				var user = $profile.get("user", false);
				user.contactos = res.contactos;
				$rootScope.contacts = user.contactos;
				$profile.set("user", user, false);
				$localStorage.setJSON("contacts", res.contactos, true).then(function(){
					$toast.show($localization.get("MESSAGE.UPDATE_SUCCESS"));
					$state.go("others.contactlist");
				});
			}, function(){
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
			});
		};
		$scope.delete = function(){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$cordovaDialogs.confirm(
				'¿Seguro que deseas borrar este contacto?',
				'Borrar contacto', [$localization.get("LOGOUT.CONFIRM_CANCEL"),$localization.get("LOGOUT.CONFIRM_OK")])
				.then(function(buttonIndex) {
					// no button = 0, 'OK' = 1, 'Cancel' = 2
					var btnIndex = buttonIndex;
					if(btnIndex == 2){
						$rootScope.contacts.splice($scope.index, 1);
						Usuario.prototype$updateAttributes({id: id}, {contactos: $rootScope.contacts}).$promise.then(function (res) {
							var user = $profile.get("user", false);
							user.contactos = res.contactos;
							$rootScope.contacts = user.contactos;
							$profile.set("user", user, false);
							$localStorage.setJSON("contacts", res.contactos, true).then(function(){
								$toast.show($localization.get("MESSAGE.DELETE_SUCCESS"));
								$state.go("others.contactlist");
							});
						}, function(){
							$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
						});
					}
				});
		}
		$scope.listContact = function(form){
			$cordovaContacts.pickContact().then(function (contactPicked) {
				$scope.contact.nombre = contactPicked.name.formatted;
				$scope.contact.telefono = contactPicked.phoneNumbers[0].value || '';
			});
		}

	})
	.controller('TabDashActiveCtrl', function($rootScope, $q, $geolocation, $scope, $localStorage, $stateParams, $toast, $localization, $state, $cordovaInAppBrowser, $cordovaDevice, $timeout){
		$scope.userActive = {};
		$rootScope.$on("$stateChangeSuccess", function(s, n){
			if(n.name == "main.dash.active"){
				//$scope.activeAlert();
			}
		});
		$geolocation.watchPosition({
			frequency : 1000,
			timeout : 5000,
			enableHighAccuracy: false
		});
		$rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
		});
		$scope.state = "sms";
		$scope.sendMenssage = function(number, next){
			var deferred = $q.defer();
			var promise = deferred.promise;
			$scope.state = next || "call";
			var location = $localStorage.getJSON("location", false);
			if ($scope.userActive.sms) {
				try {
					var options = {
						replaceLineBreaks: false, // true to replace \n by a new line, false by default
						android: {
							intent: 'INTENT'  // send SMS with the native android SMS messaging
							//intent: '' // send SMS without open any other app
						}
					};
					var success = function () {
						deferred.resolve();
					};
					var error = function (e) {
						$toast.show("No se ha enviado el sms");
						deferred.resolve();
					};
					sms.send(number || $stateParams.phone, "Necesito ayuda http://maps.google.com/?q=" + location.lat + "," + location.long + "", options, success, error);
				}catch(e){
					deferred.reject();
				}
			}else{
				deferred.reject();
			}
			return promise;
		};
		$scope.makeCall = function(number, next){
			var deferred = $q.defer();
			var promise = deferred.promise;
			$scope.state = next || "whatsapp";
			var n = number || $scope.userActive.telefono;
			if($scope.userActive.llamada) {
				if (phonedialer) {
					phonedialer.dial(
							n.replace(/ /g, ""),
							function (err) {
								deferred.reject();
							},
							function (success) {
								deferred.resolve();
							}
					);
				} else {
					$cordovaInAppBrowser.open('tel:' + n.replace(/ /g, ""), "_system");
					deferred.resolve();
				}
			}else{
				deferred.reject();
			}
			return promise;
		};
		$scope.whatsapp = function(number){
			var deferred = $q.defer();
			var promise = deferred.promise;
			var n = number || $scope.userActive.telefono;
			$scope.state = "end";
			if( $scope.userActive.whatsapp ){
				$cordovaInAppBrowser.open("whatsapp://send?text=Necesito%20ayuda%20http%3A%2F%2Fmaps.google.com%2F%3Fq%3D"+location.lat+"%2C"+location.long+"", "_system");
				deferred.resolve();
			}else{
				deferred.reject();
			}
			return promise;
		};
		$scope.activeAlert = function() {
			$scope.activating = true;
			$localStorage.getJSON("contacts", true).then(function (res) {
				$scope.userActive = _.findWhere(res, {telefono: $stateParams.phone});
				if ($scope.userActive) {
					$scope.sendMenssage().then(function(){
						if($cordovaDevice.getPlatform() == "iOS"){
							$scope.makeCall().then(function(){
								if($cordovaDevice.getPlatform() == "iOS"){
									$scope.whatsapp()
								}
							}, function(){
								$scope.whatsapp()
							});
						}
					}, function(){
						$scope.makeCall().then(function(){
							if($cordovaDevice.getPlatform() == "iOS"){
								$scope.whatsapp()
							}
						}, function(){
							$scope.whatsapp()
						});
					});
					$rootScope.$on("$lifecycle:resume", function(){
						if($cordovaDevice.getPlatform() != "iOS"){
							if ($scope.state == "call") {
								if (!$scope.makeCall()) {
									$scope.whatsapp();
								}
							} else {
								if ($scope.state == "whatsapp") {
									$scope.whatsapp();
								}
							}
						}
					});
				} else {
					var telephone = "";
					$scope.userActive = res[0];
					$scope.userShow = "Todos"
					_.forEach(res, function (v, k) {
						if(k != 0) telephone += ",";
						telephone += v.telefono.replace(/ /g, "");
					});
					$scope.sendMenssage(telephone, 'call').then(function(){
						if($cordovaDevice.getPlatform() == "iOS") {
							$scope.makeCall(null, "end");
						}
					}, function(){
						$scope.makeCall(null, "end");
					});
					$rootScope.$on("$lifecycle:resume", function(){
						if($cordovaDevice.getPlatform() != "iOS") {
							if ($scope.state == "call") {
								$scope.makeCall(null, "end");
							}
						}
					});

				}
			});
		};
		$toast.process($localization.get("MESSAGE.GEOLOCALING"));
		$geolocation.getCurrentPosition({timeout: 3000, enableHighAccuracy: false}).then(function(){
			$toast.hide();
			$scope.activeAlert();
			$toast.show($localization.get("MESSAGE.GEOLOCATED"));

		}, function(){
			$toast.hide();
			$scope.activeAlert();
			$toast.show($localization.get("MESSAGE.NO_GEOLOCATED"));
		});

		$scope.cancel = function(){
			$state.go("main.dash.home");
		}
	})
	.controller('TabSearchHomeCtrl', function($cordovaNetwork, $rootScope, $toast, $geolocation, $localization, $scope, $localStorage, $log, Sucursal){
		$scope.marker = [];
		$scope.filter = "55beb2084f0294461dae779b";
		$scope.sucursalesVisibles = [];
		$scope.setFilter = function(filter){
			$scope.filter = filter;
			$rootScope.sucursales = $localStorage.getJSON("sucursales", false) || [];
			if(filter.length > 0) {
				$rootScope.sucursales = _.where($rootScope.sucursales, {cadena: {id: filter}});
			}
		};
		$rootScope.sucursales = $localStorage.getJSON("sucursales", false) || [];
		$scope.filters = true;
		$scope.seeFilter = function(){
			$scope.filters = !$scope.filters;
			$scope.filter = "55beb2084f0294461dae779b";
			$scope.setFilter("55beb2084f0294461dae779b");
		};
		$geolocation.getCurrentPosition().then(function(res){
			Sucursal.find({
				filter: { where: {geo: {near: [res.lat, res.long]}}, limit: 200, include: { relation: "cadena" } }
			}).$promise.then(function(res){
					$localStorage.setJSON("sucursales", res, false);
					if($scope.filter.length > 0) {
						$rootScope.sucursales = _.where(res, {cadena: {id: $scope.filter}});
					}else{
						//$rootScope.sucursales = res;
					}

				}, function(){
					$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
				})
		});
		$scope.centerChange = function(lat, long){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			Sucursal.find({
				filter: { where: {geo: {near: [lat, long]}}, limit: 200, include: { relation: "cadena" } }
			}).$promise.then(function(res){
					$localStorage.setJSON("sucursales", res, false);
					if($scope.filter.length > 0) {
						$rootScope.sucursales = _.where(res, {cadena: {id: $scope.filter}});
					}else{
						//$rootScope.sucursales = res;
					}
				}, function(){
					$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
				})
		}

	})
	.controller('TabSearchViewCtrl', function($cordovaNetwork, $rootScope, $localStorage, $scope, $stateParams, $toast, $localization, Sucursal, MedicamentoSucursal){
		//$toast.loading($localization.get("MESSAGE.LOADING"));
		//$scope.sucursales = $localStorage.getJSON("sucursales", false) || [];
		$scope.marker = [];
		$toast.loading($localization.get("MESSAGE.LOADING"));
		if($cordovaNetwork.isOffline()){
			$toast.show("Debes estar conectado para realizar esta acción");
		}else {
			Sucursal.findOne({filter: {where: {id: $stateParams.id}, include: {relation: "cadena"}}}).$promise.then(function (res) {
				$scope.sucursal = res;
				$scope.marker.push({lat: $scope.sucursal.geo.lat, lng: $scope.sucursal.geo.lng});
				$scope.medicinesHere = MedicamentoSucursal.find({filter: {include: {relation: "medicamento"}, where: {sucursalId: $stateParams.id}}});
				$toast.hide()
			}, function (err) {
				$toast.hide()
			});
		}
	})
	.controller('TabSearchDoCtrl', function($cordovaNetwork, $scope, $localStorage, $toast, $localization, $filter, Medicamento, MedicamentoSucursal){
		$scope.medicamentosAutocomplete = [];
		Medicamento.find({
			filter: {
				where: {
					recalcine: true
				}
			}
		}).$promise.then(function(res){
			$scope.medicamentosAutocomplete = res;
		});

		$scope.activeSearch = function(){

		}

		$scope.doSearch = function(form){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$toast.sending($localization.get("MESSAGE.SEARCHING"));
			s = new RegExp(".*"+form.q+"*.");
			MedicamentoSucursal.find({
				filter: {
					"include": [{
						"relation": "sucursal",
						"scope": {
							"include": {
								"relation": "cadena"
							}
						}
					},{
						"relation" : "medicamento",
						"scope" : {
							"where" : {or: [{nombre: {like: ".*"+form.q+"*.", options: 'igm'}}] }
						}
					}]
				}
			}).$promise.then(function(res){
					$toast.hide();
					res = _.filter(res, function(o){
						if(o.medicamento) {
							if (o.medicamento.nombre.length > 0) {
								return true;
							}
						}
						return false
					});
					if(res.length == 0) {
						$toast.show("No se encontraron medicamentos");
					}
					if(res.length == 1) {
						$toast.show("Se encontró " + res.length + " medicamento");
					}
					if(res.length > 1) {
						$toast.show("Se encontraron " + res.length + " medicamentos");
					}
					$scope.results = res;
				}, function(err){
					$toast.hide();
				})
		};
	})
	.controller('TabDashProfileEditCtrl', function($cordovaNetwork, $rootScope, $scope, $state, $profile, $timeout, $toast, $localization, $localStorage, Usuario){
		$scope.profile = $profile.get("user", false);
		$scope.save = function(){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$toast.loading($localization.get("MESSAGE.SENDING"));
			var profile = {
				nombre: $scope.profile.nombre || null,
				apellidos: $scope.profile.apellidos || null,
				email: $scope.profile.email,
				diagnostico: $scope.profile.diagnostico || null,
				imagen: $scope.profile.imagen || null
			};
			Usuario.prototype$updateAttributes({id: $scope.profile.id}, profile).$promise.then(function(res){
				$profile.set("user", $scope.profile, false);
				var user = $profile.get("user", false);
				$rootScope.user = {
					name: user.nombre,
					lastname: user.apellidos,
					email: user.email,
					imagen: user.imagen,
					username: user.username
				};
				$toast.show($localization.get("MESSAGE.UPDATE_SUCCESS"));
			}, function(){
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
			});
		}
	})
	.controller('TabAlarmHomeCtrl', function($cordovaNetwork, $rootScope, $scope, $interval, $filter, $localStorage, $profile, $toast, $localization, $log, Recordatorio){
		$rootScope.recordatorios = $localStorage.getJSON("recordatorios", false);
		$rootScope.alarms = $localStorage.getJSON("alarms", false);
		$scope.now = new Date();
		$scope.bars = [];
		$scope.nowBar = 0;
		$scope.cleanMedicine = function(){
			$rootScope.alarmMedicine = undefined;
		};
		$scope.updateOnline = function(){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			Recordatorio.find({filter: {include: {relation: "medicamento"}, where: {usuarioId: $profile.get('id', false)}}}).$promise.then(function(res){
				_.forEach(res, function(v, k){
					res[k] = v;
					res[k].nombre = v.medicamento.nombre;
					delete res[k].medicamento;
				});
				$localStorage.setJSON("recordatorios", res, false);
				$rootScope.recordatorios = res;
				$scope.$broadcast('scroll.refreshComplete');
			}, function(){
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
				$scope.$broadcast('scroll.refreshComplete');
			});

		};
		$scope.nowBarStyle = "-webkit-transform: translate(-50%, -50%) rotateZ("+$scope.nowBar+"deg);" +
			"-moz-transform: translate(-50%, -50%) rotateZ("+$scope.nowBar+"deg);" +
			"-ms-transform: translate(-50%, -50%) rotateZ("+$scope.nowBar+"deg);" +
			"-o-transform: translate(-50%, -50%) rotateZ("+$scope.nowBar+"deg);" +
			"transform: translate(-50%, -50%) rotateZ("+$scope.nowBar+"deg);";
		$interval(function(){
			$log.info("$interval: TabAlarmHomeCtrl: L.926");
			if($profile.isLogued()) {
				$scope.now = new Date();
			}
		}, 1000);
		$scope.setAlarms = function(recordatorios){
			if(recordatorios) {
				$rootScope.alarms = $localStorage.getJSON("alarms", false);
				var alarmsTotal = [];
				if (recordatorios.length > 0) {
					$rootScope.alarms = [];
					_.forEach(recordatorios, function (v, k) {
						/**/
						var alarm;
						var alarms = [];
						var alarmsSaved = [];
						var totalAlarms = v.cantidad / v.dosis;
						var now = new Date(v.hora);
						var ahora = new Date();
						var time = angular.copy(now);
						var initQuantity = angular.copy(v.cantidad);
						for (i = 0; i < totalAlarms; i++) {
							initQuantity -= v.dosis;
							var a = {
								idAlarm: v.id,
								medicine: v.nombre,
								time: angular.copy(time).toISOString(),
								pre: new Number(initQuantity) + new Number(v.dosis),
								left: initQuantity,
								text: "Recuerda tomar tu " + v.nombre
							};
							var exist = _.findIndex($rootScope.alarms, a);
							var check = angular.copy(time);
							var checkAhora = angular.copy(ahora);
							check.setHours(0);
							check.setMinutes(0);
							check.setSeconds(1);
							checkAhora.setHours(0);
							checkAhora.setMinutes(0);
							checkAhora.setSeconds(0);
							if (exist < 0 && !(check < checkAhora)) {
								a.id = _.uniqueId("alarm_" + v.id + "_");
								a.time = angular.copy(time);
								alarms.push(a);
							}
							time.setHours(time.getHours() + parseFloat(v.frecuencia));
						}
						alarmsSaved.push(alarms);
						alarmsSaved = _.flattenDeep(alarmsSaved);
						alarmsTotal.push(alarmsSaved);
						/**/
						alarmsTotal.push(_.where($rootScope.alarms, {idAlarm: v.id}));
						alarmsTotal = _.flattenDeep(alarmsTotal);
						if (k + 1 == recordatorios.length) {
							$rootScope.alarms = alarmsTotal;
							$localStorage.setJSON("alarms", alarmsTotal, false);
						}
					});
				} else {
					var alarms = [];
					$rootScope.alarms = [];
					$localStorage.setJSON("alarms", alarms, false);
				}
			}
		};

		$scope.$watch('now', function(b, a){
			$scope.h = $filter('date')(b, "HH");
			$scope.m = $filter('date')(b, "mm");
			$scope.dw = $filter('date')(b, "EEE");
			$scope.d = $filter('date')(b, "dd");
			$scope.mt = $filter('date')(b, "MMMM");
			$scope.nowBar = 270+(((parseFloat($scope.h)*60)+parseFloat($scope.m))*0.5);
			if($scope.nowBar > 360) $scope.nowBar -= 360;
			if(typeof($scope.lasthour) == 'undefined') $scope.lasthour = $scope.h;
			if(parseFloat($scope.lasthour) != parseFloat($scope.h)){
				$scope.lasthour = $scope.h;
				$rootScope.alarms = _.flatten(new Array($localStorage.getJSON("alarms", false)));
				$scope.changeAlarms($rootScope.alarms);
			}
			$scope.nowBarStyle = "-webkit-transform: translate(-50%, -50%) rotateZ("+$scope.nowBar+"deg);" +
				"-moz-transform: translate(-50%, -50%) rotateZ("+$scope.nowBar+"deg);" +
				"-ms-transform: translate(-50%, -50%) rotateZ("+$scope.nowBar+"deg);" +
				"-o-transform: translate(-50%, -50%) rotateZ("+$scope.nowBar+"deg);" +
				"transform: translate(-50%, -50%) rotateZ("+$scope.nowBar+"deg);";
		});

		$rootScope.$watch('recordatorios', function(n, a){
			$scope.setAlarms(n);
		}, true);

		$scope.hasAlarm = function(alarm){
			var alarms = $localStorage.getJSON("alarms");
			var now = new Date().getTime();
			var realAlarms = _(alarms).filter(function(a){
				return a.idAlarm = alarm.id
			}).value();
			if(realAlarms.length > 0){
				var enter = false;
				_.forEach(realAlarms, function (n, i) {
					var date = new Date(new Date(n.time).getTime());
					if (typeof next == "undefined" && date.getTime() > now) {
						enter = true;
					}
				});
				if(enter) return true;
				else {
					var alarmIndex = _.findIndex($rootScope.recordatorios, {id: alarm.id});
					if(alarmIndex >= 0) {
						Recordatorio.deleteById({id: alarm.id}).$promise.then(function () {
							$rootScope.recordatorios.splice(alarmIndex, 1);
							$localStorage.setJSON("recordatorios", $rootScope.recordatorios, true).then(function () {
								//$toast.show($localization.get("MESSAGE.DELETE_SUCCESS"));
							});
						}, function () {
							//$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
						});
					}
					return false;
				}
			}else{
				var alarmIndex = _.findIndex($rootScope.recordatorios, {id: alarm.id});
				if(alarmIndex >= 0) {
					Recordatorio.deleteById({id: alarm.id}).$promise.then(function () {
						$rootScope.recordatorios.splice(alarmIndex, 1);
						$localStorage.setJSON("recordatorios", $rootScope.recordatorios, true).then(function () {
							//$toast.show($localization.get("MESSAGE.DELETE_SUCCESS"));
						});
					}, function () {
						//$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
					});
				}
				return false;
			}
		};

		$scope.calculateNext = function(alarm){
			if($scope.alarmToday) {
				var timezone = $scope.now.getTimezoneOffset();
				var now = new Date().getTime();
				var minLeft = Math.round((next - now) / 60000);
				var alarms = $localStorage.getJSON("alarms");
				var idAlarm = alarm.id;
				var realAlarms = _.where(alarms, {idAlarm: idAlarm});
				if(realAlarms.length > 0) {
					var next = undefined;
					var enter = false;
					_.forEach(realAlarms, function (n, i) {
						var date = new Date(new Date(n.time).getTime());
						if (typeof next == "undefined" && date.getTime() > now) {
							next = date;
							minLeft = Math.round((next - now) / 60000);
							enter = true;
						}
					});
					if (!enter) {
						minLeft = "-";
						var removeAlarms = _(alarms).filter(function (a) {
							return a.idAlarm != alarm.id
						}).value();
						try{
							$localStorage.setJSON("alarms", removeAlarms)
						}catch(e){
						}
					}
				}else{
					return "-";
				}
			}else{
				return "-";
			}
			return minLeft;
		};

		$scope.changeAlarms = function(n, a){
			$scope.bars = [];
			$rootScope.setNotification("alarms");
			$rootScope.setNotification("stock");
			$scope.next = undefined;
			var todayInit = new Date();
			var todayEnd = new Date();
			if(todayInit.getHours() >= 12 ){
				todayInit.setHours(12);
				todayEnd.setHours(0);
				todayEnd.setMinutes(0);
				todayEnd.setSeconds(0);
				todayEnd.setMilliseconds(0);
				todayEnd.setDate(todayEnd.getDate()+1);
			}else{
				todayInit.setHours(0);
				todayEnd.setHours(12);
				todayEnd.setMinutes(0);
				todayEnd.setSeconds(0);
				todayEnd.setMilliseconds(0);
				//todayEnd.setDate(todayEnd.getDate()+1);
			}

			//todayInit.setHours(0);
			todayInit.setMinutes(0);
			todayInit.setSeconds(0);
			todayInit.setMilliseconds(0);
			var alarmToday = _.filter(n, function(o){
				var fecha = new Date(o.time);
				return (fecha >= todayInit && fecha <= todayEnd);
			});
			$scope.alarmToday = alarmToday;
			var medicinesArray = [];
			_.forEach(alarmToday, function(v, k){
				var hStart = $filter('date')(new Date(v.time), "HH");
				var mStart = $filter('date')(new Date(v.time), "mm");
				var nowBar = 270+(((parseFloat(hStart)*60)+parseFloat(mStart))*0.5);
				var id = "'"+hStart+":"+mStart+"'";
				if(nowBar > 360) nowBar -= 360;
				var pos = _.findIndex($scope.bars, {id: id});
				if(pos >= 0){

				}else{
					$scope.bars.push({
						id: id,
						elements: [],
						style: "-webkit-transform: translate(-50%, -50%) rotateZ("+nowBar+"deg);" +
						"-moz-transform: translate(-50%, -50%) rotateZ("+nowBar+"deg);" +
						"-ms-transform: translate(-50%, -50%) rotateZ("+nowBar+"deg);" +
						"-o-transform: translate(-50%, -50%) rotateZ("+nowBar+"deg);" +
						"transform: translate(-50%, -50%) rotateZ("+nowBar+"deg);"
					});
				}
				pos = _.findIndex($scope.bars, {id: id});
				var i = medicinesArray.indexOf(v.medicine);

				if(i < 0){
					medicinesArray.push(v.medicine);
				}
				var classes = ["first", "second", "third", "four"];
				var ind = medicinesArray.indexOf(v.medicine);
				if(new Date(v.time) >= new Date() && new Date(v.time) <= todayEnd){
					var color = _.findWhere($rootScope.recordatorios, {id: v.idAlarm});
					$scope.bars[pos].elements.push({
						class: classes[ind],
						color: color.color
					});
				}else{
					$scope.bars[pos].elements.push({
						class: classes[ind],
						color: "#A8A7A9"
					});
				}
			});
			_.defer(function() {
				$scope.$apply();
			}, 'deferred')
		};
		$scope.updateOnline();
		$scope.$watch('alarms', function(n, a){
			$scope.changeAlarms(n, a);
		}, true);
	})

	.controller('TabAlarmAddCtrl', function($cordovaNetwork, $rootScope, $scope, $cordovaDatePicker, $state, $profile, $toast, $localization, $localStorage, Medicamento, Recordatorio){
		$rootScope.recordatorios = $localStorage.getJSON("recordatorios", false) || [];
		var colors = ['#FF9000', '#CC0C56', '#139EEA', '#42D551'];
		$scope.hexToRgb = function(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseFloat(result[1], 16),
				g: parseFloat(result[2], 16),
				b: parseFloat(result[3], 16)
			} : null;
		};
		_.forEachRight(colors, function(o, k){
			var i = _.findIndex($rootScope.recordatorios, {color: o.toLowerCase()});
			if(i < 0){
				i = _.findIndex($rootScope.recordatorios, {color: o})
			}
			if(i < 0){
				$scope.color = colors[k];
				var rgb = $scope.hexToRgb($scope.color);
				$scope.colorAlpha = "rgba("+rgb.r+", "+rgb.g+", "+rgb.b+", "+(0.4)+")";
			}
		});
		$scope.add = function(form){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$toast.loading($localization.get("MESSAGE.SENDING"));
			var medicine = undefined;
			form.name = $rootScope.alarmMedicine.nombre;
			Medicamento.find({filter: {where: {nombre: form.name}}}).$promise.then(function(res){
				if(res.length == 0){
					Medicamento.create({
						nombre: form.name,
						recalcine: false,
					}).$promise.then(function(res){
							medicine = {
								id: res.id,
								nombre: res.nombre,
								recalcine: res.recalcine,
							};
							$scope.addRecordatorio(form, medicine);
						});
				}else{
					medicine = res[0];
					$scope.addRecordatorio(form, medicine);
				}
			}, function(){
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
			})
		};
		$scope.changeKind = function(form){
			form.dosis = null;
			//form.quantity = null;
		};
		$scope.kinds = function(i, kind){

		};
		$scope.changeColor = function(color, colorFull){
			$scope.color = color;
			colorFull._a = 0.4;
			var rgb = colorFull.toRgb();
			rgb = "rgba("+rgb.r+", "+rgb.g+", "+rgb.b+", "+rgb.a+")";
			$scope.colorAlpha = rgb;
		};
		$scope.hora = function(form){
			var now = new Date();
			now.setSeconds(0);
			now.setMilliseconds(0);
			form.hora = now;
		};
		$scope.changeDate = function(){
			$cordovaDatePicker
		};
		$scope.addRecordatorio = function(form, medicine){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			var alarmsSaved = $localStorage.getJSON("alarms", false) || [];
			$rootScope.alarms = $localStorage.getJSON("alarms", false) || [];
			$rootScope.recordatorios = $localStorage.getJSON("recordatorios", false) || [];
			var hora = form.hora;
			var hr = hora.getHours();
			var mm = hora.getMinutes();
			var now = new Date();
			now.setHours(hr);
			now.setMinutes(mm);
			now.setSeconds(0);
			now.setMilliseconds(0);
			var alarm = {
				hora: now.toUTCString(),
				tipo: form.kind,
				color: $scope.color,
				dosis: form.dosis,
				nombre: medicine.nombre,
				frecuencia: form.frequency,
				cantidad: form.quantity,
				medicamentoId: medicine.id,
				usuarioId: $profile.get("id", false)
			};
			Recordatorio.create(alarm).$promise.then(function(res){
					alarm.id = res.id;
					/*_.remove(alarmsSaved, function(o, n){
						return o.idAlarm == alarm.id;
					});
					var alarms = [];
					var totalAlarms = alarm.cantidad/alarm.dosis;
					var time = angular.copy(now);
					var initQuantity = angular.copy(alarm.cantidad);
					for(i = 0; i < totalAlarms; i++){
						initQuantity -= alarm.dosis;
						alarms.push({
							id: _.uniqueId("alarm_"+alarm.id+"_"),
							idAlarm: alarm.id,
							medicine: alarm.nombre,
							time: angular.copy(time),
							color: alarm.color,
							pre: new Number(initQuantity)+new Number(alarm.dosis),
							left: initQuantity,
							text: "Recuerda tomar tu " + alarm.nombre
						});
						time.setHours(time.getHours()+parseFloat(alarm.frecuencia));
					}
					alarmsSaved.push(alarms);
					alarmsSaved = _.flattenDeep(alarmsSaved);*/
					//$localStorage.setJSON("alarms", alarmsSaved, true).then(function(){
						alarm.color = $scope.color;
						$rootScope.recordatorios.push(alarm);
						$localStorage.setJSON("recordatorios", $rootScope.recordatorios);
						$toast.show($localization.get("MESSAGE.ADD_SUCCESS"));
						$rootScope.alarmMedicine = undefined;
						$state.go("main.alarm.home");
					//});
				}, function(){
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
			});
		}
	})
	.controller('TabAlarmEditCtrl', function($cordovaNetwork, $rootScope, $scope, $toast, $timeout, $state, $localization, $stateParams, $localStorage, $cordovaDialogs, Medicamento, Recordatorio){
		$rootScope.recordatorios = $localStorage.getJSON("recordatorios", false) || [];
		$rootScope.myMedicines = $localStorage.getJSON("medicines", false) || [];
		$scope.alarm = _.findWhere($rootScope.recordatorios, {id: $stateParams.token});
		$scope.alarm.dosis = parseFloat($scope.alarm.dosis);
		$rootScope.alarmMedicine = _.findWhere($rootScope.myMedicines, {id: $scope.alarm.medicamentoId});
		var colors = ['#FF9000', '#CC0C56', '#139EEA', '#42D551'];
		$scope.color = $scope.alarm.color || colors[$rootScope.recordatorios.length-1];
		$scope.hexToRgb = function(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseFloat(result[1], 16),
				g: parseFloat(result[2], 16),
				b: parseFloat(result[3], 16)
			} : null;
		};
		var rgb = $scope.hexToRgb($scope.color);
		rgb = "rgba("+rgb.r+", "+rgb.g+", "+rgb.b+", "+(0.4)+")";
		$scope.colorAlpha = rgb || $scope.alarm.color || "#FF9000";
		//$timeout(function(){
		$scope.alarm.cantidad = parseFloat($scope.alarm.cantidad)
		//}, 500);
		var testDate =Date.parse($scope.alarm.hora);
		if(isNaN(testDate)==false) {
			$scope.alarm.hora = new Date($scope.alarm.hora);
		}else{
			$scope.alarm.hora = new Date();
			$scope.alarm.hora.setMinutes(0);
			$scope.alarm.hora.setSeconds(0);
			$scope.alarm.hora.setMilliseconds(0);
		}
		$scope.changeKind = function(form){
			//var to = $timeout(function(){
			//	if(form.dosis != "") {
			//		form.dosis = "";
			//		if(to) {
			//			$timeout.cancel(to)
			//		}
			//	}
			//}, 250);
			//form.dosis = 0;
			//form.cantidad = "";
		};
		$scope.changeColor = function(color, colorFull){
			$scope.color = color;
			colorFull._a = 0.4;
			var rgb = colorFull.toRgb();
			rgb = "rgba("+rgb.r+", "+rgb.g+", "+rgb.b+", "+rgb.a+")";
			$scope.colorAlpha = rgb;
		};
		$scope.alarmIndex = _.findIndex($rootScope.recordatorios, {id: ($stateParams.token)});
		$scope.editRecordatorio = function(medicine){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			//var alarmsSaved = $localStorage.getJSON("alarms", false) || [];
			$rootScope.recordatorios = $localStorage.getJSON("recordatorios", false) || [];
			/*_.remove(alarmsSaved, function(o, n){
				return o.idAlarm == $scope.alarm.id;
			});*/
			var alarm = angular.copy($scope.alarm);
			alarm.color = $scope.color;
			var hora = angular.copy($scope.alarm.hora);
			var hr = hora.getHours();
			var mm = hora.getMinutes();
			var now = new Date();
			hora.setHours(hr);
			hora.setMinutes(mm);
			hora.setSeconds(0);
			hora.setMilliseconds(0);
			var totalAlarms = alarm.cantidad/alarm.dosis;
			alarm.hora = hora.toUTCString();
			alarm.color = $scope.color;
			Recordatorio.prototype$updateAttributes({id: alarm.id}, alarm).$promise.then(function(res){
				alarm.color = $scope.color;
				$rootScope.recordatorios[$scope.alarmIndex] = alarm;
				$localStorage.setJSON("recordatorios", $rootScope.recordatorios);
				$toast.show($localization.get("MESSAGE.UPDATE_SUCCESS"));
				$rootScope.alarmMedicine = undefined;
		
				$state.go("main.alarm.home")
			}, function(){
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
			});
		};
		$scope.edit = function(){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$toast.loading($localization.get("MESSAGE.SENDING"));
			var medicine = undefined;
			$scope.alarm.nombre = $rootScope.alarmMedicine.nombre;
			Medicamento.find({filter: {where: {nombre: $scope.alarm.nombre}}}).$promise.then(function(res){
				if(res.length == 0){
					Medicamento.create({
						nombre: $scope.alarm.nombre,
						recalcine: false,
					}).$promise.then(function(res){
							medicine = {
								id: res.id,
								nombre: res.nombre,
								recalcine: res.recalcine,
							};
							$scope.editRecordatorio(medicine);
						});
				}else{
					medicine = res[0];
					$scope.editRecordatorio(medicine);
				}
			}, function(){
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
			})
		};
		$scope.delete = function(){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$cordovaDialogs.confirm(
				'¿Seguro que deseas borrar este medicamento?',
				'Borrar medicamento', [$localization.get("LOGOUT.CONFIRM_CANCEL"),$localization.get("LOGOUT.CONFIRM_OK")])
				.then(function(buttonIndex) {
					// no button = 0, 'OK' = 1, 'Cancel' = 2
					var btnIndex = buttonIndex;
					if(btnIndex == 2){
						Recordatorio.deleteById({id: $scope.alarm.id}).$promise.then(function(){
							$rootScope.recordatorios.splice($scope.alarmIndex, 1);
							$localStorage.setJSON("recordatorios", $rootScope.recordatorios, true).then(function(){
								$toast.show($localization.get("MESSAGE.DELETE_SUCCESS"));
								$state.go("main.alarm.home");
							});
						}, function(){
							$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
						});
					}
				});
		}
	})
	.controller("TabAlarmMedicinesCtrl", function($cordovaNetwork, $rootScope, $scope, $state, $localStorage, $profile, $toast, $localization, MedicamentoUsuario){
		var id = $profile.get("id", false);
		$scope.updateOnline = function(){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			MedicamentoUsuario.find({filter: {where: {usuarioId: id}, include: {relation: "medicamento"}}}).$promise.then(function(res){
				$scope.medicines = [];
				_.forEach(res, function(v){
					var medicine = v.medicamento;
					medicine.idRelation = v.id;
					$scope.medicines.push(medicine)
				});
				$rootScope.myMedicines = $scope.medicines;
				$localStorage.setJSON("medicines", $scope.medicines, false);
				$scope.$broadcast('scroll.refreshComplete');
			}, function(){
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
		$scope.update = function(){
			$localStorage.getJSON("medicines", true).then(function(res){
				$rootScope.myMedicines = res;
			});

		};
		$scope.existMedicine = function(medicine){
			try {
				return $rootScope.alarmMedicine.id == medicine.id
			}catch(e){
				return false;
			}
		};
		$scope.update();
		$scope.updateOnline();
		$scope.addMedicina = function(medicine){
			if(medicine){
				$rootScope.alarmMedicine = medicine;
				$rootScope.back();
			}
		}
	}).
	controller("TabAlarmMedicinesRecalcineCtrl", function($cordovaNetwork, $rootScope, $scope, $profile, $toast, $cordovaDialogs, $localization, $localStorage, Medicamento, MedicamentoUsuario){
		$rootScope.recalcines = $localStorage.getJSON("recalcines", false);
		$scope.search = {filter: ''};
		var id = $profile.get("id", false);
		var idMedicine = null;
		$scope.update = function(){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			$rootScope.recalcines = $localStorage.getJSON("recalcines", false);
			Medicamento.find({filter : {where: {recalcine: true}}}).$promise.then(function(r){
				$localStorage.setJSON("recalcines", r, false);
				$rootScope.recalcines = r;
					$scope.$broadcast('scroll.refreshComplete');
			}, function(){
				$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
		var medicines = $localStorage.getJSON("medicines", false);
		$scope.addMedicina = function(medicine){
			if($cordovaNetwork.isOffline()){
				$toast.show("Debes estar conectado para realizar esta acción");
				return;
			}
			if(medicine){
				$toast.loading($localization.get("MESSAGE.SENDING"));
				Medicamento.find({filter: { where: {nombre: medicine.nombre} }}).$promise.then(function(res){
					if(res.length > 0){
						var index = _.findIndex(medicines, {id: res[0].id});
						idMedicine = res[0].id;
						if(index < 0) {
							MedicamentoUsuario.create({
								usuarioId: id,
								medicamentoId: idMedicine
							}).$promise.then(function (ros) {
									var medicline = {
										idRelation: ros.id,
										id: res[0].id,
										nombre: res[0].nombre,
										recalcine: res[0].recalcine
									};
									medicines.push(medicline);
									$rootScope.myMedicines = medicines;
									$localStorage.setJSON("medicines", medicines, false);
									$toast.show($localization.get("MESSAGE.ADD_SUCCESS"));
									//$state.go("others.medicinelist")
									$rootScope.alarmMedicine = medicine;
									$rootScope.back(-2);
								}, function () {
									$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
								})
						}else{
							$rootScope.myMedicines = medicines;
							$rootScope.alarmMedicine = medicines[index];
							$rootScope.back(-2);
							$toast.show($localization.get("MESSAGE.ADD_SUCCESS"));
						}
					}else{
						var color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
						Medicamento.create({
							nombre: medicine.nombre,
							recalcine: false,
						}, function(ros){
							idMedicine = ros.id;
							MedicamentoUsuario.create({
								usuarioId: id,
								medicamentoId: idMedicine
							}).$promise.then(function(raq){
									medicines.push({
										idRelation: raq.id,
										id: ros.id,
										nombre: ros.nombre,
										recalcine: ros.recalcine
									});
									$rootScope.myMedicines = medicines;
									$localStorage.setJSON("medicines", medicines, false);
									$toast.show($localization.get("MESSAGE.ADD_SUCCESS"));
									//$state.go("others.medicinelist")
									$rootScope.alarmMedicine = medicine;
									$rootScope.back(-2);
								}, function(){
									$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
								})
						}, function(){
							$toast.show($localization.get("MESSAGE.ERROR_PROCESSING"));
						});
					}
				});

			}
		};
		$scope.other = function(){
			$cordovaDialogs.prompt(
				$localization.get("REGISTER.NAME_MEDICINE"),
				"Nuevo medicamento",
				[$localization.get("MESSAGE.CANCEL"), $localization.get("MESSAGE.ADD")],
				''
			).then(function(res) {
					var input = res.input1;
					// no button = 0, 'OK' = 1, 'Cancel' = 2
					var btnIndex = res.buttonIndex;
					if (btnIndex == 2) {
						$scope.addMedicina({nombre: input});
					}
				});
		};
		$scope.update();
	})
	.controller("WelcomeCtrl", function($scope, $state, $localStorage){
		$scope.welcome = function(view){
			$state.go(view);
		};
		$scope.start = function(){
			$localStorage.set("welcome", false);
			$state.go('main.dash.home');
		}
	})
;