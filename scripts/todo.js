angular.module('todo',['ionic'])

.controller('TodoCtrl', function($scope, $ionicModal, $ionicPopup){
	$ionicModal.fromTemplateUrl('new-task.html', function(modal){
		$scope.taskModal = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('new-task_1.html', function(modal) {
    $scope.taskModal_1 = modal;
  	}, {
    scope: $scope,
    animation: 'slide-in-up'
  	});
});