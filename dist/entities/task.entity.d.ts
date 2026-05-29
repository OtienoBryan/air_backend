import { SalesRep } from './sales-rep.entity';
export declare class Task {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    completedAt: Date | null;
    isCompleted: boolean;
    priority: string;
    status: string;
    salesRepId: string;
    assignedById: number;
    date: string;
    salesReps?: SalesRep[];
    assignedBy: SalesRep;
}
