# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

⚠️ The changelog should be **human-readable**, so everything that's added here should be easy to understand without additional lookups and checks

Headers are one of:

-   `Added`, `Changed`, `Removed` or `Fixed`.

## [2.0.5]

### Fixed

-   Fixed autohide

### Changed

-   Changed topOffset's default to 40 due to iPhone notches

## [2.0.4]

### Changed

-   Forked from v1.3.4 of Calin Tamas' [react-native-toast-message](https://github.com/calintamas/react-native-toast-message)
-   Rewrote component in typescript using react context and hooks
-   Switched out raster images for SVGs

### Added

-   Added react and react-native as peer dependencies
-   Added new peer dependency [react-native-svg](https://www.npmjs.com/package/react-native-svg) for SVG icons
-   Added ToastProvider and useToast as the new API
-   Added optional onPress to toast
-   Added a queue for toasts -- if you queue a toast while one is already shown it will appear after the current one is gone

## [2.0.(0-3)]

-   Broken builds. Removed from npm. Use 2.0.4+
