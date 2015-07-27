
module.exports = function( sequelize, DataTypes ) {

   var GymMember = sequelize.define( 'GymMember', {

      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true
      },

      type: {
         type: DataTypes.STRING
      }

   }, {
      
      instanceMethods: {

         getId: function() {
            return this.get('id')
         },
         getType: function() {
            return this.get('type')
         }

      }
   });

   return GymMember;
};
