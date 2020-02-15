import path from "path";
import fs from "fs";
import { Container } from "typedi";
import { OrganisationRepository } from "../../lib/storage/organisation.repository";
import { PLATFORM } from "../../lib/domain/platform";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const listFilename = path.resolve(__dirname, "orgs.json");
const listString = fs.readFileSync(listFilename).toString();
const raw = JSON.parse(listString);
const list = raw.data.organisations.nodes;
const addresses = list.map((l: any) => l.address.toLowerCase());

const organisationRepository = Container.get(OrganisationRepository);

async function main() {
  const organisations = await organisationRepository.all(PLATFORM.ARAGON);
  const orgAddresses = organisations.map(org => org.address.toLowerCase());
  const notHandled = addresses.filter((a: string) => !orgAddresses.includes(a));
  console.log("Not handled", notHandled.length, notHandled);
  // for (let h of notHandled) {
  //   await parseOrg(h);
  // }
}

main()
  .then(() => {
    // Do Nothing
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
