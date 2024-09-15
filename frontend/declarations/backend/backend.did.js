export const idlFactory = ({ IDL }) => {
  const Holding = IDL.Record({
    'currentPrice' : IDL.Float64,
    'purchasePrice' : IDL.Float64,
    'name' : IDL.Text,
    'sector' : IDL.Text,
    'quantity' : IDL.Float64,
    'assetType' : IDL.Text,
    'symbol' : IDL.Text,
  });
  const Portfolio = IDL.Record({
    'holdings' : IDL.Vec(Holding),
    'sectors' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64)),
    'assetClasses' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64)),
    'allocation' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64)),
  });
  return IDL.Service({
    'addOrUpdateHolding' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Float64,
          IDL.Float64,
          IDL.Float64,
          IDL.Text,
          IDL.Text,
        ],
        [],
        [],
      ),
    'getPortfolio' : IDL.Func([], [Portfolio], ['query']),
    'init' : IDL.Func([], [], []),
    'removeHolding' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
