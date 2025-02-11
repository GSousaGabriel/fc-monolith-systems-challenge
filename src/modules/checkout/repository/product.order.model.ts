import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";
import InvoiceModel from "../../Invoice/repository/invoice.model";

@Table({
    tableName: 'products_order',
    timestamps: false
})
export default class ProductOrder extends Model{

    @PrimaryKey
    @Column({type: DataType.STRING, allowNull: false})
    declare id: string;

    @Column({type: DataType.STRING, allowNull: false})
    declare name: string;

    @Column({type: DataType.STRING, allowNull: true})
    declare description: string;

    @Column({type: DataType.NUMBER, allowNull: true})
    declare purchasePrice: number;

    @Column({type: DataType.NUMBER, allowNull: true})
    declare salesPrice: number;

    @Column({type: DataType.NUMBER, allowNull: true})
    declare stock: number;

    @Column({type: DataType.DATE, allowNull: true})
    declare createAt: Date;

    @Column({type: DataType.DATE, allowNull: true})
    declare updateAt: Date;

    @ForeignKey(() => InvoiceModel)
    declare invoice_id: string;

    @ForeignKey(() => OrderModel)
    declare order_id: string;

}