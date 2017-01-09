/**
 * Data management factory
 */

(function() {
	'use strict';

	angular
		.module('DataFactory', [])
		.factory('DataFactory', DataFactory)
		.factory('DataResource', DataResource);

	/**
	 * Factory Definition
   * @requires DataResource
	 * @ngInject
	 */
	function DataFactory(DataResource) {
		let data = {};

    // public API
		const factory = {
			initialize: initialize,
			//!!FC!!//
			// DO NOT REMOVE IF USING GENERATOR //
		};
		return factory;

		/**
		 * Initialize the factory and load in the data file
		 * @return {promise} The promise from the Resource request
		 */
		function initialize () {
			return DataResource
				.get((response) => {
					data = response;
				});
		}

		//!!FF!!//
		// DO NOT REMOVE IF USING GENERATOR //
	}

	/**
   * Angular resource object for fetching the application data
   * @requires $resource
   * @return   {object} The resource object generated for the request
   * @ngInject
   */
	function DataResource ($resource) {
		return $resource('data.json');
	}
})();
