import { ApiProperty } from "@nestjs/swagger";

export class FindQueryDto {
    @ApiProperty({ type: Number, required: false })
    readonly limit?: number;
    @ApiProperty({ type: Number, required: false })
    readonly offset?: number;
    @ApiProperty({ required: false })
    readonly tag?: string;
    @ApiProperty({ required: false })
    readonly author?: string;
    @ApiProperty({ required: false })
    readonly favorited?: string;
}