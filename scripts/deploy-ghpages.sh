# if [ $CIRCLE_BRANCH == $SOURCE_BRANCH ]; then

TARGET_BRANCH='gh-pages'

git config --global user.email $GH_EMAIL
git config --global user.name $GH_NAME

git clone $CIRCLE_REPOSITORY_URL out

cd out
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
git rm -rf .
cd ..

cp -a packages/container/dist/. out/.

for appPath in $(find packages/app-* -type d -maxdepth 0); do
    appName=$(echo $appPath| cut -d'/' -f 2)
    if [ -d "packages/$appName/dist" ]; then
      cp -a packages/$appName/dist out/$appName
    fi
done

mkdir -p out/.circleci && cp -a .circleci/. out/.circleci/.
cd out

git add -A
git commit -m "Automated deployment to GitHub Pages: ${CIRCLE_SHA1}" --allow-empty

git push origin $TARGET_BRANCH
