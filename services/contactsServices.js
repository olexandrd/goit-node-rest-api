import { Contact } from "../models/Contact.js";
// import { db_sync } from "../helpers/db_sync.js";

// db_sync();

async function listContacts() {
  const contacts = await Contact.findAll();
  return [...contacts];
}

async function getContactById(contactId) {
  const contact = await Contact.findAll({ where: { id: contactId } });
  return contact.length ? contact[0] : null;
}

async function removeContact(contactId) {
  const contact = await Contact.findAll({ where: { id: contactId } });
  await Contact.destroy({ where: { id: contactId } });
  return contact.length ? contact[0] : null;
}

async function addContact({ name, email, phone, favorite }) {
  const newContact = await Contact.create({ name, email, phone, favorite });
  await newContact.save();
  return newContact.toJSON();
}

async function updateContact(contactId, { ...data }) {
  await Contact.update(data, { where: { id: contactId } });
  const updatedContact = await Contact.findAll({ where: { id: contactId } });
  return updatedContact.length ? updatedContact[0] : null;
}

async function updateStatusContact(contactId, { favorite }) {
  await Contact.update({ favorite }, { where: { id: contactId } });
  const updatedContact = await Contact.findAll({ where: { id: contactId } });
  return updatedContact.length ? updatedContact[0] : null;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
