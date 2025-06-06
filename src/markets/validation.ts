/**
 * Validates input parameters for the markets endpoint
 */
export interface MarketsQueryParams {
  vs_currency: string;
  ids?: string[];
  order?: string;
  per_page?: number;
  page?: number;
  sparkline?: boolean;
}

export function validateMarketsParams(params: MarketsQueryParams): void {
  // Validate vs_currency (required)
  if (!params.vs_currency || typeof params.vs_currency !== 'string') {
    throw new Error('vs_currency is required and must be a string');
  }

  // Validate ids (optional)
  if (params.ids && (!Array.isArray(params.ids) || !params.ids.every(id => typeof id === 'string'))) {
    throw new Error('ids must be an array of strings');
  }

  // Validate order (optional)
  const validOrders = ['market_cap_desc', 'market_cap_asc', 'volume_desc', 'volume_asc', 'id_desc', 'id_asc'];
  if (params.order && !validOrders.includes(params.order)) {
    throw new Error(`Invalid order. Must be one of: ${validOrders.join(', ')}`);
  }

  // Validate per_page (optional)
  if (params.per_page !== undefined) {
    if (!Number.isInteger(params.per_page) || params.per_page < 1 || params.per_page > 250) {
      throw new Error('per_page must be an integer between 1 and 250');
    }
  }

  // Validate page (optional)
  if (params.page !== undefined) {
    if (!Number.isInteger(params.page) || params.page < 1) {
      throw new Error('page must be a positive integer');
    }
  }

  // Validate sparkline (optional)
  if (params.sparkline !== undefined && typeof params.sparkline !== 'boolean') {
    throw new Error('sparkline must be a boolean');
  }
}