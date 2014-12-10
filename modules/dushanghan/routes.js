module.exports = function( app, ContentController, ContentModel ) {
    // Define routes here
    app.all('/dsh/content/:action/:id?', ContentController.attach());
    app.all('/dsh/content/?:action?', ContentController.attach());
  app.all('/dsh/text/:action/:id?', TextController.attach());
  app.all('/dsh/text/?:action?', TextController.attach());
}
