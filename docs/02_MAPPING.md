# Requirements mapping: Migration to WordPress FSE + Monorepo

**Owner**: Martín García  
**Last Updated**: 31/03/2025  
**URL**: `https://github.com/enfantterrible-ar/wp/docs/01_MAPPING.md`  

## Discovery

1. **As a developer**, I want to audit the **current state of the system** to know where I am and what I would be riding.

	- **Acceptance Criteria:**
		
		- A single **`docs/AUDIT.md`** file with:
			- Template/plugin/code snippets inventory.
			- Dependency graph.
			- Migration priority list.
		- A single **`docs/CONTENT_MODELS.md`** detailing all content types, taxonomies, and metadata.

	- **Tasks:**

		- Inventory Oxygen templates, plugins, content types, and metadata.
		- Map dependencies (e.g., "Plugin X relies on Oxygen’s shortcode system").
		- Categorize components as "migrate," "replace," or "deprecate." 
		- Document audit results.

## **Infra**
	
1. **As a developer**, I want to ensure that the **monorepo structure** supports our development workflow and scalability, including an optimized configuration using TurboRepo, so that our build and deployment processes are efficient.

	- **Acceptance Criteria:**
		
		- Bootstrapped monorepo.
		- The monorepo structure and its rationale are documented in **`docs/INFRA.md`**.
		- TurboRepo configuration is documented in **`docs/INFRA.md`**, including caching, builds, and dependency optimizations.

	- **Tasks:**

		- Bootstrap the monorepo structure (directories for `/themes`, `/mu-plugins`, `/plugins`, `/packages`, `/docs`).
		- Integrate TurboRepo configuration to manage caching, parallel builds, and dependency graph optimizations.
		- Update configuration files and dependencies as needed to reflect the optimized setup.
		- Document the monorepo structure and rationale.
		- Document the Turborepo config.

2. **As a developer**, I want to set up **automated CI/CD pipelines** so that code quality is maintained and deployments are streamlined.

	- **Acceptance Criteria:**
	
		- Document the CI/CD workflow in **`docs/DEPLOYMENT.md`**.
		- A quick-start guide exists for new developers in **`docs/QUICKSTART.md`**.
		- CI/CD workflows for linting, testing, and deployment are documented.
		- Working deployment pipelines to stage.
		- Working deployment pipelines to production.

	- **Tasks:**

		- Define GitHub Actions workflows for linting, testing, and deployment.
		- Integrate automated testing steps and validate the deployment process.
		- Include performance tests in the CI/CD pipeline to verify that new templates meet the required Lighthouse score.
		- Monitor and iterate on the CI/CD setup based on feedback and issues.

## **Migration**

1. **As a developer**, I want to **convert the current Oxygen Builder templates into FSE block templates** so that our site can be managed natively through Gutenberg.

	- **Acceptance Criteria:**

		- All Oxygen templates are converted to FSE templates.
		- The global styles are set in `theme.json`, including colors, typography, and spacing.
		- The process is documented in **`docs/THEME.md`**.

	- **Tasks:**

		- Map each Oxygen template/component to the corresponding FSE block(s).
		- Develop the custom FSE theme structure and set up `theme.json` with global styles (colors, typography, spacing).
		- Convert key templates (e.g., homepage, blog, header, footer) into FSE block templates.
		- Document the process in **`docs/THEME.md`**.

2. **As a developer**, I want to **migrate the audited plugins and custom functionalities** into the monorepo so that the codebase is consolidated and easier to maintain.

	- **Acceptance Criteria:**

		- The migration path for each plugin/functionality is documented in **`docs/PLUGINS.md`**.
		- Custom plugins are migrated into the monorepo.
		- A post-migration review ensures all functionalities remain intact.

	- **Tasks:**

		- Migrate the essential plugins and custom functionalities into the appropriate monorepo directories.
		- Refactor code as necessary to ensure compatibility with the monorepo structure.
		- Test the integrated modules to confirm that the functionality remains intact post-migration.
		- Document the process in **`docs/PLUGINS.md`**.

3. **As an editor**, I need a **consistent editing experience in Gutenberg** so that I can manage content without discrepancies between editor and live view.
	
	- **Tasks:**

		- Validate block previews in Gutenberg against the live frontend.
		- Conduct cross-browser and cross-device testing to ensure that FSE block templates render correctly.
		- Gather feedback from editors and adjust styles as needed.