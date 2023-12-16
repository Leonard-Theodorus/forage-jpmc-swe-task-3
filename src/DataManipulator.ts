import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc : number,
  price_def : number,
  ratio : number,
  timestamp: Date,
  upper_bound : number,
  lower_bound : number,
  trigger_alert : number | undefined
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]) : Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    let sumRatio = 0
    let respondLength = serverRespond.length
    for(let i = 0 ; i < respondLength; i += 2){
      const priceABC = (serverRespond[i].top_ask.price + serverRespond[i].top_bid.price) / 2;
      const priceDEF = (serverRespond[i + 1].top_ask.price + serverRespond[i + 1].top_bid.price) / 2;
      sumRatio += priceABC / priceDEF
    }
    sumRatio /= respondLength
    const upperBound = 1 + (sumRatio * 0.1);
    const lowerBound = 1 - (sumRatio * 0.1);
    return {
      //TODO: return Row Object
      price_abc : priceABC,
      price_def : priceDEF,
      ratio : ratio,
      timestamp : serverRespond[0].timestamp > serverRespond[1].timestamp ? serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound : upperBound,
      lower_bound : lowerBound,
      trigger_alert : (ratio > upperBound || ratio < lowerBound) ? ratio : undefined
    }
  }
}
