# Project: Migration to WordPress FSE + Monorepo

**Owner**: Martín García  
**Last Updated**: 31/03/2025  
**URL**: `https://github.com/enfantterrible-ar/wp/docs/01_PROJECT.md`  

## 1. Purpose  
This project aims to migrate the existing WordPress site from **Oxygen Builder** to a **Full Site Editing (FSE) theme**, while consolidating the codebase into a **monorepo**. This will eliminate Oxygen lock-in, align with modern WordPress standards, and improve version control, performance, and editorial workflow.  

## 2. Current State & Pain Points

### Strategic Risks
- **Outdated Tooling**:  
  - Miss WordPress core improvements (Site Editor, block patterns, style engine).  
  - Vulnerable to Oxygen’s uncertain long-term compatibility.  

### Technical Limitations
- **Oxygen Builder Lock-In**:  
  - Proprietary templates stored in the database, blocking version control and FSE adoption.  
  - Disables WordPress themes, preventing use of `theme.json` and core block styling.  
- **Fragmented Codebase**:  
  - Critical features are scattered across 2 major flows: custom plugins and code snippets.
  - Some of the custom plugins have a non-versioned repo, while other don't have one at all.  

### Architectural Issues and Documentation
- **Lack of content model documentation**
	- No documentation about defined content types and their function.
	- Undocumented content types metadata.
	- Content types and its metadata is initialized scattered through multiple plugins.

### Editorial Experience Issues
- **Editor/Frontend Style Mismatch**:  
  - Current state force editors to work in a broken block editor with inaccurate previews.  

## 3. Objectives  
- Replace **Oxygen Builder templates** with **FSE block templates**.  
- Implement a **custom FSE theme** with `theme.json` for global styles.  
- Standardize development using a **monorepo** (`/themes`, `/mu-plugins`, `/plugins`, `/packages`).  
- Automate deployments and code quality checks via **GitHub Actions CI/CD**.  
- Ensure a seamless editorial experience in **Gutenberg**, matching frontend styles.  

## 4. Scope  

### In Scope  
✅ Develop a **custom FSE theme** with version-controlled block templates.  
✅ Migrate **Oxygen-based layouts** to **block templates and patterns**.  
✅ Remove **Winden CSS** and replace with **FSE-compatible styling**.  
✅ Restructure code into a **monorepo** with separate themes, plugins, and shared packages.  
✅ Automate **linting, testing, and deployment** with **CI/CD pipelines**.  
✅ Document workflow for **editors and developers**.  

### Out of Scope  
❌ Enhancements unrelated to the migration (e.g., new features outside FSE adoption).  
❌ Third-party plugin replacements unless migration requires it.  
❌ Direct use of the Site Editor for template management (templates remain file-based).  

## 5. Stakeholders  

| Role | Name | Responsibility |  
|------|------|---------------|  
| Project Sponsor | REDACTED | Approves funding and strategic direction. |  
| Project Owner | REDACTED | Oversees execution, ensures alignment with business goals. |  
| Lead Developer | REDACTED | Implements FSE theme, monorepo, and CI/CD. |  
| Editors | REDACTED | Validate Gutenberg experience, provide feedback. |  
| End Users | N/A | Navigates and consumes the website. |  

## 6. Success Criteria  
- ❌ **100% of Oxygen templates** replaced by **FSE block templates**.  
- ❌ `theme.json` fully configured (global styles, spacing, typography).  
- ❌ Monorepo structure validated (`/themes`, `/mu-plugins`, `/plugins`, `/packages`).  
- ❌ Lighthouse performance score **≥ 90**.  
- ❌ Editors confirm **block editor previews match frontend styles**.  
- ❌ CI/CD pipeline operational with linting and automated deployments.  

## 7. Risks & Mitigation  

| Risk | Likelihood | Impact | Mitigation |  
|------|------------|--------|------------|  
| Content display inconsistencies | Medium | High | Audit key pages pre-launch, adjust block styles as needed. |  
| Block editor compatibility issues   | Medium     | High   | Conduct thorough pre-launch testing on staging; validate across browsers and devices; plan for rapid patch deployment if issues arise. |
| Developer onboarding delays | Low | Medium | Provide documentation on new monorepo and CI/CD workflows. |  
| Editorial workflow confusion | Medium | Low | Create `EDITOR_GUIDE.md` and train content teams. |  

## 8. Assumptions and Constraints
- **SEO & Accessibility:**  
  - The new FSE theme will adhere to existing SEO and accessibility best practices to maintain current performance.
- **Performance Monitoring:**  
  - Post-migration performance will be monitored to ensure the Lighthouse score remains ≥ 90.