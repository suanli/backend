module.exports = function ( Service, HerbModel ) {
  return Service.extend({
    model: HerbModel
  });
};
