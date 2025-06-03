# Home Library Service

How to Use
1. Clone the Repository
`git clone https://github.com/oanagrecu/nodejs2025Q2-service.git`
`cd nodejs2025Q2-service`
`git checkout dev`
2. Install Dependencies

`npm install`
3. Environment Configuration
Create a .env file in the root directory with the following content:

`PORT=4000`
You may change the PORT value to suit your needs.

4. Run the Application

`npm run start`
The application will be available at:

http://localhost:4000

5. Run Tests

`npm run test`
6. Lint the Code
`npm run lint`
Make sure there are no linting errors.

7. API Documentation
You can find the OpenAPI (Swagger) specification in the /doc folder.

To view it in Swagger UI:

Use https://editor.swagger.io/

Import the doc/openapi.yaml file

🧪 Grading Instructions
✅ Basic Scope (Max: 70 points)
Criteria	Points	Evaluation
README file with usage instructions	+10	Confirm detailed install/run/use instructions exist
Users module structure	+10	Check adherence to NestJS conventions
Tracks module structure	+10	Check adherence to NestJS conventions
Albums module structure	+10	Check adherence to NestJS conventions
Artists module structure	+10	Check adherence to NestJS conventions
Favorites module structure	+10	Check adherence to NestJS conventions
Each passed test	+10	Run npm test and count successful test cases

🚀 Advanced Scope (Max: 30 points)
Criteria	Points	Evaluation
PORT stored in .env	+10	Check if process.env.PORT is used
OpenAPI spec provided	+20	Validate doc/openapi.yaml against assignment requirements

❌ Forfeits
Violation	Penalty
Changes in tests	-670
Commits after deadline (non-doc)	-30% of max
No development branch	-20
No pull request	-20
Incorrect PR description	-10
Lint errors (not warnings)	-10 each
< 3 meaningful dev branch commits	-20
