# mysql test databases
Gym Bud uses a test database called `gb_test` for development. If the server is started with a development flag (TODO: create flag) it will use this database for all db transactions. `setup.sql` creates a user named `testroot` with password `pass` to interact with `gb_test`.

Gym Bud's test database management system uses git hooks to automatically dump and restore the test database (`gb_test`). 

On the pre-commit hook, two things happen:
* `gb_test.sql` is moved to `gb_test.sql.old`
* a new `gb_test.sql` is created from mysql's `gb_test` database.

On the post-checkout hook, `gb_test.sql` is used to reinstantiate `gb_test`.
