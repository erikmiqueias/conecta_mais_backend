import { z } from "zod";

import {
  CreateUserInputSchema,
  GetUserByEmailOutputSchema,
  UpdateUserInputSchema,
  UpdateUserOutputSchema,
  UserOutputSchema,
} from "../schemas/user.schema.js";

export type InputCreateUserDTO = z.infer<typeof CreateUserInputSchema>;
export type OutputCreateUserDTO = z.infer<typeof UserOutputSchema>;
export type OutputGetUserByIdDTO = z.infer<typeof UserOutputSchema>;
export type OutputGetUserByEmailDTO = z.infer<
  typeof GetUserByEmailOutputSchema
>;

export type InputUpdateUserDTO = Omit<
  z.infer<typeof UpdateUserInputSchema>,
  "role"
>;
export type OutputUpdateUserDTO = z.infer<typeof UpdateUserOutputSchema>;

console.log();
