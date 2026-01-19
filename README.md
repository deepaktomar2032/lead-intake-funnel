# Heatos - Full-Stack Lead Management Application

## Overview
This project is designed to serve as a full-stack lead management application, implementing a progressive lead funnel with multiple stages.

## Technology Stack
- Backend: NestJS (Node.js framework) for building scalable server-side applications.
- Frontend: React with React Router v7 for building dynamic user interfaces.
- Package Manager: pnpm for efficient dependency management in a monorepo setup.
- Database - MongoDB
- Zod – Type-safe schema validation for inputs and queries (due to its huge popularity and ease of use).
- Prettier & ESLint: Code formatting and linting tools to maintain code quality and consistency.

## Assumptions
- The application uses MongoDB as the database for storing lead information.
- The lead funnel consists of four stages: Minimal, Qualification, Discovery, and Selling.
- Each stage collects specific information and progresses the lead to the next stage upon successful submission.

## Installation & Setup
1. Clone the repository:

2. Install dependencies
   - `pnpm install`

## Run
- Dev mode (watch): `pnpm run docker:dev`
- Prod build + run: `pnpm run docker:prod`

The server listens on http://localhost:3000 & api is available to consume
The client listens on http://localhost:5173

Heroku server URL: https://heatos-server-prod-8ef0ad8aa001.herokuapp.com
Heroku client URL: https://heatos-client-prod-6657500c3b83.herokuapp.com

For simplicity, a few example requests are included in the `API.http` file & could be run directly using the VS-Code REST Client extension.

Request example:
- POST /lead
```bash
http://localhost:3000/api/lead

Content-Type: application/json

{
  "version": "1.2.0",
  "leadStage": "minimal",
  "contact": {
    "contactInformation": {
      "firstName": "Noah",
      "lastName": "Schonn",
      "phone": "+490123454635",
      "email": "lead@test.de"
    }
  }
}
```

Response example:
```json

{
    "leadStage": "minimal",
    "dataAcquisitionLink": "some-unique-link",
    "appointmentBookingLink": null,
}
```

- PUT /lead
```bash
http://localhost:3000/api/lead

Content-Type: application/json

{
    "version": "1.2.0",
    "leadStage": "qualification",
    "contact": {
        "contactInformation": {
            "firstName": "Noah",
            "lastName": "Schonn",
            "phone": "+490123454635",
            "email": "lead@test.de"
        },
        "address": {
            "street": "Pilgrim Street 6",
            "city": "Cologne",
            "postalCode": "50676",
            "countryCode": "DE"
        }
    },
    "building": {
        "address": {
            "street": "Pilgrim Street 6",
            "city": "Cologne",
            "postalCode": "50676",
            "countryCode": "DE"
        },
        "buildingInformation": {
            "immoType": "Single-family / Two-family house",
            "constructionYearString": "before 1995",
            "heritageProtection": "No",
            "boilerRoomSize": "more than 4 sqm",
            "installationLocationCeilingHeight": "180 - 199 cm",
            "widthPathway": "Yes",
            "heightPathway": "Yes",
            "personsHousehold": 4,
            "livingSpace": 170,
            "residentialUnits": 1,
            "roomsBetweenHeatingRoomAndOutdoorUnit": "one_room",
            "meterClosetLocation": "Basement",
            "electricityConnectionLocation": "Basement",
            "groundingType": "water_or_gas_pipe",
            "hasSolarThermalSystem": true
        },
        "ownershipRelationships": {
            "type": "one_owner",
            "ownerOccupiedHousing": true
        },
        "energyRelevantInformation": {
            "heatedArea": 185,
            "typeOfHeating": "Radiator + Floor heating",
            "locationHeating": "In the basement"
        }
    },
    "heatingSystem": {
        "systemType": "Natural gas",
        "consumption": 45000,
        "consumptionUnit": "Kilowatt hours (kWh)",
        "constructionYearHeatingSystem": 1995,
        "floorHeatingConnectedToReturnPipe": false,
        "floorHeatingOwnHeatingCircuit": true,
        "floorHeatingOnlyInSmallRooms": false,
        "numberOfFloorHeatingDistributors": 2,
        "numberOfRadiators": 10,
        "domesticHotWaterByHeatpump": true,
        "domesticHotWaterCirculationPump": "yes_and_active",
        "domestic_water_station": "yes"
    },
    "project": {
        "timeline": "Immediately",
        "householdIncome": "more_than_40k_gross",
        "statusOfFoundationConstruction": "Vamo",
        "fullReplacementOfHeatingSystemPlanned": true,
        "additionalDisposal": []
    }
}
```

Response example:
```json

{
    "leadStage": "minimal",
    "dataAcquisitionLink": "some-unique-link",
    "appointmentBookingLink": null,
}
```

# Architecture
### Overview
- Database Layer: Interaction with MongoDB.
- Adapter Layer: Encapsulates all database operations, providing clean interfaces for different entities (e.g., LeadAdapter).
- Service Layer: Implements business logic using the Adapter layer (e.g., LeadService).
- Controller Layer: Handles HTTP requests and responses, delegating to the Service layer (e.g., LeadController).
- Middleware & Pipes: For validation, logging, and error handling (e.g., ZodValidationPipe).

![components](./Architecture.png)

## Potential Improvements
- Apply rate limiting based on public IP to prevent API abuse and enhance security.
- Add unit and end-to-end (E2E) tests to validate the complete application flow across modules.
- Implement centralized error handling for consistent error responses.
- Picture upload feature for leads, allowing users to attach relevant images or documents.
- Implement authentication and authorization mechanisms to secure API endpoints.

## Questions
1. Stage A: 5,000 leads per month

Focus: Speed to market, low cost, simplicity.
Question: Where would you host the frontend and backend?
What database tier would you use? How much would this roughly cost?

Answer:
Hosting & Infrastructure: Railway for both frontend and backend due to its ease of use & quick deployment capabilities. It offers free tiers that can handle low traffic, making them cost-effective for initial stages.

Database: Railway's Pro Plan Features comes with following advantages which would be beneficial:
- Up to 32 GB RAM and 32 vCPU per service, giving significantly more compute capacity than lower tiers.
- Unlimited workspace seats, so multiple developers can collaborate in the same team environment.
- Concurrent global regions, which lets you deploy services in multiple regions at the same time.

Cost: The Railway Pro plan costs $20 per month, which includes $20 of monthly usage credits. This would cover the resource costs for hosting both the frontend and backend services.

2. Stage B: 50,000 leads per month

Focus: Reliability, observability, stability.
Question: What changes (if any) would you make to the infrastructure?
How would you handle monitoring, logging, and backups?

Answer:
Infrastructure Changes: As the lead volume increases, consider upgrading to a more robust hosting solution like AWS or DigitalOcean App Platform. These platforms offer better scalability and reliability for handling increased traffic.

Since we need to use a CRM, & due to high amount of leads, CRM can't be updated in real-time. So, there has to be a job runner service (e.g., using RabbitMQ or AWS SQS) to batch process lead updates to the CRM at regular intervals.

Monitoring, Logging, and Backups:
Monitoring: Implement monitoring using tools like Opentelemetry for logs, metrics, and traces. Prometheus and Grafana could alternatively be used to track application performance metrics, uptime, and resource utilization.

Backups: Set up automated backups for the MongoDB database using managed services like MongoDB Atlas, which provides built-in backup solutions and point-in-time recovery options.

## Use of AI
The high-level architecture, backend server, and monorepo setup were primarily designed and implemented by me. The frontend implementation & type generation was developed with the assistance of AI tools, which were used to speed up development on UI components.