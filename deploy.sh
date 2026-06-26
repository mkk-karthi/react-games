Act as senior devops


```
#!/bin/bash

# Exit on error
set -e

# Prepare temp folder
rm -rf temp-deploy
mkdir temp-deploy

# Build each project
for dir in */; do
  project=${dir%/}
  if [ "$project" = "temp-deploy" ] || [ "$project" = "rock-paper-scissors" ]; then
    continue
  fi

  echo "Building $project..."
  cd $project
  npm install
  npm run build
  cd ..

  if [ "$project" = "home-page" ]; then
    cp -r "$project/dist/." "temp-deploy/"
  elif [ -d "$project/build" ]; then
    cp -r "$project/build" "temp-deploy/$project"
  else
    cp -r "$project/dist" "temp-deploy/$project"
  fi
done

# Save local changes
git stash --include-untracked

# Switch to gh-pages branch (create if not exists)
if git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout gh-pages
else
  git checkout --orphan gh-pages
fi

# Remove old files
# git rm -rf . >/dev/null 2>&1 || true

# Copy new builds
cp -r temp-deploy/* .

# Commit and push
git add .
git commit -m "Deploy projects"
git push -f "https://x-access-token:${GITHUB_TOKEN}@github.com/$GITHUB_REPOSITORY.git" gh-pages

# Switch back to main
git checkout main

# Restore local changes
git stash pop || true

# Cleanup
rm -rf temp-deploy

echo "✅ Deployment complete!"
```

Optimize in this sh comments
This is multi react projects build and push git gh-page barnch
return sh commend only