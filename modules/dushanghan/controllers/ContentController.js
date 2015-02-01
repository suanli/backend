/**
 * @doc module
 * @name dushanghanModule.controllers:ContentController
 */
var Promise     = require( 'bluebird' )
module.exports = function(Controller, ContentService) {
    return Controller.extend(
    {
        service: ContentService
    },
    {
      listAction: function() {
        if ( this.Class.service !== null ) {
          var options = { where: this.req.query };

          if ( !!options.where._include ) {
            options.where._include.split( ',' ).forEach( function( include ) {
              if ( typeof options.include === 'undefined' ) {
                options.include = [];
              }
              options.include.push( models[ include ] );
            });
            delete options.where._include;
          }

          var transform = function(object) {
            return new Promise( function( resolve, reject ) {
              if(!object.statusCode) {
                for (var i in object) {
                  object[i].chapters = JSON.parse(object[i].chapters);
                }
              }
              resolve(object);
            });
          }

          options.order = ['index'];

          this.Class
            .service
            .findAll( options )
            .then( transform )
            .then( this.proxy( 'handleServiceMessage' ) )
            .catch( this.proxy( 'handleServiceMessage' ) );
        } else {
          this.next();
        }
      }
    });
}
