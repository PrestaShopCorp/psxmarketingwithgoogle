const fs = require('fs');

if (!fs.existsSync('.jest-test-results.json')) {
  throw new Error(`
    .jest-test-results.json not found
    You need to run the tests first by using this command:
    npm run test:generate-output

    `,
  );
}
