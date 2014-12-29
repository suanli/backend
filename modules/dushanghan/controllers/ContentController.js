/**
 * @doc module
 * @name dushanghanModule.controllers:ContentController
 */
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

          options.order = ['vol','chapter'];

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
