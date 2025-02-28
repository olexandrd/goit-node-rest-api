import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const { id: owner } = req.user;
  const pagination = {
    limit: req.query.limit,
    page: req.query.page,
  };

  const contacts = await contactsService.listContacts({ owner }, pagination);
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const contact = await contactsService.getContact({
    id: req.params.id,
    owner: req.user.id,
  });
  if (contact) {
    res.json(contact);
  } else {
    throw HttpError(404, `Contact with id ${req.params.id} Not found`);
  }
};

export const deleteContact = async (req, res) => {
  const contact = await contactsService.removeContact({
    id: req.params.id,
    owner: req.user.id,
  });
  if (contact) {
    res.json(contact);
  } else {
    throw HttpError(404, `Contact with id ${req.params.id} Not found`);
  }
};

export const createContact = async (req, res) => {
  const { id: owner } = req.user;
  const newContact = await contactsService.addContact({ ...req.body, owner });
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const updatedContact = await contactsService.updateContact(
    { id: req.params.id, owner: req.user.id },
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
    { id: req.params.id, owner: req.user.id },
    req.body
  );
  if (updatedContact) {
    res.json(updatedContact);
  } else {
    throw HttpError(404, `Contact with id ${req.params.id} Not found`);
  }
};
