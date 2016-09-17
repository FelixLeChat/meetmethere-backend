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
