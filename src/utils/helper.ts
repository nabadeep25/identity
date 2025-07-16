import { linkPrecedence } from "../common/const";
import Contact from "../models/contact";

export function extractUniqueField<T>(array: T[]):T[] {
  return Array.from(
    new Set(
      array.filter((val)=>val !==null && val!== undefined))
    )
}

const getFormatedData = (contacts: Contact[]) => {
  // handle empty conatcts
  if (!contacts || contacts.length === 0) {
    return {
      primaryContatctId: null,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
    };
  }

  let primaryContactIds: number[] = [];
  let secondaryIds: number[] = [];

  contacts.forEach((contact: Contact) => {
    if (contact.linkPrecedence === linkPrecedence.PRIMARY) {
      primaryContactIds.push(contact.id);
    } else if (contact.linkPrecedence === linkPrecedence.SECONDARY) {
      secondaryIds.push(contact.id);
    }
  });

  return {
    primaryContatctId: primaryContactIds[0],
    emails: extractUniqueField(contacts.map((c) => c.email)),
    phoneNumbers: extractUniqueField(contacts.map((c) => c.phoneNumber)),
    secondaryContactIds: secondaryIds,
  };
};
export { getFormatedData };
