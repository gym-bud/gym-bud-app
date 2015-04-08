echo setting mysql up...
mysql -u root -p < mysql/setup.sql
mysql -u testroot -ppass < ./mysql/gb_test.sql
cd .git
rm -r ./hooks
ln -s ../hooks .
