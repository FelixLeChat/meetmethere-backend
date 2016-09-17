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
        if(response.status === 200 && response.data){
          $cookies.put('uinfo', {username: credentials.Username, email: credentials.Email});
          $cookies.put('utoken', response.data);
          $window.location.href = '/Dashboard/Teams';
        }
      });
    }

    function apiCall() {
        
    }

    function isLoggedIn() {
      return this.loggedIn == ($cookies.get('utoken') && true);
    }

    function signup(credentials) {
      return DataGatewayService.post("register", credentials).then(function(response){
        if(response.status === 200 && response.data){
          $cookies.put('uinfo', {username: credentials.Username});
          $cookies.put('utoken', response.DataTransferItem);
          $window.location.href = '/Dashboard/Teams';
        }
      });
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
      return function request(route, payload) {
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
            $window.location.href = '/Dashboard/Teams';
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

        activate();

        /////////////////////

      function activate() {
          if (AuthService.isLoggedIn()) {
              $window.location.href = '/Dashboard/Teams';
          }
      }

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzLmpzIiwiY29udHJvbGxlcnMuanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1tdC5hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgW10pO1xyXG59KSgpO1xyXG5cbihmdW5jdGlvbigpIHtcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycpXHJcbiAgICAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBBdXRoU2VydmljZSk7XHJcblxyXG4gIEF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywgJyRsb2NhdGlvbicsICckd2luZG93JywgJyRjb29raWVzJywgJ0RhdGFHYXRld2F5U2VydmljZSddO1xyXG5cclxuICBmdW5jdGlvbiBBdXRoU2VydmljZSgkaHR0cCwgJGxvY2F0aW9uLCAkd2luZG93LCAkY29va2llcywgRGF0YUdhdGV3YXlTZXJ2aWNlKSB7XHJcbiAgICB2YXIgbG9nZ2VkSW4gPSBmYWxzZTtcclxuXHJcbiAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgc2lnbnVwOiBzaWdudXAsXHJcbiAgICAgIGxvZ2luOiBsb2dpbixcclxuICAgICAgbG9nb3V0OiBsb2dvdXQsXHJcbiAgICAgIGlzTG9nZ2VkSW46IGlzTG9nZ2VkSW4sXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBzZXJ2aWNlO1xyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gbG9naW4oY3JlZGVudGlhbHMpIHtcclxuICAgICAgcmV0dXJuIERhdGFHYXRld2F5U2VydmljZS5wb3N0KFwibG9naW5cIiwgY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwICYmIHJlc3BvbnNlLmRhdGEpe1xyXG4gICAgICAgICAgJGNvb2tpZXMucHV0KCd1aW5mbycsIHt1c2VybmFtZTogY3JlZGVudGlhbHMuVXNlcm5hbWUsIGVtYWlsOiBjcmVkZW50aWFscy5FbWFpbH0pO1xyXG4gICAgICAgICAgJGNvb2tpZXMucHV0KCd1dG9rZW4nLCByZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvRGFzaGJvYXJkL1RlYW1zJztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwaUNhbGwoKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaXNMb2dnZWRJbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMubG9nZ2VkSW4gPT0gKCRjb29raWVzLmdldCgndXRva2VuJykgJiYgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2lnbnVwKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgIHJldHVybiBEYXRhR2F0ZXdheVNlcnZpY2UucG9zdChcInJlZ2lzdGVyXCIsIGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCAmJiByZXNwb25zZS5kYXRhKXtcclxuICAgICAgICAgICRjb29raWVzLnB1dCgndWluZm8nLCB7dXNlcm5hbWU6IGNyZWRlbnRpYWxzLlVzZXJuYW1lfSk7XHJcbiAgICAgICAgICAkY29va2llcy5wdXQoJ3V0b2tlbicsIHJlc3BvbnNlLkRhdGFUcmFuc2Zlckl0ZW0pO1xyXG4gICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9EYXNoYm9hcmQvVGVhbXMnO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICByZXR1cm4gRGF0YUdhdGV3YXlTZXJ2aWNlLnBvc3QoXCJsb2dvdXRcIiwgY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwICYmIHJlc3BvbnNlLmRhdGEpe1xyXG4gICAgICAgICAgJGNvb2tpZXMuZGVsZXRlKCd1aW5mbycpO1xyXG4gICAgICAgICAgJGNvb2tpZXMuZGVsZXRlKCd1dG9rZW4nKTtcclxuICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuXG4oZnVuY3Rpb24oKSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIERhdGFHYXRld2F5U2VydmljZVxyXG4gICAqIFJlc3BvbnNpYmxlIGZvciBxdWVyeWluZyB0aGUgYmFja2VuZCBmb3IgQUpBWCBkYXRhLlxyXG4gICAqIEltcGxlbWVudHMgdGhlIEdhdGV3YXkgRFMgUGF0dGVybiwgZGVjb3VwbGluZyB0aGUgcmVzdCBvZiB0aGUgYXJjaGl0ZWN0dXJlIGZyb21cclxuICAgKiB0aGUgYmFja2VuZCBpbnRlcmZhY2UuXHJcbiAgICogSXMgc3RhdGVsZXNzLlxyXG4gICAqKi9cclxuICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKVxyXG4gICAgLnNlcnZpY2UoJ0RhdGFHYXRld2F5U2VydmljZScsIERhdGFHYXRld2F5U2VydmljZSk7XHJcblxyXG4gIERhdGFHYXRld2F5U2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICBmdW5jdGlvbiBEYXRhR2F0ZXdheVNlcnZpY2UoJGh0dHApIHtcclxuICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICBwb3N0OiBodHRwKFwiUE9TVFwiKSxcclxuICAgICAgZ2V0OiBodHRwKFwiR0VUXCIpLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVxdWVzdHMgZGF0YSBmcm9tIHRoZSBiYWNrZW5kLiBIYW5kbGVzICRodHRwIGVycm9ycy5cclxuICAgICAqIEBwYXJhbSByb3V0ZSA8c3RyaW5nPiBVUkwgcm91dGUgdG8gY2FsbFxyXG4gICAgICogQHBhcmFtIHBheWxvYWQgPG9iamVjdD4gSlNPTiBvYmplY3QgdXNlZCB0byBzcGVjaWZ5IHF1ZXJ5IGNyaXRlcmlhIHRvIHRoZSBiYWNrZW5kXHJcbiAgICAgKiovXHJcbiAgICBmdW5jdGlvbiBodHRwKG1ldGhvZCl7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0KHJvdXRlLCBwYXlsb2FkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0aW5nIHJvdXRlIFwiICsgcm91dGUgKyBcIiB3aXRoIHBheWxvYWRcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2cocGF5bG9hZCk7XHJcbiAgICAgICAgdmFyIHJlcSA9IHtcclxuICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICAgICAgdXJsOiBcIi9hcGkvXCIgKyByb3V0ZSxcclxuICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmKHBheWxvYWQpe1xyXG4gICAgICAgICAgcmVxLmRhdGEgPSBwYXlsb2FkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJGh0dHAocmVxKS50aGVuKFxyXG4gICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsnbmdDb29raWVzJ10pO1xyXG59KSgpO1xyXG5cbihmdW5jdGlvbigpe1xyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIExvZ2luQ29udHJvbGxlcik7XHJcblxyXG4gICAgTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJ0RhdGFHYXRld2F5U2VydmljZScsICdBdXRoU2VydmljZScsICckbG9jYXRpb24nLCckd2luZG93J107XHJcblxyXG4gICAgZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKERhdGFHYXRld2F5U2VydmljZSwgQXV0aFNlcnZpY2UsICRsb2NhdGlvbiwgJHdpbmRvdyl7XHJcbiAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgIHZtLnVzZXJuYW1lPScnO1xyXG4gICAgICB2bS5wd2Q9Jyc7XHJcbiAgICAgIHZtLnN1Ym1pdCA9IHN1Ym1pdDtcclxuXHJcbiAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xyXG4gICAgICAgIGlmKEF1dGhTZXJ2aWNlLmlzTG9nZ2VkSW4oKSl7XHJcbiAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvRGFzaGJvYXJkL1RlYW1zJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHN1Ym1pdCgpe1xyXG4gICAgICAgIGlmKCF2bS5lbWFpbCl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNlIGlmKCF2bS51c2VybmFtZSl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNlIGlmKCF2bS5wd2Qpe1xyXG4gICAgICAgICAgZXJyb3IoKTtcclxuICAgICAgICB9ZWxzZSBpZih2bS5wd2QgIT09IHZtLmNwd2Qpe1xyXG4gICAgICAgICAgZXJyb3IoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHZhciBwYXlsb2FkID0ge1xyXG4gICAgICAgICAgICBVc2VybmFtZTogdm0udXNlcm5hbWUsXHJcbiAgICAgICAgICAgIFBhc3N3b3JkOiB2bS5wd2QsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmxvZ2luKHBheWxvYWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGVycm9yKGZpZWxkKXtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzdWJtaXNzaW9uXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG59KSgpO1xyXG5cbihmdW5jdGlvbigpe1xyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ1NpZ251cENvbnRyb2xsZXInLCBTaWdudXBDb250cm9sbGVyKTtcclxuXHJcbiAgICBTaWdudXBDb250cm9sbGVyLiRpbmplY3QgPSBbJ0RhdGFHYXRld2F5U2VydmljZScsICdBdXRoU2VydmljZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIFNpZ251cENvbnRyb2xsZXIoRGF0YUdhdGV3YXlTZXJ2aWNlLCBBdXRoU2VydmljZSl7XHJcbiAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgIHZtLmVtYWlsPScnO1xyXG4gICAgICB2bS51c2VybmFtZT0nJztcclxuICAgICAgdm0ucHdkPScnO1xyXG4gICAgICB2bS5jcHdkPScnO1xyXG4gICAgICB2bS5zdWJtaXQgPSBzdWJtaXQ7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNMb2dnZWRJbigpKSB7XHJcbiAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9EYXNoYm9hcmQvVGVhbXMnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBzdWJtaXQoKXtcclxuICAgICAgICBjb25zb2xlLmxvZyh2bSk7XHJcbiAgICAgICAgaWYoIXZtLmVtYWlsKXtcclxuICAgICAgICAgIGVycm9yKCk7XHJcbiAgICAgICAgfWVsc2UgaWYoIXZtLnVzZXJuYW1lKXtcclxuICAgICAgICAgIGVycm9yKCk7XHJcbiAgICAgICAgfWVsc2UgaWYoIXZtLnB3ZCl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNlIGlmKHZtLnB3ZCAhPT0gdm0uY3B3ZCl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgdmFyIHBheWxvYWQgPSB7XHJcbiAgICAgICAgICAgIEVtYWlsOiB2bS5lbWFpbCxcclxuICAgICAgICAgICAgVXNlcm5hbWU6IHZtLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICBQYXNzd29yZDogdm0ucHdkLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIEF1dGhTZXJ2aWNlLnNpZ251cChwYXlsb2FkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGVycm9yKGZpZWxkKXtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzdWJtaXNzaW9uXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcclxuICAgICdhcHAuY29udHJvbGxlcnMnLFxyXG4gICAgJ2FwcC5zZXJ2aWNlcycsXHJcbiAgXSk7XHJcblxyXG59KSgpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
