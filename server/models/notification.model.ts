import mongoose, { Schema, Document, model } from "mongoose";

interface INotification extends Document {
  title: string;
  message: string;
  status: string;
  userId: string;
  createdAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "unread",
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const NotificationModel = model<INotification>(
  "Notification",
  NotificationSchema
);

export default NotificationModel;
