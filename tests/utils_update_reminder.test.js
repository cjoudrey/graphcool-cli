import test from 'ava'
import TestResolver from './helpers/test_resolver'
import TestOut from './helpers/test_out'
import { Config } from '../src/utils/config'
import { mockGithubReleaseResponse } from './fixtures/mock_data'
import { testEnvironment } from './helpers/test_environment'
const fetchMock = require('fetch-mock')

test('checkUpdate only checks once per 24 hours', async t => {
  const env = testEnvironment()
  env.config.set('lastUpdateCheck', Date.now())

})

test('checkUpdate saves last check time in config', async t => {

})

test('checkUpdate warns when a new version is available', async t => {

})

test('checkUpdate does not warn when already on latest version', async t => {

})
