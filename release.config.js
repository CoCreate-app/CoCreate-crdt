module.exports = {
  dryRun: false,
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    "@semantic-release/npm", 
    [
      "@semantic-release/github", 
      {
        successComment: false,
        failTitle: false,
      },
    ],
    [
      "@semantic-release/git", 
      {
        // Only stage and commit the changelog and package.json
        assets: ["CHANGELOG.md", "package.json"],
        message: "chore(release): ${nextRelease.version} [skip ci]",
      },
    ],
  ],
};