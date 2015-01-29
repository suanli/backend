module.exports = function (Model) {
  return Model.extend('Recipe',
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
        type: String
      },
      title: {
        type: String
      },
      herbText: {
        type: Model.Types.TEXT
      },
      comment: {
        type: Model.Types.TEXT,
        allowNull: true
      },
      herbs: {
        type: Model.Types.TEXT
      }
    });
};
