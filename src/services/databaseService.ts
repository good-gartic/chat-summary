import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export class DatabaseService {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  public async setupDatabase() {
    this.db = await open({
      filename: './summaries.db',
      driver: sqlite3.Database,
    });
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_id TEXT,
        timestamp INTEGER,
        summary TEXT,
        duration INTEGER
      )
    `);
    await this.db.exec(`DELETE FROM summaries WHERE timestamp < strftime('%s', 'now') - 86400`); // Delete old summaries
  }

  public async getSummaryFromDB(channelId: string, hours: number): Promise<{ summary: string } | undefined> {
    return this.db.get<{ summary: string }>(
      `SELECT summary FROM summaries 
       WHERE channel_id = ? 
       AND timestamp >= strftime('%s', 'now') - (duration * 3600)
       AND duration = ?`,
      [channelId, hours]
    );
  }

  public async saveSummary(channelId: string, summary: string, hours: number): Promise<void> {
    await this.db.run(
      `INSERT INTO summaries (channel_id, timestamp, summary, duration) 
       VALUES (?, strftime('%s', 'now'), ?, ?)`,
      [channelId, summary, hours]
    );
  }
}
