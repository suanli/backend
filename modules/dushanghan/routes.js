module.exports = function (app, ContentController, TextController, HerbController, WeightController, RecipeController) {
  // Define routes here
  app.all('/dsh/content', ContentController.attach());
  app.all('/dsh/text', TextController.attach());
  app.all('/dsh/herb', HerbController.attach());
  app.all('/dsh/weight', WeightController.attach());
  app.all('/dsh/recipe', RecipeController.attach());
}
