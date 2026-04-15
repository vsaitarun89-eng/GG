import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

export default function useEncryption() {
  const [keys, setKeys] = useState(null);

  useEffect(() => {
    async function loadKeys() {
      try {
        const storedSecret = await AsyncStorage.getItem('gainGrid_secretKey');
        const storedPublic = await AsyncStorage.getItem('gainGrid_publicKey');

        if (storedSecret && storedPublic) {
          setKeys({
            publicKey: new Uint8Array(JSON.parse(storedPublic)),
            secretKey: new Uint8Array(JSON.parse(storedSecret))
          });
        } else {
          const newKeys = nacl.box.keyPair();
          await AsyncStorage.setItem('gainGrid_secretKey', JSON.stringify(Array.from(newKeys.secretKey)));
          await AsyncStorage.setItem('gainGrid_publicKey', JSON.stringify(Array.from(newKeys.publicKey)));
          setKeys(newKeys);
        }
      } catch (err) {
        console.error('Failed to initialize encryption keys:', err);
      }
    }
    loadKeys();
  }, []);

  const encryptMessage = (message, recipientPublicKey) => {
    if (!keys || !recipientPublicKey) return null;
    try {
      const nonce = nacl.randomBytes(24);
      const messageUint8 = naclUtil.decodeUTF8(message);
      const encrypted = nacl.box(messageUint8, nonce, recipientPublicKey, keys.secretKey);
      
      return {
        nonce: naclUtil.encodeBase64(nonce),
        ciphertext: naclUtil.encodeBase64(encrypted)
      };
    } catch (err) {
      console.error('Encryption failed:', err);
      return null;
    }
  };

  const decryptMessage = (encryptedData, senderPublicKey) => {
    if (!keys || !senderPublicKey) return null;
    try {
      const nonce = naclUtil.decodeBase64(encryptedData.nonce);
      const ciphertext = naclUtil.decodeBase64(encryptedData.ciphertext);
      const decrypted = nacl.box.open(ciphertext, nonce, senderPublicKey, keys.secretKey);
      
      if (!decrypted) return null;
      return naclUtil.encodeUTF8(decrypted);
    } catch (e) {
      console.error("Decryption failed", e);
      return null;
    }
  };

  const generateDummyKeyPair = () => {
    return nacl.box.keyPair();
  };

  return { keys, encryptMessage, decryptMessage, generateDummyKeyPair };
}
