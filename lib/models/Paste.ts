import mongoose, { Schema, Document, Model } from 'mongoose';

interface IPaste extends Document {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
  created_at: Date;
  expires_at?: Date;
  view_count: number;
  is_expired(testTimeMs?: number): boolean;
  has_exceeded_views(): boolean;
  is_unavailable(testTimeMs?: number): boolean;
  increment_views(): void;
}

const PasteSchema = new Schema<IPaste>({
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [1, 'Content must be a non-empty string'],
  },
  ttl_seconds: {
    type: Number,
    min: [1, 'ttl_seconds must be >= 1'],
    default: null,
  },
  max_views: {
    type: Number,
    min: [1, 'max_views must be >= 1'],
    default: null,
  },
  created_at: {
    type: Date,
    default: () => new Date(),
  },
  expires_at: {
    type: Date,
    default: null,
  },
  view_count: {
    type: Number,
    default: 0,
  },
});

// Pre-save hook to calculate expires_at
PasteSchema.pre<IPaste>('save', async function() {
  if (this.ttl_seconds && !this.expires_at) {
    this.expires_at = new Date(Date.now() + this.ttl_seconds * 1000);
  }
});

// Instance methods
PasteSchema.methods.is_expired = function(testTimeMs?: number): boolean {
  if (!this.expires_at) return false;
  const now = testTimeMs ? new Date(testTimeMs) : new Date();
  return now > this.expires_at;
};

PasteSchema.methods.has_exceeded_views = function(): boolean {
  if (!this.max_views) return false;
  return this.view_count >= this.max_views;
};

PasteSchema.methods.is_unavailable = function(testTimeMs?: number): boolean {
  return this.is_expired(testTimeMs) || this.has_exceeded_views();
};

PasteSchema.methods.increment_views = function(): void {
  this.view_count = (this.view_count || 0) + 1;
};

const Paste: Model<IPaste> = mongoose.models.Paste || mongoose.model<IPaste>('Paste', PasteSchema);

export default Paste;
export type { IPaste };
