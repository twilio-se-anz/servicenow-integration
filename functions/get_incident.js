// This is your new function. To start, set the name and path on the left.

exports.handler = function (context, event, callback) {
  // Here's an example of setting up some TWiML to respond to with this function

  const axios = require("axios").default;
  const userId = event.userId;

  endPoint = `${context.SERVICE_NOW_API_ROOT}/now/table/incident?sysparm_query=caller_id%3D${userId}%5Estate!%3D7&sysparm_limit=1`;

  // Make a request for a user with a given ID
  axios({
    auth: {
      username: context.SERVICE_NOW_USERNAME,
      password: context.SERVICE_NOW_PASSWORD,
    },
    method: "get",
    url: endPoint,
  })
    .then(function (response) {
      // handle success
      console.log(response.data.result.length);
      console.log(response.data);
      return callback(null, response.data.result[0]);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      return callback(error);
    });
};
