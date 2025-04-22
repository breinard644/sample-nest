import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
    @IsEmail()
    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty()
    email:string

    @ApiProperty({ example: 'strong Password' })
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({ example: 'username' })
    @IsString()
    @IsNotEmpty()
    name:string
}