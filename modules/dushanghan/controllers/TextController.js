/**
 * @doc module
 * @name dushanghanModule.controllers:TextController
 */
var Promise     = require( 'bluebird' )
module.exports = function(Controller, TextService) {
    return Controller.extend(
    {
        service: TextService
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

            if(Object.keys( options.where ).length == 0)
            {
              this.send({
                message: 'not support'
              })
              return;
            }
            var transform = function(object)
            {
              return new Promise( function( resolve, reject ) {
                if(!object.statusCode) {
                  for (var i in object) {
                    object[i].text_comment = JSON.parse(object[i].text_comment);
                    object[i].recipe = JSON.parse(object[i].recipe);
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
