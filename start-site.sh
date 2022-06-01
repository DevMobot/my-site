cd ~
rm -rf ./my-site/pages
rm -rf ./my-site/routes
rm -rf ./my-site/resources
rm ./my-site/server.js

cp -r ./storage/shared/Site/pages ./my-site/
cp -r ./storage/shared/Site/routes ./my-site/
cp -r ./storage/shared/Site/resources ./my-site/
cp -r ./storage/shared/Site/server.js ./my-site/

cd ~
cd my-site
echo Starting...
npm start
