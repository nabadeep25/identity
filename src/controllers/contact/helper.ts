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

const getFormatedData = (contacts: any[]) => {
  let secondaryIds = contacts.slice(1)?.map((data: any) => data.id) ?? [];
  return {
    contact: {
      primaryContatctId: contacts[0].id,
      emails: getUniqueValue(contacts, "email"),
      phoneNumbers: getUniqueValue(contacts, "phoneNumber"),
      secondaryContactIds: secondaryIds,
    },
  };
};
export { getUniqueValue, getFormatedData };
