export interface StockMover {
    id: number;
    securityId: number;
    symbol: string;
    price: number;
    change: number;
    changePercentage: number;
    tradeDate: number;
}

export interface MostActiveStock {
    id: number;
    securityId: number;
    symbol: string;
    tradeVolume: number;
    shareVolume: number;
    turnover: number;
    percentageShareVolume: number;
}

export interface MarketIndex {
    value: number;
    change: number;
}

export interface MarketSummaryData {
    status: 'Open' | 'Closed' | string;
    rawStatus: string;
    aspi: MarketIndex;
    spSl20: MarketIndex;
    turnover: number;
    volume: number;
    trades: number;
    topGainers: StockMover[];
    topLosers: StockMover[];
    mostActive: MostActiveStock[];
    lastUpdated: string;
    cached: boolean;
}

export interface StockDetails {
    symbol: string;
    name: string;
    price: number;
    previousClose: number;
    change: number;
    pChange: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    marketCap: number;
    trades: number;
}

export interface StockDetailResponse {
    details: StockDetails;
    lastUpdated: string;
    cached: boolean;
}

export interface StockHistoryPoint {
    symbol: string;
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}