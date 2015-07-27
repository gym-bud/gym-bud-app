
module.exports = function( sequelize, DataTypes ) {

   var GymEmployee = sequelize.define( 'GymEmployee', {

      id: {
         type: DataTypes.INTEGER.UNSIGNED,
         primaryKey: true,
         autoIncrement: true
      },

      jobTitle: {
         type: DataTypes.STRING,
         allowNull: false
      }

   }, {
      
      instanceMethods: {

         getName: function() {
            return this.get('name');
         },

         getJobTitle: function() {
            return this.get('jobTitle');
         }
      }
   
   });

   return GymEmployee;
};
