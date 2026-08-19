export type TProduct = {
    _id?: string;
    date: string | Date;
    productName: string;
    plannedQuantity: number;
    productionQuantity: number;
    manufacturingOrder: string;
    createdAt?: string;
    updatedAt?: string;
};

export type TDailySummary = {
    date: string;
    totalPlannedQuantity: number;
    totalProductionQuantity: number;
    totalRemainingQuantity: number;
};
