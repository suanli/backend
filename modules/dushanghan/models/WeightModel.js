module.exports = function (Model) {
  return Model.extend('Weight',
    {
      type: "ORM",
      softDeletable: false,
      timeStampable: false
    },
    {
      id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
      },
      text: {
        type: Model.Types.TEXT,
        allowNull: true
      }
    });
};
