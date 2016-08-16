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
	$scope.personSelected=false;
	$scope.selectedName="Please select a name";
	$scope.imgSource="img/defaultprofile.jpg";
	$scope.selectedGender="";
	$scope.selectedEmail="";
	$scope.selectedCountry="";
	getterService.async().then(function(response){
		//response.data=response.data | orderBy : 'surname';
		$scope.data=response.data;
		$scope.READY = true;
	}, function(error){
		$scope.data="Something went wrong " + error;
	});
	
	$scope.setSelected = function(person){
		console.log(person.firstName + ' ' + person.surname + ' was clicked');
		$scope.personSelected=true;
		$scope.selectedName=person.firstName + ' ' + person.surname;
		$scope.imgSource=person.portrait;
		$scope.selectedGender=person.gender;
		$scope.selectedEmail=person.email;
		$scope.selectedCountry=person.country;
	}
});