


angular.module('mdsApp').controller('DetailModalInstanceController', function ($scope, $location, $http, $modal, item, $modalInstance) {
  var parsedItem = {}
  for (var key in item) {
    if (Array.isArray(item[key])){
      var fieldData = ""
      for (var i in item[key]) {
        fieldData = item[key][i] + ", "
      }
      //we remove the last comma and space.
      parsedItem[key] = fieldData.slice(0, -2);
    }
    else {
      parsedItem[key] = item[key]
    }
  }
  $scope.item = parsedItem;
     $scope.closeModal = function () {
       $modalInstance.close();
   };
  });

