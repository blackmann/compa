import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const send = resend.emails.send.bind(resend.emails);

export { send };
