module.exports = function ( Service, ContentModel ) {
  return Service.extend({
    model: ContentModel
  });
};
