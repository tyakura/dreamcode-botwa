import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "Email tidak valid" })
  email!: string;

  @IsNotEmpty({ message: "Password wajib diisi" })
  password!: string;
}

export class RegisterDto {
  @IsNotEmpty({ message: "Nama wajib diisi" })
  name!: string;

  @IsEmail({}, { message: "Email tidak valid" })
  email!: string;

  @MinLength(6, { message: "Password minimal 6 karakter" })
  password!: string;

  @IsNotEmpty({ message: "Nama bisnis wajib diisi" })
  businessName!: string;
}