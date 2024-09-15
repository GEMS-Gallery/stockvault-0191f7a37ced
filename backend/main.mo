import Bool "mo:base/Bool";
import Trie "mo:base/Trie";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";

actor {
  public type Asset = {
    id: Nat;
    symbol: Text;
    name: Text;
    quantity: Float;
    assetType: Text;
  };

  stable var assetsEntries : [(Nat, Asset)] = [];
  var assets = TrieMap.fromEntries<Nat, Asset>(assetsEntries.vals(), Nat.equal, Nat.hash);
  stable var nextId: Nat = 1;

  func escapeString(t : Text) : Text {
    let r1 = Text.replace(t, #text("\\"), "\\\\");
    Text.replace(r1, #text("\""), "\\\"")
  };

  func assetToJSON(a: Asset): Text {
    "{\"id\":" # Nat.toText(a.id) #
    ",\"symbol\":\"" # escapeString(a.symbol) #
    "\",\"name\":\"" # escapeString(a.name) #
    "\",\"quantity\":" # Float.toText(a.quantity) #
    ",\"assetType\":\"" # escapeString(a.assetType) # "\"}"
  };

  func assetsToJSON(): Text {
    let jsonAssets = Array.map<Asset, Text>(
      Iter.toArray(assets.vals()),
      func (a: Asset): Text { assetToJSON(a) }
    );
    "[" # Text.join(",", jsonAssets.vals()) # "]"
  };

  public query func getAssets() : async Text {
    assetsToJSON()
  };

  public func addAsset(symbol: Text, name: Text, quantity: Float, assetType: Text) : async Text {
    let newAsset: Asset = {
      id = nextId;
      symbol = symbol;
      name = name;
      quantity = quantity;
      assetType = assetType;
    };
    assets.put(nextId, newAsset);
    nextId += 1;
    assetToJSON(newAsset)
  };

  public func updateAsset(id: Nat, symbol: Text, name: Text, quantity: Float, assetType: Text) : async ?Text {
    switch (assets.get(id)) {
      case (null) { null };
      case (?existingAsset) {
        let updatedAsset: Asset = {
          id = id;
          symbol = symbol;
          name = name;
          quantity = quantity;
          assetType = assetType;
        };
        assets.put(id, updatedAsset);
        ?assetToJSON(updatedAsset)
      };
    }
  };

  public func deleteAsset(id: Nat) : async Bool {
    switch (assets.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  system func preupgrade() {
    assetsEntries := Iter.toArray(assets.entries());
  };

  system func postupgrade() {
    assets := TrieMap.fromEntries(assetsEntries.vals(), Nat.equal, Nat.hash);
    assetsEntries := [];
  };
}