var app = angular.module('myApp', []);

app.factory('getterService', function($http){
	return {
		async: function() {
			return $http.get("http://private-a73e-aquentuxsociety.apiary-mock.com/members");
		}
	};
});

app.controller('mainCtr', function(getterService,$scope) {
	$scope.READY = false;
	getterService.async().then(function(response){
		//response.data=response.data | orderBy : 'surname';
		$scope.data=response.data;
		$scope.READY = true;
	}, function(error){
		$scope.data="Something went wrong " + error;
	});
	
	$scope.setSelected = function(person){
		console.log(person.firstName + ' ' + person.surname + ' was clicked');
	}
});