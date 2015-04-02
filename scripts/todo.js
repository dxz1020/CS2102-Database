var myApp = angular.module('store',['ionic'])

myApp.controller('storeCtrl', function($scope, $ionicModal, $ionicPopup){
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

	$scope.logout = function(){		
		$.ajax({
			method: "GET",
			url: "logout.php"
		})
		.done(function( msg ) {
			alert( "You have successfully logged out");					 
		})
		.fail(function(msg) {
			console.log("error"); 
		});
	};
});

function ContentController($scope, $ionicSideMenuDelegate, $ionicPopup) {

	$scope.name = 'Digital Content Store';

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
			$scope.lifestyleContent = renderSection(listOfApps, "lifestyleSection"); 
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
			$scope.movieContent = renderSection(listOfMovie, "movieSection");       
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
			$scope.tvContent = renderSection(listOfTV, "TVSection"); 
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
			$scope.gameContent = renderSection(listOfGame, "gameSection"); 
			//checkArr(listOfGame);      
		})
		.fail(function(msg) {
			console.log("failed "); 
		});
	};

	$scope.like = function(item) {

		id = {
			'itemid' : item
		};
		var itemIdJSON = JSON.stringify(id);
		
		$.ajax({
			method: "POST",
			url: "transactions.php?type=like",
			data: itemIdJSON
		})
		.done(function(msg) {
			alert("Thank you for liking the item");
			var beforeLike = parseInt($('#' +item).html());
			$('#' +item).html(beforeLike+1);
			//document.location.href='';   
		})
		.fail(function(msg) {
			
			var alertPopup = $ionicPopup.alert({
				title: 'Issue',
				template: "You have either liked this item or you aren't signed in"
			});
			alertPopup.then(function(res) {
				console.log("You have either liked this item or you aren't signed in");
			});
		});
	};

	$scope.buy = function(item) {

		id = {
			'itemid' : item
		};
		var itemIdJSON = JSON.stringify(id);

		$.ajax({
			method: "POST",
			url: "transactions.php?type=buy",
			data: itemIdJSON
		})
		.done(function(msg) {
			var alertPopup = $ionicPopup.alert({
				title: 'Issue',
				template: "You have successfully purchased the item"
			});
			alertPopup.then(function(res) {
				console.log("You have successfully purchased the item");
			});
			//document.location.href='';   
		})
		.fail(function(msg) {
			var alertPopup = $ionicPopup.alert({
				title: 'Issue',
				template: "You have either bought this item or you aren't signed in"
			});
			alertPopup.then(function(res) {
				console.log("You have either bought this item or you aren't signed in");
			});
		});
	};

	/*
	$scope.rent = function(item) {

		id = {
			'itemid' : item
		};
		var itemIdJSON = JSON.stringify(id);
		
		$.ajax({
			method: "POST",
			url: "transactions.php?type=rent",
			data: itemIdJSON
		})
		.done(function(msg) {
			alert("You have rented " + item);		       
		})
		.fail(function(msg) {
			var alertPopup = $ionicPopup.alert({
				title: 'Issue',
				template: "You have either rented this item or you aren't signed in"
			});
			alertPopup.then(function(res) {
				console.log("You have either rented this item or you aren't signed in");
			});
		});
};*/
}

myApp.directive('dir', function($compile, $parse) {
	return {
		restrict: 'E',
		link: function(scope, element, attr) {
			scope.$watch(attr.content, function() {
          element.html($parse(attr.content)(scope)); //changes the html inside
          $compile(element.contents())(scope);
      }, true);
		}
	}
})

function checkArr(arr){
	for(var i = 0 ; i < arr.length ; i++) 
		console.log(arr[i]);
}

function renderSection(arr, type){
	var string = "";

	for(var i=0;i<arr.length;i++){

		string +=
		'<div class="card">' +
		'<div class="item item-text-wrap">' +
		"<b>Title</b>: " + arr[i].TITLE + "<br />" +
		"<b>Category</b>: " + arr[i].CATEGORY + "<br />" +
		"<b>Genre</b>: " + arr[i].GENRE + "<br />" +
		"<b>Device</b>: " + arr[i].DEVICE + "<br />" +
		//"Likes: " + arr[i].LIKES + "<br />" +
		"<b>Price</b>: $" + arr[i].PRICE + ".00<br />" +
		"<b>Rent</b>: $" + arr[i].RENT_PRICE + ".00<br />" +
		"<b>Release</b>: " + arr[i].RELEASE_DATE + 
		'</div>' +

        '<div class="item tabs tabs-secondary tabs-icon-left">' +
        '<a class="tab-item" ng-click="like(' + arr[i].ITEM_ID + ')">' +
        '<i class="icon ion-thumbsup"></i> Likes <span id=' + arr[i].ITEM_ID + '>'+ arr[i].LIKES + '</span></a>' +
        '<a class="tab-item" ng-click="rent(' + arr[i].ITEM_ID + ')">' +
        '<i class="icon ion-archive"></i> Rent </a> ' +
        '<a class="tab-item" ng-click="buy(' + arr[i].ITEM_ID + ')">' +
        '<i class="icon ion-ios7-cart"></i> Buy </a>' +
        '</div></div>'

    }
	//document.getElementById(type).innerHTML= string;
	return string; 
}

myApp.controller('LoginController', ['$scope', function($scope) {
	
	$scope.login = function(){
		$scope.taskModal.show();
	};

	$scope.close = function(){
		$scope.taskModal.hide();
	}

	$scope.userLogin = function() {
		var info = $('#loginForm').serializeArray();

		var name = info[0].value;
		var pw = info[1].value;
		
		info = {
			'email' : name,
			'password' : pw
		};

		var infoJSON = JSON.stringify(info);

		$.ajax({
			method: "POST",
			url: "login.php",
			data: infoJSON
		})
		.done(function( msg ) {
			if(msg==1){
				//Ask zixian to pass me name
				alert("Login Successful");
				$('.logout-btn').css({
					"background-color": "#ef4e3a",
					"border-color": "#cc2311"
				});
				
				var bigscope = angular.element($("#dynamictitle")).scope();
				bigscope.$apply(function(){
					bigscope.name = "Welcome, user ABC";
					//$('.title').html("Greetings, Peasants");
				})
			}
			else {
				alert("Verification failed");
			}

		})
		.fail(function(msg) {
			console.log("error"); 
		});
	};

}]);

myApp.controller('SearchController', ['$scope', function($scope) {

	$scope.query = function(queryString) {
		
		queryString; 

		$.ajax({
			method: "GET",
			url: "search.php",
			data: { title: queryString
			}
		})
		.done(function(msg) {
			var listOfMatches = JSON.parse(msg);
			console.log(listOfMatches);
			var scope = angular.element($("#mainContent")).scope();
			scope.$apply(function(){
				if (listOfMatches.length == 0) {
					scope.maincontents = "Sorry, no results found";
				} else {
					scope.maincontents = renderSection(listOfMatches);
				}
			})

		})
		.fail(function(msg) {
			console.log("failed"); 
		});
	};

}]);







