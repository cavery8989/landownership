# Land ownership
## Description
Cli tool that returns a report land owned by a company and its subsidiaries.
## Architecture
Apps entry point is main.ts where dependencies are set up and injected into their services.

Main business logic lives in domain.ts within the generateReport function. Business logic defines and exports contracts for its dependencies meaning implementations can be swapped out with out the need for updates to the business logic itself. 

The gererateReport service is passed into the app function exported from app.ts where the UI is handled.

Data is loaded in using the dataloaders which pass their output into the repos that handle the
the querying of the data sources.

## Data
Csv data is loaded into memory using a read stream that pipes its output through the readline module where it's aggregated into a more useful format. This approach was taken as the files are quite large so the aggregation can take place loading in all the data and then mapping over it would have blocked the event loop for a considerable amount of time. Doing it this way means files can be loaded in the background allowing the business logic to still take place. For example, allowing us to handle a non-existent company without having to wait for the land_ownership file to finish processing.

The **company relationship** data is aggregated to the format 
```ts
{
  [companyId]: {name: string, subsidiaries: [...subsidiaryIds]}
};
```
This allows for the companies to be accessed with only one iteration over the data and for the ids we needed to work out who owns who to be directly accessible as well.

The **land ownership** data is aggregated to the format
```ts
{
  [companyId]: [...landIds]
};
```
Again this allows us to directly access the list of land each company owns with only one initial iteration.


## Get started
```sh
npm i
npm start <companyId>
```



