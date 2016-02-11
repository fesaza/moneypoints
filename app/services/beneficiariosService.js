﻿angular.module('moneyPointsApp').service('beneficiariosService', function ($http, $rootScope) {


    //Create new beneficiario
    this.post = function (beneficiario) {
        var request = $http({
            method: "post",
            url: $rootScope.baseAddress + "/api/beneficiarios" ,
            data: beneficiario
        });
        return request;
    }

    //Get beneficiario
    this.get = function (beneficiarioId) {
        return $http.get($rootScope.baseAddress + "/api/beneficiarios/" + beneficiarioId);
    }
     //Get beneficiario
    this.getSaldoTotal = function (beneficiarioId) {
        return $http.get($rootScope.baseAddress + "/api/Beneficiarios/GetSaldoTotal/" + beneficiarioId);
    }

    //Get todos los beneficiarios
    this.getbeneficiarios = function () {
        return $http.get($rootScope.baseAddress + "/api/beneficiarios");
    }


    //Update beneficiarios
    this.put = function (beneficiarioId, beneficiario) {
        var request = $http({
            method: "put",
            url: $rootScope.baseAddress + "/api/beneficiarios/" + beneficiarioId,
            data: beneficiario
        });
        return request;
    }
    //Delete beneficiarios
    this.delete = function (beneficiarioId) {
        var request = $http({
            method: "delete",
            url: $rootScope.baseAddress + "/api/beneficiarios/" + beneficiarioId
        });
        return request;
    }

    //RecuperarContraseña

    this.RecuperarContrasena = function (Tercero) {
        var request = $http({
            method: "post",
            url: $rootScope.baseAddress + "/api/Recuperar",
            data: Tercero
        });
        return request;
    }

    //Beneficiarios con paginacion
    this.BeneficiariosPaginados = function (page, rows, filter) {
        return $http.get($rootScope.baseAddress + "/api/Beneficiarios/Paginado/" + page + "/" + rows+"/"+filter);
    }

    this.EstadosCuentasPaginados = function (beneficiarioId, page, rows) {
        return $http.get($rootScope.baseAddress + "/api/BeneficiariosClientes/GetCuentasPaginado/" + beneficiarioId + "/" + page + "/" + rows);
    }

    this.getCompra = function (NumeroFactura) {
        debugger;
        return $http.get($rootScope.baseAddress + "api/Beneficiarios/Compra/" + NumeroFactura)
    }

});