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

  SignupController.$inject = ['DataGatewayService', 'AuthService', '$window'];

  function SignupController(DataGatewayService, AuthService, $window) {
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
  angular.module('app.controllers')
    .controller('TeamController', TeamController);

    TeamController.$inject = ['DataGatewayService', 'AuthService', '$window'];

    function TeamController(DataGatewayService, AuthService, $window){
      var vm = this;
      vm.route = {
        view: 'team',
        create: 'team/create'
      };
      vm.newTeam = {};
      vm.teams = [];
      vm.show = show;
      vm.hide = hide;
      vm.create = create;
      vm.method = {
        create: 'post',
        view: 'get',
      };

      activate();

    /////////////////////

      function activate(){
        if(!AuthService.isLoggedIn()){
          $window.location.href = '/';
        }else{
          return DataGatewayService[vm.method.view](vm.route.view, {}, AuthService.getToken()).then(function(response){
            vm.teams = response.data;
          });
        }
      }

      function create(){
        return DataGatewayService[vm.method.create](vm.route.create, {},AuthService.getToken()).then(function(response){
          vm.teams.push(vm.newTeam);
          vm.newTeam = [];
        }).catch(function(error){
        });
      }

      function show(){
        $('.ui.modal').modal('show');
        vm.newteam = {
          "Description": "",
          "Name": "",
          "Users": [
            {
              "Username": "",
              "Role": "",
            }
          ],
        };
      }

      function hide(){
        $('.ui.modal').modal('hide');
      }



    }
})();

(function(){

  angular.module('app', [
    'app.controllers',
    'app.services',
  ]);

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzLmpzIiwiY29udHJvbGxlcnMuanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibW10LmFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbXSk7XHJcbn0pKCk7XHJcblxuKGZ1bmN0aW9uKCkge1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJylcclxuICAgIC5zZXJ2aWNlKCdBdXRoU2VydmljZScsIEF1dGhTZXJ2aWNlKTtcclxuXHJcbiAgQXV0aFNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJGxvY2F0aW9uJywgJyR3aW5kb3cnLCAnJGNvb2tpZXMnLCAnRGF0YUdhdGV3YXlTZXJ2aWNlJ107XHJcblxyXG4gIGZ1bmN0aW9uIEF1dGhTZXJ2aWNlKCRodHRwLCAkbG9jYXRpb24sICR3aW5kb3csICRjb29raWVzLCBEYXRhR2F0ZXdheVNlcnZpY2UpIHtcclxuICAgIHZhciBsb2dnZWRJbiA9IGZhbHNlO1xyXG5cclxuICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICBzaWdudXA6IHNpZ251cCxcclxuICAgICAgbG9naW46IGxvZ2luLFxyXG4gICAgICBsb2dvdXQ6IGxvZ291dCxcclxuICAgICAgaXNMb2dnZWRJbjogaXNMb2dnZWRJbixcclxuICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxyXG4gICAgICBnZXRJbmZvOiBnZXRJbmZvLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIGxvZ2luKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgIHJldHVybiBEYXRhR2F0ZXdheVNlcnZpY2UucG9zdChcImxvZ2luXCIsIGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCAmJiByZXNwb25zZS5kYXRhKXtcclxuICAgICAgICAgICRjb29raWVzLnB1dCgndWluZm8nLCB7dXNlcm5hbWU6IGNyZWRlbnRpYWxzLlVzZXJuYW1lLCBlbWFpbDogY3JlZGVudGlhbHMuRW1haWx9KTtcclxuICAgICAgICAgICRjb29raWVzLnB1dCgndXRva2VuJywgcmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL0Rhc2hib2FyZC9UZWFtcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc0xvZ2dlZEluKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5sb2dnZWRJbiA9PSAoJGNvb2tpZXMuZ2V0KCd1dG9rZW4nKSAmJiB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaWdudXAoY3JlZGVudGlhbHMpIHtcclxuICAgICAgcmV0dXJuIERhdGFHYXRld2F5U2VydmljZS5wb3N0KFwicmVnaXN0ZXJcIiwgY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwICYmIHJlc3BvbnNlLmRhdGEpe1xyXG4gICAgICAgICAgJGNvb2tpZXMucHV0KCd1aW5mbycsIHt1c2VybmFtZTogY3JlZGVudGlhbHMuVXNlcm5hbWV9KTtcclxuICAgICAgICAgICRjb29raWVzLnB1dCgndXRva2VuJywgcmVzcG9uc2UuRGF0YVRyYW5zZmVySXRlbSk7XHJcbiAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL0Rhc2hib2FyZC9UZWFtcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRUb2tlbigpe1xyXG4gICAgICByZXR1cm4gJGNvb2tpZXMuZ2V0KCd1dG9rZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRJbmZvKCl7XHJcbiAgICAgIHJldHVybiAkY29va2llcy5nZXQoJ3VpbmZvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICByZXR1cm4gRGF0YUdhdGV3YXlTZXJ2aWNlLnBvc3QoXCJsb2dvdXRcIiwgY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwICYmIHJlc3BvbnNlLmRhdGEpe1xyXG4gICAgICAgICAgJGNvb2tpZXMuZGVsZXRlKCd1aW5mbycpO1xyXG4gICAgICAgICAgJGNvb2tpZXMuZGVsZXRlKCd1dG9rZW4nKTtcclxuICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuXG4oZnVuY3Rpb24oKSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIERhdGFHYXRld2F5U2VydmljZVxyXG4gICAqIFJlc3BvbnNpYmxlIGZvciBxdWVyeWluZyB0aGUgYmFja2VuZCBmb3IgQUpBWCBkYXRhLlxyXG4gICAqIEltcGxlbWVudHMgdGhlIEdhdGV3YXkgRFMgUGF0dGVybiwgZGVjb3VwbGluZyB0aGUgcmVzdCBvZiB0aGUgYXJjaGl0ZWN0dXJlIGZyb21cclxuICAgKiB0aGUgYmFja2VuZCBpbnRlcmZhY2UuXHJcbiAgICogSXMgc3RhdGVsZXNzLlxyXG4gICAqKi9cclxuICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKVxyXG4gICAgLnNlcnZpY2UoJ0RhdGFHYXRld2F5U2VydmljZScsIERhdGFHYXRld2F5U2VydmljZSk7XHJcblxyXG4gIERhdGFHYXRld2F5U2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICBmdW5jdGlvbiBEYXRhR2F0ZXdheVNlcnZpY2UoJGh0dHApIHtcclxuICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICBwb3N0OiBodHRwKFwiUE9TVFwiKSxcclxuICAgICAgZ2V0OiBodHRwKFwiR0VUXCIpLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVxdWVzdHMgZGF0YSBmcm9tIHRoZSBiYWNrZW5kLiBIYW5kbGVzICRodHRwIGVycm9ycy5cclxuICAgICAqIEBwYXJhbSByb3V0ZSA8c3RyaW5nPiBVUkwgcm91dGUgdG8gY2FsbFxyXG4gICAgICogQHBhcmFtIHBheWxvYWQgPG9iamVjdD4gSlNPTiBvYmplY3QgdXNlZCB0byBzcGVjaWZ5IHF1ZXJ5IGNyaXRlcmlhIHRvIHRoZSBiYWNrZW5kXHJcbiAgICAgKiovXHJcbiAgICBmdW5jdGlvbiBodHRwKG1ldGhvZCl7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0KHJvdXRlLCBwYXlsb2FkLCB0b2tlbikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZyByb3V0ZSBcIiArIHJvdXRlICsgXCIgd2l0aCBwYXlsb2FkXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHBheWxvYWQpO1xyXG4gICAgICAgIHZhciByZXEgPSB7XHJcbiAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgICAgICAgIHVybDogXCIvYXBpL1wiICsgcm91dGUsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZihwYXlsb2FkKXtcclxuICAgICAgICAgIHJlcS5kYXRhID0gcGF5bG9hZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodG9rZW4pe1xyXG4gICAgICAgICAgcmVxLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IHRva2VuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJGh0dHAocmVxKS50aGVuKFxyXG4gICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsnbmdDb29raWVzJ10pO1xyXG59KSgpO1xyXG5cbihmdW5jdGlvbigpe1xyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIExvZ2luQ29udHJvbGxlcik7XHJcblxyXG4gICAgTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJ0RhdGFHYXRld2F5U2VydmljZScsICdBdXRoU2VydmljZScsICckbG9jYXRpb24nLCckd2luZG93J107XHJcblxyXG4gICAgZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKERhdGFHYXRld2F5U2VydmljZSwgQXV0aFNlcnZpY2UsICRsb2NhdGlvbiwgJHdpbmRvdyl7XHJcbiAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgIHZtLnVzZXJuYW1lPScnO1xyXG4gICAgICB2bS5wd2Q9Jyc7XHJcbiAgICAgIHZtLnN1Ym1pdCA9IHN1Ym1pdDtcclxuXHJcbiAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xyXG4gICAgICAgIGlmKEF1dGhTZXJ2aWNlLmlzTG9nZ2VkSW4oKSl7XHJcbiAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvRGFzaGJvYXJkL1RlYW1zJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHN1Ym1pdCgpe1xyXG4gICAgICAgIGlmKCF2bS5lbWFpbCl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNlIGlmKCF2bS51c2VybmFtZSl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNlIGlmKCF2bS5wd2Qpe1xyXG4gICAgICAgICAgZXJyb3IoKTtcclxuICAgICAgICB9ZWxzZSBpZih2bS5wd2QgIT09IHZtLmNwd2Qpe1xyXG4gICAgICAgICAgZXJyb3IoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHZhciBwYXlsb2FkID0ge1xyXG4gICAgICAgICAgICBVc2VybmFtZTogdm0udXNlcm5hbWUsXHJcbiAgICAgICAgICAgIFBhc3N3b3JkOiB2bS5wd2QsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmxvZ2luKHBheWxvYWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGVycm9yKGZpZWxkKXtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzdWJtaXNzaW9uXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG59KSgpO1xyXG5cbihmdW5jdGlvbigpe1xyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ1NpZ251cENvbnRyb2xsZXInLCBTaWdudXBDb250cm9sbGVyKTtcclxuXHJcbiAgU2lnbnVwQ29udHJvbGxlci4kaW5qZWN0ID0gWydEYXRhR2F0ZXdheVNlcnZpY2UnLCAnQXV0aFNlcnZpY2UnLCAnJHdpbmRvdyddO1xyXG5cclxuICBmdW5jdGlvbiBTaWdudXBDb250cm9sbGVyKERhdGFHYXRld2F5U2VydmljZSwgQXV0aFNlcnZpY2UsICR3aW5kb3cpIHtcclxuICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgdm0uZW1haWw9Jyc7XHJcbiAgICAgIHZtLnVzZXJuYW1lPScnO1xyXG4gICAgICB2bS5wd2Q9Jyc7XHJcbiAgICAgIHZtLmNwd2Q9Jyc7XHJcbiAgICAgIHZtLnN1Ym1pdCA9IHN1Ym1pdDtcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgIGlmIChBdXRoU2VydmljZS5pc0xvZ2dlZEluKCkpIHtcclxuICAgICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL0Rhc2hib2FyZC9UZWFtcyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHN1Ym1pdCgpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHZtKTtcclxuICAgICAgICBpZighdm0uZW1haWwpe1xyXG4gICAgICAgICAgZXJyb3IoKTtcclxuICAgICAgICB9ZWxzZSBpZighdm0udXNlcm5hbWUpe1xyXG4gICAgICAgICAgZXJyb3IoKTtcclxuICAgICAgICB9ZWxzZSBpZighdm0ucHdkKXtcclxuICAgICAgICAgIGVycm9yKCk7XHJcbiAgICAgICAgfWVsc2UgaWYodm0ucHdkICE9PSB2bS5jcHdkKXtcclxuICAgICAgICAgIGVycm9yKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICB2YXIgcGF5bG9hZCA9IHtcclxuICAgICAgICAgICAgRW1haWw6IHZtLmVtYWlsLFxyXG4gICAgICAgICAgICBVc2VybmFtZTogdm0udXNlcm5hbWUsXHJcbiAgICAgICAgICAgIFBhc3N3b3JkOiB2bS5wd2QsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgQXV0aFNlcnZpY2Uuc2lnbnVwKHBheWxvYWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZXJyb3IoZmllbGQpe1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHN1Ym1pc3Npb25cIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0pKCk7XHJcblxuKGZ1bmN0aW9uKCl7XHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignVGVhbUNvbnRyb2xsZXInLCBUZWFtQ29udHJvbGxlcik7XHJcblxyXG4gICAgVGVhbUNvbnRyb2xsZXIuJGluamVjdCA9IFsnRGF0YUdhdGV3YXlTZXJ2aWNlJywgJ0F1dGhTZXJ2aWNlJywgJyR3aW5kb3cnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBUZWFtQ29udHJvbGxlcihEYXRhR2F0ZXdheVNlcnZpY2UsIEF1dGhTZXJ2aWNlLCAkd2luZG93KXtcclxuICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgdm0ucm91dGUgPSB7XHJcbiAgICAgICAgdmlldzogJ3RlYW0nLFxyXG4gICAgICAgIGNyZWF0ZTogJ3RlYW0vY3JlYXRlJ1xyXG4gICAgICB9O1xyXG4gICAgICB2bS5uZXdUZWFtID0ge307XHJcbiAgICAgIHZtLnRlYW1zID0gW107XHJcbiAgICAgIHZtLnNob3cgPSBzaG93O1xyXG4gICAgICB2bS5oaWRlID0gaGlkZTtcclxuICAgICAgdm0uY3JlYXRlID0gY3JlYXRlO1xyXG4gICAgICB2bS5tZXRob2QgPSB7XHJcbiAgICAgICAgY3JlYXRlOiAncG9zdCcsXHJcbiAgICAgICAgdmlldzogJ2dldCcsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcclxuICAgICAgICBpZighQXV0aFNlcnZpY2UuaXNMb2dnZWRJbigpKXtcclxuICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJztcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHJldHVybiBEYXRhR2F0ZXdheVNlcnZpY2Vbdm0ubWV0aG9kLnZpZXddKHZtLnJvdXRlLnZpZXcsIHt9LCBBdXRoU2VydmljZS5nZXRUb2tlbigpKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgdm0udGVhbXMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBjcmVhdGUoKXtcclxuICAgICAgICByZXR1cm4gRGF0YUdhdGV3YXlTZXJ2aWNlW3ZtLm1ldGhvZC5jcmVhdGVdKHZtLnJvdXRlLmNyZWF0ZSwge30sQXV0aFNlcnZpY2UuZ2V0VG9rZW4oKSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICB2bS50ZWFtcy5wdXNoKHZtLm5ld1RlYW0pO1xyXG4gICAgICAgICAgdm0ubmV3VGVhbSA9IFtdO1xyXG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gc2hvdygpe1xyXG4gICAgICAgICQoJy51aS5tb2RhbCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgdm0ubmV3dGVhbSA9IHtcclxuICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjogXCJcIixcclxuICAgICAgICAgIFwiTmFtZVwiOiBcIlwiLFxyXG4gICAgICAgICAgXCJVc2Vyc1wiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcIlVzZXJuYW1lXCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgXCJSb2xlXCI6IFwiXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaGlkZSgpe1xyXG4gICAgICAgICQoJy51aS5tb2RhbCcpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgIH1cclxuXHJcblxyXG5cclxuICAgIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXHJcbiAgICAnYXBwLmNvbnRyb2xsZXJzJyxcclxuICAgICdhcHAuc2VydmljZXMnLFxyXG4gIF0pO1xyXG5cclxufSkoKTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
