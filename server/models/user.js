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
            // this is required for custom error message on unique validation
            isUnique: function( email, done ) {
               User.find({ where: { email: email }})
               .then(function( user ) {

                  if( user ) { 
                     done(new Error('Email already exists in our system.')); 
                  }

                  done();

               }, function( err ) {

                  if( err ) {
                     done(err);
                  }

                  done();
               
               });

            },

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

      instanceMethods: {

         getName: function() {
            return this.get('name');
         },
         getId: function() {
            return this.get('id');
         }

      },

      classMethods: {
         
         associate: function( models ) {

            User.hasMany( models.Organization, { foreignKey: 'creatorId' });

/*
            User.belongsToMany( models.Organization, { 
               through: 'OrganizationAdministrator',
               as: 'Organization'
            });

            User.belongsToMany( models.Gym, { 
               through: models.GymEmployee,
               as: 'Employer'
            });
            
            User.belongsToMany( models.Gym, { 
               through: models.GymMember,
               as: 'Member'
            });
*/

         }

      }

   });

   return User;

};

