import semver = require('semver')

const latestVersionUrl = 'https://api.github.com/repos/graphcool/graphcool-cli/releases/latest'

export async function getLatestVersion(): Promise<string> {
  const result = await fetch(latestVersionUrl)
  const json = await result.json()

  const latestVersion = json['tag_name']

  if (!semver.valid(latestVersion)) {
    throw new Error(`The latest GitHub release has an invalid tag: ${latestVersion}`)
  }

  return semver.clean(latestVersion)
}
