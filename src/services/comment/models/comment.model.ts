import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { IComment } from "../../../interfaces/comment.interface";
import User from "../../auth/models/user.model";
import News from "../../news/models/news.model";

@Table({
  tableName: "comments",
  timestamps: true,
  underscored: true,
})
export default class Comment extends Model<IComment> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

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
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: "created_at",
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: "updated_at",
  })
  updatedAt!: Date;

  // İlişkiler
  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => News)
  news!: News;
}
