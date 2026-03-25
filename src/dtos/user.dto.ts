import { Role } from "../generated/prisma/enums.js";

export interface InputCreateUserDTO {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface OutputCreateUserDTO {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface OutputGetUserByEmailDTO {
  id: string;
  password: string;
  username: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface OutputGetUserByIdDTO {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
