import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function generatePassword() {
  let newPassword = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  const length = 10;
  for (let i = 0; i < length; i++) {
    newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return newPassword;
}

export function generateRandomID() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

export async function generateUniqueID() {
  let isUnique = false;
  let randomID;
  while (!isUnique) {
    randomID = generateRandomID(); // Đảm bảo hàm này trả về một chuỗi ID
    const userRef = doc(collection(db, 'users'), randomID);
    const docSnapshot = await getDoc(userRef);
    isUnique = !docSnapshot.exists();
  }
  return randomID;
}