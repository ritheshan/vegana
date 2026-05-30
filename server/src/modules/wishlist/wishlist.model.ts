import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlist extends Document {
  customerId: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  },
  { timestamps: true }
);

wishlistSchema.index({ customerId: 1, tripId: 1 }, { unique: true });

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
