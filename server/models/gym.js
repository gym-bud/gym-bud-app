
module.exports = function( sequelize, DataTypes ) {

   var Gym = sequelize.define( 'Gym', {

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
               args: /^[a-z0-9\s]+$/i,
               msg: 'Gym name must only contain alphanumeric characters'
            }
         },
         set: function( val ) {
            
            this.setDataValue( 'name', val.trim() );
         }
      },

      urlName: {
         type: DataTypes.STRING,
         unique: true,
         allowNull: false,
         validate: {
            is: {
               args: /^[a-z0-9\-]+$/i,
               msg: 'Custom URL must be in the form a-valid-url (e.g. gymbud.rocks/a-valid-url)'
            }
         },
         set: function( val ) {
            
            this.setDataValue( 'urlName', val.trim() );
         }
      }

   }, {
      
      instanceMethods: {

         getName: function() {
            return this.name;
         },

         getUrl: function( org ) {
            return org.getUrl() + '/' + this.get('urlName');
         }

      },

      classMethods: {

         associate: function( models ) {

            Gym.belongsTo( models.Organization, { 
               as: 'Organization'
            });

            Gym.belongsToMany( models.User, { 
               through: models.GymEmployee,
               as: { singular: 'Employee', plural: 'Employees' }
            });

            Gym.belongsToMany( models.User, { 
               through: models.GymMember,
               as: { singular: 'Member', plural: 'Members' }
            });

         }
      }
   
   });

   return Gym;
};
