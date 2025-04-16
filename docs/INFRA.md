# Infrastructure

**Owner**: Martín García  
**Last Updated**: 16/04/2025  
**URL**: `https://github.com/enfantterrible-ar/wp/docs/INFRA.md`

---

## Overview

This project employs a **monorepo architecture** to centralize all WordPress components—namely an FSE theme, custom plugins, shared utilities, build tools, and documentation—within a single repository. This architecture streamlines development, builds, and deployment, while ensuring consistency and adherence to shared standards across all project components.

## Goals

- Ensure consistency across themes and plugins.
- Leverage shared tooling (powered by 10up-toolkit) for building, linting, formatting, and testing.
- Facilitate atomic commits to update multiple components simultaneously.
- Simplify CI/CD pipelines by centralizing all projects within a single repository.
- Accelerate builds and reduce redundancy using TurboRepo caching.
- Maintain updated internal documentation for reference purposes.

## Included Components

- **Custom Theme**: `themes/enfantterrible-block-theme`
- **Must-Use Plugins**:
  - Example Plugin: `mu-plugins/enfantterrible-plugin`
- **Plugins Directory**: `plugins/`
- **Shared Codebase**: `packages/`
- **Build and Deployment Scripts**: `scripts/`
- **Documentation**: `docs/`

## Organization and Workflow

### 1. Monorepo Management via TurboRepo

TurboRepo orchestrates tasks across the monorepo. The root-level `turbo.json` outlines the execution parameters for tasks such as *build*, *start*, *test*, and *lint*. Key considerations include:

- **Task Dependencies**: Tasks are executed sequentially as required. For example, the *build* tasks for the theme and plugin are interdependent to ensure consistent propagation of changes.

- **Caching Strategy**: Output directories (e.g., `dist` folders) are specified to ensure that only modified components are rebuilt.

- **Persistent Development**: The *start* task runs continuously (with caching disabled) to support live development and hot reloading.

#### Pipelines

- **`build`**
  - **Purpose**:  
    Compiles assets across all workspaces and generates distribution files  
    needed for deployment.
  - **Configuration:**
    - The `"dependsOn": ["^build"]` directive ensures that build tasks in  
      dependent packages are executed before the local build process begins.

    - The `"outputs"` list specifies the directories where the build  
      artifacts are stored, ensuring that TurboRepo can identify when the  
      build is up-to-date.
  - **Outcome:**  
    A complete and synchronized build of the project, with all package  
    artifacts generated and stored in the specified directories.

- **`start`**
  - **Purpose**:  
    Launches the project in development mode, typically running a  
    live-reloading server.
  - **Configuration:**
    - The `"dependsOn": ["^build"]` directive mandates that all required  
      build tasks are completed beforehand.

    - The `"persistent": true` setting keeps the development server running  
      continuously.

    - The `"cache": false` setting ensures that the task always uses the  
      latest code, bypassing any cached outputs.
  - **Outcome:**  
    A functional development environment wherein all changes are  
    immediately visible, facilitating real-time testing and debugging.

- **`test`**
  - **Purpose**:  
    Executes tests to validate the correctness and integrity of the code  
    across the monorepo.
    
  - **Configuration:**
    - The `"dependsOn": ["build"]` directive ensures that the tests run  
      against the latest compiled code.

    - The `"outputs": []` setting indicates that the test task does not  
      produce any artifacts that need caching.

  - **Outcome:**  
    Reliable feedback on the code’s quality and functionality by running  
    unit and integration tests.

- **`lint-js`, `lint-style`, `format-js`**
  - **Purpose**:  
    These tasks provide code quality checks and formatting operations:
    - **`lint-js`**: Performs static code analysis on JavaScript files.  
    - **`lint-style`**: Checks and enforces style guidelines for CSS or  
      style files.  
    - **`format-js`**: Ensures that the JavaScript code adheres to  
      formatting rules.
  - **Configuration:**  
    Each task is configured with `"outputs": []` because linting and  
    formatting generate logs or modify code in place rather than producing  
    cacheable artifacts.
  - **Outcome:**  
    A consistent codebase that adheres to predefined style and formatting  
    guidelines, reducing potential errors and ensuring maintainability.

> [!NOTE]
> See [`turbo.json`](https://github.com/enfantterrible-ar/wp/tree/trunk/turbo.json) for more details.

### 2. NPM Workspaces and Shared Package Management

The monorepo utilizes npm workspaces to manage package dependencies for both the theme and plugin:

- **Workspace Configuration**: The top-level `package.json` enumerates workspaces to synchronize dependencies and scripts.
- **Centralized Script Management**: Global scripts (such as build, start, lint, test, and clean-dist) are defined at the top level and delegated to TurboRepo, which in turn invokes the respective scripts in each package.
- **Adaptability**: Package and dependency configurations remain flexible to accommodate evolution during development.

### 3. Composer for PHP Dependency Management

At the PHP level, Composer administers dependencies and enforces code standards for both the theme and the plugin:

- **Global Composer Configuration**: Specifies common requirements (e.g., PHP version and WordPress standards) to ensure compatibility and code quality.
- **Package-Specific Composer Files**: Each package (theme or plugin) incorporates its own `composer.json` to manage distinct dependencies, autoloading, and scripts.
- **Integrated Tooling**: Composer is utilized to integrate PHP code quality tools, such as PHPCS and PHPStan, to maintain coding standards.

### 4. Theme and Plugin Workflows

Each package within the monorepo follows a similar workflow:

- **Asset Compilation with 10up-Toolkit**:  
  Both the theme and plugin utilize 10up-toolkit to compile assets (JavaScript, CSS, etc.) with custom configurations to support block-based development and other WordPress-specific features.
- **Script Automation**:  
  Dedicated npm scripts are established for development (including watch mode with live reload), production asset builds, code linting, code formatting, test execution, and build directory cleanup.
- **Configuration Flexibility**:  
  The 10up-toolkit settings are integrated within each package’s configuration, permitting adjustments to build entries and asset paths during development without affecting the overall monorepo configuration.

## Development Workflow

The development process is designed for efficiency and consistency:

1. **Local Development**:  
   Utilize DDEV or a similar local environment tool to replicate a production-like setting. Executing the global `start` command triggers TurboRepo to run the individual start scripts for both the theme and plugin, thereby supporting simultaneous development with live reloading.
  
2. **Production Build**:  
   Executing the global `build` command initiates the build process for each package. TurboRepo manages dependencies and caches build outputs to ensure that only modified components are rebuilt.
  
3. **Linting and Testing**:  
   Global lint and test commands execute comprehensive checks across all packages, thereby ensuring consistency and code quality. Tools integrated via both npm and Composer enforce these checks.
  
4. **Configuration Evolution**:  
   Package-level and Composer configurations are designed to evolve independently. This facilitates updates to individual components while maintaining a clear overview of the overall development workflow.