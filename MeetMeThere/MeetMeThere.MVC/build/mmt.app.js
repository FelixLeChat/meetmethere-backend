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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzLmpzIiwiY29udHJvbGxlcnMuanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibW10LmFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbXSk7XHJcbn0pKCk7XHJcblxuKGZ1bmN0aW9uKCkge1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJylcclxuICAgIC5zZXJ2aWNlKCdBdXRoU2VydmljZScsIEF1dGhTZXJ2aWNlKTtcclxuXHJcbiAgQXV0aFNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJGxvY2F0aW9uJywgJyR3aW5kb3cnLCAnJGNvb2tpZXMnLCAnRGF0YUdhdGV3YXlTZXJ2aWNlJ107XHJcblxyXG4gIGZ1bmN0aW9uIEF1dGhTZXJ2aWNlKCRodHRwLCAkbG9jYXRpb24sICR3aW5kb3csICRjb29raWVzLCBEYXRhR2F0ZXdheVNlcnZpY2UpIHtcclxuICAgIHZhciBsb2dnZWRJbiA9IGZhbHNlO1xyXG5cclxuICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICBzaWdudXA6IHNpZ251cCxcclxuICAgICAgbG9naW46IGxvZ2luLFxyXG4gICAgICBsb2dvdXQ6IGxvZ291dCxcclxuICAgICAgaXNMb2dnZWRJbjogaXNMb2dnZWRJbixcclxuICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxyXG4gICAgICBnZXRJbmZvOiBnZXRJbmZvLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIGxvZ2luKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgIHJldHVybiBEYXRhR2F0ZXdheVNlcnZpY2UucG9zdChcImxvZ2luXCIsIGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCAmJiByZXNwb25zZS5kYXRhKXtcclxuICAgICAgICAgICRjb29raWVzLnB1dCgndWluZm8nLCB7dXNlcm5hbWU6IGNyZWRlbnRpYWxzLlVzZXJuYW1lLCBlbWFpbDogY3JlZGVudGlhbHMuRW1haWx9KTtcclxuICAgICAgICAgICRjb29raWVzLnB1dCgndXRva2VuJywgcmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL0Rhc2hib2FyZC9UZWFtcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc0xvZ2dlZEluKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5sb2dnZWRJbiA9PSAoJGNvb2tpZXMuZ2V0KCd1dG9rZW4nKSAmJiB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaWdudXAoY3JlZGVudGlhbHMpIHtcclxuICAgICAgcmV0dXJuIERhdGFHYXRld2F5U2VydmljZS5wb3N0KFwicmVnaXN0ZXJcIiwgY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwICYmIHJlc3BvbnNlLmRhdGEpe1xyXG4gICAgICAgICAgJGNvb2tpZXMucHV0KCd1aW5mbycsIHt1c2VybmFtZTogY3JlZGVudGlhbHMuVXNlcm5hbWV9KTtcclxuICAgICAgICAgICRjb29raWVzLnB1dCgndXRva2VuJywgcmVzcG9uc2UuRGF0YVRyYW5zZmVySXRlbSk7XHJcbiAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL0Rhc2hib2FyZC9UZWFtcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRUb2tlbigpe1xyXG4gICAgICByZXR1cm4gJGNvb2tpZXMuZ2V0KCd1dG9rZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRJbmZvKCl7XHJcbiAgICAgIHJldHVybiAkY29va2llcy5nZXQoJ3VpbmZvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICByZXR1cm4gRGF0YUdhdGV3YXlTZXJ2aWNlLnBvc3QoXCJsb2dvdXRcIiwgY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwICYmIHJlc3BvbnNlLmRhdGEpe1xyXG4gICAgICAgICAgJGNvb2tpZXMuZGVsZXRlKCd1aW5mbycpO1xyXG4gICAgICAgICAgJGNvb2tpZXMuZGVsZXRlKCd1dG9rZW4nKTtcclxuICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuXG4oZnVuY3Rpb24oKSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIERhdGFHYXRld2F5U2VydmljZVxyXG4gICAqIFJlc3BvbnNpYmxlIGZvciBxdWVyeWluZyB0aGUgYmFja2VuZCBmb3IgQUpBWCBkYXRhLlxyXG4gICAqIEltcGxlbWVudHMgdGhlIEdhdGV3YXkgRFMgUGF0dGVybiwgZGVjb3VwbGluZyB0aGUgcmVzdCBvZiB0aGUgYXJjaGl0ZWN0dXJlIGZyb21cclxuICAgKiB0aGUgYmFja2VuZCBpbnRlcmZhY2UuXHJcbiAgICogSXMgc3RhdGVsZXNzLlxyXG4gICAqKi9cclxuICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKVxyXG4gICAgLnNlcnZpY2UoJ0RhdGFHYXRld2F5U2VydmljZScsIERhdGFHYXRld2F5U2VydmljZSk7XHJcblxyXG4gIERhdGFHYXRld2F5U2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICBmdW5jdGlvbiBEYXRhR2F0ZXdheVNlcnZpY2UoJGh0dHApIHtcclxuICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICBwb3N0OiBodHRwKFwiUE9TVFwiKSxcclxuICAgICAgZ2V0OiBodHRwKFwiR0VUXCIpLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVxdWVzdHMgZGF0YSBmcm9tIHRoZSBiYWNrZW5kLiBIYW5kbGVzICRodHRwIGVycm9ycy5cclxuICAgICAqIEBwYXJhbSByb3V0ZSA8c3RyaW5nPiBVUkwgcm91dGUgdG8gY2FsbFxyXG4gICAgICogQHBhcmFtIHBheWxvYWQgPG9iamVjdD4gSlNPTiBvYmplY3QgdXNlZCB0byBzcGVjaWZ5IHF1ZXJ5IGNyaXRlcmlhIHRvIHRoZSBiYWNrZW5kXHJcbiAgICAgKiovXHJcbiAgICBmdW5jdGlvbiBodHRwKG1ldGhvZCl7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0KHJvdXRlLCBwYXlsb2FkLCB0b2tlbikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZyByb3V0ZSBcIiArIHJvdXRlICsgXCIgd2l0aCBwYXlsb2FkXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHBheWxvYWQpO1xyXG4gICAgICAgIHZhciByZXEgPSB7XHJcbiAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgICAgICAgIHVybDogXCIvYXBpL1wiICsgcm91dGUsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZihwYXlsb2FkKXtcclxuICAgICAgICAgIHJlcS5kYXRhID0gcGF5bG9hZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodG9rZW4pe1xyXG4gICAgICAgICAgcmVxLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IHRva2VuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJGh0dHAocmVxKS50aGVuKFxyXG4gICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsnbmdDb29raWVzJ10pO1xyXG59KSgpO1xyXG5cbihmdW5jdGlvbigpe1xyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIExvZ2luQ29udHJvbGxlcik7XHJcblxyXG4gICAgTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJ0RhdGFHYXRld2F5U2VydmljZScsICdBdXRoU2VydmljZScsICckbG9jYXRpb24nLCckd2luZG93J107XHJcblxyXG4gICAgZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKERhdGFHYXRld2F5U2VydmljZSwgQXV0aFNlcnZpY2UsICRsb2NhdGlvbiwgJHdpbmRvdyl7XHJcbiAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgIHZtLnVzZXJuYW1lPScnO1xyXG4gICAgICB2bS5wd2Q9Jyc7XHJcbiAgICAgIHZtLnN1Ym1pdCA9IHN1Ym1pdDtcclxuXHJcbiAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xyXG4gICAgICAgIGlmKEF1dGhTZXJ2aWNlLmlzTG9nZ2VkSW4oKSl7XHJcbiAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvRGFzaGJvYXJkL1RlYW1zJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHN1Ym1pdCgpe1xyXG4gICAgICAgIGlmKCF2bS5lbWFpbCl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNlIGlmKCF2bS51c2VybmFtZSl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNlIGlmKCF2bS5wd2Qpe1xyXG4gICAgICAgICAgZXJyb3IoKTtcclxuICAgICAgICB9ZWxzZSBpZih2bS5wd2QgIT09IHZtLmNwd2Qpe1xyXG4gICAgICAgICAgZXJyb3IoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHZhciBwYXlsb2FkID0ge1xyXG4gICAgICAgICAgICBVc2VybmFtZTogdm0udXNlcm5hbWUsXHJcbiAgICAgICAgICAgIFBhc3N3b3JkOiB2bS5wd2QsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmxvZ2luKHBheWxvYWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGVycm9yKGZpZWxkKXtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzdWJtaXNzaW9uXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG59KSgpO1xyXG5cbihmdW5jdGlvbigpe1xyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ1NpZ251cENvbnRyb2xsZXInLCBTaWdudXBDb250cm9sbGVyKTtcclxuXHJcbiAgICBTaWdudXBDb250cm9sbGVyLiRpbmplY3QgPSBbJ0RhdGFHYXRld2F5U2VydmljZScsICdBdXRoU2VydmljZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIFNpZ251cENvbnRyb2xsZXIoRGF0YUdhdGV3YXlTZXJ2aWNlLCBBdXRoU2VydmljZSl7XHJcbiAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgIHZtLmVtYWlsPScnO1xyXG4gICAgICB2bS51c2VybmFtZT0nJztcclxuICAgICAgdm0ucHdkPScnO1xyXG4gICAgICB2bS5jcHdkPScnO1xyXG4gICAgICB2bS5zdWJtaXQgPSBzdWJtaXQ7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNMb2dnZWRJbigpKSB7XHJcbiAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9EYXNoYm9hcmQvVGVhbXMnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBzdWJtaXQoKXtcclxuICAgICAgICBjb25zb2xlLmxvZyh2bSk7XHJcbiAgICAgICAgaWYoIXZtLmVtYWlsKXtcclxuICAgICAgICAgIGVycm9yKCk7XHJcbiAgICAgICAgfWVsc2UgaWYoIXZtLnVzZXJuYW1lKXtcclxuICAgICAgICAgIGVycm9yKCk7XHJcbiAgICAgICAgfWVsc2UgaWYoIXZtLnB3ZCl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNlIGlmKHZtLnB3ZCAhPT0gdm0uY3B3ZCl7XHJcbiAgICAgICAgICBlcnJvcigpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgdmFyIHBheWxvYWQgPSB7XHJcbiAgICAgICAgICAgIEVtYWlsOiB2bS5lbWFpbCxcclxuICAgICAgICAgICAgVXNlcm5hbWU6IHZtLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICBQYXNzd29yZDogdm0ucHdkLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIEF1dGhTZXJ2aWNlLnNpZ251cChwYXlsb2FkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGVycm9yKGZpZWxkKXtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBzdWJtaXNzaW9uXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG59KSgpO1xyXG5cbihmdW5jdGlvbigpe1xyXG4gIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ1RlYW1Db250cm9sbGVyJywgVGVhbUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIFRlYW1Db250cm9sbGVyLiRpbmplY3QgPSBbJ0RhdGFHYXRld2F5U2VydmljZScsICdBdXRoU2VydmljZScsICckd2luZG93J107XHJcblxyXG4gICAgZnVuY3Rpb24gVGVhbUNvbnRyb2xsZXIoRGF0YUdhdGV3YXlTZXJ2aWNlLCBBdXRoU2VydmljZSwgJHdpbmRvdyl7XHJcbiAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgIHZtLnJvdXRlID0ge1xyXG4gICAgICAgIHZpZXc6ICd0ZWFtJyxcclxuICAgICAgICBjcmVhdGU6ICd0ZWFtL2NyZWF0ZSdcclxuICAgICAgfTtcclxuICAgICAgdm0ubmV3VGVhbSA9IHt9O1xyXG4gICAgICB2bS50ZWFtcyA9IFtdO1xyXG4gICAgICB2bS5zaG93ID0gc2hvdztcclxuICAgICAgdm0uaGlkZSA9IGhpZGU7XHJcbiAgICAgIHZtLmNyZWF0ZSA9IGNyZWF0ZTtcclxuICAgICAgdm0ubWV0aG9kID0ge1xyXG4gICAgICAgIGNyZWF0ZTogJ3Bvc3QnLFxyXG4gICAgICAgIHZpZXc6ICdnZXQnLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XHJcbiAgICAgICAgaWYoIUF1dGhTZXJ2aWNlLmlzTG9nZ2VkSW4oKSl7XHJcbiAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICByZXR1cm4gRGF0YUdhdGV3YXlTZXJ2aWNlW3ZtLm1ldGhvZC52aWV3XSh2bS5yb3V0ZS52aWV3LCB7fSwgQXV0aFNlcnZpY2UuZ2V0VG9rZW4oKSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgIHZtLnRlYW1zID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gY3JlYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIERhdGFHYXRld2F5U2VydmljZVt2bS5tZXRob2QuY3JlYXRlXSh2bS5yb3V0ZS5jcmVhdGUsIHt9LEF1dGhTZXJ2aWNlLmdldFRva2VuKCkpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgdm0udGVhbXMucHVzaCh2bS5uZXdUZWFtKTtcclxuICAgICAgICAgIHZtLm5ld1RlYW0gPSBbXTtcclxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHNob3coKXtcclxuICAgICAgICAkKCcudWkubW9kYWwnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgIHZtLm5ld3RlYW0gPSB7XHJcbiAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiXCIsXHJcbiAgICAgICAgICBcIk5hbWVcIjogXCJcIixcclxuICAgICAgICAgIFwiVXNlcnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJVc2VybmFtZVwiOiBcIlwiLFxyXG4gICAgICAgICAgICAgIFwiUm9sZVwiOiBcIlwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGhpZGUoKXtcclxuICAgICAgICAkKCcudWkubW9kYWwnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xyXG4gICAgJ2FwcC5jb250cm9sbGVycycsXHJcbiAgICAnYXBwLnNlcnZpY2VzJyxcclxuICBdKTtcclxuXHJcbn0pKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
