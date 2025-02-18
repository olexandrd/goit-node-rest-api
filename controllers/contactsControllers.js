import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const contact = await contactsService.getContactById(req.params.id);
  if (contact) {
    res.json(contact);
  } else {
    throw HttpError(404, `Contact with id ${req.params.id} Not found`);
  }
};

export const deleteContact = async (req, res) => {
  const contact = await contactsService.removeContact(req.params.id);
  if (contact) {
    res.json(contact);
  } else {
    throw HttpError(404, `Contact with id ${req.params.id} Not found`);
  }
};

export const createContact = async (req, res) => {
  const newContact = await contactsService.addContact(req.body);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const updatedContact = await contactsService.updateContact(
    req.params.id,
    req.body
  );
  if (updatedContact) {
    res.json(updatedContact);
  } else {
    throw HttpError(404, `Contact with id ${req.params.id} Not found`);
  }
};

export const updateStatusContact = async (req, res) => {
  const updatedContact = await contactsService.updateStatusContact(
    req.params.id,
    req.body
  );
  if (updatedContact) {
    res.json(updatedContact);
  } else {
    throw HttpError(404, `Contact with id ${req.params.id} Not found`);
  }
};
