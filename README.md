## Installation (Twilio Configuration)

1. Change `.env` variables for Service Now
2. Execute one of the following commands depending on your environment

   1. Run `twilio serverless:deploy --env=.env.development` to create new service and deploy the functions and assets
   2. Run `twilio serverless:deploy --env=.env.uat --environment=uat` to create new service and deploy the functions and assets
   3. Run `twilio serverless:deploy --env=.env.production --production` to create new service and deploy the functions and assets

3. Run `twilio api:serverless:v1:services:update --ui-editable --sid <SID>` to enable console editing
