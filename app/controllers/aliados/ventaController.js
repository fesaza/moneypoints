(function () {
    'use strict';

    angular.module("moneyPointsApp")
    .controller('ventaController', ['$scope', '$rootScope', '$', 'ventaService', 'tercerosService', 'authorizationService', ventaController]);

    function ventaController($scope, $rootScope, $, ventaService, tercerosService, authorizationService) {
    
        $scope.text = "";
        $scope.onlyNumber = /^\d+$/;
        $scope.QR = false;
        //Se debe cambiar valor para que no este quemado (Usuario logueado
        //var clienteId = 3;
        var clienteId = authorizationService.getId();
        //$scope.onlyNumber = /^\d+$/;
        $scope.venta = null;

        var updateGreetingMessage = function (text) {
            $scope.text = text;
        }

        var generarQRCompleted = function (text) {
            $scope.text = text;
        }

        $rootScope.$on("finalizarCompraCompleted", function (e, message) {
            finalizarCompraCallBack(message);
        });

        var finalizarCompraCallBack = function (message) {
            debugger;
            var factura = message;
            var numero = factura.split(".");
            new PNotify({ text: message, type: 'info', delay: 3000 });
      
        };

        ventaService.initialize();

        
        $scope.generarQR = function () {
            
            $scope.QR = true;
            kendo.ui.progress($("#frmVenta"), true);

            //Limpiar div
            $('#divQR').empty();
            $scope.terceroBeneficiario = null;

            //Validar cedula
            var cedula = $scope.venta.Identificacion;

 
            var promiseGetbeneficiario = tercerosService.getByIdentificacion(cedula);

          

            promiseGetbeneficiario.then(function (pl) {
              
                var res = pl.data;

                if (res.length == 0) {
                 
                    $scope.QR = false;
                  
                    new PNotify({ text: 'La identificación no existe.', type: 'danger', delay: 3000 });
                } else {
                    var tercero = res[0];
                    if (tercero.Beneficiarios.length == 0) {
                        $scope.QR = false;
                        new PNotify({ text: 'La identificación no esta registrada como beneficiario.', type: 'danger', delay: 3000 });
                        return;
                    }

              
                    $scope.terceroBeneficiario = tercero;

                    var textQR = ventaService.getConnectionId() + "_" + tercero.Beneficiarios[0].BeneficiarioId + "_" + $scope.venta.Valor + "_" + clienteId;
                    $scope.text = textQR;
                   
                    //generar qr
                    $('#divQR').qrcode({
                        "render": 'div',
                        "width": 100,
                        "height": 100,
                        "color": "#FFFFFF",
                        "mode": 4,
                        "text": textQR
                    });
                }

                kendo.ui.progress($("#frmVenta"), false);
            },
             function (errorPl) {
                 handleError(errorPl);
             });


        }

        $rootScope.$on("acceptGreet", function (e, message) {
            $scope.$apply(function () {
                updateGreetingMessage(message);
            });
        });

        $rootScope.$on("generarQRCompleted", function (e, message) {
            $scope.$apply(function () {
                generarQRCompleted(message);
            });
        });

        var confirmarCompraCallBack = function (message) {
            //new PNotify({ text: message + " Esperando PIN.", type: 'info', delay: 3000 });
        };

        $rootScope.$on("confirmarCompra", function (e, message) {
            $scope.$apply(function () {
                confirmarCompraCallBack(message);
            });
        });
    };

})();