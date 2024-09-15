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
    sector: Text;
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

  public func addOrUpdateHolding(symbol: Text, name: Text, quantity: Float, purchasePrice: Float, currentPrice: Float, assetType: Text, sector: Text) : async () {
    let holding : Holding = {
      symbol = symbol;
      name = name;
      quantity = quantity;
      purchasePrice = purchasePrice;
      currentPrice = currentPrice;
      assetType = assetType;
      sector = sector;
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
    let sectors = calculateSectors(holdingsArray);

    {
      holdings = holdingsArray;
      allocation = allocation;
      assetClasses = assetClasses;
      sectors = sectors;
    }
  };

  private func calculateAllocation(holdings: [Holding]) : [(Text, Float)] {
    // Implement allocation calculation logic
    []
  };

  private func calculateAssetClasses(holdings: [Holding]) : [(Text, Float)] {
    // Implement asset classes calculation logic
    []
  };

  private func calculateSectors(holdings: [Holding]) : [(Text, Float)] {
    // Implement sectors calculation logic
    []
  };

  system func preupgrade() {
    holdingsEntries := Iter.toArray(holdings.entries());
  };

  system func postupgrade() {
    holdings := HashMap.fromIter<Text, Holding>(holdingsEntries.vals(), 10, Text.equal, Text.hash);
  };
}