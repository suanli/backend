module.exports = function (Model) {
  return Model.extend('Timezone',
    {
      type: "ORM",
      softDeletable: true,
      timeStampable: true
    },
    {
      id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: String,
        allowNull: false,
        unique: true
      },
      offset: {
        type: String,
        allowNull: false
      }
    });
};
