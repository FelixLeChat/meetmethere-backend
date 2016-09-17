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
      return function request(route, payload) {
        console.log("Requesting route " + route + " with payload");
        console.log(payload);
        var req = {
          method: method,
          url: "api/" + route,
          headers: {
            "Content-Type": "application/json"
          }
        };
        if(payload){
          req.data = payload;
        }
        return $http().then(
          function(response) {
            console.log(response);
            return Promise.resolve(response.data);
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

(function(){
  angular.module('app.controllers', ['ngCookies']);
})();

(function(){
  angular.module('app.controllers')
    .controller('LoginController', LoginController);

    LoginController.$inject = ['DataGatewayService', 'AuthService', '$location','$window'];

    function LoginController(DataGatewayService, AuthService, $location, $window){
      var vm = this;
      vm.username='';
      vm.pwd='';
      vm.submit = submit;

      activate();

    /////////////////////

      function activate(){
        if(AuthService.isLoggedIn()){
          $location.path('/');
          $window.location.reload();
        }
      }

      function submit(){
        if(!vm.email){
          error();
        }else if(!vm.username){
          error();
        }else if(!vm.pwd){
          error();
        }else if(vm.pwd !== vm.cpwd){
          error();
        }else{
          var payload = {
            Username: vm.username,
            Password: vm.pwd,
          };
          return AuthService.login(payload);
        }

      }

      function error(field){
        console.error("Invalid submission");
      }

    }
})();

(function(){
  angular.module('app.controllers')
    .controller('SignupController', SignupController);

    SignupController.$inject = ['DataGatewayService', 'AuthService'];

    function SignupController(DataGatewayService, AuthService){
      var vm = this;
      vm.email='';
      vm.username='';
      vm.pwd='';
      vm.cpwd='';
      vm.submit = submit;

    /////////////////////

      function submit(){
        console.log(vm);
        if(!vm.email){
          error();
        }else if(!vm.username){
          error();
        }else if(!vm.pwd){
          error();
        }else if(vm.pwd !== vm.cpwd){
          error();
        }else{
          var payload = {
            Email: vm.email,
            Username: vm.username,
            Password: vm.pwd,
          };
          AuthService.signup(payload);
        }
      }

      function error(field){
        console.error("Invalid submission");
      }

    }
})();

(function(){

  angular.module('app', [
    'app.controllers',
    'app.services',
  ]);

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzLmpzIiwiY29udHJvbGxlcnMuanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1tdC5hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgW10pO1xyXG59KSgpO1xyXG5cbihmdW5jdGlvbigpIHtcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpXHJcbiAgICAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBBdXRoU2VydmljZSk7XHJcblxyXG4gIEF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywgJyRsb2NhdGlvbicsICckd2luZG93JywgJyRjb29raWVzJywgJ0RhdGFHYXRld2F5U2VydmljZSddO1xyXG5cclxuICBmdW5jdGlvbiBBdXRoU2VydmljZSgkaHR0cCwgJGxvY2F0aW9uLCAkd2luZG93LCAkY29va2llcywgRGF0YUdhdGV3YXlTZXJ2aWNlKSB7XHJcbiAgICB2YXIgbG9nZ2VkSW4gPSBmYWxzZTtcclxuXHJcbiAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgc2lnbnVwOiBzaWdudXAsXHJcbiAgICAgIGxvZ2luOiBsb2dpbixcclxuICAgICAgbG9nb3V0OiBsb2dvdXQsXHJcbiAgICAgIGlzTG9nZ2VkSW46IGlzTG9nZ2VkSW4sXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBzZXJ2aWNlO1xyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gbG9naW4oY3JlZGVudGlhbHMpIHtcclxuICAgICAgcmV0dXJuIERhdGFHYXRld2F5U2VydmljZS5wb3N0KFwibG9naW5cIiwgY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwICYmIHJlc3BvbnNlLmhlYWRlcnMuQXV0aG9yaXphdGlvbil7XHJcbiAgICAgICAgICAkY29va2llcy5wdXQoJ3VpbmZvJywge3VzZXJuYW1lOiBjcmVkZW50aWFscy5Vc2VybmFtZSwgZW1haWw6IGNyZWRlbnRpYWxzLkVtYWlsfSk7XHJcbiAgICAgICAgICAkY29va2llcy5wdXQoJ3V0b2tlbicsIHJlc3BvbnNlLmhlYWRlcnMuQXV0aG9yaXphdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc0xvZ2dlZEluKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5sb2dnZWRJbiA9PSAoJGNvb2tpZXMuZ2V0KCd1dG9rZW4nKSAmJiB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaWdudXAoY3JlZGVudGlhbHMpIHtcclxuICAgICAgcmV0dXJuIERhdGFHYXRld2F5U2VydmljZS5wb3N0KFwicmVnaXN0ZXJcIiwgY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwICYmIHJlc3BvbnNlLmhlYWRlcnMuQXV0aG9yaXphdGlvbil7XHJcbiAgICAgICAgICAkY29va2llcy5wdXQoJ3VpbmZvJywge3VzZXJuYW1lOiBjcmVkZW50aWFscy5Vc2VybmFtZX0pO1xyXG4gICAgICAgICAgJGNvb2tpZXMucHV0KCd1dG9rZW4nLCByZXNwb25zZS5oZWFkZXJzLkF1dGhvcml6YXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICByZXR1cm4gRGF0YUdhdGV3YXlTZXJ2aWNlLnBvc3QoXCJsb2dvdXRcIiwgY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwICYmIHJlc3BvbnNlLmhlYWRlcnMuQXV0aG9yaXphdGlvbil7XHJcbiAgICAgICAgICAkY29va2llcy5kZWxldGUoJ3VpbmZvJyk7XHJcbiAgICAgICAgICAkY29va2llcy5kZWxldGUoJ3V0b2tlbicpO1xyXG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcclxuICAgICAgICAgICR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn0pKCk7XHJcblxuKGZ1bmN0aW9uKCkge1xyXG5cclxuICAvKipcclxuICAgKiBEYXRhR2F0ZXdheVNlcnZpY2VcclxuICAgKiBSZXNwb25zaWJsZSBmb3IgcXVlcnlpbmcgdGhlIGJhY2tlbmQgZm9yIEFKQVggZGF0YS5cclxuICAgKiBJbXBsZW1lbnRzIHRoZSBHYXRld2F5IERTIFBhdHRlcm4sIGRlY291cGxpbmcgdGhlIHJlc3Qgb2YgdGhlIGFyY2hpdGVjdHVyZSBmcm9tXHJcbiAgICogdGhlIGJhY2tlbmQgaW50ZXJmYWNlLlxyXG4gICAqIElzIHN0YXRlbGVzcy5cclxuICAgKiovXHJcbiAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIilcclxuICAgIC5zZXJ2aWNlKCdEYXRhR2F0ZXdheVNlcnZpY2UnLCBEYXRhR2F0ZXdheVNlcnZpY2UpO1xyXG5cclxuICBEYXRhR2F0ZXdheVNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnXTtcclxuXHJcbiAgZnVuY3Rpb24gRGF0YUdhdGV3YXlTZXJ2aWNlKCRodHRwKSB7XHJcbiAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgcG9zdDogaHR0cChcIlBPU1RcIiksXHJcbiAgICAgIGdldDogaHR0cChcIkdFVFwiKSxcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlcXVlc3RzIGRhdGEgZnJvbSB0aGUgYmFja2VuZC4gSGFuZGxlcyAkaHR0cCBlcnJvcnMuXHJcbiAgICAgKiBAcGFyYW0gcm91dGUgPHN0cmluZz4gVVJMIHJvdXRlIHRvIGNhbGxcclxuICAgICAqIEBwYXJhbSBwYXlsb2FkIDxvYmplY3Q+IEpTT04gb2JqZWN0IHVzZWQgdG8gc3BlY2lmeSBxdWVyeSBjcml0ZXJpYSB0byB0aGUgYmFja2VuZFxyXG4gICAgICoqL1xyXG4gICAgZnVuY3Rpb24gaHR0cChtZXRob2Qpe1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdChyb3V0ZSwgcGF5bG9hZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZyByb3V0ZSBcIiArIHJvdXRlICsgXCIgd2l0aCBwYXlsb2FkXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHBheWxvYWQpO1xyXG4gICAgICAgIHZhciByZXEgPSB7XHJcbiAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgICAgICAgIHVybDogXCJhcGkvXCIgKyByb3V0ZSxcclxuICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmKHBheWxvYWQpe1xyXG4gICAgICAgICAgcmVxLmRhdGEgPSBwYXlsb2FkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJGh0dHAoKS50aGVuKFxyXG4gICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWyduZ0Nvb2tpZXMnXSk7XHJcbn0pKCk7XHJcblxuKGZ1bmN0aW9uKCl7XHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgTG9naW5Db250cm9sbGVyKTtcclxuXHJcbiAgICBMb2dpbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnRGF0YUdhdGV3YXlTZXJ2aWNlJywgJ0F1dGhTZXJ2aWNlJywgJyRsb2NhdGlvbicsJyR3aW5kb3cnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBMb2dpbkNvbnRyb2xsZXIoRGF0YUdhdGV3YXlTZXJ2aWNlLCBBdXRoU2VydmljZSwgJGxvY2F0aW9uLCAkd2luZG93KXtcclxuICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgdm0udXNlcm5hbWU9Jyc7XHJcbiAgICAgIHZtLnB3ZD0nJztcclxuICAgICAgdm0uc3VibWl0ID0gc3VibWl0O1xyXG5cclxuICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XHJcbiAgICAgICAgaWYoQXV0aFNlcnZpY2UuaXNMb2dnZWRJbigpKXtcclxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XHJcbiAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gc3VibWl0KCl7XHJcbiAgICAgICAgaWYoIXZtLmVtYWlsKXtcclxuICAgICAgICAgIGVycm9yKCk7XHJcbiAgICAgICAgfWVsc2UgaWYoIXZtLnVzZXJuYW1lKXtcclxuICAgICAgICAgIGVycm9yKCk7XHJcbiAgICAgICAgfWVsc2UgaWYoIXZtLnB3ZCl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNlIGlmKHZtLnB3ZCAhPT0gdm0uY3B3ZCl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgdmFyIHBheWxvYWQgPSB7XHJcbiAgICAgICAgICAgIFVzZXJuYW1lOiB2bS51c2VybmFtZSxcclxuICAgICAgICAgICAgUGFzc3dvcmQ6IHZtLnB3ZCxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UubG9naW4ocGF5bG9hZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZXJyb3IoZmllbGQpe1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHN1Ym1pc3Npb25cIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0pKCk7XHJcblxuKGZ1bmN0aW9uKCl7XHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignU2lnbnVwQ29udHJvbGxlcicsIFNpZ251cENvbnRyb2xsZXIpO1xyXG5cclxuICAgIFNpZ251cENvbnRyb2xsZXIuJGluamVjdCA9IFsnRGF0YUdhdGV3YXlTZXJ2aWNlJywgJ0F1dGhTZXJ2aWNlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gU2lnbnVwQ29udHJvbGxlcihEYXRhR2F0ZXdheVNlcnZpY2UsIEF1dGhTZXJ2aWNlKXtcclxuICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgdm0uZW1haWw9Jyc7XHJcbiAgICAgIHZtLnVzZXJuYW1lPScnO1xyXG4gICAgICB2bS5wd2Q9Jyc7XHJcbiAgICAgIHZtLmNwd2Q9Jyc7XHJcbiAgICAgIHZtLnN1Ym1pdCA9IHN1Ym1pdDtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHN1Ym1pdCgpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHZtKTtcclxuICAgICAgICBpZighdm0uZW1haWwpe1xyXG4gICAgICAgICAgZXJyb3IoKTtcclxuICAgICAgICB9ZWxzZSBpZighdm0udXNlcm5hbWUpe1xyXG4gICAgICAgICAgZXJyb3IoKTtcclxuICAgICAgICB9ZWxzZSBpZighdm0ucHdkKXtcclxuICAgICAgICAgIGVycm9yKCk7XHJcbiAgICAgICAgfWVsc2UgaWYodm0ucHdkICE9PSB2bS5jcHdkKXtcclxuICAgICAgICAgIGVycm9yKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICB2YXIgcGF5bG9hZCA9IHtcclxuICAgICAgICAgICAgRW1haWw6IHZtLmVtYWlsLFxyXG4gICAgICAgICAgICBVc2VybmFtZTogdm0udXNlcm5hbWUsXHJcbiAgICAgICAgICAgIFBhc3N3b3JkOiB2bS5wd2QsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgQXV0aFNlcnZpY2Uuc2lnbnVwKHBheWxvYWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZXJyb3IoZmllbGQpe1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHN1Ym1pc3Npb25cIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xyXG4gICAgJ2FwcC5jb250cm9sbGVycycsXHJcbiAgICAnYXBwLnNlcnZpY2VzJyxcclxuICBdKTtcclxuXHJcbn0pKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
