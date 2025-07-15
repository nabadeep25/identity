import { Request, Response } from "express";
import { getFormatedData } from "../utils/helper";
import {
  createContact,
  getAllRelatedContacts,
  getContactsByEmailOrPhone,
  updateContactById,
} from "../services/contact";
import Contact from "../models/contact";
import { linkPrecedence } from "../common/const";
import logger from "../utils/logger";

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

    let firstContact: Contact;

    logger.info("Number of existing contacts found:", existingContacts.length);

    if (existingContacts.length === 0) {
      //1. Requirement1:  No existing contact, create new primary
      const newContact = await createContact(
        email,
        phoneNumber,
        linkPrecedence.PRIMARY
      );

      return res.status(200).json({
        contact: getFormatedData([newContact]),
      });
    } else {
      firstContact = existingContacts[0];
      const exactMatch = existingContacts.some(
        (c) => c.email === email && c.phoneNumber === phoneNumber
      );

      logger.info("Exact match found:", exactMatch);

      if (!exactMatch) {
        const existContactByEmail = existingContacts.find(
          (c) => c.email === email
        );
        logger.info("Existing contactId by email:", existContactByEmail?.id);
        const existContactByPhone = existingContacts.find(
          (c) => c.phoneNumber === phoneNumber
        );
        logger.info("Existing contactId by phone:", existContactByPhone?.id);

        if (existContactByEmail && existContactByPhone) {
          // if both contact are primary, make the recent one secondary
          let oldestContact: Contact = existContactByEmail;
          let recentContact: Contact = existContactByPhone;
          if (existContactByEmail.createdAt > existContactByPhone.createdAt) {
            recentContact = existContactByEmail;
            oldestContact = existContactByPhone;
          }
          // Keep oldest record as primary
          await updateContactById(recentContact.id, {
            linkPrecedence: linkPrecedence.SECONDARY,
            linkedId: oldestContact.id,
          });
          logger.info(`Updated conactId ${recentContact.id} to secondary`);
        } else if (email && phoneNumber) {
          // Create secondary contact
          logger.info("Creating secondary contact");
          await createContact(
            email,
            phoneNumber,
            linkPrecedence.SECONDARY,
            firstContact.id
          );
        }
      }
    }
    const primaryContactId =
      firstContact.linkPrecedence === linkPrecedence.PRIMARY
        ? firstContact.id
        : (firstContact.linkedId as number);
    const allContacts = await getAllRelatedContacts(primaryContactId);

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
