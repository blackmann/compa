dokku apps:create $1

dokku builder:set $1 build-dir client

COOKIE_SECRET_1=$(openssl rand -hex 16)
COOKIE_SECRET_2=$(openssl rand -hex 16)
dokku config:set $1 SCHOOL=$1
dokku config:set $1 COOKIE_SECRET=$COOKIE_SECRET_1,$COOKIE_SECRET_2

SECRET_KEY=$(openssl rand -hex 16)
dokku config:set $1 SECRET_KEY=$SECRET_KEY
dokku config:set $1 RESEND_API_KEY=$RESEND_API_KEY

dokku config:set $1 AWS_UPLOAD_ENDPOINT="eu-central-1.linodeobjects.com"
dokku config:set $1 AWS_REGION="eu-central-1"
dokku config:set $1 AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
dokku config:set $1 AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
dokku config:set $1 AWS_BUCKET=compa
dokku config:set $1 AWS_BUCKET_DIR=$1-compa

dokku domains:set $1 $1.compa.so

dokku storage:ensure-directory $1
dokku storage:mount $1 /var/lib/dokku/data/storage/$1:/app/prisma/data

dokku config:set $1 DATABASE_URL="file:./data/$1.db"
