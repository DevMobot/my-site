cd ~
rm -rf ./my-site/pages
rm -rf ./my-site/routes
rm -rf ./my-site/resources
rm ./my-site/server.js

cp -r ./storage/shared/Old_Site/Site/pages ./my-site/
cp -r ./storage/shared/Old_Site/Site/routes ./my-site/
cp -r ./storage/shared/Old_Site/Site/resources ./my-site/
cp ./storage/shared/Old_Site/Site/server.js ./my-site/

cd ./storage/shared/
cp -r ./Old_Site/Site/pages ./Site/
cp -r ./Old_Site/Site/routes ./Site/
cp -r ./Old_Site/Site/resources ./Site/
cp ./Old_Site/Site/server.js ./Site/

rm -rf ./Old_Site
cd ~
echo "Done!"
