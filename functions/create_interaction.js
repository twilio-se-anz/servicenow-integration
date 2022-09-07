// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  // Here's an example of setting up some TWiML to respond to with this function

  const axios = require("axios").default;
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
  const userId = event.userId;
  const response = new Twilio.Response();
  response.appendHeader("Content-Type", "application/json");
  console.log("Creating new SNOW interaction for user: ", userId);

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
    data: { type: "phone", opened_for: userId },
  })
    .then(({ data }) => {
      // handle success
      console.log(
        "SNOW create incident result data",
        JSON.stringify(data, null, 2)
      );
      // Employee not found
      if (!data || !data.result || data.result.length < 1) {
        console.log("Incident NOT created, data.result not found");
        return callback(null, {});
      } else {
        // handle success
        let incident = data.result[0];
        response.setBody(incident);
        console.log("Incident created: ", incident.number);
      }

      return callback(null, response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      return callback(error);
    });
};
