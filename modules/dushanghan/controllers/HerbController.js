/**
 * @doc module
 * @name dushanghanModule.controllers:HerbController
 */
var Promise     = require( 'bluebird' )
module.exports = function(Controller, HerbService) {
  return Controller.extend(
    {
      service: HerbService
    },
    {
      listAction: function() {
        if ( this.Class.service !== null ) {
          var options = { where: this.req.query };

          if(Object.keys( options.where ).length > 0)
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
                console.log(object);
                object[0].text = JSON.parse(object[0].text)
              }
              resolve(object);
            });
          }

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
