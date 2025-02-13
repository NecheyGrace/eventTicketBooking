import { openDB } from "idb";

const DB_NAME = "conferenceTicketDB";
const STORE_NAME = "formData";

export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
  return db;
};

export const saveFormData = async (data) => {
  const db = await initDB();
  await db.put(STORE_NAME, data, "currentForm");
};

export const getFormData = async () => {
  const db = await initDB();
  return await db.get(STORE_NAME, "currentForm");
};
