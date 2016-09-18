(function(){
  angular.module('app.controllers')
    .controller('MeetingController', MeetingController);

    MeetingController.$inject = ['DataGatewayService', 'AuthService', '$window'];

    function MeetingController(DataGatewayService, AuthService, $window){
      var vm = this;
      vm.route = {
        'meeting': 'meeting',
        'team': 'team',
        'search': 'search',
        'submit': 'meeting/submit'
      };
      vm.schedule ={};
      vm.show = show;
      vm.hide = hide;
      vm.create = create;
      vm.select = select;
      vm.submit = submit;
      vm.position = {};
      vm.meetings = [];
      vm.teams = [];
      vm.results = [];

      activate();

      /////////////////////

      function activate(){
        if(!AuthService.isLoggedIn()){
          $window.location.href = '/';
        }else{
          return DataGatewayService[vm.method.view](vm.route.team, {}, AuthService.getToken())
          .then(function(response){
            vm.teams = response.data;
            return DataGatewayService[vm.method.view](vm.route.meetings, {}, AuthService.getToken());
          })
          .then(function(response){
            var teamId = 0;
            vm.meetings = response.data;
            //Maps a team to each meeting
            for(var i = 0 ; i < vm.meetings.length; i++){
              teamId = meetings[i].TeamId;
              for(var j = 0 ; j < vm.teams.length; j++){
                if(vm.teams[j].Id == teamId){
                  meetings[i].Team = vm.teams[j];
                  break;
                }
              }
            }
          });
        }
      }

      function create(){
        vm.schedule = {
          StartDate: '',
          StartTime: '',
          WiFi: false,
          Electricity: false,
          Calm: false,
          Nature: false,
          Coffee: false,
          Beer: false,
          Food: false,
          Affordable: false,
        };
      }

      function member(){
        vm.newTeam.Users.push({
          "Username": "",
          "Role": "",
        });
      }

      function show(){
        $('.ui.modal.1').modal('show');
        create();
      }

      function hide(x){
        if(x === undefined) x =1;
        $('.ui.modal.'+x).modal('hide');
      }

      function select(){
        $('.ui.modal.2').modal('show');
        var position = getLocation();
        vm.schedule.Latitude = position.coords.latitude;
        vm.schedule.Longitude = position.coords.longitude;
        return DataGatewayService.post(vm.route.search, vm.schedule ,AuthService.getToken()).then(function(response){
          if(response.status % 200 < 100){
            for(var i=0; i < vm.results; i++){
              vm.results.pop();
            }
            for(var i=0; i < response.data; i++){
              response.data[i].chosen = false;
              vm.results.push(response.data[i]);
            }
          }
        });

      }

      function submit(){
        var choice;
        for (var i = 0; i < vm.results.length; i++) {
          if (vm.results[i].chosen) {
            choice = vm.results[i];
            return DataGatewayService.post(vm.route.submit, choice , AuthService.getToken()).then(function(){
              hide(2);
            });
          }
        }
        //
      }

      function getLocation() {
          if (navigator.geolocation) {
              return navigator.geolocation.getCurrentPosition();
          } else {
              return;
          }
      }



    }
})();
