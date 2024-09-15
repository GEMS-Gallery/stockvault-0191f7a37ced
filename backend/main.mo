import Array "mo:base/Array";
import Hash "mo:base/Hash";

import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

actor PortfolioTracker {
  type Holding = {
    symbol: Text;
    name: Text;
    quantity: Float;
    purchasePrice: Float;
    currentPrice: Float;
    assetType: Text;
  };

  type Portfolio = {
    holdings: [Holding];
    allocation: [(Text, Float)];
    assetClasses: [(Text, Float)];
    sectors: [(Text, Float)];
  };

  stable var holdingsEntries : [(Text, Holding)] = [];
  var holdings = HashMap.HashMap<Text, Holding>(10, Text.equal, Text.hash);

  public func init() : async () {
    holdings := HashMap.fromIter<Text, Holding>(holdingsEntries.vals(), 10, Text.equal, Text.hash);
  };

  public func addOrUpdateHolding(symbol: Text, name: Text, quantity: Float, purchasePrice: Float, currentPrice: Float, assetType: Text) : async () {
    let holding : Holding = {
      symbol = symbol;
      name = name;
      quantity = quantity;
      purchasePrice = purchasePrice;
      currentPrice = currentPrice;
      assetType = assetType;
    };
    holdings.put(symbol, holding);
  };

  public func removeHolding(symbol: Text) : async () {
    holdings.delete(symbol);
  };

  public query func getPortfolio() : async Portfolio {
    let holdingsArray = Iter.toArray(holdings.vals());
    let allocation = calculateAllocation(holdingsArray);
    let assetClasses = calculateAssetClasses(holdingsArray);
    let sectors = calculateSectors();

    {
      holdings = holdingsArray;
      allocation = allocation;
      assetClasses = assetClasses;
      sectors = sectors;
    }
  };

  private func calculateAllocation(holdings: [Holding]) : [(Text, Float)] {
    // Placeholder implementation
    [("Equity", 64.0), ("Fixed Income", 17.0), ("Cash", 17.0), ("Crypto", 1.0)]
  };

  private func calculateAssetClasses(holdings: [Holding]) : [(Text, Float)] {
    // Placeholder implementation
    [("ETF", 41.0), ("Stock", 17.0), ("Bonds", 23.0), ("Cash", 17.0), ("Crypto", 1.0)]
  };

  private func calculateSectors() : [(Text, Float)] {
    // Placeholder implementation
    [
      ("Others", 50.0),
      ("Technology", 15.0),
      ("Financial Services", 10.0),
      ("Consumer Cyclical", 8.0),
      ("Communication Services", 7.0),
      ("Consumer Staples", 5.0),
      ("Basic Materials", 3.0),
      ("Healthcare", 2.0)
    ]
  };

  system func preupgrade() {
    holdingsEntries := Iter.toArray(holdings.entries());
  };

  system func postupgrade() {
    holdings := HashMap.fromIter<Text, Holding>(holdingsEntries.vals(), 10, Text.equal, Text.hash);
  };
}