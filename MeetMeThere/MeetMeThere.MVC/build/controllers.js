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
    .controller('MeetingController', MeetingController);

    MeetingController.$inject = ['DataGatewayService', 'AuthService', '$window'];

    function MeetingController(DataGatewayService, AuthService, $window){
      var vm = this;
      vm.route = 'meeting';
      vm.teams = [];
      vm.show = show;
      vm.hide = hide;
      vm.request = request;
      vm.position = {};

      activate();

    /////////////////////

      function getUserLocation(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
              vm.position = position;
            });
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }

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
        for(var i = 0 ; i < vm.newTeam.Users.length; i++){
          if(!vm.newTeam.Users[i].Username){
            vm.newTeam.Users.splice(i);
          }
        }
        if(vm.newTeam.Users.length > 0){
          return DataGatewayService[vm.method.create](vm.route.create, vm.newTeam ,AuthService.getToken()).then(function(response){
            vm.teams.push(vm.newTeam);
            vm.newTeam = [];
          }).catch(function(error){
          });
        }
      }

      function member(){
        vm.newTeam.Users.push({
          "Username": "",
          "Role": "",
        });
      }

      function show(){
        $('.ui.modal').modal('show');
        vm.newTeam = {
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
      vm.member = member;
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
          view();
        }
      }

      function view(){
        return DataGatewayService[vm.method.view](vm.route.view, {}, AuthService.getToken()).then(function(response){
          vm.teams = response.data;
        });
      }

      function create(){
        for(var i = 0 ; i < vm.newTeam.Users.length; i++){
          if(!vm.newTeam.Users[i].Username){
            vm.newTeam.Users.splice(i);
          }
        }
        if(vm.newTeam.Users.length > 0){
          return DataGatewayService[vm.method.create](vm.route.create, vm.newTeam ,AuthService.getToken()).then(function(response){
            if(response.status % 200 < 100){
              vm.newTeam = [];
              hide();
            }
            return view();
          }).catch(function(error){
          });
        }
      }

      function member(index){
        if(index !== undefined){
          vm.newTeam.splice(index);
        }else{
          vm.newTeam.Users.push({
            "Username": "",
            "Role": "",
          });
        }
      }

      function show(){
        $('.ui.modal').modal('show');
        vm.newTeam = {
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
