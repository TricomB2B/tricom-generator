/**
 *
 */
(function() {

	'use strict';

	angular
		.module('DataFactory', ['ngResource'])
		.factory('DataFactory', DataFactory)
		.factory('DataResource', DataResource);

	/**
	 * @param {[type]} DataFactory [description]
	 * @ngInject
	 */
	function DataFactory(DataResource) {
		var data = {};

		var factory = {
			initialize: initialize

			//!!FC!!//
			// DO NOT REMOVE IF USING GENERATOR //
		};
		return factory;

		/**
		 * [initialize description]
		 * @return {[type]} [description]
		 */
		function initialize() {
			return DataResource
				.get(function(response) {
					data = response;
				});
		}

		//!!FF!!//
		// DO NOT REMOVE IF USING GENERATOR //
	}

	/**
	 * @param {[type]} $resource [description]
	 * @ngInject
	 */
	function DataResource($resource) {
		return $resource('data.json');
	}

})();
