import { Request, Response } from "express";
import { getFormatedData } from "./helper";
import {
  createContact,
  getAllRelatedContacts,
  getContactsByEmailOrPhone,
} from "../../services/contact";
import Contact from "../../models/contact";
import { linkPrecedence } from "../../config/const";

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

    if (existingContacts.length === 0) {
      // No existing contact, create new primary
      primary = await createContact(email, phoneNumber, linkPrecedence.PRIMARY);

      return res.status(200).json({
        contact: getFormatedData([primary]),
      });
    } else {
      primary = existingContacts.filter(
        (contact) => contact.linkPrecedence === linkPrecedence.PRIMARY
      )[0];

      const exactMatch = existingContacts.some(
        (c) => c.email === email && c.phoneNumber === phoneNumber
      );

      if (!exactMatch) {
        // Create secondary contact
        await createContact(
          email,
          phoneNumber,
          linkPrecedence.SECONDARY,
          primary.id
        );
       
      }
    }
    const allContacts = await getAllRelatedContacts(primary.id);

    const formatedData = getFormatedData(allContacts);

    res.json({
      contact: formatedData,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error?.message ?? "INTERNAL SERVER ERROR",
    });
  }
};

export { identifyContact };
