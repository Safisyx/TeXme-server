Steps to run this project:

1. As this project is using SendGrid, please grab an API key at [https://sendgrid.com/](https://sendgrid.com/).
2. Create a file `mailApiKey.ts` in the folder `src` and put the following inside
`export const SENDGRID_KEY = 'API_KEY'` (replace `API_KEY` with your SendGrid API key)
3. Run `npm install` command to install the dependencies
4. Setup database settings inside `ormconfig.js` file. If not using Postgres, don't forget to install the driver
5. Run `npm run compile` to compile the project to get the javascript files.
6. Run `npm start` command
