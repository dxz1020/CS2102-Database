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

	$scope.getApp = function() {
		$.ajax({
			method: "GET",
			url: "search.php",
			data: { category: 'App'
			}
		})
		.done(function(msg) {
			var listOfApps = JSON.parse(msg);
			checkArr(listOfApps);       
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
			checkArr(listOfMovie);       
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
			checkArr(listOfTV);       
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
			checkArr(listOfGame);       
		})
		.fail(function(msg) {
			console.log("failed "); 
		});
	};
}