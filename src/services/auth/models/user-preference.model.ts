import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { IUserPreference } from "../../../interfaces/auth.interface";
import User from "./user.model";

@Table({
  tableName: "user_preferences",
  timestamps: true,
  underscored: true,
})
export default class UserPreference extends Model<IUserPreference> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  userId!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  notificationEnabled!: boolean;

  @Column({
    type: DataType.STRING(20),
    defaultValue: "light",
  })
  theme!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  preferredCategories!: string[];

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;

  // İlişkiler
  @BelongsTo(() => User)
  user!: User;
}
