import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parameter } from '../entities/parameter.entity';

@Injectable()
export class ParametersRepository {
    constructor(
        @InjectRepository(Parameter)
        public readonly repository: Repository<Parameter>
    ) { }

    async getEventParameters(): Promise<{
        id_event: string;
        siecode_event: string;
    }>{
        const result = await this.repository.find({
            where: {
                groupCode: '02'
            }
        });
        const data = {
            id_event: result.find(r => r.code === 'id_event')?.value || '',
            siecode_event: result.find(r => r.code === 'siecode_event')?.value || ''
        }
        console.log('Event parameters', data);
        return data;
    }
}