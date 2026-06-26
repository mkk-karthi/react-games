#!/bin/bash

# Exit on error
set -e

DEPLOY_DIR="temp-deploy"
SKIP_PROJECTS=("temp-deploy" "rock-paper-scissors")

# Clean and prepare staging directory
rm -rf "$DEPLOY_DIR"
mkdir "$DEPLOY_DIR"

# Build each project
for dir in */; do
  project=${dir%/}

  # Skip excluded projects
  [[ " ${SKIP_PROJECTS[*]} " =~ " $project " ]] && continue

  echo "Building $project..."
  cd "$project"
  npm install --silent
  npm run build
  cd ..

  if [ -d "$project/build" ]; then
    cp -r "$project/build" "$DEPLOY_DIR/$project"
  elif [ "$project" = "home-page" ]; then
    cp -r "$project/dist/." "$DEPLOY_DIR/"
  else
    cp -r "$project/dist" "$DEPLOY_DIR/$project"
  fi
done

# Switch to gh-pages branch (create if not exists)
if git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout gh-pages
else
  git checkout --orphan gh-pages
fi

# Backup CNAME from gh-pages branch
if [ -f CNAME ]; then
  cp CNAME "$DEPLOY_DIR/CNAME"
fi

# Copy new builds
cp -r "$DEPLOY_DIR"/. .

# Commit and push
git add .
git commit -m "Deploy projects"
git push -f origin gh-pages

# Cleanup
rm -rf temp-deploy

echo "✅ Deployment complete!"