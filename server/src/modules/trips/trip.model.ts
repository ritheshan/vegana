import mongoose, { Document, Schema } from 'mongoose';

export enum TripStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ITrip extends Document {
  organizerId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: string;
  destination: string;
  duration: number; // in days
  startDate: Date;
  endDate: Date;
  totalSeats: number;
  availableSeats: number;
  price: number;
  images: string[];
  itinerary: any[];
  inclusions: string[];
  exclusions: string[];
  meetingPoint: string;
  cancellationPolicy: string;
  status: TripStatus;
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITrip>(
  {
    organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    itinerary: { type: [Object], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    meetingPoint: { type: String, required: true },
    cancellationPolicy: { type: String, required: true },
    status: { type: String, enum: Object.values(TripStatus), default: TripStatus.DRAFT },
  },
  { timestamps: true }
);

export const Trip = mongoose.model<ITrip>('Trip', tripSchema);
