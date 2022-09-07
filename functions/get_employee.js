/**
 * @file Looks up employee in service now by 8 digit employee ID
 * @author Chris Connolly <cconnolly@twilio.com>
 * @version 1.0.0
 * @param {object} context - Serverless context
 * @param {object} event - Request params, headers
 * @param {function} callback - Function call back
 * @returns {function} - Serverless handler
 * @constructor
 */
exports.handler = async function (context, event, callback) {
  const axios = require("axios");
  const userId = event.userId;
  const response = new Twilio.Response();
  response.appendHeader("Content-Type", "application/json");
  console.log("Looking up Employee ID: ", userId);

  // Endpoint constructed from environment variables
  endPoint = `${context.SERVICE_NOW_API_ROOT}/now/table/sys_user?sysparm_query=employee_number%3D${userId}&sysparm_limit=1`;
  console.log("Making SNOW request to: ", endPoint);

  // Make a request for a user with a given ID
  await axios({
    auth: {
      username: context.SERVICE_NOW_USERNAME,
      password: context.SERVICE_NOW_PASSWORD,
    },
    method: "get",
    url: endPoint,
    responseType: "json",
  })
    .then(({ data }) => {
      console.log("SNOW lookup data", JSON.stringify(data, null, 2));
      // Employee not found
      if (!data || !data.result || data.result.length < 1) {
        console.log("SNOW No employee records returned");
        return callback(null, {});
      } else {
        // handle success
        let person = data.result[0];
        response.setBody(person);
        console.log(
          `SNOW Found employee ID: ${userId} SNOW sys_id: ${person.sys_id}`
        );
      }
      return callback(null, response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      return callback(error);
    });
};
