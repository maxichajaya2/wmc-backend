import { Injectable } from '@nestjs/common';
// import { DESIGNATIONS_MAP } from '../constants/designations';

export interface Designation {
  code: string;
  name: string;
}

@Injectable()
export class DesignationsService {
  // private readonly map = DESIGNATIONS_MAP;

  // findAll(): Designation[] {
  //   return Object.entries(this.map).map(([code, name]) => ({ code, name }));
  // }

  // getOne(code: string): Designation | null {
  //   const name = this.map[code];
  //   return name ? { code, name } : null;
  // }
}
