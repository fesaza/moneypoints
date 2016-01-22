function handleError(pl) {

    var msg = "";

    if (pl.data.ExceptionMessage)
        msg = pl.data.ExceptionMessage;
    else msg = pl.data.Message;

    new PNotify({
        text: 'Error: ' + msg,
        type: 'danger',
        delay: 3000
    });
}

angular.module('fsMoneyPoints', [])
.service('CordovaService', ['$document', '$q',
  function ($document, $q) {

      var d = $q.defer(),
          resolved = false;

      var self = this;
      this.ready = d.promise;

      document.addEventListener('deviceready', function () {
          resolved = true;
          d.resolve(window.cordova);
      });

      // Check to make sure we didn't miss the 
      // event (just in case)
      setTimeout(function () {
          if (!resolved) {
              if (window.cordova) d.resolve(window.cordova);
          }
      }, 3000);
  }]);

var app = angular.module('moneyPointsApp', ['fsMoneyPoints', 'ngRoute', 'ngCookies', 'kendo.directives']).filter('pagination', function () {
    return function (input, start) {
        start = +start;
        if (input != null)
            return input.slice(start);
    };
});;


app.config(function ($routeProvider, $httpProvider) {
    //$httpProvider.defaults.headers.common.Authorization = 'Basic VGFpc2VlckpvdWRlaDpZRUFSVkZGTw==';

    $routeProvider
        .when('/login', {
            controller: 'loginController',
            templateUrl: 'app/views/login/loginView.html',
            hideMenus: true
        })
        .when('/afiliadosCliente', {
            controller: 'afiliadosClienteController',
            templateUrl: 'app/views/clientes/afiliadosClienteView.html'
        })
        .when('/cargarPuntos/:beneficiariosClienteId', {
            controller: 'cargarPuntosController',
            templateUrl: 'app/views/clientes/cargarPuntosView.html'
        })
        .when('/beneficiariosCliente', {
            controller: 'beneficiariosClienteController',
            templateUrl: 'app/views/clientes/beneficiariosClienteView.html'
        })
        .when('/conciliaciones', {
            templateUrl: 'app/views/clientes/conciliaciones/conciliacionesView.html',
            controller: 'conciliacionesController'
        })
        .when('/conciliacionesDetails/:conciliacionId', {
            templateUrl: 'app/views/clientes/conciliaciones/conciliacionesDetailsView.html',
            controller: 'conciliacionesDetailsController'
        })
        .when('/conciliacionesNew', {
            templateUrl: 'app/views/clientes/conciliaciones/conciliacionesNewView.html',
            controller: 'conciliacionesDetailsController'
        })
        //recibirConciliaciones
        .when('/recibirConciliaciones/:conciliacionId', {
            templateUrl: 'app/views/aliados/conciliacionesDetailView.html',
            controller: 'recibirConciliacionesController'
        })
        .when('/clientes', {
            templateUrl: 'app/views/clientes/clientesView.html',
            controller: 'clientesController'
        })
         .when('/clientesDetails/:ClienteId', {
             templateUrl: 'app/views/clientes/clientesDetailsView.html',
             controller: 'clientesDetailsController'
         })
        .when('/beneficiarios', {
            templateUrl: 'app/views/beneficiarios/beneficiariosView.html',
            controller: 'beneficiariosController'
        })
        .when('/HomeBeneficiario', {
            templateUrl: 'app/views/beneficiarios/HomeBeneficiarioView.html',
            controller: 'HomeBeneficiarioController'
        })
         .when('/ComercioAsociado', {
             templateUrl: 'app/views/beneficiarios/ComercioAsociadoView.html'
         })
         .when('/beneficiariosDetails/:beneficiarioId', {
             templateUrl: 'app/views/beneficiarios/beneficiariosDetailsView.html',
             controller: 'beneficiariosDetailsController'
         })
        .when('/registrarse/:beneficiarioId', {
            templateUrl: 'app/views/beneficiarios/beneficiariosDetailsView.html',
            controller: 'beneficiariosDetailsController'
        })
         .when('/detallesCuentaBeneficiario/:beneficiariosClienteId/:nombre', {
             templateUrl: 'app/views/beneficiarios/detallesCuentaBeneficiario.html',
             controller: 'detallesCuentaBeneficiarioController'
         })
        .when('/vender', {
            templateUrl: 'app/views/aliados/ventaView.html',
            controller: 'ventaController'
        })
        .when('/compra', {
            templateUrl: 'app/views/beneficiarios/compra/compraView.html',
            controller: 'compraController'
        })
        .when('/confirmarCompra', {
            templateUrl: 'app/views/beneficiarios/compra/confirmarCompraView.html',
            controller: 'confirmarCompraController'
        })
        .when('/seguridad', {
            templateUrl: 'app/views/beneficiarios/seguridadView.html',
            controller: 'seguridadController'
        })
        .when('/equivalencias', {
            templateUrl: 'app/views/clientes/equivalenciasView.html',
            controller: 'equivalenciasController'
        })
        .when('/recuperarContraseña', {
            templateUrl: 'app/views/beneficiarios/RecuperarContrasena.html',
            controller: 'RecuperarContrasenaController'
            
        })
         .otherwise({
             redirectTo: 'app/home.html'
         });
}).run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {



        //Mantener usuario logueado
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {

            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        } else {
            //Redireccionar al login
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser && $location.path() !== '/registrarse/0' && $location.path() !== '/recuperarContraseña') {
                $location.path('/login');
            }
        }


        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            //Redireccionar al login
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser && $location.path() !== '/registrarse/0' && $location.path() !== '/recuperarContraseña') {
                $location.path('/login');
            }
        });

        $rootScope.beforeSendRequest = function (req) {
            req.setRequestHeader('Authorization', 'Basic ' + $rootScope.globals.currentUser.authdata);
        };
    }]);

app.controller('indexCtrl', function ($scope, CordovaService, $location, $rootScope, authenticationService) {
    $scope.goPath = function (path) {
        $location.path(path);
    };

    $scope.logout = function () {

        authenticationService.clearCredentials();
        $scope.asegurables = {};
        $location.path('/login');
    };


    //$rootScope.baseAddress = "http://localhost/Se.MoneyPoints.Api";
    $rootScope.baseAddress = "http://atenas:90/moneypoints_pru";
    // $rootScope.baseAddress = "http://aplicaciones.softwareestrategico.com:90/moneypoints_pru";

    $scope.tcdevicePixelRatio = window.devicePixelRatio;

    $rootScope.$on('refreshMenu', function (event, data) {

        $scope.asegurables = data;
    });

    $scope.ocultar = function () {
        //jQuery("#wrapper").toggleClass("toggled");
        jQuery('nav').removeClass("gn-open-all");
        jQuery('#mainMenuIcon').removeClass("gn-selected");
    }

    $rootScope.$on("$routeChangeSuccess", function () {
        window.scrollTo(0, 0);
    });

    $rootScope.$on('$locationChangeSuccess', function () {

        if ($location.path() == '/login' || $location.path() == '/registrarse/0' || $location.path() == '/RecuperarUser') {
            if (!$rootScope.globals.currentUser)
                $scope.hideMenus = false;
            else {
                authenticationService.navigateDefaultPage();
            }
        }

        else {

            //Mostrar menu
            $scope.hideMenus = true;
        }
    });
});