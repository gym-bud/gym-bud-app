#! /bin/bash
echo "setting mysql up... you'll be asked for your mysql root's password."
read -p "Y?" -n 1 -r
if ( mysql -u root -p < ./mysql/setup.sql ); then
   echo "copying test database..."
   mysql -u testroot -ppass gb_test < ./mysql/gb_test.sql
   cd .git
   echo "linking hooks..."
   ln -sf ../hooks .
   cd ../server
   echo "installing npm modules..."
   npm install
   echo "OK! Welcome to Gym Bud"
fi

