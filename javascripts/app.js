/* global angular,window */
var listavooDbApp = angular.module('listavooDbApp', ['ngTouch', 'ngRoute', 'ngResource', 'ngAnimate', 'listavooDbControllers', 'listavooFilters']);

listavooDbApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider ,$locationProvider)
	{			
		$routeProvider.
			when('/', {
				//templateUrl: 'partials/dashboard.html',
				//controller: 'InicioCtrl'
				redirectTo: '/voos'
			}).
			when('/voos', { 
				templateUrl: 'partials/listaVoos.html',
				controller: 'listaVoosCtrl'
			}).
			when('/voos/chegadas', { 
				templateUrl: 'partials/listaVoos.html',
				controller: 'listaVoosCtrl'			
			}).
			when('/voos/saidas', { 
				templateUrl: 'partials/listaVoos.html',
				controller: 'listaVoosCtrl'			
			}).
			when('/unsupported', {
				templateUrl: 'partials/unsupported.html'
			}).
			otherwise({
				redirectTo: '/'
			});
			
		$locationProvider.html5Mode(true).hashPrefix('!');
		
	}
]);


		
// Registering a directive after app bootstrap
listavooDbApp.directive('head', ['$rootScope','$compile',
    function($rootScope, $compile){
        return {
            restrict: 'E',
            link: function(scope, elem){
                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.routeStyles = {};
                $rootScope.$on('$routeChangeStart', function (e, next, current) {
                    if(current && current.$$route && current.$$route.css){
                        if(!angular.isArray(current.$$route.css)){
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function(sheet){
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if(next && next.$$route && next.$$route.css){
                        if(!angular.isArray(next.$$route.css)){
                            next.$$route.css = [next.$$route.css];
                        }
                        angular.forEach(next.$$route.css, function(sheet){
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
    }
]);
