#!/bin/bash

# Exit on error
set -e

# Build tic-tac-toe
echo "Building tic-tac-toe..."
cd tic-tac-toe
npm install
npm run build
cd ..

# Prepare temp folder
rm -rf temp-deploy
mkdir temp-deploy

# Copy builds
cp -r tic-tac-toe/build temp-deploy/tic-tac-toe

# Deploy to gh-pages branch
git checkout --orphan gh-pages
git reset --hard
cp -r temp-deploy/* .
git add .
git commit -m "Deploy projects"
git push -f origin gh-pages
git checkout master

# Cleanup
rm -rf temp-deploy

echo "✅ Deployment complete!"
