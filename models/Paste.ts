import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPaste extends Document {
  shortId: string;
  content: string;
  language: string;
  visibility: 'public' | 'unlisted' | 'private';
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  expiresAt?: Date;
  viewCount: number;
  maxViews?: number;
  aiAnalysis?: {
    vulnerabilities: Array<{
      type: string;
      severity: string;
      line: number;
      fix: string;
    }>;
    suggestions: Array<{
      category: string;
      improvement: string;
      line: number;
    }>;
    performanceScore: number;
    analyzedAt: Date;
  };
  metadata: {
    ip?: string;
    userAgent?: string;
  };
}

const PasteSchema = new Schema<IPaste>({
  shortId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'plaintext',
  },
  visibility: {
    type: String,
    enum: ['public', 'unlisted', 'private'],
    default: 'public',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: {
    type: Date,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  maxViews: {
    type: Number,
  },
  aiAnalysis: {
    vulnerabilities: [{
      type: {
        type: String,
      },
      severity: String,
      line: Number,
      fix: String,
    }],
    suggestions: [{
      category: String,
      improvement: String,
      line: Number,
    }],
    performanceScore: Number,
    analyzedAt: Date,
  },
  metadata: {
    ip: String,
    userAgent: String,
  },
});

// Index for expiration
PasteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Check if model exists before creating
const Paste: Model<IPaste> = mongoose.models.Paste || mongoose.model<IPaste>('Paste', PasteSchema);

export default Paste;
