// src/lib/currencyService.ts
import { toast } from "@/hooks/use-toast";

// Default fallback rates in case API fails
const FALLBACK_RATES = {
  usd: 0.0012,
  eur: 0.0011,
  gbp: 0.00095
};

export class CurrencyService {
  static async getETNPrice(currency: string): Promise<number> {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=electroneum&vs_currencies=${currency.toLowerCase()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch ETN price');
      }
      
      const data = await response.json();
      const price = data.electroneum?.[currency.toLowerCase()];
      
      if (!price) {
        throw new Error(`Could not get ETN price in ${currency}`);
      }
      
      return price;
    } catch (error) {
      console.error('Error fetching ETN price:', error);
      toast({
        title: "Using estimated exchange rate",
        description: "Could not fetch current rates. Using approximate values.",
        variant: "destructive",
      });
      
      // Return fallback price
      return FALLBACK_RATES[currency.toLowerCase()] || 0.001;
    }
  }

  static async convertToETN(amount: number, currency: string): Promise<number> {
    const etnPrice = await this.getETNPrice(currency);
    return amount / etnPrice;
  }

  static async convertToFiat(etnAmount: number, currency: string): Promise<number> {
    const etnPrice = await this.getETNPrice(currency);
    return etnAmount * etnPrice;
  }
}