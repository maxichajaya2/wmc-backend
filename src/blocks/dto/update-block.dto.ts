import { CreateBlockDto } from "./create-block.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBlockDto extends PartialType(CreateBlockDto){}