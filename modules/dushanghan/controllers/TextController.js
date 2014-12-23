/**
 * @doc module
 * @name dushanghanModule.controllers:TextController
 */
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

            this.Class
              .service
              .findAll( options )
              .then( this.proxy( 'handleServiceMessage' ) )
              .catch( this.proxy( 'handleServiceMessage' ) );
          } else {
            this.next();
          }
        }
    });
}
