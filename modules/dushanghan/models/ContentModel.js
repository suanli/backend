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
      vol: {
        type: Number
      },
      chapter: {
        type: Number
      },
      title: {
        type: String,
        allowNull: false
      }
    });
};
