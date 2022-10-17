/**
 * @file Creates a new service now incident
 * @author Chris Connolly <cconnolly@twilio.com>
 * @version 1.0.0
 * @param {object} context - Serverless context
 * @param {object} event - Request params, headers
 * @param {function} callback - Function call back
 * @returns {function} - Serverless handler
 * @constructor
 */

exports.handler = async function (context, event, callback) {
  const axios = require("axios").default;
  const response = new Twilio.Response();
  response.appendHeader("Content-Type", "application/json");

  const sys_id = event.sys_id || "";
  console.log("Creating new SNOW interaction for sys_id: ", sys_id);
  endPoint = `${context.SERVICE_NOW_API_ROOT}/now/table/interaction`;
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
        "SNOW create interaction result data",
        JSON.stringify(data, null, 2)
      );
      // Employee not found
      if (!data || !data.result || data.result.length < 1) {
        console.log("Interaction NOT created, data.result not found");
        return callback(null, {});
      } else {
        // handle success
        let interaction = data.result;
        response.setBody(interaction);
        console.log(
          `Interaction created ${interaction.number} with sys_id: ${interaction.sys_id}`
        );
      }

      return callback(null, response);
    })
    .catch(function (error) {
      // handle error
      console.log("Error creating incident, SNOW API returned error", error);
      return callback(error);
    });
};
