import { z } from "zod";

export const authCredentialsSchema = z.object({
  email: z.email({ error: "Informe um e-mail válido" }),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type AuthCredentials = z.infer<typeof authCredentialsSchema>;
