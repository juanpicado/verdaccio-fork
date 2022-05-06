import { ChildProcess, fork, execSync } from "child_process";

export function runRegistry(
  args: string[] = [],
  childOptions: {}
): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {

        const childFork = fork(require.resolve('verdaccio/bin/verdaccio'), args, childOptions);

    childFork.on('message', (msg: {verdaccio_started: boolean}) => {
      if(msg.verdaccio_started){
        resolve(childFork);
      }
    });

    childFork.on('error', (err: any) => reject([err]));
    childFork.on('disconnect', (err: any) => reject([err]));
  
  });
}

export function login(user: string, password: string, port: string) {
  execSync(
    `npx npm-cli-login -u ${user} -p ${password} -e test@domain.test -r http://localhost:${port}`
  );
}

export function runNpmCommand(command: string, port: string): string {
  const buffer = execSync(
    `npm ${command} --registry http://localhost:${port} --json`
  );
  return buffer.toString();
}

export function runNpmInfo(pkg: string, port: string): unknown {
  const buffer = runNpmCommand(`info ${pkg}`, port);
  return JSON.parse(buffer.toString());
}

export function runNpmPublish(port: string) {
  const buffer = runNpmCommand(`publish --access=public --json`, port);
  return JSON.parse(buffer.toString());
}
