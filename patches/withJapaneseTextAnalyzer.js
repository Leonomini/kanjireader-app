const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withJapaneseTextAnalyzer(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    const pickFirstLines = [
      `pickFirst 'META-INF/CONTRIBUTORS.md'`,
      `pickFirst 'META-INF/LICENSE.md'`
    ];

    const packagingOptionsRegex = /packagingOptions\s*{([\s\S]*?)}/m;

    // Fall 1: packagingOptions {} existiert bereits
    if (packagingOptionsRegex.test(contents)) {
      contents = contents.replace(packagingOptionsRegex, (match, innerContent) => {
        let updatedContent = innerContent;

        pickFirstLines.forEach((line) => {
          if (!innerContent.includes(line)) {
            updatedContent += `\n        ${line}`;
          }
        });

        return `packagingOptions {\n${updatedContent}\n    }`;
      });
    } else {
      // Fall 2: packagingOptions {} existiert noch nicht – neuen Block einfügen
      contents = contents.replace(/android\s*{/, match => `${match}
    packagingOptions {
        ${pickFirstLines.join('\n        ')}
    }`);
    }

    config.modResults.contents = contents;
    return config;
  });
};
