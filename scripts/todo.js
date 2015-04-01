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
			alert("You have either liked this item or you aren't signed in"); 
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
			alert("You have successfully purchased the item");
			//document.location.href='';   
		})
		.fail(function(msg) {
			alert("You have either bought this item or you aren't signed in"); 
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
			alert("You have either rented this item or you aren't signed in"); 
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
		"Title: " + arr[i].TITLE + "<br />" +
		"Category: " + arr[i].CATEGORY + "<br />" +
		"Genre: " + arr[i].GENRE + "<br />" +
		"Device: " + arr[i].DEVICE + "<br />" +
		//"Likes: " + arr[i].LIKES + "<br />" +
		"Price: " + arr[i].PRICE + "<br />" +
		"Rent: " + arr[i].RENT_PRICE + "<br />" +
		"Release: " + arr[i].RELEASE_DATE + 
		

        /*'<button class="button button-positive button-small likeBtn basicForms" ng-click="like(' + arr[i].ITEM_ID + ')">' +           	
    	'Like it  ' + arr[i].LIKES +'</button>' +    	
    	
        '<button class="button button-positive button-small rentBtn basicForms" ng-click="rent(' + arr[i].ITEM_ID + ')">' +          	
    	'Rent </button>' +

        '<button class="button button-positive button-small buyBtn basicForms" ng-click="buy(' + arr[i].ITEM_ID + ')">' +           	
        "Buy </button></form></div>"; */


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

function textBoxSearch(){

	var userInput = "lord";
	$.ajax({
			method: "GET",
			url: "search.php",
			data: { title: "Movie"
				  }
		})
		.done(function(msg) {
			var listOfMovie = JSON.parse(msg);
			$scope.movieContent = renderSection(listOfMovie, "movieSection");       
		})
		.fail(function(msg) {
			console.log("failed"); 
		});
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
				alert( "LOGIN SUCCESSFUL");
				$('.logout-btn').css({
					"background-color": "#ef4e3a",
					"border-color": "#cc2311"
				});

				$('.title').html("Greetings, Peasants");
			}
			else {
				alert( "Verification failed");
			}

		})
		.fail(function(msg) {
			console.log("error"); 
		});
	};

}]);


