var app = angular.module('OptimizerApp', ['ngRoute', 'OptCtrls', 'OptServices', 'ngMaterial']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/home.html',
  })
  .when('/signup', {
    templateUrl: 'app/views/signup.html',
    controller: 'SignupCtrl'
  })
  .when('/login', {
    templateUrl: 'app/views/login.html',
    controller: 'LoginCtrl'
  })
  .when('/profile',{
    templateUrl: 'app/views/profile.html',
    controller:'WeatherCtrl'
  })
  .when('/profile/addWardrobe',{
    templateUrl: 'app/views/addWardrobe.html',
    controller: 'NewCtrl'
  })
  .when('/profile/:id', {
    templateUrl: 'app/views/editProfile.html',
    controller: 'ShowCtrl'
  })
  .when('/about',{
    templateUrl: 'app/views/about.html',
  })
  .when('/howitworks',{
    templateUrl: 'app/views/howitworks.html',
  })
  .otherwise({
    templateUrl: 'app/views/404.html'
  });
  $locationProvider.html5Mode(true);
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}]).run(["$rootScope", "Auth", function($rootScope, Auth) {
  $rootScope.isLoggedIn = function() {
    return Auth.isLoggedIn.apply(Auth);
  };
}]);