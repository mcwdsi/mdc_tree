'use strict';



/**
 * @ngdoc function
 * @name obc-grants.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the obc-grants
 */
angular.module('dujourApp')
    .controller('MainCtrl', function ($scope, $location, $http) {

        var APIURL = 'http://localhost:3000';
        $scope.headers = [];
        headers.items = [];
        var configName = $location.search().configName;
        $http.get(APIURL + '/grants', {    
        }).success(function (data) {
            console.log(data)
            var publications = {};
            var pubsByYear = {}
            //The first loop gets rid of duplicates
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
                            idLabel: data[i].grantidlabel
                        };
                        publications[key] = current
                    }
                }
                
            }
            //The second loop puts the values by year.
            console.log(publications)
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
                console.log(dates)
                for (var i in dates) {
                    var header = { "title": dates[i].date};
                    header.items = []
                    var datesRange = dates[i].date.split("-");
                    if (datesRange.length > 1) {
                        //This is a range of dates
                        var range = datesRange[0]- datesRange[1];
                        for (var x = 0; x <= range; x++) {
                            var currentDate = Number(datesRange[0]) - Number(x);
                            if(currentDate in pubsByYear){
                                pubsByYear[currentDate].sort(function(a,b) {return (a.published < b.published) ? 1 : ((b.published < a.published) ? -1 : 0);} );
                                for(pub in pubsByYear[currentDate]){
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
                                console.log(pubsByYear[currentDate][pub])
                                header.items = header.items.concat(pubsByYear[currentDate][pub])
                            }
                        }
                    }
                    $scope.headers.push(header)
                }
           });
           
        });
    });


