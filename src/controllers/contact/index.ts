import { Request, Response } from "express";
import { getFormatedData } from "./helper";
import {
  createContact,
  getAllRelatedContacts,
  getContactsByEmailOrPhone,
  updateContactById,
} from "../../services/contact";
import Contact from "../../models/contact";
import { linkPrecedence } from "../../config/const";
import logger from "../../utils/logger";

const identifyContact = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ error: "email or phoneNumber required" });
    }

    const existingContacts = await getContactsByEmailOrPhone(
      email,
      phoneNumber
    );

    let primary: Contact;

    logger.info("Existing contacts found:", JSON.stringify(existingContacts, null, 2));

    if (existingContacts.length === 0) {
      // No existing contact, create new primary
      primary = await createContact(email, phoneNumber, linkPrecedence.PRIMARY);

      return res.status(200).json({
        contact: getFormatedData([primary]),
      });
    } else {
      primary = existingContacts.filter(
        (contact) => contact.linkPrecedence === linkPrecedence.PRIMARY
      )[0] ?? existingContacts[0];

      logger.info("Primary contact found:", JSON.stringify(primary, null, 2));

      const exactMatch = existingContacts.some(
        (c) => c.email === email && c.phoneNumber === phoneNumber
      );

      logger.info("Exact match found:", exactMatch);

      if (!exactMatch) {
        const existContactByEmail = existingContacts.find(
          (c) => c.email === email
        );
        logger.info("Existing contact by email:", existContactByEmail);
        const existContactByPhone = existingContacts.find(
          (c) => c.phoneNumber === phoneNumber
        );
        logger.info("Existing contact by phone:", existContactByPhone);

        if (existContactByEmail && existContactByPhone) {
          // if both contact are primary, make the recent one secondary
          const mostRecentContact =
            existContactByEmail.createdAt > existContactByPhone.createdAt
              ? existContactByEmail
              : existContactByPhone;
          logger.info("Most recent contact:", JSON.stringify(mostRecentContact, null, 2));
          await updateContactById(mostRecentContact.id, {
            linkPrecedence: linkPrecedence.SECONDARY,
          });
        } else if(email && phoneNumber){
          // Create secondary contact with new details
          logger.info("Creating secondary contact with email:", email, "and phoneNumber:", phoneNumber);
          await createContact(
            email,
            phoneNumber,
            linkPrecedence.SECONDARY,
            primary.id
          );
        }
      }
    }
    const allContacts = await getAllRelatedContacts(primary.id);

    const formatedData = getFormatedData(allContacts);

    res.json({
      contact: formatedData,
    });
  } catch (error: any) {
    logger.error("Error identifying contact:", error);
    res.status(500).json({
      error: true,
      message: error?.message ?? "INTERNAL SERVER ERROR",
    });
  }
};

export { identifyContact };
