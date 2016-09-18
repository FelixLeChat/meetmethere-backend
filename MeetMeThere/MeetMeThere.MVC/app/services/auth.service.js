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
      getToken: getToken,
      getInfo: getInfo,
    };

    return service;
    /////////////////////

    function login(credentials) {
      return DataGatewayService.post("login", credentials).then(function(response){
        if(response.status === 200 && response.data){
          $cookies.put('uinfo', {username: credentials.Username, email: credentials.Email});
          $cookies.put('utoken', response.data);
          $window.location.href = '/Dashboard/Teams';
        }
      });
    }

    function isLoggedIn() {
      return this.loggedIn = ($cookies.get('utoken') && true);
    }

    function signup(credentials) {
      return DataGatewayService.post("register", credentials).then(function(response){
        if(response.status === 200 && response.data){
          $cookies.put('uinfo', {username: credentials.Username});
          $cookies.put('utoken', response.data);
          $window.location.href = '/Dashboard/Teams';
        }
      });
    }

    function getToken(){
      return $cookies.get('utoken');
    }

    function getInfo(){
      return $cookies.get('uinfo');
    }

    function logout() {
      return DataGatewayService.post("logout", credentials).then(function(response){
        if(response.status === 200 && response.data){
          $cookies.delete('uinfo');
          $cookies.delete('utoken');
          $window.location.href = '/';
        }
      });
    }
  }
})();
