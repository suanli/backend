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
      volume: {
        type: Number
      },
      capter: {
        type: Number
      },
      index: {
        type: Number
      },
      text: {
        type: String,
        allowNull: false
      },
      recipe1: {
        type: String,
        allowNull: true
      },
      recipe2: {
        type: String,
        allowNull: true
      },
      recipe3: {
        type: String,
        allowNull: true
      },
      recipe4: {
        type: String,
        allowNull: true
      },
      comment1Position: {
        type: Number
      },
      comment1: {
        type: String,
        allowNull: true
      },
      comment2Position: {
        type: Number
      },
      comment2: {
        type: String,
        allowNull: true
      },
      comment3Position: {
        type: Number
      },
      comment3: {
        type: String,
        allowNull: true
      },
      comment4Position: {
        type: Number
      },
      comment4: {
        type: String,
        allowNull: true
      }
    });
};
