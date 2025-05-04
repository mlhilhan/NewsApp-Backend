import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import { INews } from "../../../interfaces/news.interface";
import Comment from "../../comment/models/comment.model";
import Reaction from "../../comment/models/reaction.model";
import Category from "./category.model";
import NewsCategory from "./news-category.model";

@Table({
  tableName: "news",
  timestamps: true,
  underscored: true,
})
export default class News extends Model<INews> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: "image_url",
  })
  imageUrl!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  source!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  author!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  category!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "published_at",
  })
  publishedAt!: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: "external_id",
  })
  externalId!: string;

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
  @HasMany(() => Comment)
  comments!: Comment[];

  @HasMany(() => Reaction)
  reactions!: Reaction[];

  @BelongsToMany(() => Category, () => NewsCategory)
  categories!: Category[];
}
