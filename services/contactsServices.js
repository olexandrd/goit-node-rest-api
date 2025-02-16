import { promises as fs } from "node:fs";
import { join } from "node:path";
import { uid } from "uid";

const contactsPath = join(process.cwd(), "db", "contacts.json");

async function writeToFile(data) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file ", contactsPath);
  }
}

async function readFromFile() {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file ", contactsPath);
    return [];
  }
}

async function listContacts() {
  const contacts = await readFromFile();
  return [...contacts];
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);
  if (idx === -1) {
    return null;
  }
  const [contact] = contacts.splice(idx, 1);
  await writeToFile(contacts);
  return contact;
}

async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContact = { id: uid(), name, email, phone };
  contacts.push(newContact);
  await writeToFile(contacts);
  return newContact;
}

async function updateContact(contactId, { ...data }) {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);
  if (idx === -1) {
    return null;
  }
  const updatedContact = { ...contacts[idx] };
  for (const key in data) {
    if (data[key] !== undefined) {
      updatedContact[key] = data[key];
    }
  }
  contacts[idx] = { ...contacts[idx], ...updatedContact };
  await writeToFile(contacts);
  return updatedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
