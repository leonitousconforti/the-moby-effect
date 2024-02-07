import * as core from "@actions/core";
import * as uuid from "uuid";

const serviceIdentifier = uuid.v4();
core.setOutput("service-identifier", serviceIdentifier);
