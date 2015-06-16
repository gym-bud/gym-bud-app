var Sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');
var Q = require('Q');


var sequelize = new Sequelize(
     process.env.GB_MYSQL_DATABASE
   , process.env.GB_MYSQL_USERNAME
   , process.env.GB_MYSQL_PASSWORD
   , {
        host: process.env.GB_MYSQL_HOST
      , dialect: 'mysql'
      , pool: {
           max: 5,
           min: 0,
           idle: 10000
      }
   }
);


/*
var Admin = sequelize.define( 'admin', {

   userId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,

      references : {
         model: User,
         key: 'id'
      }
   }
});
*/


var OrganizationRole = sequelize.define( 'organizationRole', {
   id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
   },

   name: {
      type: Sequelize.STRING,
      allowNull: false
   },

   description: {
      type: Sequelize.STRING,
      allowNull: true
   }
});

var UserOrganizationRole = sequelize.define( 'userOrganizationRole', {

   id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
   }/*,

   userId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,

      references: {
         model: User,
         key: 'id'
      }
   },

   organizationId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,

      references: {
         model: Organization,
         key: 'id'
      }
   },

   organizationRoleId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,

      references: {
         model: OrganizationRole,
         key: 'id'
      }
   }
   */
});

var Gym = sequelize.define( 'gym', {

   id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
   },

   name: {
      type: Sequelize.STRING,
      allowNull: false
   },

   urlName: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
         is: /^[a-z0-9\-]+$/i 
      },
      set: function( val ) {
         
         this.setDataValue( 'urlName', val.trim() );
      }
   }
   /*,

   organizationId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
         model: Organization,
         key: 'id'
      }
   }
   */

});

var GymRole = sequelize.define( 'gymRole', {
   id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
   },

   name: {
      type: Sequelize.STRING,
      allowNull: false
   },

   description: {
      type: Sequelize.STRING,
      allowNull: true
   }
});

var UserGymRole = sequelize.define( 'userGymRole', {

   id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
   }
   /*,

   userId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,

      references: {
         model: User,
         key: 'id'
      }
   },

   gymId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,

      references: {
         model: Gym,
         key: 'id'
      }
   },

   gymRoleId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,

      references: {
         model: GymRole,
         key: 'id'
      }
   }
   */
});

/*
UserOrganizationRole.belongsTo(OrganizationRole);
UserOrganizationRole.belongsTo(Organization);
UserOrganizationRole.belongsTo(User);
*/


/*
Gym.belongsTo(Organization);

UserGymRole.belongsTo(OrganizationRole);
UserGymRole.belongsTo(Gym);
UserGymRole.belongsTo(User);
*/

sequelize.sync({ force: true })
.then( function() {

   return User.create({ name: 'Eric Buckthal', email: 'ebuckthal@gmail.com', password: 'v3vus9jy', isAdmin: true })
   .then( function( user ) {

      return Q.all([

         Organization.create({ name: 'A good organization', urlName: 'a-good-org' })
         .then( function( org ) {

            return user.addOrganization( org );
         }),

         Organization.create({ name: 'A second organization', urlName: 'a-second-org' })
         .then( function( org ) {

            return user.addOrganization( org );
         })

      ]);
   })

}).then( function() {

   console.log('SEQUELIZE: all good in the hood');


}).catch( function( error ) {

   console.log('SEQUELIZE did not sync correctly: ' + error);

});

