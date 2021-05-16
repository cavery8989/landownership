#!/usr/bin/env node
import { companies } from "./data/repo/companies";
import { landRegister } from "./data/repo/landRegister";
import { generateReport } from "./domain";

import { app } from "./app";

const companyRepo = companies("./data/company_relations.csv");
const landRepo = landRegister("./data/land_ownership.csv");

app(generateReport(companyRepo, landRepo)).start();
