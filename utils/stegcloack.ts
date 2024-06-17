import { hide, reveal } from "./stegcloack/stegcloak"

type HideSecretMessageParams = {
  normalMessage: string;
  password: string;
  secretMessage: string;
}

type RevealSecretMessageParams = {
  message: string;
  password: string;
}

export const hideSecretMessage = (params: HideSecretMessageParams): Promise<string> => {
  const { secretMessage, password, normalMessage } = params;
  return hide({
    message: secretMessage,
    password,
    cover: normalMessage,
    encrypt: true,
    integrity: false
  });
};

export const revealSecretMessage = (params: RevealSecretMessageParams): Promise<string> => {
  const { password, message } = params;

  return reveal({
    password,
    secret: message
  });
};