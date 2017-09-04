set -e
DIST=$(node -p -e "require('./package.json').DIST")

# clean
rm -rf $DIST

# build
npm run build

# commit
echo "Enter deploy message: "
read MESSAGE
git add $DIST/.
git commit -m "[deploy] $MESSAGE"
git subtree push --prefix $DIST origin gh-pages
