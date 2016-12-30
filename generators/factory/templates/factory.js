/**
 * <%= description %>
 * @author
 */

(function () {
  'use strict';

  angular
    .module('<%= module %>', [])
    .factory('<%= factory %>', <%= factory %>);

  /**
  * Factory Definition
  * @ngInject
  */
  function <%= factory %> () {
    let data = {};

    let factory = {
      //!!FC!!// DO NOT REMOVE IF USING GENERATOR //
    };
    return factory;

  //!!FF!!// DO NOT REMOVE IF USING GENERATOR //
  }
})();
