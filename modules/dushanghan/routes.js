module.exports = function( app, ContentController, TextController ) {
    // Define routes here
    app.all('/dsh/content', ContentController.attach());
    app.all('/dsh/text', TextController.attach());//dsh/text?vol=1&chapter=1
}
