module.exports = function ( Service, RecipeModel ) {
  return Service.extend({
    model: RecipeModel
  });
};
