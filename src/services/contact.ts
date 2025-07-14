
import Contact from "../models/contact";
import { Op } from "sequelize";

const getContactsByEmailOrPhone = (
  email: string | null,
  phoneNumber: string | null
) => {
  return Contact.findAll({
    where: {
      [Op.or]: [{ email }, { phoneNumber }]
    },
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
