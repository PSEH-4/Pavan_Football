var express = require('express');
var rp = require("request-promise");
var URL = require("url");

const api_key = "&APIkey=9bb66184e0c8145384fd2cc0f7b914ada57b4e8fd2e4d6d586adcc27c257a978";
function search(req, res) {
  const queryParams = req.query;
  const country = queryParams.country || undefined;
  const league = queryParams.league || undefined;
  const team = queryParams.team || undefined;
  if (typeof league === "undefined") {
    return res.status(500).json({
      status: "ERROR_VALIDATING_PARAMS",
      error_info: {
        message: "Query Param `league` is mandatory."
      }
    });
  } else {
    getCountryId(country)
      .then((countryId) => {
        if (country && typeof countryId === "undefined") {
          return res.status(500).json({
            status: "ERROR_FETCHING_COUNTRY_INFO",
            error_info: {
              message: `Unable to identify country by name: ${country}`,
            }
          }).send();
        }
        getLeagueInfo(league, countryId)
          .then((leagueInfo) => {
            if (typeof leagueInfo === "undefined") {
              return res.status(500).json({
                status: "ERROR_FETCHING_LEAGUE_INFO",
                error_info: {
                  message: `Unable to identify league by name: ${league}`,
                }
              });
            }
            const leagueId = leagueInfo.leagueId;
            countryId = leagueInfo.countryId;
            getTeamId(team, leagueId)
              .then((teamId) => {
                if (team && typeof teamId === "undefined") {
                  return res.status(500).json({
                    status: "ERROR_FETCHING_TEAM_INFO",
                    error_info: {
                      message: `Unable to identify team by name: ${team}`,
                    }
                  }).send();
                }
                getStandings(leagueId, teamId, countryId, league)
                  .then((result) => {
                    return res.status(200).json(result).send();
                  })
                  .catch((error) => {
                    return res.status(500).json({ error: error }).send();
                  })

              })
              .catch((error) => {
                return res.status(500).json({ error: error }).send();
              })
          })
          .catch((error) => {
            return res.status(500).json({ error: error }).send();
          })
      })
      .catch((error) => {
        return res.status(500).json({ error: error }).send();
      });
  }
}

function getCountryId(countryName) {
  return new Promise((resolve, reject) => {
    if (typeof countryName === "undefined" || countryName.length == 0) {
      return resolve(undefined);
    } else {

      const options = {
        uri: "https://apiv2.apifootball.com/?action=get_countries&APIkey=9bb66184e0c8145384fd2cc0f7b914ada57b4e8fd2e4d6d586adcc27c257a978",
        json: true
      }
      rp(options)
        .then((result) => {
          let query_result;
          for (const country of result) {
            if (country.country_name === countryName) {
              query_result = country.country_id;
              break;
            }
          }
          return resolve(query_result);
        }).catch((err) => {
          const custom_error = {
            status: "ERROR_FETCHING_COUNTRY_INFO",
            error_info: {
              message: `Unable to fetch country info for : ${countryName}`,
              original_error: err,
            }
          };
          return reject(custom_error);
        });
    }
  });
}

function getLeagueInfo(league_name, countryId) {
  return new Promise((resolve, reject) => {
    if (typeof league_name === "undefined" || league_name.length == 0) {
      return resolve(undefined);
    }
    let queryUrl = "https://apiv2.apifootball.com/?action=get_leagues" + api_key;
    if (typeof countryId !== "undefined" && countryId.length != 0) {
      queryUrl += "&country_id=" + countryId;
    }
    const options = {
      uri: queryUrl,
      json: true
    }
    rp(options)
      .then((result) => {
        let query_result;
        for (const league_record of result) {
          if (league_record.league_name === league_name) {
            query_result = { leagueId: league_record.league_id, countryId: league_record.country_id };
            break;
          }
        }
        return resolve(query_result);
      }).catch((err) => {
        const custom_error = {
          status: "ERROR_FETCHING_LEAGUE_INFO",
          error_info: {
            message: `Unable to fetch league info for : ${league_name}`,
            original_error: err,
          }
        };
        return reject(custom_error);
      });
  });
}

function getTeamId(team, leagueId) {
  return new Promise((resolve, reject) => {
    if (typeof team === "undefined" || team.length == 0) {
      return resolve(undefined);
    }
    let queryUrl = "https://apiv2.apifootball.com/?action=get_teams" + api_key;
    if (typeof leagueId !== "undefined" && leagueId.length != 0) {
      queryUrl += "&league_id=" + leagueId;
    }
    const options = {
      uri: queryUrl,
      json: true
    }

    rp(options)
      .then((result) => {
        let query_result;
        for (const team_record of result) {
          if (team_record.team_name === team) {
            query_result = team_record.team_key;
            break;
          }
        }
        return resolve(query_result);
      }).catch((err) => {
        const custom_error = {
          status: "ERROR_FETCHING_TEAM_INFO",
          error_info: {
            message: `Unable to fetch team id for : ${team}`,
            original_error: err,
          }
        };
        return reject(custom_error);
      });
  });
}


function getStandings(leagueId, teamId, countryId, league) {
  return new Promise((resolve, reject) => {
    let queryUrl = "https://apiv2.apifootball.com/?action=get_standings" + api_key;
    queryUrl += "&league_id=" + leagueId;

    const options = {
      uri: queryUrl,
      json: true
    }

    rp(options)
      .then((result) => {
        if (teamId) {
          for (const team of result) {
            if (team.team_id === teamId) {
              const teamStanding = {
                "country_id": countryId,
                "country_name": team.country_name,
                "league_id": team.league_id,
                "league_name": team.league_name,
                "team_id": team.team_id,
                "team_name": team.team_name,
                "overall_league_position": team.overall_league_position,
              }
              return resolve([teamStanding]);
            }
          }
        } else {
          let resultArray = [];
          result.forEach((team) => {
            const teamStanding = {
              "country_id": countryId,
              "country_name": team.country_name,
              "league_id": team.league_id,
              "league_name": team.league_name,
              "team_id": team.team_id,
              "team_name": team.team_name,
              "overall_league_position": team.overall_league_position,
            }
            resultArray.push(teamStanding);
          });
          return resolve(resultArray);
        }
      }).catch((err) => {
        const custom_error = {
          status: "ERROR_FETCHING_STANDINGS_INFO",
          error_info: {
            message: `Unable to fetch team standings for : ${league}`,
            original_error: err,
          }
        };
        return reject(custom_error);
      });
  });
}

exports.search = search;
