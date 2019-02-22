#!/bin/bash

BASEDIR=/var/www/html/

# Set SMARTY and FILES permissions for PHP access.
find $BASEDIR -type d -name templates_c \
	-exec chown -R www-data -- {} \; \
	-exec chmod -R 0700 -- {} \;
find $BASEDIR -type d -name FILES \
	-exec chown -R www-data -- {} \; \
	-exec chmod -R 0700 -- {} \;

exit
