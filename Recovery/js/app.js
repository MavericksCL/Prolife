var app = angular.module('RecoveryApp', ['ngRoute']);

var server = "http://recalcine.cloudapp.net:3000/api";

app.controller("HomeCtrl", function($scope, $location, $http){
	$scope.passEquals = false;
	$scope.password = '';
	$scope.$watch('password', function(n){
		console.log(n);
		if(n == $scope.passwordRepeat && typeof n != "undefined" && typeof $scope.passwordRepeat != "undefined"){
			$scope.passEquals = true;
			console.log($scope.passEquals);
		}else{
			$scope.passEquals = false;
		}
	});
	$scope.$watch('passwordRepeat', function(n){
		console.log(n == $scope.password);
		if(n == $scope.password && typeof n != "undefined" && typeof $scope.password != "undefined"){
			$scope.passEquals = true;
			console.log($scope.passEquals);
		}else{
			$scope.passEquals = false;
		}
	});
	$scope.params = $location.search();
	if(typeof $scope.params.access_token == "undefined"){
		window.location.href = "failed.html";
	}
	$scope.send = function(){
		$http.post(server+'/usuarios/confirmReset', {
			password: $scope.password,
			accessToken: $scope.params.access_token
		}).success(function(res){
			if(res.response.code == "PASSWORD_CHANGED"){
				window.location.href = "ok.html";
			}else{
				window.location.href = "failed.html";
			}
		})
	};

});