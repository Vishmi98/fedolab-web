import { Schema, model, Document, models } from "mongoose";

interface ContactUs extends Document {
    id: number;
    name: string;
    email: string;
    subject: string;
    phoneNo: string;
    message: string;
    createDate: Date;
    updatedDate: Date;
}

const contactUsSchema = new Schema<ContactUs>({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    phoneNo: { type: String, required: true },
    message: { type: String },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});

const ContactUsModel = models.contactUs || model<ContactUs>("contactUs", contactUsSchema);

export default ContactUsModel;
