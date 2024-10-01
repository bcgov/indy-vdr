const path = require('node:path')

const indyVdrShared = require('../indy-vdr-shared/package.json')

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          [indyVdrShared.name]: path.join(
            __dirname,
            '../indy-vdr-shared',
            indyVdrShared.source,
          ),
        },
      },
    ],
  ],
}
