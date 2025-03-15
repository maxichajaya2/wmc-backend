import { PartialType } from "@nestjs/mapped-types";
import { AddCommentDto } from "./add-comment.dto";

export class UpdateCommentDto extends PartialType(AddCommentDto) {}