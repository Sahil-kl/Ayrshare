import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class InstagramOptions{
    reels: boolean
    shareReelsFeed: boolean
    thumbNailOffset: number
    locationId: any
    autoResize: boolean
    userTags: []
}

export class PostDto {

    @ApiProperty()
    @IsNotEmpty()
    platforms: []

    @ApiPropertyOptional()
    @IsOptional()
    post: string

    @ApiProperty()
    profileKey: string

    @ApiPropertyOptional()
    @IsOptional()
    mediaUrls: []

    @ApiPropertyOptional()
    @IsOptional()
    isVideo: boolean

    @ApiPropertyOptional()
    @IsOptional()
    shortenLinks: boolean

    @ApiPropertyOptional({type: InstagramOptions})
    InstagramOptions: InstagramOptions
}

