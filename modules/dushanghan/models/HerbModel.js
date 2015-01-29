module.exports = function (Model) {
  return Model.extend('Herb',
    {
      type: "ORM",
      softDeletable: false,
      timeStampable: false
    },
    {
      text: {
        type: Model.Types.TEXT,
        allowNull: true
      }
    });
};
