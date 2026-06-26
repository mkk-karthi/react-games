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

# Backup CNAME from gh-pages if exists
CNAME_BACKUP=""
if git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout gh-pages
else
  git checkout --orphan gh-pages
fi

# Backup CNAME from gh-pages branch
if [ -f CNAME ]; then
  cp CNAME "$DEPLOY_DIR/CNAME"
fi
cp .gitignore "$DEPLOY_DIR/.gitignore"

# Remove ALL files from gh-pages branch
git rm -rf . >/dev/null 2>&1 || true

# Copy ONLY built files
cp -r "$DEPLOY_DIR"/. .

# Commit and force-push to publish
git add .
git commit -m "Deploy projects"
git push -f origin gh-pages

# Remove staging directory
rm -rf "$DEPLOY_DIR"

echo "✅ Deployment complete!"