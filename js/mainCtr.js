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
	$scope.personIsSelected=false;
	$scope.personSelected="";
	$scope.selectedName="Please select a name";
	$scope.imgSource="img/defaultprofile.jpg";
	$scope.nameFilter=true;
	$scope.occupationFilter=true;
	$scope.companyFilter=true;
	$scope.ordering="surname";
	$scope.reverse = false;
	$scope.beginAt=0;
	$scope.itemsPerPage=15;
	$scope.filteredList="";
	
	getterService.async().then(function(response){
		$scope.data=response.data;
		$scope.READY = true;
	}, function(error){
		$scope.data="Something went wrong " + error;
	});
	
	$scope.changeFilter = function (filter) {
		if(filter==="All"){
			$scope.nameFilter=true;
			$scope.occupationFilter=true;
			$scope.companyFilter=true;
		}
		else{
			$scope.nameFilter=false;
			$scope.occupationFilter=false;
			$scope.companyFilter=false;
		}
		if(filter==="Name"){
			$scope.nameFilter=true;
		}
		else if(filter==="Occupation"){
			$scope.occupationFilter=true;
		}
		else if(filter==="Company"){
			$scope.companyFilter=true;
		}
	};
	
	$scope.search = function (person) {
		return ((angular.lowercase(person.firstName + ' ' + person.surname).indexOf(angular.lowercase($scope.search_param) || '') !== -1 && $scope.nameFilter)||
			(angular.lowercase(person.occupation).indexOf(angular.lowercase($scope.search_param) || '') !== -1 && $scope.occupationFilter)||
			(angular.lowercase(person.company).indexOf(angular.lowercase($scope.search_param) || '') !== -1 && $scope.companyFilter));
	};
	
	$scope.setSelected = function(person){
		$scope.personIsSelected=true;
		$scope.personSelected=person;
		$scope.selectedName=person.firstName + ' ' + person.surname;
		$scope.imgSource=person.portrait;
	};

	$scope.sortBy = function(ordering){
		if($scope.ordering === ordering){
			$scope.reverse = !$scope.reverse;
		}
		else{
			$scope.reverse = false;
		}
		$scope.ordering = ordering;
	};

	$scope.next = function(){
		var holder = $scope.beginAt;
		$scope.beginAt=$scope.beginAt+$scope.itemsPerPage;
		if($scope.beginAt>=$scope.data.length){
			console.log('Something went wrong revert value back to ' + holder);
			$scope.beginAt=holder;
		}
		console.log('next was called and the new beginAt is ' + $scope.beginAt);
	};

	//Still Buggy
	$scope.previous = function(){
		if(($scope.beginAt-$scope.itemsPerPage)<0){
			console.log('Something went wrong');
			$scope.beginAt=0;
		}
		else if($scope.beginAt){
			console.log('keep at 0');
			$scope.beginAt=0;
		}
		else{
			console.log('subtract');
			$scope.beginAt=$scope.beginAt-$scope.itemsPerPage;
		}
		console.log('previous was called and the new beginAt is ' + $scope.beginAt);
	};
	
	$scope.$watch('filteredList', function() {
			console.log('filteredList:', $scope.filteredList.length);
    });
});