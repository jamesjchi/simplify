angular.module('OptCtrls', ['OptServices', 'ngMaterial', 'ngMessages'])
.controller('HomeCtrl', ['$http', '$scope', '$location', '$routeParams', '$window', 'Opt', '$mdBottomSheet', function($http, $scope, $location, $routeParams, $window, Opt, $mdBottomSheet) {
 $scope.openBottomSheet = function() {
    $mdBottomSheet.show({
      templateUrl: 'app/views/info.html'
    });
  };
}])
.controller('ShowCtrl', ['$http', 'Auth', '$scope', '$location', '$routeParams', 'Opt', function($http, Auth, $scope, $location, $routeParams, Opt) {
  $scope.user = Auth.currentUser();
  
  $scope.updateProfile = function(){
    Opt.query({_id:  $routeParams.id}, function success(run) { 
      console.log($scope.user._doc.email);
      console.log($scope.user._doc._id);
      $http({
        method: 'PUT',
        url: '/api/users/' + $routeParams.id,
        data: { _id: $routeParams.id,
          name: $scope.user._doc.name, 
          email: $scope.user._doc.email, 
          phone: $scope.user._doc.phone, 
          location: $scope.user._doc.location, 
          notifications: $scope.user._doc.notifications 
        }
      })
      console.log($scope.user._doc.name);
      $location.path('/profile');
    })
  }

}])
.controller('NewCtrl', ['Auth', '$scope', '$location', 'Opt', function(Auth, $scope, $location, Opt) {
  var userId  = Auth.currentUser();
  $scope.wardrobe = {
    brand: '',
    type: '',
    user: userId
  };
  $scope.createWardrobe = function() {
    Opt.save($scope.wardrobe, function success(data) {
      $location.path('/profile');
    }, function error(data) {
      console.log(data);
    });
  }
}])

//auth

.controller('NavCtrl', ['$scope', 'Auth', '$location', '$mdToast', function($scope, Auth, $location, $mdToast) {
  $scope.user = Auth.currentUser();
  $scope.logout = function() {
    Auth.removeToken();
    $location.path('/');
    $mdToast.show($mdToast.simple().content('You have logged out!'));
  };
}])
.controller('SignupCtrl', ['$scope', '$http', '$location', 'Auth', '$mdToast', function($scope, $http, $location, Auth, $mdToast) {
  $scope.user = {
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    notifications: ''

  };
  $scope.userSignup = function() {
    $http.post('/api/users', $scope.user).then(function success(res) {
      
      $http.post('/api/auth', $scope.user).then(function success(res) {
        Auth.saveToken(res.data.token);
        $location.path('/profile');
        $mdToast.show($mdToast.simple().content('You have signed up!'));
      }, function error(res) {
        console.log(data);
      });
    }, function error(res) {
      console.log(data);
      $location.path('/signup');
      $mdToast.show($mdToast.simple().content('Oops! Invalid credentials. Please try again.'));
    });
  }
}])
.controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', '$mdToast', function($scope, $http, $location, Auth, $mdToast) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userLogin = function() {

    $http.post('/api/auth', $scope.user).then(function success(res) {
      Auth.saveToken(res.data.token);
      if (res.data.token !== undefined) {
      // console.log('Token:', res.data.token);
      $location.path('/profile');
      $mdToast.show($mdToast.simple().content('You have been logged in!'));
      } else {
      $mdToast.show($mdToast.simple().content('Oops! Invalid login credentials. Please try again.'));
      $location.path('/login');
      }
    }, function error(res) {
      console.log(data);
      $mdToast.show($mdToast.simple().content('Oops! Invalid login credentials. Please try again.'));
      $location.path('/login');
    });
  }
}])
//weather

.controller('WeatherCtrl', ['$scope', '$http', 'Auth', '$mdDialog', function($scope, $http, Auth, $mdDialog){
  $scope.user = Auth.currentUser();
  // console.log($scope.user._doc._id);

  $scope.showAlert = function(ev) {
    $mdDialog.show(
      $mdDialog.alert()

  .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('This feature is coming soon!')
        .textContent('Here you will be able to add more custom notifications such as food suggestions for lunch based on your location or what the workout for your day is to add to your daily notifications!')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };

  $scope.getTemperature = function(){
    $http({
      method: 'GET',
      url: '/api/temperatures/'+ $scope.location
      
}).then(function success(res){
  if(res){
    $scope.wDescription = res.data.weather[0].description; 
    $scope.wTemp = res.data.main.temp;
    $scope.wPlace = res.data.name;
    console.log($scope.wDescription);
    
    switch (true) {
      case $scope.wTemp >= 85:
      clothesArray = veryHot   
      break;
      case $scope.wTemp >= 70:
      clothesArray = hot   
      break;
      case $scope.wTemp >= 50:
      clothesArray = warm 
      break;
      case $scope.wTemp >= 40:
      clothesArray = brisk 
      break;
      case $scope.wTemp >= 20:
      clothesArray = cold
      break;
      case $scope.wTemp >= 0:
      clothesArray = veryCold
      break;
      
    }
    $scope.clothesArray = clothesArray
  }
}, function error(res) {
  console.log(res)
});     
var clothesArray = [];
var veryCold = ['Gloves', 'Long sleeve', 'Heavy jacket', 'Insulated Jeans', 'Hat'];
var cold = ['Gloves', 'Long sleeve', 'Light jacket', 'Jeans', 'Hat'];
var brisk = ['T-Shirt', 'Jeans'];
var warm = ['T-Shirt', 'Shorts'];
var hot =['Breathable T-Shirt', 'Shorts'];
var veryHot = ['Shorts', 'Breathable T-Shirt'];
}

// yelp search function
  // $scope.yelpSearch = function(){
  //   var yelpReq = {
  //     method: 'GET',
  //     url: '/yelp',
  //     params: {
  //       location:$scope.searchLocation,
  //       term:$scope.searchTerm
  //     }
  //   }
  //   $http(yelpReq).success(function(data){
  //     $scope.results = data.data.businesses;
  //     $scope.total = data.data.total;
  //   })
  //  }

}])

