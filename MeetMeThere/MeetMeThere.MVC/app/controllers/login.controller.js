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
