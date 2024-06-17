"use strict";

const R = require("ramda");

const { encrypt: encryptAPI, decrypt } = require("./components/encrypt");
const { compress, decompress, zwcHuffMan } = require("./components/compact");
const { zwcOperations, embed } = require("./components/message");
const { byteToBin, compliment } = require("./components/util");

const zwc = ["‌", "‍", "⁡", "⁢", "⁣", "⁤"]; // 200c,200d,2061,2062,2063,2064 Where the magic happens!

const hide = ({ message, password, cover = "This is a confidential text", encrypt = true, integrity = false }) => {
  return new Promise(async (resolve, reject) => {
    if (cover.split(" ").length === 1) {
      return reject("Minimum two words required");
    }

    const {
      toConceal,
      toConcealHmac,
      noCrypt,
    } = zwcOperations(zwc);

    const { shrink } = zwcHuffMan(zwc);

    const prepareSecret = R.pipe(compress, compliment);
    const embedSecret = (cover, invisibleStream) => embed(cover, invisibleStream);
    const createInvisibleStream = (payload, integrity, crypt) => R.pipe(
      byteToBin,
      integrity && crypt ? toConcealHmac : crypt ? toConceal : noCrypt,
      shrink
    )(payload);

    try {
      const secret = prepareSecret(message);
      const payload = encrypt ? encryptAPI({ password, data: secret, integrity }) : secret;
      const invisibleStream = createInvisibleStream(payload, integrity, encrypt);
      const result = embedSecret(cover, invisibleStream);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const reveal = ({ secret, password }) => {
  return new Promise((resolve, reject) => {
    const {
      concealToData,
      detach,
    } = zwcOperations(zwc);

    const { expand } = zwcHuffMan(zwc);

    const extractData = R.pipe(detach, expand, concealToData);
    const processDecryption = (decryptStream) => R.pipe(compliment, decompress)(decryptStream);

    try {
      const { data, integrity, encrypt } = extractData(secret);
      const decryptStream = encrypt ? decrypt({ password, data, integrity }) : data;
      const result = processDecryption(decryptStream);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

// Exporting functions
module.exports = {
  zwc,
  hide,
  reveal
};
