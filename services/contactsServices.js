import { Contact } from "../models/Contact.js";
// import { db_sync } from "../helpers/db_sync.js";

// db_sync();

async function listContacts(query, pagination) {
  const { limit, page } = pagination;
  const offset = (page - 1) * limit || 0;
  const contacts = await Contact.findAll({ where: query, offset, limit });
  return [...contacts];
}

async function getContact(query) {
  const { id, owner } = query;
  const contact = await Contact.findOne({ where: { id, owner } });
  return contact || null;
}

async function removeContact(query) {
  const contact = await getContact(query);
  if (!contact) {
    return null;
  }
  const destroyedContact = contact.toJSON();
  await contact.destroy();
  return destroyedContact;
}

async function addContact(query) {
  const { name, email, phone, favorite, owner } = query;
  const newContact = await Contact.create({
    name,
    email,
    phone,
    favorite,
    owner,
  });
  await newContact.save();
  return newContact.toJSON();
}

async function updateContact(query, { ...data }) {
  const contact = await getContact(query);
  if (!contact) {
    return null;
  }
  await contact.update(data);
  return contact.toJSON();
}

async function updateStatusContact(query, { favorite }) {
  const contact = await getContact(query);
  if (!contact) {
    return null;
  }
  await contact.update({ favorite });
  return contact.toJSON();
}

export default {
  listContacts,
  getContact,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
