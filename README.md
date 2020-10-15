# @quadient/design-tokens

### Motivation 
This package is a proposal on how we can cooperate, generate and share UX design tokens. As an output, various types of formats are generated. It is using a style-dictionary package (https://amzn.github.io/style-dictionary/#/) and provides only configuration for this tool.

### Description 
The input configuration is in the `./src/` folder. It contains the configuration `*.json` files with defined names and values of the tokens.

### How to use
Because this package is not now available as a public npm package, you have to just clone, fork or download the repository.

In the root folder run `npm i` to download all the dependencies. Run `npm run build` to generate output files. If the build finished, there is a `./build/` folder with the generated output token formats. 

Select the suitable output format and include it in your project. If you need another format, see the official format support documentation (https://amzn.github.io/style-dictionary/#/formats) and eventually update `config.js` to generate tokens in the appropriate format.

### Branding

According to the UX specification, there is a primary color token which can be rewritten with your brand color. Primary color should be selected from the list of available (tested) primary variant colors. You can set primary color in `./src/brand.json` and the value should be a value from the colors in `./src/colorPrimaryVariant.json`

### Configuration
The tested configuration is set in the `config.js` file. Transformation of `px` units is used for some output formats (e.g. javascript output does not contain px - to be able to call some mathematic operations with the token, whereas the css file contains `px` units to css interprets the token properly.) If you create a new `*-.json` input configuration file, you have to register this file in `config.js` in the source property (global mask is not used for the whole folder because with a list of individual files you are able to affect the order of the generated tokens).

### Themes
By default there are two themes generated (first with default colors, the second one with inverted colors). Each theme has own file in output format. 
If you want to build only one theme, run `npm run buildDefaultTheme` or `npm run buildDarkTheme`.

### Value Collision
During theme generating, info messages are printed into console. Messages such as e.g. `Collision detected at: color.bg.ui100! Original value: {color.base.white.value}, New value: {color.base.grey1000.value}` means that original value was rewritten by the theme value. It is not error, just information directly from style-dictionary package. 

### Example
`./example/example.html` use css output styles to present some basic color tokens with generated value. After change and rebuild configuration you can check the result here.

### Limitations found
The tool is unable to directly add opacity on dynamic colors - to resolve this, `convertToRGBa` action and `opacity` transformation were added (see `config.js` for more details).


