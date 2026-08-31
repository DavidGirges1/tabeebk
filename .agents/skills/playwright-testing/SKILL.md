---
name: playwright-testing
description: Guidelines and workflows for running, authoring, and debugging Playwright end-to-end (E2E) automated tests in this project.
---

# Playwright Automated Testing Workflow

This project is configured with Playwright for End-to-End (E2E) testing against the Next.js application.

## Key Commands

- **Run all E2E tests headless**:
  ```bash
  npm run test:e2e
  ```
- **Run E2E tests with UI Mode**:
  ```bash
  npm run test:e2e:ui
  ```
- **Run E2E tests in headed browser**:
  ```bash
  npm run test:e2e:headed
  ```
- **Open Test Report**:
  ```bash
  npm run test:e2e:report
  ```
- **Code Generator (record interactions)**:
  ```bash
  npm run test:e2e:codegen http://localhost:3000
  ```

## Configuration

- Config file: [playwright.config.ts](file:///D:/freelance%20projects/Med%20Aggregator/playwright.config.ts)
- Test directory: [e2e/](file:///D:/freelance%20projects/Med%20Aggregator/e2e)
- Dev server integration: Automatically starts `npm run dev` on `http://localhost:3000` during test runs if not already active.

## MCP Playwright Server

Antigravity CLI is integrated with Playwright via the MCP configuration located at `~/.gemini/config/mcp_config.json`. The agent can invoke browser automation tools directly during interactive sessions.
