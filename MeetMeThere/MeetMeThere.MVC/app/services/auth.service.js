(function() {

  angular.module('app.services')
    .service('AuthService', AuthService);

  AuthService.$inject = ['$http', '$location', '$window', '$cookies', 'DataGatewayService'];

  function AuthService($http, $location, $window, $cookies, DataGatewayService) {
    var loggedIn = false;

    var service = {
      signup: signup,
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
    };

    return service;
    /////////////////////

    function login(credentials) {
      return DataGatewayService.post("login", credentials).then(function(response){
        if(response.status === 200 && response.headers.Authorization){
          $cookies.put('uinfo', {username: credentials.Username, email: credentials.Email});
          $cookies.put('utoken', response.headers.Authorization);
        }
      });
    }

    function isLoggedIn() {
      return this.loggedIn == ($cookies.get('utoken') && true);
    }

    function signup(credentials) {
      return DataGatewayService.post("register", credentials).then(function(response){
        if(response.status === 200 && response.headers.Authorization){
          $cookies.put('uinfo', {username: credentials.Username});
          $cookies.put('utoken', response.headers.Authorization);
        }
      });
    }

    function logout() {
      return DataGatewayService.post("logout", credentials).then(function(response){
        if(response.status === 200 && response.headers.Authorization){
          $cookies.delete('uinfo');
          $cookies.delete('utoken');
          $location.path('/');
          $window.location.reload();
        }
      });
    }
  }
})();
