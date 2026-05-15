import { sql } from './db';
import { cookies } from 'next/headers';

export interface User {
  id: string;
  email: string;
  name: string | null;
}

// This file is kept for type exports only
