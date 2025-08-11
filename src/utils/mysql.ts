// utils/mysql.ts
import type { Pool } from 'mysql2/promise'

const isNode = typeof process !== 'undefined' && process.versions?.node

export interface DBClient {
    query<T = any>(sql: string, params?: any[]): Promise<T[]>
    findOne<T = any>(sql: string, params?: any[]): Promise<T | null>
    insert(sql: string, params?: any[]): Promise<any>
    update(sql: string, params?: any[]): Promise<any>
}

export class MySQL implements DBClient {
    private pool: Pool | null = null
    private apiUrl: string | null = null

    constructor() {
        if (isNode) {
            // Node.js mysql2/promise
            const mysql = require('mysql2/promise')
            this.pool = mysql.createPool({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT || 3306),
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            })
        } else {
            // Cloudflare Workers ，use HTTP API
            this.apiUrl = process.env.DB_API_URL || ''
        }
    }

    async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
        if (isNode && this.pool) {
            const [rows] = await this.pool.query(sql, params)
            return rows as T[]
        } else {
            // Workers request HTTP API
            const res = await fetch(`${this.apiUrl}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sql, params })
            })
            return (await res.json()) as T[]
        }
    }

    async findOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
        const rows = await this.query<T>(sql, params)
        return rows.length ? rows[0] : null
    }

    async insert(sql: string, params?: any[]) {
        return this.exec(sql, params)
    }

    async update(sql: string, params?: any[]) {
        return this.exec(sql, params)
    }

    private async exec(sql: string, params?: any[]) {
        if (isNode && this.pool) {
            const [result] = await this.pool.execute(sql, params)
            return result
        } else {
            const res = await fetch(`${this.apiUrl}/exec`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sql, params })
            })
            return await res.json()
        }
    }
}
