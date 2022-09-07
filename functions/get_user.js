// This is your new function. To start, set the name and path on the left.

exports.handler = function (context, event, callback) {
  // Here's an example of setting up some TWiML to respond to with this function

  const axios = require("axios").default;
  const userPhone = event.from.replace("+", "%2B");

  endPoint = `${context.SERVICE_NOW_API_ROOT}/now/table/sys_user?sysparm_query=phone%3D${userPhone}%5EORhome_phone%3D${userPhone}%5EORmobile_phone%3D${userPhone}&sysparm_limit=1`;

  console.log(endPoint);

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
      console.log(response.data.result[0]);
      return callback(null, response.data.result[0]);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      return callback(error);
    });
};
