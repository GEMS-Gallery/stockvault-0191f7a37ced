import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Float "mo:base/Float";

actor PortfolioTracker {
  public query func getStockPrice(symbol: Text) : async Text {
    // This is a mock implementation. In a real-world scenario,
    // you would integrate with a stock price API here.
    let mockPrice = switch (symbol) {
      case "AAPL" { "150.25" };
      case "GOOGL" { "2750.80" };
      case "MSFT" { "305.60" };
      case _ { "0.00" };
    };
    mockPrice
  };
}