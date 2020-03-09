export enum APP_ID {
  SHARE = "ds:share",
  ARAGON_TOKEN_CONTROLLER = "0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f",
  ARAGON_VAULT = "0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1",
  ARAGON_FINANCE = "0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae",
  ARAGON_VOTING = "0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4",
  ARAGON_APPLICATION_REGISTRY = "0xddbcfd564f642ab5627cf68b9b7d374fb4f8a36e941a75d89c87998cef03bd61",
  ARAGON_ACL = "0xe3262375f45a6e2026b7e7b18c2b807434f2508fe1a2a3dfb493c7df8f4aad6a",
  MOLOCH_1_BANK = "ds:m1:bank"
}

export enum APP_NAME {
  TOKEN_MANAGER = "Token Manager",
  VOTING = "Voting",
  FINANCE = "Finance",
  GUILD_BANK = "Guild Bank",
  VAULT = "Vault",
  APPLICATION_REGISTRY = "EVM Script Registry",
  ACL = "Access Control List",
  UNKNOWN = "Unknown",
  SHARES = "Shares"
}

export const APP_ID_TO_NAME = Object.freeze(
  new Map<APP_ID, APP_NAME>([
    [APP_ID.ARAGON_TOKEN_CONTROLLER, APP_NAME.TOKEN_MANAGER],
    [APP_ID.ARAGON_FINANCE, APP_NAME.FINANCE],
    [APP_ID.ARAGON_VAULT, APP_NAME.VAULT],
    [APP_ID.ARAGON_VOTING, APP_NAME.VOTING],
    [APP_ID.ARAGON_APPLICATION_REGISTRY, APP_NAME.APPLICATION_REGISTRY],
    [APP_ID.ARAGON_ACL, APP_NAME.ACL],
    [APP_ID.MOLOCH_1_BANK, APP_NAME.GUILD_BANK],
    [APP_ID.SHARE, APP_NAME.SHARES]
  ])
);

export async function applicationNameById(someAppId: string) {
  const appId = someAppId as APP_ID;
  const found = APP_ID_TO_NAME.get(appId);
  if (found) {
    return found;
  } else {
    return APP_NAME.UNKNOWN;
  }
}
