module.exports = function (Model) {
  return Model.extend('Text',
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
      index: {
        type: Number
      },
      text: {
        type: String,
        allowNull: false
      },
      recipe: {
        type: String,
        allowNull: true
      },
      text_comment: {
        type: String,
        allowNull: true
      }
    });
};
