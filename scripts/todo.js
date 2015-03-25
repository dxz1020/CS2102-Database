angular.module('store',['ionic'])

.controller('storeCtrl', function($scope, $ionicModal, $ionicPopup){
	$ionicModal.fromTemplateUrl('login.html', function(modal){
		$scope.taskModal = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	$scope.login = function(){
		$scope.taskModal.show();
	};
	$scope.close = function(){
		$scope.taskModal.hide();
	}
});

function ContentController($scope, $ionicSideMenuDelegate) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	$scope.getLifestyle = function() {
		$.ajax({
			method: "GET",
			url: "search.php",
			data: { category: 'App'
			}
		})
		.done(function(msg) {
			var listOfApps = JSON.parse(msg);
			renderSection(listOfApps, "lifestyleSection");   
		})
		.fail(function(msg) {
			console.log("failed"); 
		});
	};

	$scope.getMovie = function() {
		$.ajax({
			method: "GET",
			url: "search.php",
			data: { category: "Movie"
			}
		})
		.done(function(msg) {
			var listOfMovie = JSON.parse(msg);
			renderSection(listOfMovie, "movieSection");       
		})
		.fail(function(msg) {
			console.log("failed"); 
		});
	};

	$scope.getTV = function() {
		$.ajax({
			method: "GET",
			url: "search.php",
			data: { category: "TV"
		}
		})
		.done(function(msg) {
			var listOfTV = JSON.parse(msg);
			renderSection(listOfTV, "TVSection"); 
			//checkArr(listOfTV);       
		})
		.fail(function(msg) {
			console.log("failed"); 
		});
	};

	$scope.getGame = function() {
		$.ajax({
			method: "GET",
			url: "search.php",
			data: { category: "Game"
			}
		})
		.done(function(msg) {
			var listOfGame = JSON.parse(msg);
			renderSection(listOfGame, "gameSection"); 
			//checkArr(listOfGame);       
		})
		.fail(function(msg) {
			console.log("failed "); 
		});
	};
}

function checkArr(arr){
 for(var i = 0 ; i < arr.length ; i++) 
  console.log(arr[i]);
}

function renderSection(arr, type){
	var string = "";

	for(var i=0;i<arr.length;i++){

		string +=
		'<div class="item item-text-wrap">' +
		"Title: " + arr[i].TITLE + "<br />" +
		"Category: " + arr[i].CATEGORY + "<br />" +
		"Genre: " + arr[i].GENRE + "<br />" +
		"Device: " + arr[i].DEVICE + "<br />" +
		"Likes: " + arr[i].LIKES + "<br />" +
		"Price: " + arr[i].PRICE + "<br />" +
		"Rent: " + arr[i].RENT_PRICE + "<br />" +
		"Release: " + arr[i].RELEASE_DATE + 
		'</div>' ;  
	}
	document.getElementById(type).innerHTML= string;
}

function login(){
    //get variables
    $.ajax({
    method: "POST",
    url: "login.php",
    data: { email: name,
            password: pw
          }
  })
  .done(function( msg ) {
    console.log( "Login successful " + msg ); 
  })
  .fail(function(msg) {
    console.log("failed"); 
  });
}
