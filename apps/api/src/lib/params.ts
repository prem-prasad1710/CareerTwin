import { Request } from 'express';

export function param(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

export function queryParam(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0] || '';
  return '';
}

export function userId(req: Request): string {
  return param(req.params.userId);
}
