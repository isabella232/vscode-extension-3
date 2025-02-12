/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import assert from 'assert';
import sinon from 'sinon';
import { getHttpsProxyAgent } from '../../../snyk/common/proxy';
import { IVSCodeWorkspace } from '../../../snyk/common/vscode/workspace';

suite('Proxy', () => {
  // Proxy settings
  const host = 'my.proxy.com';
  const port = 8080;
  const auth = 'user:password';
  const proxy = `https://${auth}@${host}:${port}`;
  const proxyStrictSSL = true;

  teardown(() => {
    sinon.restore();
  });

  test('No proxy set', () => {
    const getConfiguration = sinon.stub();
    getConfiguration.withArgs('http', 'proxy').returns(undefined);

    const workspace = {
      getConfiguration,
    } as unknown as IVSCodeWorkspace;

    const agent = getHttpsProxyAgent(workspace);

    assert.strictEqual(agent, undefined);
  });

  test('Proxy is set in VS Code settings', () => {
    const getConfiguration = sinon.stub();
    getConfiguration.withArgs('http', 'proxy').returns(proxy);
    getConfiguration.withArgs('http', 'proxyStrictSSL').returns(proxyStrictSSL);

    const workspace = {
      getConfiguration,
    } as unknown as IVSCodeWorkspace;

    const agent = getHttpsProxyAgent(workspace);

    // @ts-ignore: cannot test options otherwise
    assert.deepStrictEqual(agent?.proxy.host, host);
    // @ts-ignore: cannot test options otherwise
    assert.deepStrictEqual(agent?.proxy.port, port);
    // @ts-ignore: cannot test options otherwise
    assert.deepStrictEqual(agent?.proxy.auth, auth);
    // @ts-ignore: cannot test options otherwise
    assert.deepStrictEqual(agent?.proxy.rejectUnauthorized, proxyStrictSSL);
  });

  test('Proxy is set in environment', () => {
    const getConfiguration = sinon.stub();
    getConfiguration.withArgs('http', 'proxy').returns(undefined);
    getConfiguration.withArgs('http', 'proxyStrictSSL').returns(proxyStrictSSL);

    const workspace = {
      getConfiguration,
    } as unknown as IVSCodeWorkspace;

    const agent = getHttpsProxyAgent(workspace, {
      https_proxy: proxy,
      http_proxy: proxy,
    });

    // @ts-ignore: cannot test options otherwise
    assert.deepStrictEqual(agent?.proxy.host, host);
    // @ts-ignore: cannot test options otherwise
    assert.deepStrictEqual(agent?.proxy.port, port);
    // @ts-ignore: cannot test options otherwise
    assert.deepStrictEqual(agent?.proxy.auth, auth);
    // @ts-ignore: cannot test options otherwise
    assert.deepStrictEqual(agent?.proxy.rejectUnauthorized, proxyStrictSSL);
  });
});
