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
	  
      //need one of these per canvas
    //  const smoothie = [new SmoothieChart({millisPerPixel:40,maxValue:160,minValue:-40,interpolation:'linear'}),
	//			        new SmoothieChart({millisPerPixel:40,interpolation:'linear'}),
	//			        new SmoothieChart({millisPerPixel:40,interpolation:'linear'}),
	//			        new SmoothieChart({millisPerPixel:40,maxValue:100000000,minValue:0,labels:{disabled:true}})]
				   			            
	// smoothie[0].streamTo(document.getElementById("canvas"+0));		  
	// smoothie[1].streamTo(document.getElementById("canvas"+1));	
	// smoothie[2].streamTo(document.getElementById("canvas"+2));	
	// smoothie[3].streamTo(document.getElementById("canvas"+3),250);	 
	
    //  const line = [new TimeSeries(), //0sine
	//                new TimeSeries(), //1random
	//                new TimeSeries(), //2system cpu
	//                new TimeSeries(), //3process cpu
	//                new TimeSeries(), //4motion
	//                new TimeSeries(), //5light
	//                new TimeSeries(), //6uv
	//                new TimeSeries(), //7mosit
//	                new TimeSeries(), //8button 
	//                new TimeSeries()  //9rotery
	 //               ]
                								
			
	 /// smoothie[0].addTimeSeries(line[1]);
	 // smoothie[0].addTimeSeries(line[0],{ strokeStyle:'rgb(0, 255, 0)', fillStyle:'rgba(0, 255, 0, 0.4)', lineWidth:2 });

    //  smoothie[1].addTimeSeries(line[5],{ strokeStyle:'rgb(255, 255, 255)', fillStyle:'rgba(255, 255, 255, 0.4)', lineWidth:2 }); //light
    //  smoothie[1].addTimeSeries(line[6],{ strokeStyle:'rgb(255, 0, 255)', fillStyle:'rgba(255, 0, 255, 0.4)', lineWidth:2 }); //uv
    //  smoothie[1].addTimeSeries(line[7],{ strokeStyle:'rgb(165,42,42)', fillStyle:'rgba(165,42,42, 0.4)', lineWidth:2 }); //mositure
      
      
    //  smoothie[2].addTimeSeries(line[4],{ strokeStyle:'rgb(255, 255, 255)', fillStyle:'rgba(255, 255, 255, 0.4)', lineWidth:2 }); //motion -- moving average.
    //  smoothie[2].addTimeSeries(line[8],{ strokeStyle:'rgb(255, 0, 0)', fillStyle:'rgba(255, 0, 0, 0.4)', lineWidth:2 }); //button -- spike
    //  smoothie[2].addTimeSeries(line[9],{ strokeStyle:'rgb(0, 0, 255)', fillStyle:'rgba(0, 0, 255, 0.4)', lineWidth:2 }); //rotary --must bound turn up and down
      

	//  smoothie[3].addTimeSeries(line[3],{ strokeStyle:'rgb(0, 255, 0)', fillStyle:'rgba(0, 255, 0, 0.4)', lineWidth:2 });
	//  smoothie[3].addTimeSeries(line[2],{ strokeStyle:'rgb(255, 0, 0)', fillStyle:'rgba(255, 0, 0, 0.4)', lineWidth:2 });//on top last

		$scope.send = function(message) {
		}		
		
		$scope.subscribe = function(subId) {
		}
		
		$scope.unsubscribe = function(subId) {
		}    
		
		
	  $scope.valve = [{},{},{},{}]; 
		
		/////////////////////////////////////
		//example code using Graphvis to build SVG
		////////////////////////////////////////
		
	/////////////////////////////////////////////////////	
		//example code using graphiz svg
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
// 	/////////////////////////////////////////////////////////////	
		
		
		
	// function buildStationStyle(manifold, station, label, stationStyles) {
// 		
			// var style = stationStyles[station];
			// return manifold.concat("->",station, ";\n",station,"[label=\"",label,"\"",style,"];\n");
// 
	// }	
// 
	// // style=filled, fillcolor=red
// 	
	// $scope.stationStyles ={ 
	                     	// "m1s1" : "",
	                        // "m1s2" : "",
	                        // "m1s3" : "",
// 	                        
	                        // "m2s1" : "",
	                        // "m2s2" : "",
	                        // "m2s3" : "",
	                        // "m2s4" : "",
	                        // "m2s5" : "",
// 	                     
	                        // "m3s1" : "",
	                        // "m3s2" : "",
// 	                        
	                        // };
// 		
	// function buildFactory(stationStyles) {
// 	
		// var result= "digraph {\n";
// 		
		// result = result.concat("rankdir = LR\n");
// 		
		// result = result.concat("Compressor->m1"," [penwidth=3];\n");		
		// result = result.concat("m1->m2"," [penwidth=3];\n");
		// result = result.concat("m2->m3"," [penwidth=3];\n");
// 		
		// result = result.concat("{ rank=same Compressor, m1, m2, m3 }\n");
// 		
		// result = result.concat("m1 [style=bold,label=\"Manifold 1\"]\n");
		// result = result.concat("m2 [style=bold,label=\"Manifold 2\"]\n");
		// result = result.concat("m3 [style=bold,label=\"Manifold 3\"]\n");
// 		
	    // result = result.concat(buildStationStyle("m1","m1s1","Station 11",stationStyles));
	    // result = result.concat(buildStationStyle("m1","m1s2","Station 12",stationStyles));
	    // result = result.concat(buildStationStyle("m1","m1s3","Station 13",stationStyles));
// 	    
	    // result = result.concat(buildStationStyle("m2","m2s1","Station 21",stationStyles));
	    // result = result.concat(buildStationStyle("m2","m2s2","Station 22",stationStyles));
	    // result = result.concat(buildStationStyle("m2","m2s3","Station 23",stationStyles));
	    // result = result.concat(buildStationStyle("m2","m2s4","Station 24",stationStyles));
	    // result = result.concat(buildStationStyle("m2","m2s5","Station 25",stationStyles));
// 	    
	    // result = result.concat(buildStationStyle("m3","m3s1","Station 31",stationStyles));
	    // result = result.concat(buildStationStyle("m3","m3s2","Station 32",stationStyles));
// 
// 
		// result=result.concat("}");			
		// return result;
// 		
	// }	
	// function buildSVG(dot) {
		// return Viz(dot,{format: "svg", engine: "dot"})
	  // .replace("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>","");
	// }
		
		/////////////////////////////////////
		//end of graphviz example code
		//////////////////////////////////
		
	function circleRun(fills, cx1, cy1, stepX, stepY, r ) {		
		 var c;
		 var result = "";
		
		 for(c = 0; c < fills.length; c++){		 	
		 	result = result.concat(circle(fills[c], cx1+(stepX*c), cy1+(stepY*c), r ));
		 }		
		
		return result;
	}	
	
	//TODO: manidfold square?
	//      draw booth?
		
		
	function circle(fill, cx, cy, r) {
		return "<circle ng-click=\"alert('zzzz');\"   fill=\"".concat(fill,"\" stroke=\"black\" cx=\"",cx,"\" cy=\"",cy,"\" r=\"", r,"\"/>"); 
	}	
		
		
	function test() {
		scope.result = "";
		$scope.$apply();
		 alert("yyyy");
	}	
		
	$scope.m1ValveStates = 	["none","red"];
	$scope.m2ValveStates = 	["none","red","none"];
	$scope.m3ValveStates = 	["none","red","none"];
	$scope.m4ValveStates = 	["green","green","none"];
	$scope.m5ValveStates = 	["green","green","none"];	
		
		
	function mapItems() {
		
		var result = "";
		
		var xBase = 20;
		
		result = result.concat(circleRun($scope.m1ValveStates, xBase+0, -400, 20, -10, 5));
		result = result.concat(circleRun($scope.m2ValveStates, xBase+0, -200, 20, 10, 5));
		result = result.concat(circleRun($scope.m3ValveStates, xBase+370, -210, -20, 10, 5));
		result = result.concat(circleRun($scope.m4ValveStates, xBase+0, -210, 10, -30, 5));
		result = result.concat(circleRun($scope.m3ValveStates, xBase+400, -270, -10, 30, 5));
		
		return result;
	}	

		  
	function buildSVGFloor() {
				
		
	   return "<svg width=\"640pt\" height=\"530pt\" viewBox=\"0.00 0.00 640 530\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> \
	          <g id=\"graph0\" class=\"graph\" transform=\"scale(1 1) rotate(0) translate(4 526) \">".concat(mapItems(),
	          "</g>  </svg>");
			  

		
	}	  
	
	$scope.result = buildSVGFloor();
 
 
 
		  
		  
 }));
