import { DataTypes } from "sequelize";
import sequelize from "../common/sequelize/connect.sequelize.js";

const binhLuanModel = sequelize.define(
  "binh_luan",
  {
    binh_luan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nguoi_dung_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "nguoi_dung_id", //khóa chính của bảng nguoi_dung
        model: "nguoi_dung", // tên bảng tham chiếu
      }
    },
    hinh_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "hinh_id",
        model: "hinh_anh"
      }
    },
    ngay_binh_luan: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    noi_dung: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN, // chỉ bao gồm 2 giá trị là 0 và 1 tương ứng với false và true
      allowNull: false,
      defaultValue: 0,
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      ),
    },

  },
  {
    tableName: "binh_luan",
    timestamps: false,
  }
  , { tableName: "binh_luan" });
export default binhLuanModel;