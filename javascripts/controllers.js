/* global angular */

'use strict';

var myVersion = 1;
var OBJECT_STORE_ITEMS = 'chegadas';

var listavooDbControllers = angular.module('listavooDbControllers', ['xc.indexedDB']);

listavooDbControllers.config(function ($indexedDBProvider) {
	$indexedDBProvider
      .connection('painel-localdb')
      .upgradeDatabase(myVersion, function(event, db, tx){
      		if(!db.objectStoreNames.contains(OBJECT_STORE_ITEMS)) {
      			var osItemsDashboard = db.createObjectStore(OBJECT_STORE_ITEMS, { keyPath: "id", autoIncrement:true});
      		}
      });
});

listavooDbControllers.controller('InicioCtrl', ['$scope', '$indexedDB', 
		function($scope,  $indexedDB) {
			
	var itemsObjectStore = $indexedDB.objectStore(OBJECT_STORE_ITEMS);	
	
	init();
	
	function init() {				
      itemsObjectStore.clear();
      itemsObjectStore
          .insert({"horavoo":new Date(),
                   "destino": "Florianópolis",
                   "aeroporto": "Hercílio Luz",
                   "ciaaerea": "TAM",
                   "numerovoo": "4700",
                   "terminal": "2",
                   "portao": "22",			         
                   "horaestimada":new Date(),
                   "status": "Última Chamada"
          });
      itemsObjectStore
          .insert({"horavoo":new Date(),
                   "destino": "Vitória",
                   "aeroporto": "Vitória",
                   "ciaaerea": "GOL",
                   "numerovoo": "1696",
                   "terminal": "1",
                   "portao": "R3",			         
                   "horaestimada":new Date(),
                   "status": "Despacho Aberto"
          });
      itemsObjectStore
          .insert({"horavoo":new Date(),
                   "destino": "Porto Alegre",
                   "aeroporto": "Salgado Filho",
                   "ciaaerea": "AVIANCA",
                   "numerovoo": "6279",
                   "terminal": "1",
                   "portao": "03",			         
                   "horaestimada":new Date(),
                   "status": "Embarque Próximo"
          });			
	};
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {		
		$location.path('/voos/chegadas');
	};
			
}]);

listavooDbControllers.controller('listaVoosCtrl', ['$scope', '$log', '$interval', '$rootScope', '$routeParams', '$location',  '$indexedDB',  
		function($scope, $log, $interval,$rootScope, $routeParams, $location, $indexedDB) {
	
    var itemsObjectStore = $indexedDB.objectStore(OBJECT_STORE_ITEMS);
    
    if ($rootScope == "saida")$scope.entidade = {"pt":"Saídas","en":"Departures","es":"Salidas"};
    else $scope.entidade = {"pt":"Chegadas","en":"Arrivals","es":"Llegadas"};
    
    init();
    
    	
    function init() {				
        itemsObjectStore.clear();
        itemsObjectStore
            .insert({"horavoo":new Date(),
                     "destino": "Florianópolis",
                     "aeroporto": "Hercílio Luz",
                     "ciaaerea": "TAM.png",
                     "numerovoo": "4700",
                     "terminal": "2",
                     "portao": "22",			         
                     "horaestimada":new Date(),
                     "status": {"pt":"Última Chamada","en":"Last Call","es":"Última Llamada"}
            });
        itemsObjectStore
            .insert({"horavoo":new Date(),
                     "destino": "Vitória",
                     "aeroporto": "Vitória",
                     "ciaaerea": "GLO.png",
                     "numerovoo": "1696",
                     "terminal": "1",
                     "portao": "R3",			         
                     "horaestimada":new Date(),
                     "status": {"pt":"Despacho Aberto", "en":"Checking Open", "es":"facturación abierta"}
            });
        itemsObjectStore
            .insert({"horavoo":new Date(),
                     "destino": "Porto Alegre",
                     "aeroporto": "Salgado Filho",
                     "ciaaerea": "ONE.png",
                     "numerovoo": "6279",
                     "terminal": "1",
                     "portao": "03",			         
                     "horaestimada":new Date(),
                     "status": {"pt":"Embarque Próximo","en":"Boarding" , "es":"En Ruta"}
            });			
    }; 
    
    function buscaItems() {        
        itemsObjectStore.getAll().then(function(itemsList) {
            $scope.listViewItems = itemsList;
            $scope.titulo.horavoo = {"pt":"HORÁRIO VOO","en":"FLIGHT TIME"};
            $scope.titulo.destino = {"pt":"DESTINO","en":"DESTINATION"};
            $scope.titulo.aeroporto = {"pt":"AEROPORTO","en":"AIRPORT"};
            $scope.titulo.cia = {"pt":"CIA. AEREA","en":"AIR COMPANY"};
            $scope.titulo.terminal = {"pt":"TERMINAL","en":"TERMINAL"};
            $scope.titulo.portao = {"pt":"PORTÃO","en":"GATE"};
            $scope.titulo.horaestimada = {"pt":"HORÁRIO ESTIMADO","en":"ESTIMATED TIME"};
        });		
    };
    
    if($indexedDB.onDatabaseError) {
      $location.path('/unsupported');
    } else {
      buscaItems();
    };
		
}])
.directive('changeCurrentLanguage', ['$interval', 'dateFilter',
      function($interval, dateFilter) {        
        // return the directive link function. (compile function not needed)        
        return {
              restrict: "A",
              replace: true,             
              scope: {model:'='},      
              link:function(scope, element, attrs) {
                  var next = 0;
                  var languages = ['pt', 'en', 'es'];
                  var format = "dd/MM/yyyy HH:mm:ss";  // date format
                  var stopTime; // so that we can cancel the time updates
                  var seconds = 5;
                  
                  // used to update the UI
                  function updateTime() {                      
                      element.text(dateFilter(new Date(), format));
                      seconds--;
                      if (seconds==0){
                          scope.model = languages[next];                      
                          if (++next > languages.length-1) next=0;
                          seconds=5;
                      }
                  }
                  
                  // watch the expression, and update the UI on change.
                  /*scope.$watch(attrs.changeCurrentLanguage, function() {                  
                      updateTime();
                  });*/
                  
                  stopTime = $interval(updateTime, 1000);
                  
                  // listen on DOM destroy (removal) event, and cancel the next UI update
                  // to prevent updating time after the DOM element was removed.
                  element.on('$destroy', function() {
                    $interval.cancel(stopTime);
                  });
              }
        }
}]);

function AppController($scope) {
    $scope.selectedLang = 'Old value';
}
