import {Table, Model, PrimaryKey, Column, HasMany, ForeignKey, BelongsTo, DataType } from "sequelize-typescript";
import ClientOrder from "./client.order.model";
import ProductOrder from "./product.order.model";

@Table({
    tableName: 'orders',
    timestamps: false
})
export default class OrderModel extends Model{

    @PrimaryKey
    @Column({type: DataType.STRING, allowNull: false})
    declare id: string;

    @ForeignKey(() => ClientOrder)
    declare clientId: string;

    @BelongsTo(() => ClientOrder)
    declare client: ClientOrder;

    @HasMany(() => ProductOrder, {onUpdate: 'CASCADE'})
    declare products?: ProductOrder[];
}