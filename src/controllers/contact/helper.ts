import { linkPrecedence } from "../../config/const";
import Contact from "../../models/contact";

const getUniqueValue = (arr: any[], key: string) => {
  let map = new Map();
  return arr.reduce((acc, value) => {
    if (!map.has(value[key])) {
      map.set(value[key], 1);
      acc.push(value[key]);
    }
    return acc;
  }, []);
};



const getFormatedData = (contacts: Contact[]) => {
  let secondaryIds = contacts.filter(c => c.linkPrecedence === linkPrecedence.SECONDARY)?.map((data: any) => data.id) ?? [];

  return {
      primaryContatctId: contacts[0].id,
      emails: getUniqueValue(contacts, "email"),
      phoneNumbers: getUniqueValue(contacts, "phoneNumber"),
      secondaryContactIds: secondaryIds,
    
  };
};
export { getFormatedData };
