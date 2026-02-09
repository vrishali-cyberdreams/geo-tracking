import z from "zod";

export const registerEmployeeSchema = z.object({
  email: z.email("Invalid Email"),
  firstName: z.string().min(2, "Firstname must have atleast 2 charachters"),
  lastName: z.string().min(2, "Lastname must have atleast 2 charachters"),
  contact: z
    .string()
    .regex(/^\d{10}$/, "Contact number must be exactly 10 digits"),
  designation: z.string().min(2, "Designation must have atleast 2 charachters"),
});