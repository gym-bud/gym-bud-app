var bcrypt = require('bcrypt-nodejs');

module.exports = function( sequelize, DataTypes ) {

   var User = sequelize.define( 'User', { 
   
      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true
      },

      name: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            is: {
               args: /^[a-z0-9\-\s]+$/i,
               msg: 'Name must only include alphanumeric characters'
            }
         },
         set: function( val ) {
            
            this.setDataValue( 'name', val.trim() );
         }

      },
      
      email: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
         validate: {
            isEmail: { msg: 'Invalid email' } 
         }

      },

      isAdmin: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: false
      },

      passwordHash: {
         type: DataTypes.STRING(60),
         allowNull: false
      },

      password: {
         type: DataTypes.VIRTUAL,
         set: function( val ) {
            this.setDataValue('password', val);
            this.setDataValue('passwordHash', bcrypt.hashSync( val ));

         },
         validate: {
            isLongEnough: function( val ) {
               if ( val.length < 7 ) {
                  throw new Error('Password must be at least 7 characters');
               }
            }
         }
      }

   }, {

      classMethods: {
         
         associate: function( models ) {

            User.hasMany( models.Organization, { foreignKey: 'creatorId' });

         }

      }

   });

   return User;

};

