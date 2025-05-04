import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { IReaction, ReactionType } from "../../../interfaces/comment.interface";
import User from "../../auth/models/user.model";
import News from "../../news/models/news.model";

@Table({
  tableName: "reactions",
  timestamps: true,
  underscored: true,
})
export default class Reaction extends Model<IReaction> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "user_id",
  })
  userId!: number;

  @ForeignKey(() => News)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "news_id",
  })
  newsId!: number;

  @Column({
    type: DataType.ENUM(...Object.values(ReactionType)),
    allowNull: false,
  })
  type!: ReactionType;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: "created_at",
  })
  createdAt!: Date;

  // İlişkiler
  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => News)
  news!: News;
}
