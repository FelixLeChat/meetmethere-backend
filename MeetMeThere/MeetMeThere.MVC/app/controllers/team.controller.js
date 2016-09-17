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
          return DataGatewayService[vm.method.view](vm.route.view, {}).then(function(response){
            vm.teams = response.data;
          });
        }
      }

      function create(){
        return DataGatewayService[vm.method.create](vm.route.create, {}).then(function(response){
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
