/**
 * @file Looks for existing service now incidents
 * @author Chris Connolly <cconnolly@twilio.com>
 * @version 1.0.0
 * @param {object} context - Serverless context
 * @param {object} event - Request params, headers
 * @param {function} callback - Function call back
 * @returns {function} - Serverless handler
 * @constructor
 */
exports.handler = async function (context, event, callback) {
  // Here's an example of setting up some TWiML to respond to with this function

  const axios = require("axios").default;
  const sys_id = event.sys_id;
  const response = new Twilio.Response();
  response.appendHeader("Content-Type", "application/json");
  console.log("Finding incidents for SNOW user: ", sys_id);

  endPoint = `${context.SERVICE_NOW_API_ROOT}/now/table/incident?sysparm_query=sys_id%3D${sys_id}%5Estate!%3D7&sysparm_limit=1`;

  console.log(endPoint);

  // Make a request for a user with a given SNOW sys_id (user)
  await axios({
    auth: {
      username: context.SERVICE_NOW_USERNAME,
      password: context.SERVICE_NOW_PASSWORD,
    },
    method: "post",
    url: endPoint,
    responseType: "json",
    data: { type: "phone", opened_for: sys_id },
  })
    .then(({ data }) => {
      // handle success
      console.log(
        "SNOW create interaction data",
        JSON.stringify(data, null, 2)
      );
      // Employee not found
      if (!data || !data.result || data.result.length < 1) {
        console.log("No incidents found, data.result not found");
        return callback(null, {});
      } else {
        // handle success
        let incident = data.result[0];
        response.setBody(incident);
        console.log("Incident found: ", incident.number);
      }

      return callback(null, response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      return callback(error);
    });
};
