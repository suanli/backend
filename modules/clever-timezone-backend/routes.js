module.exports = function( app, TimezoneController, TimezoneModel ) {
    // Define routes here
    app.all('/timezone/:action/:id?', TimezoneController.attach());
    app.all('/timezone/?:action?', TimezoneController.attach());
}
