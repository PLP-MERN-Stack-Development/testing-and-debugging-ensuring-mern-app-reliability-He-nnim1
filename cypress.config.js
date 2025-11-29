const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // allow overriding baseUrl via env for flexibility
    baseUrl: process.env.E2E_BASE_URL || 'http://localhost:5000',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
