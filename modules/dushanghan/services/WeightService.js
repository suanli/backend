module.exports = function ( Service, WeightModel ) {
  return Service.extend({
    model: WeightModel
  });
};
