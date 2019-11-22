import * as AWS from "aws-sdk";

export interface InfuraCredentials {
  PROJECT_ID: string;
  SECRET: string;
}

export class SecretsService {
  private readonly client: AWS.SecretsManager;

  constructor() {
    this.client = new AWS.SecretsManager();
  }

  read<A>(name: string): Promise<A> {
    return new Promise((resolve, reject) => {
      this.client.getSecretValue({ SecretId: name }, (err, data) => {
        if (err) {
          if (err.code === "DecryptionFailureException")
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            reject(err);
          else if (err.code === "InternalServiceErrorException")
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            reject(err);
          else if (err.code === "InvalidParameterException")
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            reject(err);
          else if (err.code === "InvalidRequestException")
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            reject(err);
          else if (err.code === "ResourceNotFoundException")
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            reject(err);
        } else {
          // Decrypts secret using the associated KMS CMK.
          // Depending on whether the secret is a string or binary, one of these fields will be populated.
          if (data.SecretString) {
            resolve(JSON.parse(data.SecretString));
          } else {
            reject(new Error("Expected SecretString"));
            // let buff = Buffer.from(data.SecretBinary as string, 'base64');
            // resolve(buff.toString('ascii'));
          }
        }
      });
    });
  }
}
