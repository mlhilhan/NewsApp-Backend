import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  HasOne,
} from "sequelize-typescript";
import bcrypt from "bcrypt";
import { IUser } from "../../../interfaces/auth.interface";
import UserPreference from "./user-preference.model";

@Table({
  tableName: "users",
  timestamps: true,
  underscored: true,
})
export default class User extends Model<IUser> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 50],
    },
  })
  username!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING(20),
    defaultValue: "user",
  })
  role!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;

  // İlişkiler
  @HasOne(() => UserPreference)
  preference!: UserPreference;

  // Password hash'leme hook'u
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  // Password karşılaştırma metodu
  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  // Kullanıcıyı JSON olarak döndürürken password alanını çıkar
  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    delete values.password;
    return values;
  }
}
