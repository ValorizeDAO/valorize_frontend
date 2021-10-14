describe("Registration", () => {
  beforeEach(() => {
    cy.visit("/register")
  })
  it("submit button is disabled on arrival", () => {
    cy.title().should("eq", "Register | Valorize")
    cy.get("#submit-registration")
    .should("have.disabled", "true")
  })
  it("display if username is available", () => {
    // cy.intercept("GET", "http://localhost:1323/api/v0/users/*", { fixture: "user/notavailable.json" })
    cy.get("#email")
      .type("javier@test.com")
    const username = "javier" + new Date().getTime()
    cy.get("#username")
      .type(username)
    cy.contains("div", username + " is available!")
  })
})
