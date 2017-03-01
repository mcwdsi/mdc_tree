'use strict';



/**
 * @ngdoc function
 * @name obc-grants.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the obc-grants
 */
angular.module('pubsApp') 
    .controller('MainCtrl', function ($scope, $location, $http) {

        var APIURL = 'http://localhost:3000';
        $scope.headers = [];
        headers.items = [];
        var configName = $location.search().configName;
        $http.get(APIURL + '/pubs_page', {    
        }).success(function (data) {
            console.log(data)
            var publications = {};
            var pubsByYear = {}
            //The first loop gets rid of duplicates
            var total = 0;
            for (var i in data) {
                if (data[i].pubName != undefined){
                    var key = data[i].pubName
                    if (!(key in publications)) {
                        var current = {
                            published: data[i].date,
                            authors: data[i].authors,
                            journal: data[i].journal,
                            pubTitle: data[i].pubName,
                            grantTitle: data[i].title,
                            linkout: data[i].linkout,
                            idLabel: data[i].grantidlabel,
                            pmid: data[i].pmid
                        };
                        publications[key] = current
                        total = total + 1;
                    }
                }
            }
            //The second loop puts the values by year.
            
            for (var key in publications) { 
                var year = publications[key].published.split("-")[0]
                var pub = [publications[key]]
                if(pubsByYear[year] == undefined){
                    pubsByYear[year] =  pub
                }
                else {
                    pubsByYear[year].push(publications[key]);
                } 
            }
            
            $http.get('scripts/configs/publications.json')
            .success(function (config) {
                //set the publications by the dates we get from the json config file.
                var dates = config.dates;
                $scope.title =config.title;

                for (var i in dates) {
                    var datesRange = dates[i].date.split("-");
                    var title =dates[i].date;
                    if (datesRange.length > 1) {
                        var title = datesRange[1] + "-" + datesRange[0];
                    }
                    var header = {};
                    header.items = []
                    header.title = title
                    if (datesRange.length > 1) {
                        //This is a range of dates
                        var range = datesRange[0]- datesRange[1];
                        for (var x = 0; x <= range; x++) {
                            var currentDate = Number(datesRange[0]) - Number(x);
                            if(currentDate in pubsByYear){
                                pubsByYear[currentDate].sort(function(a,b) {return (a.published < b.published) ? 1 : ((b.published < a.published) ? -1 : 0);} );
                                for(pub in pubsByYear[currentDate]){
                                    total = total-1
                                    pubsByYear[currentDate][pub].index = total;
                                    header.items = header.items.concat(pubsByYear[currentDate][pub])
                            }
                        }
                      }
                    }
                    else {
                         //This is just one year
                        var currentDate = dates[i].date
                        if(currentDate in pubsByYear){
                            pubsByYear[currentDate].sort(function(a,b) {return (a.published < b.published) ? 1 : ((b.published < a.published) ? -1 : 0);} );
                            for( pub in pubsByYear[currentDate] ){
                                total = total-1
                                pubsByYear[currentDate][pub].index = total;
                                header.items = header.items.concat(pubsByYear[currentDate][pub])   
                            }
                        }
                    }
                    if(header.items.length >0){
                        $scope.headers.push(header)
                    }
                }
           });
           
        });
    })
.controller('headerCtrl', ['$anchorScroll', '$location', '$scope',
  function($anchorScroll, $location, $scope) {
    $scope.gotoAnchor = function(x) {
      var newHash = 'anchor' + x;
      if ($location.hash() !== newHash) {
        $anchorScroll(newHash);
      } else {
        $anchorScroll();
      }
    };
  }
]);



