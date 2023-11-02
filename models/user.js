const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  class User extends Model {}

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    }
  );

  // Hash the password before saving it to the database
  User.beforeCreate(async (user, options) => {
    if (user.password) {
      const saltRounds = 10; // Adjust the number of salt rounds for your security needs
      user.password = await bcrypt.hash(user.password, saltRounds);
    }
  });

  // Method to validate the password
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};

// Additional associations or methods can be added to this file as needed
