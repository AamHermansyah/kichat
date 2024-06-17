import StegCloak from "stegcloak"

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
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let { secretMessage, password, normalMessage } = params;
      password = !password.length ? process.env.NEXT_PUBLIC_DEFAULT_PASSWORD as string : password;
      const stegcloak = new StegCloak(true, false);

      try {
        const result = stegcloak.hide(secretMessage, password, normalMessage);
        resolve(result);
      } catch (error) {
        reject('Pesan biasa minimal 2 kata');
      }
    }, 1000);
  });
};

export const revealSecretMessage = (params: RevealSecretMessageParams): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let { password, message } = params;
      password = !password.length ? process.env.NEXT_PUBLIC_DEFAULT_PASSWORD as string : password;
      const stegcloak = new StegCloak(true, false);

      try {
        const result = stegcloak.reveal(message, password);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, 2000);
  });
};