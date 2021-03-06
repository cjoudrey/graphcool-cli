import test from 'ava'
import TestResolver from '../src/system/TestResolver'
import authCommand from '../src/commands/auth'
import { authEndpoint, graphcoolConfigFilePath, systemAPIEndpoint } from '../src/utils/constants'
import TestAuthServer from '../src/api/TestAuthServer'
import { testToken } from './mock_data/mockData'
import { TestSystemEnvironment } from '../src/types'
import TestOut from '../src/system/TestOut'
import 'isomorphic-fetch'
const fetchMock = require('fetch-mock')
const debug = require('debug')('graphcool')

/*
 Tests:
 - Succeeding auth without token
 - Succeeding auth with existing token
 */

test.afterEach(() => {
  new TestOut().write('\n')
  fetchMock.restore()
})

test('Succeeding auth without token', async t => {

  // configure HTTP mocks
  fetchMock.post(`${authEndpoint}/create`, {})
  fetchMock.get(`${authEndpoint}/*`, {
    authToken: testToken
  })
  fetchMock.post(`${systemAPIEndpoint}`, {
    data: {
      viewer: {
        user: {
          id: 'abcdefghik'
        }
      }
    }
  })

  // configure auth dependencies
  const env = testEnvironment({})
  const authServer = new TestAuthServer()

  env.out.prefix((t as any)._test.title, '$ graphcool auth')

  // authenticate
  await t.notThrows(
    authCommand({}, env, authServer)
  )

  // verify result
  const {token} = JSON.parse(env.resolver.read(graphcoolConfigFilePath))
  t.is(token, testToken)
})

test('Succeeding auth with existing token', async t => {

  // configure HTTP mocks
  fetchMock.post(`${systemAPIEndpoint}`, {
    data: {
      viewer: {
        user: {
          id: 'abcdefghik'
        }
      }
    }
  })

  // configure auth dependencies
  const props = {token: testToken}
  const env = testEnvironment({})
  env.resolver.write(graphcoolConfigFilePath, testToken)
  const authServer = new TestAuthServer()

  env.out.prefix((t as any)._test.title, `$ graphcool auth -t ${testToken}`)

  // authenticate
  await t.notThrows(
    authCommand(props, env, authServer)
  )

  // verify result
  const {token} = JSON.parse(env.resolver.read(graphcoolConfigFilePath))
  t.is(token, testToken)
})

function testEnvironment(storage: any): TestSystemEnvironment {
  return {
    resolver: new TestResolver(storage),
    out: new TestOut(),
  }
}
