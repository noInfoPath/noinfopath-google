//noinfopath-google@0.0.1
//This is simply an angular wrapper around the Google Maps JS API, so it can be injected
//and mocked when necessary.


(function(angular, undefined){
	"use strict";


	angular.module("noinfopath.google",['noinfopath.navigator', 'noinfopath.require'])
		.service("noGoogleMapsApi", ['$timeout','$q', '$window',  'noRequire', function($timeout, $q, $window, noRequire){
			var SELF = this;
			var _googleMapsApi, _map, _markers = {}, _options;
				

			Object.defineProperties(this, {
		        "api": {
		        	"get": function (){ return _googleMapsApi; }
				},
				"hasMapAPI": {
					"get": function () { return typeof google === "object"; }
				},
				"map": {
					"get": function () { return _map; }
				},
				"hasMap": {
					"get": function () { return typeof _map === "object"; }
				},
				"markers": {
					"get": function () { return _markers; }
				}
		    });			

			this.load = function(url){

				var deferred = $q.defer(),
					googleMapUrl = url;

				function _googleMapApiReady(){
					if(!SELF.hasMapAPI) throw "Google Map API not found!";
					_googleMapsApi = google.maps;
					deferred.resolve(_googleMapsApi);
				}

				$window.noGoogleMapsApiReady = _googleMapApiReady.bind(this);

				if(!SELF.hasMapAPI){
					console.log("Loading Google Maps API.");
					noRequire.loadScript(googleMapUrl)
						.then(function(){
							console.log("Google Maps API is initializing.");
						})
						.catch(function(err){
							console.log("Failed to load Google Maps API");
						})

					$timeout(function(){
						if(!SELF.hasMapAPI) deferred.reject("Google Maps API failed to initilize in the alotted about of time.")
					}, 2000);
				}else{
					$timeout(function(){
						deferred.resolve(SELF.api);
					},10);
				}

				return deferred.promise;
			};

			this.render = function(el, mapOptions){
				_options = mapOptions;
				function makeMap(){
					var ops = {
						zoom: mapOptions.zoom,
						center: mapOptions.center,
						mapTypeId: SELF.api.MapTypeId.HYBRID
					};

					//console.log("making map\n", ops);

					_map = new _googleMapsApi.Map(el[0], ops);


				}

				if(SELF.hasMapAPI){
					makeMap(mapOptions);
				}else{
					throw "noGoogleMapsApi is not initialized";
				}
			};

			this.addMarker = function(markerOptions){
				var marker = {
				    position: markerOptions.position,
				    map: _map,
				    title: markerOptions.title
				};

				var m = _markers[markerOptions.name] = new _googleMapsApi.Marker(marker);								
				m.noConfig = markerOptions;
				if(!!markerOptions.click){
					var fn = markerOptions.click.bind(SELF, _markers[markerOptions.name], markerOptions, _options);
					_googleMapsApi.event.addListener(_markers[markerOptions.name], 'click', fn);					
				}
			};

			this.addMarkers = function(markers){
				if(markers.length > 0){
					angular.forEach(markers, function(marker){
						SELF.addMarker(marker);
					});
				}			
			};

			this.getMaxZoom = function (position){
				var deferred = $q.defer(),
					maxZoomService = new _googleMapsApi.MaxZoomService();

				maxZoomService.getMaxZoomAtLatLng(position, function(response) {
					if (response.status != _googleMapsApi.MaxZoomStatus.OK) {
						deferred.reject("Error in MaxZoomService");
					} else {
						console.log("The maximum zoom at this location is: " + response.zoom);
						deferred.resolve(response.zoom);
					}
				});
	
				return deferred.promise;			
			}		

		}])

		.directive("noGoogleMaps",['noGoogleMapsApi',function(noGoogleMapsApi){
			console.log("noGoogleMaps");

			return {
				restrict: "A",
				link: function(scope, el, attrs, ctrl){
					el.text("Loading google maps api");

					el.css("height", (window.innerHeight - 90) + "px");
					//console.log("height: ", el.height());
					
					scope.onResizeFunction = function() {
						scope.windowHeight = window.innerHeight;
						scope.windowWidth = window.innerWidth;

						//console.log(scope.windowHeight+"-"+scope.windowWidth)
					};

					// Call to the function when the page is first loaded
					scope.onResizeFunction();

					angular.element(window).bind('resize', function() {
						scope.onResizeFunction();
						scope.$apply();
					});


					scope.$watch(attrs["noOptions"], function(newval, oldval, scope){
						//console.log("noOptions changed:", oldval, newval);
						if(newval)
						{
							noGoogleMapsApi.render(el, newval);
						}
					});
					
					scope.$watch(attrs["noOptions"] + ".markers", function(newval, oldval, scope){
						//console.log("noOptions.markers changed:", oldval, newval);
						if(newval)
						{
							noGoogleMapsApi.addMarkers(newval);
						}
					});
				}
			}
		}])



	;
})(angular);