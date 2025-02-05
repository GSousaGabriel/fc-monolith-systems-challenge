import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "clients",
    timestamps: false
})
export default class ClientModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    email: string;

    @Column({ type: DataType.NUMBER, allowNull: false })
    address: string;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;
}