# pipedrive-api

Express.js API for creating Pipedrive Activities from Github Gists.

## Prerequisites
To run the application node and mysql are required to be downloaded.

```
https://dev.mysql.com/downloads/

https://nodejs.org/en/download/
```

Application requires a MySQL user. Username and password can be set in the .env file.

Application requires Pipedrive API Token which can be set in the .env file.

Following command must be run to install all the dependencies.
```
npm install
```

## Running the app

App can be run with the following command.

```
node .
```

Author is also providing the Postman folder with requests.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/8912ec385509cc218eb9?action=collection%2Fimport)

## Architecture

App initialization can be found in the index.js file on the highest level.

Database initializtion and connection in src/config/db.js

src/api contains the API routes.

src/controllers contains the business logic.

src/models contains the database communications.

src/constants contains the external API urls.

## API explanation

Users are saved to database upon Posting to the Activities route.

**/gists** route is for getting GitHub users public gists. Query param **sinceLastVisit** indicates if all public gists are to be returned or only gists that were added after the last Pipedrive Activity creation.

**/users** route is for retrieving users saved to the database.

**/activities** route is for creating Pipedrive Activities from Github users public gists. On first request for a specific user, the user is saved to the database and all public Gists are considered when creating Activities.

On following requests the **createAll** param can be added to the request to indicate if Activities should be made from all Gists or only from Gists that were added since the last visit. Default value is **false**

**/activities/:username/interval** route is similar to previous but it now runs in intervals. Interval length and total run times are given in
.env file. Note that this application does not use authentication for Github API and therfore the maximum requests per hour is 60.


## Author
* **Marko Bode** - [markobode11](https://github.com/markobode11)
