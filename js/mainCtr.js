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
	$scope.filteredList=[{}];
	$scope.filteredLength=0;
	$scope.sorting="All";
	$scope.page=[
		{page:1,isActive:true,isHidden:false},
		{page:2,isActive:false,isHidden:false},
		{page:3,isActive:false,isHidden:false},
		{page:4,isActive:false,isHidden:false},
		{page:5,isActive:false,isHidden:false},
		{page:6,isActive:false,isHidden:false},
		{page:7,isActive:false,isHidden:false}
	];
	$scope.leftVisible=false;
	$scope.rightVisible=true;
	var totalPages=0;
	
	getterService.async().then(function(response){
		$scope.data=response.data;
		$scope.READY = true;
	}, function(error){
		$scope.data="Something went wrong " + error;
	});
	
	$scope.changeFilter = function (filter) {
		$scope.sorting=filter;
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
		var visiblePages=0;
		for(i=0;i<$scope.page.length;i++){
			if($scope.page[i].isActive&&$scope.page[i].page!==totalPages){
				refreshPagination($scope.page[i].page+1);
			}
		}
	};

	$scope.previous = function(){
		for(i=1;i<$scope.page.length;i++){
			if($scope.page[i].isActive){
				refreshPagination($scope.page[i].page-1);
			}
		}
	};
	
	$scope.$watch('filteredList', function() {
		if($scope.READY){
			$scope.filteredLength=$scope.filteredList.length;
			refreshPagination(1);
		}
	});
	
	$scope.pageClicked= function(theClickedPage){
		console.log("The Clicked Page: " + theClickedPage.page)
		refreshPagination(theClickedPage.page);
	};
	
	refreshPagination=function(pageNumber){
		totalPages=Math.floor($scope.filteredLength/$scope.itemsPerPage);
		$scope.page[6].page=totalPages;
		$scope.page[1].isHidden=false;
		$scope.page[2].isHidden=false;
		$scope.page[3].isHidden=false;
		$scope.page[4].isHidden=false;
		$scope.page[5].isHidden=false;
		$scope.page[6].isHidden=false;
		switch(totalPages) {
			case 0:
			case 1:
				$scope.page[1].isHidden=true;
			case 2:
				$scope.page[2].isHidden=true;
			case 3:
				$scope.page[3].isHidden=true;
			case 4:
				$scope.page[4].isHidden=true;
			case 5:
				$scope.page[5].isHidden=true;
			case 6:
				$scope.page[6].isHidden=true;
			case 7:
				$scope.rightVisible=false;
				break;
			default:
				$scope.rightVisible=true;
		}
		if(pageNumber>4){
			$scope.leftVisible=true;
			if((totalPages-pageNumber)<=3){
				$scope.rightVisible=false;
				$scope.page[5].page=totalPages-1;
				$scope.page[4].page=totalPages-2;
				$scope.page[3].page=totalPages-3;
				$scope.page[2].page=totalPages-4;
				$scope.page[1].page=totalPages-5;
			}
			else{
				$scope.page[1].page=pageNumber-2;
				$scope.page[2].page=pageNumber-1;
				$scope.page[3].page=pageNumber;
				$scope.page[4].page=pageNumber+1;
				$scope.page[5].page=pageNumber+2;
			}
		}
		else{
			$scope.page[1].page=2;
			$scope.page[2].page=3;
			$scope.page[3].page=4;
			$scope.page[4].page=5;
			$scope.page[5].page=6;
		}
		for(i=0;i<$scope.page.length;i++){
			if($scope.page[i].page===pageNumber){
				$scope.page[i].isActive=true;
			}
			else{
				$scope.page[i].isActive=false;
			}
		}
		$scope.beginAt=pageNumber*$scope.itemsPerPage;
	}
});