cd ~
cd ./storage/shared/
rm -rf Old_Site
mkdir Old_Site
cp -r ./Site ./Old_Site/
rm -rf ./Site
mkdir Site
cd ~

cp -r ./my-site/pages ./storage/shared/Site/
cp -r ./my-site/public ./storage/shared/Site/
cp -r ./my-site/resources ./storage/shared/Site/
cp -r ./my-site/server.js ./storage/shared/Site/

echo -e "\nComplete! \nUpdating Dependencies..."
cd my-site
npm i

cd ~
echo -e "\n*****************************************"
echo -e "Update Complete!"

read -p "Wanna start updated code now? (y/n) " ans
if [ $ans == "y" ]
then
   clear
   bash start.sh
else
   echo Exiting...
fi