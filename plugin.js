// Ignite CLI plugin for Navigation
// ----------------------------------------------------------------------------

const DEPENDENCIES = [
    {
        package: 'react-navigation',
        version: '^4.0.10'
    },
    {
        package: 'react-native-reanimated',
        version: '^1.3.0'
    },
    {
        package: 'react-native-gesture-handler',
        version: '^1.4.1'
    },
    {
        package: 'react-native-screens',
        version: '^1.0.0-alpha.23'
    },
    {
        package: 'react-navigation-stack',
        version: '^1.10.3'
    },
    {
        package: 'react-navigation-tabs',
        version: '^2.5.6'
    },
];

const rnScreensPatch = `    implementation 'androidx.appcompat:appcompat:1.1.0-rc01'\n    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0-alpha02'`;

const add = async function (toolbox) {
    // Learn more about toolbox: https://infinitered.github.io/gluegun/#/toolbox-api.md
    const { ignite } = toolbox
    const APP_PATH = process.cwd()
    const packageJSON = require(`${APP_PATH}/package.json`)

    for (let index = 0; index < DEPENDENCIES.length; index++) {
        const { package, version } = DEPENDENCIES[index];

        await ignite.addModule(package, { link: packageJSON.dependencies['react-native'] < '0.60.0', version })
    }

    await toolbox.system.run('pod install', { cwd: `${APP_PATH}/ios` })

    // Example of patching a file
    ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
      insert: rnScreensPatch,
      after: `implementation "com.facebook.react:react-native:.*`
    });
}

/**
 * Remove yourself from the project.
 */
const remove = async function (toolbox) {
    // Learn more about toolbox: https://infinitered.github.io/gluegun/#/toolbox-api.md
    const { ignite } = toolbox
    const APP_PATH = process.cwd()
    const packageJSON = require(`${APP_PATH}/package.json`)

    for (let index = 0; index < DEPENDENCIES.length; index++) {
        const { package } = DEPENDENCIES[index];

        await ignite.removeModule(package, { unlink: packageJSON.dependencies['react-native'] < '0.60.0' });
    }

    await toolbox.system.run('pod install', { cwd: `${APP_PATH}/ios` })

    // Example of unpatching a file
    ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
        delete: rnScreensPatch,
    });
}

// Required in all Ignite CLI plugins
module.exports = { add, remove }

