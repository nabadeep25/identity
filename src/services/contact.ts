
import Contact from "../models/contact";
import { Op } from "sequelize";

const getContactsByEmailOrPhone = (
  email?: string,
  phoneNumber?: string
) => {
  const conditions: any[] = [];

  if (email) conditions.push({ email });
  if (phoneNumber) conditions.push({ phoneNumber });

  const where = conditions.length > 0 ? { [Op.or]: conditions } : {};

  return Contact.findAll({
    where,
    order: [["createdAt", "ASC"]]
  });
};

const createContact = (
  email: string,
  phoneNumber: string,
  linkPrecedence: string,
  linkedId?: number
) => {
  return Contact.create({
    email,
    phoneNumber,
    linkPrecedence,
    linkedId
  });
};

const updateContactById = (
  id: number,
  payload: Partial<Contact>
) => {
  return Contact.update(payload, {
    where: { id },
    returning: true
  })
}

const getAllRelatedContacts = (primaryId: number) => {
  return Contact.findAll({
    where: {
      [Op.or]: [{ id: primaryId }, { linkedId: primaryId }]
    },
    order: [["createdAt", "ASC"]]
  });
};




export {
  getContactsByEmailOrPhone,
  createContact,
  getAllRelatedContacts,
  updateContactById
};
