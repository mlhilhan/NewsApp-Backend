import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import { ICategory } from "../../../interfaces/news.interface";
import News from "./news.model";
import NewsCategory from "./news-category.model";

@Table({
  tableName: "categories",
  timestamps: true,
  underscored: true,
})
export default class Category extends Model<ICategory> {
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
    },
  })
  name!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  slug!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: "created_at",
  })
  createdAt!: Date;

  // İlişkiler
  @BelongsToMany(() => News, () => NewsCategory)
  news!: News[];
}
