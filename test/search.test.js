const chai = require("chai");
const chaiHttp = require('chai-http');

const app = require("../app");


chai.use(chaiHttp);

const assert = chai.assert;
const should = chai.should;
const expect = chai.expect;

describe('Search Tests', function () {
  it("Missing league_id", () => {
    chai.request(app).get("/search")
      .then((response) => {
        expect(response).to.have.status(500);
      })
      .catch((error) => {
        // console.error(error);
        throw error;
      })
  });

  it("Search should fail with invalid league name", () => {
    chai.request(app).get("/search?league=tests")
      .then((response) => {
        expect(response).to.have.status(500);
        return;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      })
  });

  it("Search should pass with valid league name", () => {
    chai.request(app).get("/search?league=Ligue 2")
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array');
        return;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      })
  });

  it("Search should return one record with valid league name and team name", () => {
    chai.request(app).get("/search?league=Ligue 2&team=Niort")
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.lengthOf(1);
        return;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      })
  });

  it("Search should fail with valid league name and invalid team name", () => {
    chai.request(app).get("/search?league=Ligue 2&team=Nio")
      .then((response) => {
        expect(response).to.have.status(500);
        return;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      })
  });

  it("Search should return records with valid league name and country name", () => {
    chai.request(app).get("/search?league=Ligue 2&country=France")
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array');
        return;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      })
  });

  it("Search should fail with valid league name and invalid country name", () => {
    chai.request(app).get("/search?league=Ligue 2&country=Frane")
      .then((response) => {
        expect(response).to.have.status(500);
        return;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      })
  });

  it("Search should return one record with valid league, country and team ", () => {
    chai.request(app).get("/search?league=Ligue 2&country=France&team=Niort")
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.lengthOf(1);
        return;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      })
  });

});
