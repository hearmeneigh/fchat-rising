process.env.DEBUG = 'electron-windows-installer:main';
const path = require('path');
const pkg = require(path.join(__dirname, 'package.json'));
const fs = require('fs');
const child_process = require('child_process');
const _ = require('lodash');

const distDir = path.join(__dirname, 'dist');
const isBeta = pkg.version.indexOf('beta') !== -1;
const modules = path.join(__dirname, 'app', 'node_modules');

// const spellcheckerPath = 'spellchecker/build/Release/spellchecker.node',
//     keytarPath = 'keytar/build/Release/keytar.node',
//     integerPath = 'integer/build/Release/integer.node',
//     betterSqlite3 = 'better-sqlite3/build/Release/better_sqlite3.node';
//
// mkdir(path.dirname(path.join(modules, spellcheckerPath)));
// mkdir(path.dirname(path.join(modules, keytarPath)));
// fs.copyFileSync(require.resolve(spellcheckerPath), path.join(modules, spellcheckerPath));
// fs.copyFileSync(require.resolve(keytarPath), path.join(modules, keytarPath));

const includedPaths = [
    // 'spellchecker/build/Release/spellchecker.node',
    'keytar/build/Release/keytar.node',
    'throat',
    'node-fetch',
    'jquery'
];

_.each(
    includedPaths,
    (p) => {
        let from = p;
        let to = p;

        if (_.isArray(p)) {
            from = p[0];
            to = p[1];
        }

        fs.mkdirSync(path.dirname(path.join(modules, to)), {recursive: true});
        fs.copyFileSync(require.resolve(from), path.join(modules, to));
    }
);



require('electron-packager')({
    dir: path.join(__dirname, 'app'),
    out: distDir,
    overwrite: true,
    name: 'F-Chat',
    icon: path.join(__dirname, 'build', 'icon'),
    ignore: ['\.map$'],
    osxSign: process.argv.length > 2 ? {identity: process.argv[2]} : false,
    prune: false,
    arch: process.platform === 'darwin' ? ['x64', 'arm64'] : ['x64', 'arm64'],
}).then((appPaths) => {
    if (process.env.SKIP_INSTALLER) {
        return;
    }

    if(process.platform === 'win32') {
        console.log('Creating Windows installer');
        const icon = path.join(__dirname, 'build', 'icon.ico');
        const setupName = `F-Chat Rising Setup.exe`;
        if(fs.existsSync(path.join(distDir, setupName))) fs.unlinkSync(path.join(distDir, setupName));
        const nupkgName = path.join(distDir, `fchat-${pkg.version}-full.nupkg`);
        const deltaName = path.join(distDir, `fchat-${pkg.version}-delta.nupkg`);
        if(fs.existsSync(nupkgName)) fs.unlinkSync(nupkgName);
        if(fs.existsSync(deltaName)) fs.unlinkSync(deltaName);
        if(process.argv.length <= 3) console.warn('Warning: Creating unsigned installer');
        require('electron-winstaller').createWindowsInstaller({
            appDirectory: appPaths[0],
            outputDirectory: distDir,
            iconUrl: 'file:///%localappdata%\\fchat\\app.ico',
            setupIcon: icon,
            noMsi: true,
            exe: 'F-Chat.exe',
            title: 'F-Chat Rising',
            setupExe: setupName,
            name: 'fchat'
            // remoteReleases: 'https://client.f-list.net/win32/' + (isBeta ? '?channel=beta' : ''),
            // signWithParams: process.argv.length > 3 ? `/a /f ${process.argv[2]} /p ${process.argv[3]} /fd sha256 /tr http://timestamp.digicert.com /td sha256` : undefined
        }).catch((e) => console.error(`Error while creating installer: ${e.message}`));
    } else if(process.platform === 'darwin') {
        console.log('Creating Mac DMG');

        _.each([{ name: 'Intel', path: appPaths[0] }, { name: 'M1', path: appPaths[1] }], (arch) => {
            console.log(arch.name, arch.path);

            const target = path.join(distDir, `F-Chat Rising ${arch.name}.dmg`);
            if(fs.existsSync(target)) fs.unlinkSync(target);
            const appPath = path.join(arch.path, 'F-Chat.app');
            if(process.argv.length <= 2) console.warn('Warning: Creating unsigned DMG');
            require('appdmg')({
                basepath: arch.path,
                target,
                specification: {
                    title: 'F-Chat Rising',
                    icon: path.join(__dirname, 'build', 'icon.png'),
                    background: path.join(__dirname, 'build', 'dmg.png'),
                    contents: [{x: 555, y: 345, type: 'link', path: '/Applications'}, {x: 555, y: 105, type: 'file', path: appPath}],
                    'code-sign': process.argv.length > 2 ? {
                        'signing-identity': process.argv[2]
                    } : undefined
                }
            }).on('error', console.error);
            const zipName = `F-Chat_Rising_${arch.name}_${pkg.version}.zip`;
            const zipPath = path.join(distDir, zipName);
            if(fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
            const child = child_process.spawn('zip', ['-r', '-y', '-9', zipPath, 'F-Chat.app'], {cwd: arch.path});
            child.stdout.on('data', () => {});
            child.stderr.on('data', (data) => console.error(data.toString()));
            fs.writeFileSync(path.join(distDir, 'updates.json'), JSON.stringify({
                releases: [{version: pkg.version, updateTo: {url: 'https://client.f-list.net/darwin/' + zipName}}],
                currentRelease: pkg.version
            }));
        });
    } else {
        console.log('Creating Linux AppImage');
        console.log('APPPATHS', appPaths);

        for (const appPath of appPaths) {
            const appArch = appPath.match(/F-Chat-linux-([a-zA-Z0-9]+)$/)[1];
            const appArchLong = appArch === 'x64' ? 'x86_64' : 'arm64';
            const buildPath = path.join(__dirname, 'build');
            const distFinal = path.join(distDir, appArch);

            fs.renameSync(path.join(appPath, 'F-Chat'), path.join(appPath, 'AppRun'));
            fs.copyFileSync(path.join(buildPath, 'icon.png'), path.join(appPath, 'icon.png'));

            const libDir = path.join(appPath, 'usr', 'lib'), libSource = path.join(buildPath, 'linux-libs');
            fs.mkdirSync(libDir, {recursive: true});

            for(const file of fs.readdirSync(libSource)) {
                fs.copyFileSync(path.join(libSource, file), path.join(libDir, file));
            }

		console.log('SYMLINK', path.join(appPath, 'icon.png'), path.join(appPath, '.DirIcon'));
                fs.symlinkSync(path.join(appPath, 'icon.png'), path.join(appPath, '.DirIcon'));
                fs.writeFileSync(path.join(appPath, 'fchat.desktop'), '[Desktop Entry]\nName=F-Chat\nExec=AppRun\nIcon=icon\nType=Application\nCategories=GTK;GNOME;Utility;');

                require('axios').get(`https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-${appArchLong}.AppImage`, {responseType: 'stream'}).then((res) => {
                    const downloaded = path.join(distFinal, 'appimagetool.AppImage');
                    const stream = fs.createWriteStream(downloaded);
                    res.data.pipe(stream);
                    stream.on('close', () => {
                        const args = [appPath, 'fchat.AppImage', '-u', 'gh-releases-zsync|hearmeneigh|fchat-rising|latest|F-Chat-Rising-*-linux.AppImage.zsync'];
                        if(process.argv.length > 2) args.push('-s', '--sign-key', process.argv[2]);
                        else console.warn('Warning: Creating unsigned AppImage');
                        console.log('Dist DIR', distFinal);
                        if(process.argv.length > 3) args.push('--sign-args', `--no-tty  --pinentry-mode loopback --yes --passphrase=${process.argv[3]}`);
                        fs.chmodSync(downloaded, 0o755);

                        child_process.spawn(downloaded, ['--appimage-extract'], {cwd: distFinal}).on('close', () => {
                            const child = child_process.spawn(path.join(distFinal, 'squashfs-root', 'AppRun'), args, {cwd: distDir, env: {ARCH: appArchLong }});
                            child.stdout.on('data', (data) => console.log(data.toString()));
                            child.stderr.on('data', (data) => console.error(data.toString()));
                        });
                    });
                }, (e) => console.error(`HTTP error: ${e.message}`));
            }
        }
    }
}, (e) => console.log(`Error while packaging: ${e.message}`));
