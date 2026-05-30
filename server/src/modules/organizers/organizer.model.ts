import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganizer extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  description?: string;
  contactNumber: string;
  website?: string;
  address?: string;
  logo?: string;
  banner?: string;
  isApproved: boolean;
  isPremium: boolean;
  premiumExpiry?: Date;
  rating: number;
  totalTrips: number;
}

const organizerSchema = new Schema<IOrganizer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true },
    description: { type: String },
    contactNumber: { type: String, required: true },
    website: { type: String },
    address: { type: String },
    logo: { type: String },
    banner: { type: String },
    isApproved: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    premiumExpiry: { type: Date },
    rating: { type: Number, default: 0 },
    totalTrips: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Organizer = mongoose.model<IOrganizer>('Organizer', organizerSchema);
