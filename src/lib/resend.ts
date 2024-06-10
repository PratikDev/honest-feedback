import { Resend } from "resend";
import { getEnv } from "./utils";

export const resend = new Resend(getEnv("RESEND_API_KEY"));
