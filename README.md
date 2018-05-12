# Falcore

Front-end boilerplate for Interactive Strategies

## Directory Structure

```
dist/ ________________________________________ # Compiled Code & Files
gulp-tasks/ __________________________________ # Individual Gulp Tasks
src/ _________________________________________ # Pre-Compiled Source Code & Files
|- api/ ______________________________________ # Mock API Data
|  |- search.json ____________________________ # Mock IS Search Data
|- assets/ ___________________________________ # Assets
|  |- fonts/ _________________________________ # Fonts
|  |- images/ ________________________________ # Images
|- components/ _______________________________ # Components
|  |- component-name/ ________________________ # Individual Component
|    |- component-name.js ____________________ # Individual Component JS Partial
|    |- component-name.json __________________ # Individual Component JSON Data Partial for Twig
|    |- component-name.scss __________________ # Individual Component SCSS Partial
|    |- component-name.twig __________________ # Individual Component Twig Partial
|- global-scss/ ______________________________ # Global SCSS
|  |- helpers/ _______________________________ # Helpers & Mixins
|  |- vendor/ ________________________________ # Vendor Styles
|- js-plugins/ _______________________________ # JavaScript Plugin Partials
|- pages/ ____________________________________ # Twig Page Partials
|- compiled-data.json ________________________ # Mock Twig Data (merged JSON file from src/data/twig/** using Gulp)
|- layout.twig _______________________________ # Main Twig Layout File
|- main.js ___________________________________ # Main JavaScript File
|- main.scss _________________________________ # Main SCSS File
styleguide-builder/ __________________________ # Generator for the Living Styleguide
.browserslistrc ______________________________ # List of Browsers for Babel and Autoprefixer
gulp-config.js _______________________________ # Config File for Gulp
gulpfile.babel.js ____________________________ # Gulp File
```

---

## Prerequisites

| Name   | Version    | Documentation                              |
|--------|------------|--------------------------------------------|
| Node   | >= 6       | [http://nodejs.org](http://nodejs.org)     |
| Yarn   | >= 1.5.1   | [https://yarnpkg.com](https://yarnpkg.com) |

## Installing

After you have Node and Yarn installed, you may begin to install the project's dependencies.

Install Node Packages using [Yarn](https://yarnpkg.com/en/):

    $ yarn

Install Gulp Globally:

    $ yarn global add gulp

---

## Configuration

There are many different pieces of tech and many files that set the preferences for each of them. Here's a list of them and where to find the config file for each.

- Gulp: `gulpfile.js` - [docs](https://github.com/gulpjs/gulp)
- Yarn: `package.json` - [docs](https://yarnpkg.com/en/)

---

## Environment Variables

There is an `env.example` file with all possible environment variables. These **MUST** be set for Gulp to build the project. Duplicate this file **(DO NOT DELETE or RENAME)** and rename it to `.env`. Description of options and possible values are below:

| Name             | Description                                            | Possible Values (Type)                      |
|------------------|--------------------------------------------------------|---------------------------------------------|
| ENVIRONMENT      | Environment you are building                           | development, staging or production (string) |
| MOCK_DATA        | Whether or not to use a JSON server for mock API data  | true or false (boolean)                     |
| SEARCH_ENDPOINT  | Search endpoint for IS-Search                          | URL (string)                                |
| SEARCH_URL       | URL of search results page                             | URL (relative) (string)                     |

---

## Building

For additional information on the build process, see comments in `gulpfile.js`, `gulp-config.js`, and individual tasks in `gulp-tasks/`.

To run Gulp to build the project:

    $ gulp

---

## Templating

This project uses [Twig](https://github.com/twigjs/twig.js) for templates. Gulp compiles all of the Twig templates into normal HTML files in the `dist/` folder.

---

## Living Styleguide

This project uses [KSS (Knyle Style Sheets)](https://github.com/kneath/kss) to generate a living styleguide based on Sass comments. The styleguide is compiled into the `dist/styleguide` folder and is accessible for viewing at `/styleguide` in your local environment or on your server.

## Conventions

- Relative links instead of root relative links for paths (where possible) i.e. use `../images/logo.png` instead of `/images/logo.png`
- Use 2 spaces for indentation in all files. Don't use hard tabs
- Add a blank line to the end of all files
- Remove trailing whitespace in code
- Insert blank lines between blocks of code in Sass and JS and between major blocks in Twig

---

## Notes

#### .htaccess and web.config

These files are added to allow for server support of SVG. The .htaccess is for Apache environments and the web.config for IIS. Either/both of these files can be safely removed if they don't apply to your environment.

#### Version Control

We use [git](https://git-scm.com/) through [Bitbucket](http://bitbucket.org/) for version control.

---

#### Author

Interactive Strategies - [frontend@interactivestrategies.com](frontend@interactivestrategies.com)

---

#### License

This project is licensed under the MIT License - see the `LICENSE.md` file for details
