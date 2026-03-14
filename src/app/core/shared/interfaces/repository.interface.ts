import { Observable } from 'rxjs';

export interface IRepository<T> {
  getAll(): Observable<T[]>;
  getById(id: string): Observable<T | null>;
  create(entity: Omit<T, 'id'>): Observable<T>;
  update(id: string, entity: Partial<T>): Observable<T>;
  delete(id: string): Observable<void>;
}

export interface IStorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
  keys(): string[];
}
