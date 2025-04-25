module.exports = (sequelize, DataTypes) => {
    const Program = sequelize.define('Program', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      endDate: {
        type: DataTypes.DATE
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      timestamps: true
    });
  
    Program.associate = (models) => {
      Program.belongsToMany(models.Client, {
        through: models.Enrollment,
        foreignKey: 'programId',
        as: 'clients'
      });
    };
  
    return Program;
  };