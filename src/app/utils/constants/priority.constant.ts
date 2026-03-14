import { GeneralModel } from '../models';

export const PRIORITYLIST: readonly Readonly<GeneralModel>[] = [
  { id: 1, name: 'Baja' } as const,
  { id: 2, name: 'Media' } as const,
  { id: 3, name: 'Alta' } as const,
];
