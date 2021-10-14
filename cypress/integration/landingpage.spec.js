describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("/")
  })
  it("clicking login will take you to login page", () => {
    cy.get("#login").click()
    cy.title().should('eq', 'Login | Valorize')
  })
  it("clicking Register will take you to login page", () => {
    cy.get("#register").click()
    cy.title().should('eq', 'Register | Valorize')
  })
})
