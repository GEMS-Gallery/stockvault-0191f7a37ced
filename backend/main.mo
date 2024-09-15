import Array "mo:base/Array";
import Hash "mo:base/Hash";

import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

actor StockHolding {
  // Define the structure for a stock holding
  type Holding = {
    symbol: Text;
    quantity: Float;
    purchasePrice: Float;
  };

  // Use a stable variable to store holdings
  stable var holdingsEntries : [(Text, Holding)] = [];
  var holdings = HashMap.HashMap<Text, Holding>(10, Text.equal, Text.hash);

  // Initialize holdings from stable storage
  public func init() : async () {
    holdings := HashMap.fromIter<Text, Holding>(holdingsEntries.vals(), 10, Text.equal, Text.hash);
  };

  // Add or update a stock holding
  public func addOrUpdateHolding(symbol: Text, quantity: Float, purchasePrice: Float) : async () {
    let holding : Holding = {
      symbol = symbol;
      quantity = quantity;
      purchasePrice = purchasePrice;
    };
    holdings.put(symbol, holding);
  };

  // Remove a stock holding
  public func removeHolding(symbol: Text) : async () {
    holdings.delete(symbol);
  };

  // Get all stock holdings
  public query func getAllHoldings() : async [Holding] {
    return Iter.toArray(holdings.vals());
  };

  // Calculate total portfolio value (assuming current price is purchase price)
  public query func getTotalPortfolioValue() : async Float {
    var total : Float = 0;
    for (holding in holdings.vals()) {
      total += holding.quantity * holding.purchasePrice;
    };
    return total;
  };

  // For upgrades: store holdings in stable variable
  system func preupgrade() {
    holdingsEntries := Iter.toArray(holdings.entries());
  };

  // For upgrades: reinitialize holdings from stable variable
  system func postupgrade() {
    holdings := HashMap.fromIter<Text, Holding>(holdingsEntries.vals(), 10, Text.equal, Text.hash);
  };
}