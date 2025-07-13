import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/connection'; 


class Contact extends Model {
  public id!: number;
  public phoneNumber?: string;
  public email?: string;
  public linkedId?: number;
  public linkPrecedence!: 'primary' | 'secondary';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Contact.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    phoneNumber: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    linkedId: { type: DataTypes.INTEGER },
    linkPrecedence: {
      type: DataTypes.ENUM('primary', 'secondary'),
      allowNull: false,
      defaultValue: 'primary',
    },
  },
  {
    sequelize,
    modelName: 'Contact',
    paranoid: true, // for deletedAt
    timestamps: true, // for createdAt and updatedAt
  }
);

export default Contact;
