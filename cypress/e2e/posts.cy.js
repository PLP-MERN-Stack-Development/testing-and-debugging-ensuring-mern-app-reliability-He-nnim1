describe('Posts API E2E (smoke)', () => {
  // Minimal unauthenticated checks to verify server health and error handling.

  it('GET /api/posts returns 200 and an array', () => {
    cy.request({ url: '/api/posts', retryOnStatusCodeFailure: true }).then((resp) => {
      expect(resp.status).to.equal(200);
      expect(resp.body).to.be.an('array');
    });
  });

  it('GET /api/posts/:id with invalid id returns 400 or 404', () => {
    cy.request({ method: 'GET', url: '/api/posts/invalid-id', failOnStatusCode: false }).then((res) => {
      expect([400, 404]).to.include(res.status);
    });
  });
});
