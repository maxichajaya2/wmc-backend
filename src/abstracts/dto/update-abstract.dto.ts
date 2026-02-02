import { PartialType } from "@nestjs/mapped-types";
import { CreateAbstractDto } from "./create-abstract.dto";

export class UpdateAbstractDto extends PartialType(CreateAbstractDto){}