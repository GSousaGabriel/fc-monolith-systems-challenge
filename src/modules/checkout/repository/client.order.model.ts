import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'client_order',
    timestamps: false,
})
export default class ClientOrder extends Model{

    @PrimaryKey
    @Column({type: DataType.STRING, allowNull: false})
    declare id: string;
    
    @Column({type: DataType.STRING, allowNull: false})
    declare name: string;
    
    @Column({type: DataType.STRING, allowNull: false})
    declare email: string;
    
    @Column({type: DataType.STRING, allowNull: false})
    declare document: string;
}