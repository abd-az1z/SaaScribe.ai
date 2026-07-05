import { pgTable, serial, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  pageCount: integer('page_count').notNull(),
  content: text('content'), // Extracted text
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const riskAssessments = pgTable('risk_assessments', {
  id: serial('id').primaryKey(),
  documentId: integer('document_id').references(() => documents.id).notNull(),
  overallScore: integer('overall_score').notNull(), // 0-100
  summary: text('summary'),
  findings: jsonb('findings'), // Array of findings { type, description, severity, location }
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'upload', 'analyze'
  userId: text('user_id').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
