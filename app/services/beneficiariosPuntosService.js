﻿angular.module('moneyPointsApp').service('beneficiariosPuntosService', function ($http, $rootScope) {

     //Get todos los historicos beneficiariosPuntos by beneficiarioId
    this.getbeneficiariosPuntosHistoricos = function (beneficiariosClienteId) {
        return $http.get($rootScope.baseAddress + "/api/BeneficiariosPuntos?$filter= BeneficiariosClienteId eq " + beneficiariosClienteId);
    }
    this.getbeneficiariosComprasHistorico = function (beneficiariosClienteId) {
    debugger;
        return $http.get($rootScope.baseAddress + "/api/BeneficiariosClientesCompras?$filter= BeneficiariosClienteId eq " + beneficiariosClienteId);
    }

    //Create new beneficiariosPunto
    this.post = function (beneficiariosPunto) {
        var request = $http({
            method: "post",
            url: $rootScope.baseAddress + "/api/beneficiariosPuntos",
            data: beneficiariosPunto
        });
        return request;
    }

    //Get beneficiariosPunto
    this.get = function (beneficiariosPuntoId) {
        return $http.get($rootScope.baseAddress + "/api/beneficiariosPuntos/" + beneficiariosPuntoId);
    }

    //Get todos los beneficiariosPuntos
    this.getbeneficiariosPuntos = function () {
        return $http.get($rootScope.baseAddress + "/api/beneficiariosPuntos");
    }

    //Update beneficiariosPuntos
    this.put = function (beneficiariosPuntoId, beneficiariosPunto) {
        var request = $http({
            method: "put",
            url: $rootScope.baseAddress + "/api/beneficiariosPuntos/" + beneficiariosPuntoId,
            data: beneficiariosPunto
        });
        return request;
    }
    //Delete beneficiariosPuntos
    this.delete = function (beneficiariosPuntoId) {
        var request = $http({
            method: "delete",
            url: $rootScope.baseAddress + "/api/beneficiariosPuntos/" + beneficiariosPuntoId
        });
        return request;
    }
});