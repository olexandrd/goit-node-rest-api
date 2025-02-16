import { Contact, sequelize } from "../models/contacts.js";

sequelize.authenticate().then(() => {
  console.log("Connection to DB has been established successfully.");
  Contact.sync();
  console.log("Contact modes was synchronized successfully.");
});

async function listContacts() {
  const contacts = await Contact.findAll();
  return [...contacts];
}

async function getContactById(contactId) {
  const contact = await Contact.findAll({ where: { id: contactId } });
  return contact || null;
}

async function removeContact(contactId) {
  const contact = await Contact.findAll({ where: { id: contactId } });
  await Contact.destroy({ where: { id: contactId } });
  return contact.length ? contact[0] : null;
}

async function addContact({ name, email, phone }) {
  const newContact = await Contact.create({ name, email, phone });
  await newContact.save();
  return newContact.toJSON();
}

async function updateContact(contactId, { ...data }) {
  await Contact.update(data, { where: { id: contactId } });
  const updatedContact = await Contact.findAll({ where: { id: contactId } });
  return updatedContact.length ? updatedContact[0] : null;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
