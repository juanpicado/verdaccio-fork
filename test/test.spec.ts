import { ChildProcess } from "child_process";
import {
  login,
  runNpmInfo,
  runNpmPublish,
  runRegistry,
} from "./utils/registry";
import getPort from "get-port";
let child: ChildProcess;
let port = 4000;

beforeAll(async () => {
  port = await getPort();
  child = await runRegistry(["-c", "./verdaccio.yaml", "-l", `${port}`], {});
});

afterAll(() => {
  child.kill();
});

test("foo has access to jquery", (done) => {
  login("foo", "bar", port.toString());
  const object = runNpmInfo("jquery", port.toString()) as any;
  expect(object.name).toBe("jquery");
  done();
});

test('verify publish a package', (done) => {
  login("foo", "bar", port.toString());
  const object = runNpmPublish(port.toString());
  const {name, version} = require('../package.json');
  const pkgName = `${name}@${version}`;
  const info = runNpmInfo(pkgName, port.toString()) as any;
  expect(info.name).toBe(name);
  expect(info.version).toBe('12.0.0');
  done();
});