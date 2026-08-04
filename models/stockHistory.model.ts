import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStockHistory extends Document {
    symbol: string;
    date: string; // YYYY-MM-DD
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    trades?: number;
}

const StockHistorySchema = new Schema<IStockHistory>(
    {
        symbol: { type: String, required: true, index: true },
        date: { type: String, required: true },
        open: { type: Number, required: true },
        high: { type: Number, required: true },
        low: { type: Number, required: true },
        close: { type: Number, required: true },
        volume: { type: Number, required: true },
        trades: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Prevent duplicate entries for the same symbol and date
StockHistorySchema.index({ symbol: 1, date: 1 }, { unique: true });

const StockHistory: Model<IStockHistory> =
    mongoose.models.StockHistory || mongoose.model<IStockHistory>('StockHistory', StockHistorySchema);

export default StockHistory;