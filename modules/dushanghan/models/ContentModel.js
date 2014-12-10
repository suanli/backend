module.exports = function (Model) {
  return Model.extend('Content',
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
      volumeIndex: {
        type: Number
      },
      capterIndex: {
        type: Number
      },
      title: {
        type: String,
        allowNull: false
      }
    });
};
