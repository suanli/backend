module.exports = function (Model) {
  return Model.extend('Weight',
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
