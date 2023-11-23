import { IsString,IsEmail } from "class-validator";

export class userDto{
    readonly custom_fields_values: CustomFieldValueDto[];
    readonly name: string;
}
export class CustomFieldValueDto{
    readonly field_id:number;
    readonly values:string[]
}

