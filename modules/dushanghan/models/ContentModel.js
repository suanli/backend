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
      index: {
        type: Number
      },
      title: {
        type: String,
        allowNull: false
      },
      chapters: {
        type: Model.Types.TEXT,
        allowNull: false
      }
    });
};
