const StyleDictionary = require("style-dictionary");
const tinycolor = require("tinycolor2");
const path = require("path");
const fs = require("fs");

const isDarkThemeConfiguration = process.argv[3] && process.argv[3] === './configDarkTheme.js';

StyleDictionary.registerAction({
  name: "convertToRGBa",
  do: (_dictionary, config) => {
    /**
     * Due to tool transform limitation, color with opacity token is written as a 'getRGBa(color, opacity)' string on output (see opacity transformation)
     * This action parses the string color with opacity and convert it into rgba color format
     */ 
    const filePath = path.join(config.buildPath, config.files[0].destination);
    var fileContent = fs.readFileSync(filePath, "utf-8");

    // looking e.g. for: getRGBa(#FFFFFF, 0.68);
    const convertToRGBaRegex = /getRGBa\((.{7}?)\,(.*?)\)/gm;
    fileContent = fileContent.replace(convertToRGBaRegex, (_match, color, opacity) => {
      return tinycolor(color).setAlpha(opacity).toRgbString();
    });

    /**
     * Due to tool transform limitation, opacity has to be written as a string in the input configuration
     * This action convert opacity in string back to number
     * looking for: "0.??" and return just number
     */ 
    const opacityToNumberRegex = /\"(0.[0-9][0-9]?)\"/gm;
    fileContent = fileContent.replace(opacityToNumberRegex, (_match, opacity) => {
      return opacity;
    });

    fs.writeFileSync(filePath, fileContent, "utf-8");
    console.log(`RGBa conversion and opacity conversion for ${filePath} finished`);
  },
  undo: () => {},
});


let source = [
  "src/angle.json",
  "src/brandDefault.json",
  "src/brand.json",
  "src/colorPrimaryVariant.json",
  "src/duration.json",
  "src/easing.json",
  "src/color.json",
  "src/colorBase.json",
  "src/border.json",
  "src/font.json",
  "src/gradient.json",
  "src/opacity.json",
  "src/opacityBase.json",
  "src/radius.json",
  "src/radiusBase.json",
  "src/spacing.json",
  "src/sizing.json",
  "src/shadow.json",
]

if(isDarkThemeConfiguration) {
  source.push(
    "src/darkTheme/color.json",
    "src/darkTheme/colorPrimaryVariant.json"
  )
}

function getFileName() {
  if(isDarkThemeConfiguration) {
    return 'variablesDarkTheme'
  }
  return 'variables'
}

module.exports = {
  source: source,
  transform: {
    pxUnit: {
      type: "value",
      matcher: (prop) => {
        return prop.unit === "px";
      },
      transformer: (prop) => {
        return `${prop.value}px`;
      },
    },
    opacity: {
      type: "value",
      matcher: (prop) => {
        return prop.opacity !== undefined;
      },
      transformer: (prop) => {
        // prepare color value with opacity for convertToRGBa action 
        return `getRGBa(${prop.color},${prop.opacity})`;
      },
    }
  },
  platforms: {
    scss: {
      transforms: StyleDictionary.transformGroup.scss.concat(
        "pxUnit",
        "opacity"
      ),
      buildPath: "build/scss/",
      files: [
        {
          destination:  `${getFileName()}.scss`,
          format: "scss/variables",
        },
      ],
      actions: ["convertToRGBa"],
    },
    less: {
      transforms: StyleDictionary.transformGroup.less.concat(
        "pxUnit",
        "opacity"
      ),
      buildPath: "build/less/",
      files: [
        {
          destination: `${getFileName()}.less`,
          format: "less/variables",
        },
      ],
      actions: ["convertToRGBa"],
    },
    css: {
      transforms: StyleDictionary.transformGroup.css.concat(
        "pxUnit",
        "opacity"
      ),
      buildPath: "build/css/",

      files: [
        {
          destination: `${getFileName()}.css`,
          format: "css/variables",
        },
      ],
      actions: ["convertToRGBa"],
    },
    js: {
      transforms: StyleDictionary.transformGroup.js.concat("opacity"),
      buildPath: "build/js/",
      files: [
        {
          destination: `${getFileName()}.js`,
          format: "javascript/es6",
        },
      ],
     actions: ["convertToRGBa"],
    },
    json: {
      transforms: StyleDictionary.transformGroup.js.concat("opacity"),
      buildPath: "build/json/",
      files: [
        {
          destination:  `${getFileName()}.json`,
          format: "json/flat",
        },
      ],
      actions: ["convertToRGBa"],
    },
  },
};
