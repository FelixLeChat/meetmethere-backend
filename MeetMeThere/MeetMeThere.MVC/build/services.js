(function(){
  angular.module('app.services', []);
})();

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

(function() {

  /**
   * DataGatewayService
   * Responsible for querying the backend for AJAX data.
   * Implements the Gateway DS Pattern, decoupling the rest of the architecture from
   * the backend interface.
   * Is stateless.
   **/
  angular.module("app.services")
    .service('DataGatewayService', DataGatewayService);

  DataGatewayService.$inject = ['$http'];

  function DataGatewayService($http) {
    var service = {
      post: http("POST"),
      get: http("GET"),
    };

    return service;
    /////////////////////

    /**
     * Requests data from the backend. Handles $http errors.
     * @param route <string> URL route to call
     * @param payload <object> JSON object used to specify query criteria to the backend
     **/
    function http(method){
      return function request(route, payload, token) {
        console.log("Requesting route " + route + " with payload");
        console.log(payload);
        var req = {
          method: method,
          url: "/api/" + route,
          headers: {
            "Content-Type": "application/json"
          }
        };
        if(payload){
          req.data = payload;
        }
        if(token){
          req.headers.Authorization = token;
        }
        return $http(req).then(
          function(response) {
            console.log(response);
            return Promise.resolve(response);
          },
          function(error) {
            console.error(error);
            return Promise.reject(error);
          }
        );
      };
    }
  }
})();
