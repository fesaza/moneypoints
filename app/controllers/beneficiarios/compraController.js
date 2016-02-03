﻿(function () {
    'use strict';

    angular.module("moneyPointsApp").factory('dataVenta', function () {

        var venta = null;

        var setDataVenta = function (data) {
            venta = data;
        };

        var getDataVenta = function () {
            return venta;
        }

        return {
            getDataVenta: getDataVenta,
            setDataVenta: setDataVenta
        };
    });

    angular.module("moneyPointsApp").controller('compraController',
        ['$scope', '$rootScope', '$', 'ventaService', 'beneficiariosService', 'afiliadosService','clientesService', 'dataVenta', compraController]);

    function compraController($scope, $rootScope, $, ventaService, beneficiariosService, afiliadosService, clientesService, dataVenta) {

        $scope.compra = null;
        $scope.text = "";
        var ventaServiceStarted = false;

        var setData = function (r) {

            kendo.ui.progress($("#divVenta"), true);

            var spl = r.split("_");
            $scope.compra = {
                Valor: spl[2],
                AliadoId: spl[3],
                BeneficiarioId: spl[1],
                ConnectionIdCliente: spl[0]
            }

            //Consultar datos del beneficiario
            var prmBeneficiario = beneficiariosService.get(spl[1]);

            prmBeneficiario.then(function (pl) {
                var res = pl.data;

                if (!res) {
                    new PNotify({ text: "No se encontraron los datos del beneficiario.", type: "danger", delay: 3000 });
                    return;
                }

                //todo: validar que la cedula coincida con la session
                $scope.beneficiario = res;

                kendo.ui.progress($("#divVenta"), false);
            }, function (error) {
                new PNotify({ text: "No se pudo consultar la información del beneficiario" + error.message, type: "danger", delay: 3000 });
            });

            var prmAfiliado = clientesService.get(spl[3]);

            prmAfiliado.then(function (pl) {
                var res = pl.data;

                if (!res) {
                    new PNotify({ text: "No se pudo consultar la información del aliado", type: "danger", delay: 3000 });
                    return;
                }

                $scope.aliado = res.Tercero;
            }, function (error) {
                new PNotify({ text: "No se pudo consultar la información del aliado" + error.message, type: "danger", delay: 3000 });
            });
        };

        var scan = function () {
        
            if (window.navigator.platform === "Win32") {
                new PNotify({ text: "función no soportada en simulador", type: "danger", delay: 3000 });
                //Esta linea es para pruebas en pc
                setData('f7a164ba-d3d4-4136-80d3-5a0427ac8200_5108_2_1090');
            }
            else {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {
                            setData(result.text);
                        }
                    },
                    function (error) {
                        new PNotify({ text: "Error escanenado", type: 'danger', delay: 3000 });
                    });
            }
        }

        $scope.$on('$viewContentLoaded', scan);

        $rootScope.$on("startCompleted", function (e) {
            ventaService.sincronizarCompra($scope.compra.ConnectionIdCliente);
        });

        $scope.confirmarCompra = function () {
            debugger;
       $scope.unmensaje = false
       if (!ventaServiceStarted && !$scope.unmessage) {
           $scope.unmensaje = true;
                ventaService.initialize();
            }
        };

        var confirmarCompraCallBack = function (message) {
            
            ventaServiceStarted = true;
            new PNotify({ text: message, type: 'info', delay: 3000 });

            $scope.goPath('/confirmarCompra');
            dataVenta.setDataVenta($scope.compra);
            $scope.$apply();
        };

        $rootScope.$on("confirmarCompra", function (e, message) {
            confirmarCompraCallBack(message);
        });

    };
})();