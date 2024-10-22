import Array "mo:base/Array";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

actor {
  stable var highScores : [Nat] = [];

  public func addScore(score : Nat) : async [Nat] {
    highScores := Array.sort(Array.append<Nat>(highScores, [score]), Int.compare);
    if (highScores.size() > 5) {
      highScores := Array.tabulate<Nat>(5, func (i) { highScores[i] });
    };
    highScores
  };

  public query func getHighScores() : async [Nat] {
    highScores
  };
}
