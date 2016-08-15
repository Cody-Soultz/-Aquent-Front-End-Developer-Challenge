angular.module('myApp', [])
.controller('mainCtr', function($http,$scope) {
	$http.get("http://private-a73e-aquentuxsociety.apiary-mock.com/members")
	.then(function(response){
		$scope.data=response.data;
	}, function(response){
		$scope.data="Something went wrong";
	});
	
	$scope.setSelected = function(person){
		console.log(person.firstName + ' ' + person.surname + ' was clicked');
	}
});