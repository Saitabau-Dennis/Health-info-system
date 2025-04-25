module.exports = (sequelize, DataTypes) => {
    const Enrollment = sequelize.define('Enrollment', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'id'
        }
      },
      programId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Programs',
          key: 'id'
        }
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      status: {
        type: DataTypes.ENUM('Active', 'Completed', 'Withdrawn'),
        defaultValue: 'Active'
      },
      notes: {
        type: DataTypes.TEXT
      }
    }, {
      timestamps: true,
      indexes: [
        // Unique constraint to prevent duplicate enrollments
        {
          unique: true,
          fields: ['clientId', 'programId']
        }
      ]
    });
  
    return Enrollment;
  };