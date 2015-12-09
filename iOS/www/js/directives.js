angular.module('Recalcine.directives', [])
    .directive("verticalCenter", function($log){
        return {
            link: function (scope, element, attr) {
                var ionContent = angular.element("ion-content");
                var mTop = (ionContent.height()-angular.element(element).height())/2;
                var eTop = angular.element(element).offset().top;
            }
        }
    })
    .directive("lowerspace", function($log, $interval){
        return {
            link: function(scope, element, attr){

                $interval(function(){
	                if(!$(element).hasClass("resized")) {
		                var upperspace = $(element).siblings().outerHeight();
		                if (upperspace == 0) {
			                upperspace = $(element).siblings().find(":first").outerHeight();
		                }
		                var content = $(element).parents("ion-content").outerHeight();
		                $(element).height(content - upperspace);
		                $(element).addClass("resized");
	                }
                }, 100);
            }
        }
    })
	.directive("upperspace", function($log, $interval){
		return {
			link: function(scope, element, attr){
				$interval(function(){
					if(!$(element).hasClass("resized")) {
						var lowerspace = $(element).siblings().outerHeight();
						if (lowerspace == 0) {
							lowerspace = $(element).siblings().find(":first").outerHeight();
						}
						var content = $(element).parents("ion-content").outerHeight();
						$(element).height(content - lowerspace);
						$(element).addClass("resized");
					}
				}, 100);
			}
		}
	})
	.directive("selectInside", function(){
		return {
			require: 'ngModel',
			scope: {
				default: "=selectInside"
			},
			link: function(scope, e, attr, ctrl){
				var element = $(e).parents(".item");
				$(element).on("click", function(){
					if(typeof(ctrl.$viewValue) == undefined || ctrl.$viewValue == undefined){
						ctrl.$setViewValue(scope.default);
						ctrl.$render();
					}
				}).promise();
				$(element).on("blur", function(){
				});
				$(element).on("focus", function(){
				});
				$(element).on("input", function(e){
					e.preventDefault();
				});
				$(element).on("change", function(e){
					e.preventDefault();
				}).promise();

			}
		}
	})
	.directive("timePicker", function($cordovaDatePicker){
		return {
			scope: {
				model: "=timePicker"
			},
			link: function(s, e, a, c){
				$(e).css("position", "relative");
				$(e).append("<div style='position: absolute;width:100%;height:100%;top:0;z-index:10;'></div>");
				$(e).find("input").css({"position": "relative", "z-index": "1"});
				$(e).on("click", function(e){
					e.preventDefault();
					e.stopPropagation();

					var options = {
						date: s.model,
						mode: 'time', // or 'time'
						minDate: s.model - 100000000,
						allowOldDates: true,
						allowFutureDates: true,
						doneButtonLabel: 'Hecho',
						doneButtonColor: '#000000',
						cancelButtonLabel: 'Cancelar',
						cancelButtonColor: '#000000',
						is24Hour: true
					};

					s.model.setSeconds(0);
					s.model.setMilliseconds(0);

					$cordovaDatePicker.show(options).then(function(date){
						s.model = date;
						s.model.setSeconds(0);
						s.model.setMilliseconds(0);
					}, function(){
						s.model = new Date();
						s.model.setSeconds(0);
						s.model.setMilliseconds(0);
					});

				})
			}
		}
	})
		.directive("listpicker", function(){
			return {
				require: 'ngModel',
				link: function(scope, e, attr, ctrl){
					var items = [];
					var interval = null;
					var config = {
						title: attr.title || "Selecciona una opción",
						items: [],
						selectedValue: attr.defaultValue || "",
						doneButtonLabel: "Aceptar",
						cancelButtonLabel: "Cancelar"
					};
					function loadElements(){
						if( $(e).find(".elements").length > 0 ) {
							clearInterval(interval);
							$(e).find(".elements span").each(function (i) {
								items.push({
									text: $(this).text(),
									value: $(this).attr("value")
								});
							}).promise().done(function () {
								config.items = items;
							});
						}else{
							setInterval(function(){
								loadElements();
							}, 250)
						}
					}

					loadElements();

					$(e).on("click", function(e){
						var items = [];
						$(this).find(".elements span").each(function(i){
							items.push({
								text: $(this).text(),
								value: $(this).attr("value")
							});
						}).promise().done(function(){
							config.items = items;
							try {
								window.plugins.listpicker.showPicker(config,
										function (item) {
											ctrl.$setViewValue(item);
											ctrl.$render();

										},
										function () {
											//alert("You have cancelled");
										}
								);
							}catch(e){

							}
						});
					})
				}
			}
		})
	.directive("colorpicker", function(){
		return {
			scope:  {
				onchange: "=change",
				start: "=",
				default: "="
			},
			link: function(scope, element){
				var colors = ['#FF9000', '#CC0C56', '#139EEA', '#42D551'];
				$(element).spectrum({
					showPaletteOnly: true,
					showPalette:true,
					color: colors[scope.start],
					palette: [
						colors,
						['#074080', 'red', 'green', 'blue']
					],
					move: function(color) {
						try {
							scope.onchange(color.toHexString(), color)
						}catch(e){

						}
					},
					change: function(color) {
						try {
							scope.onchange(color.toHexString(), color)
						}catch(e){

						}
					}
				});
			}
		}
	})
	.directive("fileimage", function($timeout, $cordovaCamera, $toast, $localization, $cordovaActionSheet, $cordovaDevice){
		return {
			scope: {
				model: "=ngModel"
			},
			link: function(s, e, a, c){
				$(e).on("click", function(ev){
					// Show the action sheet
					var cordova = false;
					try{
						$cordovaDevice.getPlatform();
						cordova = true;
					}catch(e){
						cordova = false;
					}
				//if(cordova) {
					//options.allowEdit = false

					$cordovaActionSheet.show({
						title: '',
						buttonLabels: ['Tomar foto', 'Elegir foto'],
						addCancelButtonWithLabel: 'Cancelar',
						androidEnableCancelButton: true,
						winphoneEnableCancelButton: true
					}).then(function (btnIndex) {
						var index = btnIndex;
						$toast.loading($localization.get("MESSAGE.LOADING"));
						/* CAMERA */
						if (index == 0 || index > 2) {
							$cordovaCamera.cleanup();
							$toast.hide();
						}

						if (index == 1) {
							var options = {
								quality: 100,
								destinationType: Camera.DestinationType.DATA_URL,
								sourceType: Camera.PictureSourceType.CAMERA,
								allowEdit: true,
								MediaType: Camera.MediaType.PICTURE,
								encodingType: Camera.EncodingType.PNG,
								targetWidth: 100,
								targetHeight: 100,
								popoverOptions: CameraPopoverOptions,
								saveToPhotoAlbum: true
							};
							$cordovaCamera.getPicture(options).then(function (imageData) {
								s.model = "data:image/png;base64," + imageData;
								$cordovaCamera.cleanup();
								$toast.hide();
							})
						}
						/* GALLERY */
						if (index == 2) {
							$cordovaCamera.getPicture({
								quality: 100,
								destinationType: Camera.DestinationType.DATA_URL,
								sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
								allowEdit: true,
								MediaType: Camera.MediaType.PICTURE,
								encodingType: Camera.EncodingType.PNG,
								targetWidth: 100,
								targetHeight: 100,
								popoverOptions: CameraPopoverOptions,
								saveToPhotoAlbum: false
							}).then(function (imageData) {
								s.model = "data:image/png;base64," + imageData;
								$cordovaCamera.cleanup();
								$toast.hide();
							})
						}
					});
				});
			}
		}
	})
		.directive("map", function($log, $interval, $rootScope, $localStorage, $timeout, $filter, $toast, $localization, $geolocation, $cordovaNetwork){
			return {
				scope:  {
					options: "=map",
					marker: "=",
					sucursals: "=sucursals",
					change: "="
				},
				link: function(scope, element, attr){
					var centered = false;
					var newCentered = false;
					var map;
					var markers = [];
					var me;
					function initMap(){
						var infowindow = new google.maps.InfoWindow({});
						scope.marker = scope.marker || [];
						$toast.loading($localization.get("MESSAGE.LOADING"));
						var center = $localStorage.getJSON("location", false) || {lat: -33.4718999, lng: -70.9100214};
						if(center.long){
							center.lng = center.long;
							delete center.long;
						}
						if (scope.marker.length > 0) {
							center = {lat: scope.marker[0].lat, lng: scope.marker[0].lng};
						}
						var mapOptions = {
							center: center,
							zoom: 15,
							navigationControl: false,
							mapTypeControl: false,
							streetViewControl: false,
							zoomControl: true
						};

						map = new google.maps.Map($(element)[0], mapOptions);
						window.map = map;
						google.maps.event.addListener(map, 'center_changed', function () {
							if (scope.change) {
								center = map.getCenter();
								scope.change(center.lat(), center.lng());
							}
							//google.maps.event.trigger(map,'resize');
						});
						google.maps.event.addListener(map, 'resize', function () {
							if (scope.marker.length > 0 && !newCentered) {
								//if(!map.updated) {
								map.setCenter(new google.maps.LatLng(scope.marker[0].lat, scope.marker[0].lng));
								newCentered = true;

								map.updated = true;
								//}
							}
							$geolocation.getCurrentPosition().then(function (res) {
								google.maps.event.trigger(map, 'resize');
								if (scope.marker.length == 0) {
									map.setCenter(new google.maps.LatLng(res.lat, res.long));
									centered = true;
								}
								try {
									me.setMap(null);
								} catch (e) {

								}
								//if(scope.options == "me"){
								me = new google.maps.Marker({
									position: new google.maps.LatLng(res.lat, res.long),
									icon: "img/"+$rootScope.svg("pin2"),
									map: map
								});
							}, function (res) {
							}, function (res) {
							});
						});
						if(center.lat != 0){
							google.maps.event.trigger(map, 'resize');
							try {
								me.setMap(null);
							} catch (e) {

							}
							//if(scope.options == "me"){
							me = new google.maps.Marker({
								position: new google.maps.LatLng(center.lat, center.lng),
								icon: "img/"+$rootScope.svg("pin2"),
								map: map
							});
						}
						$geolocation.watchPosition({
							frequency: 1000,
							timeout: 5000,
							enableHighAccuracy: false
						}).then(function () {
						}, function (err) {

						}, function (pos) {
							if (scope.marker.length == 0 && !centered) {
								map.setCenter(new google.maps.LatLng(pos.lat, pos.long));
								centered = true;
							}
							//map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
							if (me) {
								me.setPosition(new google.maps.LatLng(pos.lat, pos.long))
							}else{
								google.maps.event.trigger(map, 'resize');
								try {
									me.setMap(null);
								} catch (e) {

								}
								//if(scope.options == "me"){
								me = new google.maps.Marker({
									position: new google.maps.LatLng(pos.lat, pos.long),
									icon: "img/"+$rootScope.svg("pin2"),
									map: map
								});
							}
						});
						google.maps.event.addListener(map, 'projection_changed', function () {
							google.maps.event.trigger(map, 'resize');
							$geolocation.getCurrentPosition().then(function (res) {
								google.maps.event.trigger(map, 'resize');
								if (scope.marker.length == 0) {
									map.setCenter(new google.maps.LatLng(res.lat, res.long));
									centered = true;
								}
								try {
									me.setMap(null);
								} catch (e) {

								}
								//if(scope.options == "me"){
								me = new google.maps.Marker({
									position: new google.maps.LatLng(res.lat, res.long),
									icon: "img/"+$rootScope.svg("pin2"),
									map: map
								});
							}, function (res) {
							}, function (res) {
							});
						});
						$interval(function () {
							var base = $(".gm-style div:first > :nth-child(3) :nth-child(4) > :first").append("<div class='bg-bottom-infowindow'></div>");
							var baseStyle = $(".gm-style div:first > :nth-child(3) :nth-child(4) > :first > :first > :nth-child(4)");
							if (!$(base).hasClass("transparent") && base.length > 0) {
								base.append("<div class='bg-bottom-infowindow'></div>");
								base.find(":first > :nth-child(2)").css({"boxShadow": "none", "background": "none !important"});
								$(".bg-bottom-infowindow").css({
									"position": "absolute",
									"width": "100%",
									"left": "0",
									"top": "60px",
									"bottom": "0",
									"z-index": "0",
									"background": "white"
								});
								$(".gm-style-iw").css("z-index", 1);
								$(baseStyle).css("background", "rgba(255, 255, 255, 0.8)");
								$(base).addClass("transparent");
							}
						}, 1000);

						if (scope.marker.length > 0) {
							var marker = new google.maps.Marker({
								position: new google.maps.LatLng(scope.marker[0].lat, scope.marker[0].lng),
								icon: "img/"+$rootScope.svg("pin"),
								map: map
							});
							marker.setMap(map);
							map.setCenter(new google.maps.LatLng(scope.marker[0].lat, scope.marker[0].lng));
							centered = true;
						}
						scope.$watch('marker', function (n, o) {
							if(scope.marker[0]) {
								if (scope.marker[0].lat && scope.marker[0].lng) {
									var marker = new google.maps.Marker({
										position: new google.maps.LatLng(scope.marker[0].lat, scope.marker[0].lng),
										icon: "img/" + $rootScope.svg("pin"),
										map: map
									});
									marker.setMap(map);
									map.setCenter(new google.maps.LatLng(scope.marker[0].lat, scope.marker[0].lng));
									centered = true;
								}
							}
						}, true);
						window.map = map;
						if (scope.sucursals) {
							scope.$watch('sucursals', function (n, o) {
								var enough = n;
								_.forEach(markers, function (v, k) {
									if (_.findIndex(n, {id: v.idMarker}) < 0) {
										markers[k].setMap(null);
									}
								});
								//markers = [];
								if (n.length > 0) {
									_.forEach(n, function (v, k) {
										var exist = _.findWhere(markers, {idMarker: v.id});
										var index = _.findIndex(markers, {idMarker: v.id});
										if (!exist) {
											var pin = v.cadena.pin || "pin";
											var marker = new google.maps.Marker({
												idMarker: v.id,
												position: new google.maps.LatLng(v.geo.lat, v.geo.lng),
												icon: "img/" +$rootScope.svg(pin),
												map: map
											});
											marker.setMap(map);
											window.infowindow = infowindow;
											marker.text = contentString = '<a onclick="javascript:window.infowindow.close()" href="#/main/search/view/' + v.id + '" class="info-farmacia"><div class="imagen-cadena"><img src="' + v.cadena.imagen + '" alt=""/></div>' +
													'<div class="nombre-cadena">' + $filter('capitalize')(v.cadena.nombre) + '</div>' +
													'<div class="nombre-sucursal">' + $filter('capitalize')(v.nombre) + ' <i class="icon ion-ios-arrow-forward gray"></i> </div></a>';
											google.maps.event.addListener(marker, 'click', function () {
												infowindow.setContent(this.text);
												infowindow.open(map, marker);
											});
											markers.push(marker);
										} else {
											if (exist.map == null) {
												exist.setMap(map)
											}
										}

										//}
									});
								}
							}, true);
						}
						$interval(function () {
							google.maps.event.trigger(map, 'resize');
						}, 1000);
					}
					if($cordovaNetwork.isOffline()){
						var interval = $interval(function(){
							if($cordovaNetwork.isOnline() && typeof google != "undefined"){
								$interval.cancel(interval);
								initMap();
							}
						}, 500);
					}else {
						initMap()
					}
				}
			}
		})
		.directive("alquimioAutocomplete", function(){
			return {

				templateUrl: "templates/directives/autocomplete.html",
				require: "ngModel",
				transclude: true,
				scope: {
					"alquimioAutocomplete": "=",
					"ngModel": "=",
					"callback": "&",
					"form": "="
				},
				link: function(s, e, a, c){
					var selected = false;
					s.$watch('ngModel', function(n){
						if(n){
							if(selected){
								c.$setPristine();
								selected = false;
							}else{
								c.$setDirty();
							}
						}else{
							c.$setPristine();
						}
					});
					s.autocompleted = function(med){
						c.$pristine = false;
						c.$setViewValue(med.nombre);
						c.$pristine = true;
						selected = true;
						if(s.callback){
							s.callback({search: s.form});
						}
					};
					s.view = c;
				}
			}
		});
