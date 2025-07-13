
import db from "../db/connection";

const getByEmailAndPhone = (email: string, phoneNumber: string) => {
  return db("contacts")
    .select()
    .where({ email, phoneNumber })
    .orderBy("createdAt");
};

const getByEmailOrPhone = (
  email: string | null,
  phoneNumber: string | null
) => {
  return db("contacts").select().where({ email }).orWhere({ phoneNumber }).orderBy("createdAt");
};

const insertContact = (
  email: string,
  phoneNumber: string,
  linkPrecedence: string
) => {
  return db("contacts")
    .insert({
      email,
      phoneNumber,
      linkPrecedence,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning("*");
};

const updateContact = (data: any, ids: number[]) => {
  return db("contacts").update(data).whereIn("id", ids).returning("*");
};

const getAllRelatedContactId = async(
  email: string | null,
  phoneNumber: string | null
) => {
 let resut=await db
  .withRecursive("results", (qb) => {
    qb.select("id", "linkedId","phoneNumber","email")
      .from("contacts")
      .where({ phoneNumber })
      .orWhere({ email })
      .unionAll((qb) => {
        qb.select("contacts.id", "contacts.linkedId","contacts.phoneNumber","contacts.email")
          .from("contacts")
          .join("results","results.linkedId", "contacts.id")
   
          .whereNot(db.ref("contacts.id"), "=", db.ref("results.id"));
      });
  })
    .select("id","phoneNumber","email")
    .from("results");

   
    return db("contacts").select().where(function() {
        this.whereIn('id',resut.map(data=>data.id))
        if(!email)
        this.orWhereIn('email',resut.map(data=>data.email))
        if(!phoneNumber)
        this.orWhereIn('phoneNumber',resut.map(data=>data.phoneNumber))
    }).orderBy("createdAt");
};


export {
  getByEmailAndPhone,
  getByEmailOrPhone,
  insertContact,
  updateContact,
  getAllRelatedContactId
};
