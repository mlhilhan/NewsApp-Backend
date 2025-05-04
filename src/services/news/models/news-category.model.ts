import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { INewsCategory } from "../../../interfaces/news.interface";
import News from "./news.model";
import Category from "./category.model";

@Table({
  tableName: "news_categories",
  timestamps: false,
})
export default class NewsCategory extends Model<INewsCategory> {
  @ForeignKey(() => News)
  @Column({
    field: "news_id",
    type: DataType.INTEGER,
    primaryKey: true,
  })
  newsId!: number;

  @ForeignKey(() => Category)
  @Column({
    field: "category_id",
    type: DataType.INTEGER,
    primaryKey: true,
  })
  categoryId!: number;
}
