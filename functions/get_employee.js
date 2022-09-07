/**
 * @file Looks up employee by 8 digit ID
 * @author Chris Connolly <cconnolly@@twilio.com>
 * @version 1.0.0
 * @param {object} context - Serverless context
 * @param {object} event - Request params, headers
 * @param {function} callback - Function call back
 * @returns {function} - Serverless handler
 * @constructor
 */
exports.handler = function (context, event, callback) {
  const axios = require("axios");
  const userId = event.userId;
  const response = new Twilio.Response();

  // Endpoint constructed from environment variables
  endPoint = `${context.SERVICE_NOW_API_ROOT}/now/table/sys_user?sysparm_query=employee_number%3D${userId}&sysparm_limit=1`;

  console.log("Making SNOW request to: ", endPoint);

  // Make a request for a user with a given ID
  axios({
    auth: {
      username: context.SERVICE_NOW_USERNAME,
      password: context.SERVICE_NOW_PASSWORD,
    },
    method: "get",
    url: endPoint,
  })
    .then(function (snow_response) {
      let data = snow_response.data;
      console.log("SNOW data", JSON.stringify(data, null, 2));
      // Employee not found
      if (!data || !data.result || data.result.length < 1) {
        console.log("SNOW No employee records returned");
        response.setStatusCode(404);
        return callback(null, response);
      }
      // handle success
      console.log(snow_response.data.result[0]);
      response.setBody(snow_response.data.result[0]);
      return callback(null, response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      return callback(error);
    });
};
