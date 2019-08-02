const chai = require("chai");
const chaiHttp = require('chai-http');

const app = require("../app");


chai.use(chaiHttp);

const assert = chai.assert;
const should = chai.should;
const expect = chai.expect;

describe('Basic Tests', function () {
  it("HealthCheck Test", () => {
    chai.request(app).get("/")
      .then((response) => {
        expect(response).to.have.status(200);
      })
      .catch((error) => {
        console.error(error);
        throw error;
      })
  });
});
