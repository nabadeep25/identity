import { Request, Response } from "express";
import { getFormatedData } from "./helper";
import {
  getAllRelatedContactId,
  getByEmailAndPhone,
  getByEmailOrPhone,
  insertContact,
  updateContact,
} from "../../services/contact";
import { linkPrecedence } from "../../config/const";

const identifyContact = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;
    let data: any;
    let completeContact: any[] = [];
    if (email && phoneNumber) {
      completeContact = await getByEmailAndPhone(email, phoneNumber);
    }
    if (!email || !phoneNumber || !completeContact.length) {
      let incompleteContact: any[] = [];
      if (!completeContact?.length)
        incompleteContact = await getByEmailOrPhone(email, phoneNumber);

      if (!incompleteContact?.length) {
        //  if there are no existing contacts against an incoming request
        const [contact] = await insertContact(
          email,
          phoneNumber,
          linkPrecedence.PRIMARY
        );
        let data = {
          primaryContatctId: contact.id,
          emails: contact.email,
          phoneNumbers: contact.phoneNumber,
          secondaryContactIds: [],
        };
        return res.status(201).json({contacts: data});
      }

      // if request contain new information
      let isEmailPresent = false;
      let isPhonePresent = false;
      incompleteContact?.forEach((contact: any) => {
        if (contact?.email == email) {
          isEmailPresent = true;
        } else if (contact?.phoneNumber == phoneNumber) {
          isPhonePresent = true;
        }
      });

      let idsToBeUpadated: number[] = [];
      if (isEmailPresent && isPhonePresent) {
        incompleteContact?.slice(1).forEach((contact: any) => {
          if (contact?.linkPrecedence == linkPrecedence.PRIMARY) {
            idsToBeUpadated.push(contact.id);
          }
        });

        if (idsToBeUpadated.length) {
          let r = await updateContact(
            { linkPrecedence: linkPrecedence.SECONDARY },
            idsToBeUpadated
          );
        }
      } else if (email && phoneNumber) {
        await insertContact(email, phoneNumber, linkPrecedence.SECONDARY);
      }
    }

    let contacts = await getAllRelatedContactId(email, phoneNumber);

    data = getFormatedData(contacts);

    return res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error?.message ?? "INTERNAL SERVER ERROR",
    });
  }
};

export { identifyContact };
