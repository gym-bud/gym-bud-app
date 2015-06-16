
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
            is: /^[a-z0-9\s]+$/i 
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
            is: /^[a-z0-9\-]+$/i 
         },
         set: function( val ) {
            
            this.setDataValue( 'urlName', val.trim() );
         }
      }

   }, {

      classMethods: {

         associate: function( models ) {

            Organization.belongsTo( models.User, { 
               as: 'Creator', 
               foreignKey: 'creatorId' 
            });

         }
      }
   
   });

   return Organization;
};
