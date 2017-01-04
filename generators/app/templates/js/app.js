/**
 * <%= name %>
 * <%= description %>
 *
 * @repo    https://github.com/TricomB2B/<%= appName %>
 * @author  Someone <someone@somewhere.com>
 * @version 0.0.0
 */

(function () {
	'use strict';

	angular
		.module('<%= prefix %>', [
			'ngResource',
			'ui.router',
			'tcomViews',
			'DataFactory',
			'HomeView',
			// enter additional modules/components here

			// Generator Views
			//!!V!!//
			// DO NOT MODIFY | DO NOT REMOVE LINE ABOVE IF USING GENERATOR

			// Generator Directives
			//!!D!!//
			// DO NOT MODIFY | DO NOT REMOVE LINE ABOVE IF USING GENERATOR

			// Generator Factories
			//!!F!!//
			// DO NOT MODIFY | DO NOT REMOVE LINE ABOVE IF USING GENERATOR
		])
		.run(bootstrap)
		.config(rootConfig);


	/**
	 * Useful output for debugging state changes
	 * @ngInject
	 */
	function stateDebug($rootScope) {
		$rootScope.$on('$stateChangeStart', function (e, toState, toParams) {
			console.log('start');
			console.log(toState);
			console.log(toParams);
		});

		$rootScope.$on('$stateNotFound', function (e, toState) {
			console.log('not found');
			console.log(toState);
		});

		$rootScope.$on('$stateChangeSuccess', function (e, toState, toParams) {
			console.log('success');
			console.log(toState);
			console.log(toParams);
		});

		$rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {
			console.log('error');
			console.log(toState);
			console.log(error);
		});
	}

	/**
   * Initialize any components or elements when the application starts up
   * @ngInject
   */
	function bootstrap() {
		console.log('bootstrapped');
	}

	/**
   * State configuration for the top-level application and root state
   * @ngInject
   */
	function rootConfig($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('root', {
				url: '',
				abstract: 'true',
				resolve: {
					data: function (DataFactory) {
						return DataFactory.initialize().$promise;
					}
				}
			});
	}
})();
