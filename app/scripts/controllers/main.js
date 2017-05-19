'use strict';



/**
 * @ngdoc function
 * @name obc-grants.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the obc-grants
 */
angular.module('mdsApp') 
    .controller('MainCtrl', function ($scope, $location, $http, $modal) {

        var APIURL = 'http://localhost:3000';
        var configName = $location.search().configName;
$http.get(APIURL + '/mdc_tree')
    .success(function (data) {
      $scope.softwareTerms = {"Software" : data.software}
      $scope.datasetsTerms = {"Datasets" : data.dataset}
    
 $scope.showChildren = function (term) {
    for (var i in term.children) {
      term.children[i].show = true;
    }
  };

  $scope.hasChildren = function (term) {
    return $scope.areTermsEmpty(term.children);
  };

  $scope.display_detail = function (item) {
    //if the term that we get back is not root then we should display their information.
    if (item.isRoot == false){
      $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/modals/detail-modal.html',
        controller: 'DetailModalInstanceController',
        size: 'lg',
        resolve: {
          item: function () {
            return item;
          }
        }
    });
    }
    
    return $scope.areTermsEmpty(item.children);
  };

  $scope.areTermsEmpty = function (terms) {
    if (Object.keys(terms).length === 0 && terms.constructor === Object) {
      return false;
    } else {
      return true;
    }
  };

    });



})




