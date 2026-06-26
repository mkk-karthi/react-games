#!/bin/bash

# Exit immediately on error
set -e

DEPLOY_DIR="temp-deploy"
SKIP_PROJECTS=("temp-deploy" "rock-paper-scissors")

# Clean and prepare staging directory
rm -rf "$DEPLOY_DIR"
mkdir "$DEPLOY_DIR"

# Build all React projects, skipping excluded ones
for dir in */; do
  project="${dir%/}"

  # Skip excluded projects
  [[ " ${SKIP_PROJECTS[*]} " =~ " $project " ]] && continue

  echo "🔨 Building $project..."
  cd "$project"
  npm install --silent
  npm run build
  cd ..

  # home-page deploys to root; others go into named subdirectories
  if [ "$project" = "home-page" ]; then
    cp -r "$project/dist/." "$DEPLOY_DIR/"
  elif [ -d "$project/build" ]; then
    cp -r "$project/build" "$DEPLOY_DIR/$project"
  else
    cp -r "$project/dist" "$DEPLOY_DIR/$project"
  fi
done

# Stash uncommitted changes to avoid conflicts during branch switch
git stash --include-untracked

# Switch to gh-pages branch, creating an orphan branch if it doesn't exist
if git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout gh-pages
  # Preserve CNAME file if it exists
  [ -f CNAME ] && cp CNAME CNAME.bak
else
  git checkout --orphan gh-pages
fi

# Remove old build files (excluding CNAME)
git rm -rf . >/dev/null 2>&1 || true

# Deploy built artifacts to branch root
cp -r "$DEPLOY_DIR"/. .

# Restore CNAME if it was backed up
if [ -f CNAME.bak ]; then
  mv CNAME.bak CNAME
  git add CNAME
fi

# Commit and force-push to publish
git add .
git commit -m "Deploy projects"
git push -f origin gh-pages

# Return to main and restore stashed changes
git checkout main
git stash pop || true

# Remove staging directory
rm -rf "$DEPLOY_DIR"

echo "✅ Deployment complete!"