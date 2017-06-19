import { SystemEnvironment } from '../types'
import semver = require('semver')
import {
  latestVersionUrl,
  outdatedMessage
} from './constants'

export async function getLatestVersion(): Promise<string> {
  const result = await fetch(latestVersionUrl)
  const json = await result.json()

  const latestVersion = json['tag_name']

  if (!semver.valid(latestVersion)) {
    throw new Error(`The latest GitHub release has an invalid tag: ${latestVersion}`)
  }

  return semver.clean(latestVersion)
}

export async function checkUpdate(env: SystemEnvironment, currentVersion: string) {
  const lastUpdateCheck = Number(env.config.get('lastUpdateCheck')) || 0
  if (lastUpdateCheck && Date.now() - lastUpdateCheck < (3600 * 24)) {
    return;
  }

  env.config.set({ lastUpdateCheck: Date.now() })
  env.config.save()

  const latestVersion = await getLatestVersion()

  if (semver.gt(latestVersion, currentVersion)) {
    env.out.write(outdatedMessage(currentVersion, latestVersion))
    env.out.write('\n')
  }
}
