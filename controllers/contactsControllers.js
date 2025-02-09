import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const contact = await contactsService.getContactById(req.params.id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const deleteContact = async (req, res) => {
  const contact = await contactsService.removeContact(req.params.id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};
