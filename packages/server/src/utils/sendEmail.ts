import nodemailer from "nodemailer";

export const sendEmail = async (
    subject: string,
    recipient: string,
    html: string
) => {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    await transport.sendMail({ subject, to: recipient, html });
};
