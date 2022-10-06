import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class SocialAnalyticsDto{
    @ApiProperty()
    @IsNotEmpty()
    platforms: []

}

export class PostAnalyticsDto {

    @ApiProperty()
    @IsNotEmpty()
    platforms: []

    @ApiProperty()
    @IsNotEmpty()
    id: string

    @ApiProperty()
    @IsNotEmpty()
    profileKey: string

}

