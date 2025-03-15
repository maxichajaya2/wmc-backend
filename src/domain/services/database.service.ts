import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

export interface FindAllParams {
  table: string;
  select?: string[];
  where?: string;
  params?: any[];
}

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor() {
    const config = {
      host: process.env.DB_HOST,  // Cambia según tus necesidades
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
    console.log({config});
    this.pool = new Pool(config);
  }

  async executeQuery(query: string, params: any[] = []) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows; // Retorna los resultados de la consulta
    } finally {
      client.release(); // Libera el cliente de la conexión
    }
  }

  async findAll<T>({ table, where, select = [], params }: FindAllParams): Promise<T[]> {
    return this.executeQuery(`SELECT ${select.length === 0 ? '*' : select.join(',')} FROM ${table} ${where ? `WHERE ${where}` : ''}`, params);
  }

  async create<T>({ table, values, returning = [] }: { table: string, values: any, returning?: string[] }): Promise<T> {
    const result = await this.executeQuery(`INSERT INTO ${table} (${Object.keys(values).join(',')}) VALUES (${Object.keys(values).map((_, i) => `$${i + 1}`).join(',')}) ${returning.length > 0 ? `RETURNING ${returning.join(',')}` : ''}`, Object.values(values));
    console.log({result});
    return result[0];
  }

  async update<T>({ table, values, where, returning = [] }: { 
    table: string, 
    values: any, 
    where: { [key: string]: any }, 
    returning?: string[] 
  }): Promise<T> {
    const setClauses = Object.keys(values).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const whereClauses = Object.keys(where).map((key, i) => `${key} = $${i + 1 + Object.keys(values).length}`).join(' AND ');
    
    const query = `UPDATE ${table} SET ${setClauses} WHERE ${whereClauses} ${returning.length > 0 ? `RETURNING ${returning.join(',')}` : ''}`;
    const params = [...Object.values(values), ...Object.values(where)];
  
    const result = await this.executeQuery(query, params);
    return result[0];
  }
}
