var Q = require('q');

module.exports = function( sequelize, DataTypes ) {

   var Organization = sequelize.define( 'Organization', {

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
               msg: 'Business organization name must only contain alphanumeric characters'
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
            return this.get('name');
         },

         getUrl: function() {
            return '/' + this.get('urlName');
         },

         isAdmin: function( user ) {

            if( !user ) { 
               return Q.fcall(function() {
                  return false; 
               });
            }

            return this.getAdministrators({
               where: { id: user.getId() }
            }).then( function( admins ) {

               return admins.length > 0;
            })
         },

         isCreator: function( user ) {

            if( !user ) { 
               return Q.fcall(function() {
                  return false; 
               });
            }

            return this.getCreator()
            .then(function( creator ) {
               return user.getId() == creator.getId();
            });
         },

         getRemoveAdminUrl: function( user ) {

            return '/' + this.get('urlName') + '/admins/' + user.getId() + '/delete';
         },

         getAddAdminUrl: function() {

            return '/' + this.get('urlName') + '/admins';
         },
      },

      classMethods: {

         associate: function( models ) {

            Organization.belongsTo( models.User, { 
               as: 'Creator', 
               foreignKey: 'creatorId' 
            });

            Organization.belongsToMany( models.User, { 
               through: 'OrganizationAdministrator',
               as: { singular: 'Administrator', plural: 'Administrators' }
            });

            Organization.hasMany( models.Gym, { 
               as: { singular: 'Gym', plural: 'Gyms' }
            });

         }
      }
   
   });

   return Organization;
};
