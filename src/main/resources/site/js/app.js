'use strict';
/* global angular */

console.log('app.js x: creating myApp module');
const app = angular.module('myApp', [
  'myApp.directives', 'myApp.filters', 'myApp.services',
  'ngRoute', 'ngSanitize', 'ngTouch'
]);
console.log('app.js x: created myApp module');


app.config(['$routeProvider', $routeProvider => {
  $routeProvider.when('/view1', {
    templateUrl: 'partials/partial1.html',
    controller: 'MyCtrl',
    view: 'center'
  });
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);


app.controller('MyCtrl', (function($scope) {
	
	
	  if (!WebSocket) window.WebSocket = window.MozWebSocket;
	  if (!WebSocket) {
		    return alert('Your browser does not support WebSockets.');
	  }


	  var client = null;

	  function startupWebSocket() {
	
	// Create a client instance
	client = new Paho.MQTT.Client(location.hostname, 9001, "myWSClient");
	
	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	
	// connect the client
	client.connect({onSuccess:onConnect});
	
	
	// called when the client connects
	function onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	  console.log("onConnect");
	  client.subscribe("#"); //simple demo just subscribe to everything.
	  
	  //////this is how to send messages but we are not doing that in this demo.
	  //message = new Paho.MQTT.Message("Hello");
	  //message.destinationName = "World";
	  //client.send(message);
	  ////////////////////////////
	}
	
	// called when the client loses its connection
	function onConnectionLost(responseObject) {
	  if (responseObject.errorCode !== 0) {
	    console.log("onConnectionLost:"+responseObject.errorMessage);
	  }
	}
	
	function isScalarField(field) {
		
		switch (field) {
		    case 'ManifoldSerialNumberMessage':
		    case 'ValveSerialNumberMessage':
		    case 'LifeCycleCountMessage':
		    case 'SupplyPressureMessage':
		    case 'DurationOfLast1_4SignalMessage':
		    case 'DurationOfLast1_2SignalMessage':
		    case 'EqualizationAveragePressureMessage':
		    case 'EqualizationPressureRateMessage':
		    case 'ResidualOfDynamicAnalysisMessage':
		    		    
		        return true;
		}
		return false;
		
	}
	
	function isTextField(field) {
		return field == "PartNumberMessage";		
	}
	
	function isBooleanField(field) {
		switch (field) {
		    case 'ValueFault':
		    case 'PressureFault':
		    case 'LeakFault':
		    		    
		        return true;
		}
		return false;
	}
	
	// called when a message arrives
	function onMessageArrived(message) {
	
	 if (!message.duplicate) {
	 
	
	
	  var now = new Date().getTime();
	  
	  var topic = message.destinationName;
	  console.log("onMessageArrived:"+topic);
	  
	  var segments = topic.split("/");
	  
	  //only one on the chart
	  if (segments[3] == "SupplyPressureMessage") {
	      var temp = new ArrayBuffer(4);
	      var dataView = new DataView(temp); //ArrayBuffer
	    	    
	      dataView.setInt8(0, message.payloadBytes[0]);
	      dataView.setInt8(1, message.payloadBytes[1]);
	      dataView.setInt8(2, message.payloadBytes[2]);
	      dataView.setInt8(3, message.payloadBytes[3]);
	      
	  	  //  //NOTE: we use local time or chart may be off screen.    
	      
	      var value = dataView.getInt32(0);	
		  var station = Number(segments[2]);
	      line[station-1].append(now, value);
	      
	      //$scope.valve[station-1][segments[3]] = value;	      	      
	      

          // $scope.result = buildSVG(buildFactory($scope.stationStyles));
	  	  // $scope.$apply();
	  }
	  
	  
	  
	  if (isScalarField(segments[3]) ) {
	      var temp = new ArrayBuffer(4);
	      var dataView = new DataView(temp); //ArrayBuffer
	    	    
	      dataView.setInt8(0, message.payloadBytes[0]);
	      dataView.setInt8(1, message.payloadBytes[1]);
	      dataView.setInt8(2, message.payloadBytes[2]);
	      dataView.setInt8(3, message.payloadBytes[3]);

	      var value = dataView.getInt32(0);	
		  var station = Number(segments[2]);

	      $scope.valve[station-1][segments[3]] = value;	      	      
	      
	      $scope.$apply();
	  }
	  
	  if (isTextField(segments[3]) ) {
		  var station = Number(segments[2]);
	      $scope.valve[station-1][segments[3]] = message.payloadString;	      
	      $scope.$apply();
	  }
	  
	  
	  if (isBooleanField(segments[3]) ) {
		  var station = Number(segments[2]);
	      $scope.valve[station-1][segments[3]] = message.payloadString;	  
	      
	      
	      //TODO: if string matches the kind of filter then set the values for the objects.
	      
	      
	      // if (segments[3] == "ValueFault") {
	      	  // if (message.payloadString == "True") {
	      	  	// $scope.stationStyles["m1s1"]="style=filled, fillcolor=red";
	      	  // } else {
	      	  	// $scope.stationStyles["m1s1"]="";
	      	  // }
	      // }
// 	      
	      // if (segments[3] == "LeakFault") {
	      	  // if (message.payloadString == "True") {
	      	  	// $scope.stationStyles["m1s1"]="style=filled, fillcolor=blue";
	      	  // } else {
	      	  	// $scope.stationStyles["m1s1"]="";
	      	  // }
	      // }
// 	      
	      // $scope.result = buildSVG(buildFactory($scope.stationStyles));	      	      
	      // $scope.$apply();
	      
	      
	  }
	  

	  }
	  
	  
	}
	
	
	
	  }
	  
  	  
	  startupWebSocket();
	 

		$scope.send = function(message) {
		}		
		
		$scope.subscribe = function(subId) {
		}
		
		$scope.unsubscribe = function(subId) {
		}    
		
		
	  $scope.valve = [{},{},{},{}]; 

		
	function circleRun(fills, cx1, cy1, stepX, stepY, r ) {		
		 var c;
		 var result = "";
		
		 for(c = 0; c < fills.length; c++){		 	
		 	result = result.concat(circle(fills[c], cx1+(stepX*c), cy1+(stepY*c), r ));
		 }		
		
		return result;
	}	

	function circle(fill, cx, cy, r) {
		return "<circle ng-click=\"console.log('zzzz');\"   fill=\"".concat(fill,"\" stroke=\"black\" cx=\"",cx,"\" cy=\"",cy,"\" r=\"", r,"\"/>"); 
	}	
		
		
	$scope.leakFilter = function() {
		console.log("hello");
	}	
	
	$scope.valveFilter = function() {
		console.log("hello");
	}			
		
	$scope.overFilter = function() {
		console.log("hello");
	}
	
	$scope.underFilter = function() {
		console.log("hello");
	}		
		
	$scope.lifeFilter = function(limit) {
		console.log("hello "+limit);
	}		
	
	$scope.lifeLimit = 1000;
	
		
	$scope.m1ValveStates = 	["none","red"];
	$scope.m2ValveStates = 	["none","red","none"];
	$scope.m3ValveStates = 	["none","red","none"];
	$scope.m4ValveStates = 	["green","green","none"];
	$scope.m5ValveStates = 	["green","green","none"];	
		
		
	function mapItems() {
		
		var result = "";
		
		var xBase = 20;
		var yBase = 150;
		
		result = result.concat(circleRun($scope.m1ValveStates, xBase+10, yBase-400, 20, -10, 5));
		result = result.concat(circleRun($scope.m4ValveStates, xBase+10, yBase-230, 0, -30, 5));
		result = result.concat(circleRun($scope.m2ValveStates, xBase+20, yBase-190, 20, 10, 5));
		
		result = result.concat(circleRun($scope.m3ValveStates, xBase+350, yBase-190, -20, 10, 5));
		result = result.concat(circleRun($scope.m3ValveStates, xBase+370, yBase-310, 0, 30, 5));
		
		//result = result.concat(circle("blue",0,0,10) );
		
		return result;
	}	

		  
	function buildSVGFloor() {
				
		console.log("zzzzzzzzzzzzzzzzzzzzz  hello");
		
	   return "<svg width=\"640pt\" height=\"380pt\" viewBox=\"0.00 0.00 640 380\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> \
	          <g id=\"graph0\" class=\"graph\" transform=\"scale(1 1) rotate(0) translate(4 380) \">".concat(mapItems(),
	          "</g>  </svg>");
			  

		
	}	  
	
	$scope.result = buildSVGFloor();
 
 
 
		  
		  
 }));
