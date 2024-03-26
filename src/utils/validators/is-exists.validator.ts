import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'IsExist', async: true })
export class IsExist implements ValidatorConstraintInterface {
  constructor() {}

  async validate(value: string, validationArguments: ValidationArguments) {
    // const repository = validationArguments.constraints[0];
    // const pathToProperty = validationArguments.constraints[1];

    // console.log(this.dataSource);
    // const entity: unknown = await this.dataSource
    //   .getRepository(repository)
    //   .findOne({
    //     where: {
    //       [pathToProperty ? pathToProperty : validationArguments.property]:
    //         pathToProperty ? value?.[pathToProperty] : value,
    //     },
    //   });

    return Boolean(true);
  }
}
