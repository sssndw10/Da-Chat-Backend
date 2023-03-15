import { IsString, Length } from 'class-validator';

export class LoginDto {
  @Length(6, 20)
  username: string;

  @IsString()
  password: string;
}
