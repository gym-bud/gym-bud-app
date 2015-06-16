
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
            is: /^[a-z0-9\s]+$/i 
         },
         set: function( val ) {
            
            this.setDataValue( 'name', val.trim() );
         }

      },
      
      email: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            isEmail: true
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
                  throw new Error('Please choose a longer password');
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

