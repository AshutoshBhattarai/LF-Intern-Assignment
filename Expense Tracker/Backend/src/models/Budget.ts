import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User";
import Category from "./Category";

@Entity("budgets")
export default class Budget {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  title: string;
  @Column("float")
  amount: number;
  @Column({ name: "start_time" })
  startTime: Date;
  @Column({ name: "end_time" })
  endTime: Date;
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;
  @OneToOne(() => Category, { onDelete: "CASCADE" })
  category: Category;
  @Column({ default: new Date(), name: "created_at" })
  createdAt: Date;
  @Column({ default: new Date(), name: "updated_at" })
  updatedAt: Date;
}
