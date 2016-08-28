int PAMonteCarloSimulator::GetRMIndex(const POLRiskModel* pRiskModel, const DynArray<String>& sIds, const DynArray<RotatePair>& ri, bool bBimeFullUniv) {
  DynArray<int> returnArray;
  DynArray<String> holdsSymbolsForSedol;
  DynArray<String> sedol;
  if(sIds.GetSize() != ri.GetSize() ) {
    return; //error?
  }

  for(int j = 0; j<sIds.GetSize(); j++) {
    PROFILE_STACK_BLOCK("PAMonteCarloSimulator::GetRMIndex");
    const POLRiskModelBarra* pBarra = dynamic_cast<const POLRiskModelBarra*>(pRiskModel);
    const bool isBIME = pBarra && pBarra->IsBIMERiskModel();
    const pair<POLRiskModelIdentifier,int >  key (pRiskModel->Identifier(), (bBimeFullUniv && isBIME ? -GetReportDate() : GetReportDate()));
    GuiUSBridge* pUSBridge = m_pEngine->GetUSBridge().get();

    // check if we have built the cache of RI->RMI and Sedol->RMI
    if(!m_mRMRotateIndexMap.exists(key)) {
      // This is a pair of maps that go from equity ri -> rmindex and fi ri ->
      // rmindex in that order.
      pair<Map<int, int>, Map<int, int> >&  entry = m_mRMRotateIndexMap[key];
      Map<int, int>& mEqIndices = entry.first;
      Map<int, int>& mFiIndices = entry.second;
      mEqIndices.set_default_value(-1);
      mFiIndices.set_default_value(-1);

      Map<String, int>& mSymbolToRMIndex = m_mSymbolRMIndexMap[key];
      mSymbolToRMIndex.set_default_value(-1);

      // fetch the full universe and then get the ri and sedol for each security
      const DynArray<String>& daRMUniv = (bBimeFullUniv && isBIME) ? pBarra->FullUniverseFactSetIDs() : pRiskModel->UniverseWithAppendedCompanies();
      pair_iterators_t univ_range = make_pair(daRMUniv.begin(), daRMUniv.end());

      const int univSize = FDS::STL::distance(univ_range.first, univ_range.second);

      DynArray<String> daSymbol;
      DynArray<int> idxInRMForSedols;
      for (int i = 0; i < univSize; ++i) {
        const String& sym = *(univ_range.first + i);
        // fetch the RI without adding (no need to add the whole risk universe)
        const RotatePair temp_ri = GET_ROTATE_INDEX(sym, pUSBridge);
        // if it doesn't have an RI, fetch the sedol
        if(!is_pair_on_rotate_master(temp_ri, pUSBridge)) {
          // try to get the sedol, else use the risk models symbol
          // if we don't get a sedol, we try to compare by symbol directly to
          // snag any extra coverage we can
          //daSymbol and iForDaSedolSymbol are both the same size -- ifordasedolsymbol keeps track of index to set mSymbolToRMIndex[dasymbol] equal to below.
          daSymbol.Append(sym);
          idxInRMForSedols.Append(i);
        } else {
          if(is_index_in_universe(temp_ri.first, EQUITY_UNIV, pUSBridge)) {
            mEqIndices[temp_ri.first] = i;
          }
          if(is_index_in_universe(temp_ri.second, DEBT_UNIV, pUSBridge)) {
            mFiIndices[temp_ri.second] = i;
          }
        }
      }

      if( !daSymbol.empty() ) {
        DynArray<String> daSedol;
        if( FDS::sedolFromUnknownId( daSedol, daSymbol, true ) ) {
          //for logging purposes
          const String fl_entry = "$$SYMB_sedolFromUnknownId_pamc1";
          const FDS::SymFormulaStats fl_stats( fl_entry);

          for(int i = 0; i < daSymbol.GetSize(); i++) {
            if(FDS_ISNA(daSedol[i])) {
              mSymbolToRMIndex[daSymbol[i]] = idxInRMForSedols[i];
            } else {
              mSymbolToRMIndex[daSedol[i]] = idxInRMForSedols[i];
            }
          }
        }
      }
    }
    const pair<Map<int, int>, Map<int, int> >&  entry = m_mRMRotateIndexMap[key];
    const Map<int, int>& mEqIndices = entry.first;
    const Map<int, int>& mFiIndices = entry.second;

    Map<String, int>& mSymbolToRMIndex = m_mSymbolRMIndexMap[key];

    int iRMIndex_ri = -1;

    if(is_pair_on_rotate_master(ri[j], pUSBridge)){
      if (is_index_in_universe(ri.second, DEBT_UNIV, pUSBridge)) {
        iRMIndex_ri = mFiIndices[ri[j].second];
      } else if (iRMIndex_ri == -1 && is_index_in_universe(ri[j].first, EQUITY_UNIV, pUSBridge)) {
        iRMIndex_ri = mEqIndices[ri[j].first];
      }
      returnArray.append(iRMIndex_ri);
    } else {
  
      //If the security we're looking to find isn't on the rotate master, then we will need to get its sedol to search the sedol map
      //However, this function is used as part of security creation, and every security gets checked here to see if the commodity
      //or equity models know about it.  A large bond portfolio, none of which will have a ri that matches anything in either model,
      //will hit this point with iRMIndex_ri as -1 twice for every security, forcing 2x# of bonds in portfolio sedol translations to
      //occur.  This seems to vary wildly in time, with profiling indicating it usually takes between 8 and 90(!?) seconds for global agg.
      //Since we only add symbols not on the rotate master into the sedol map during the cache construction, we can significantly
      //optimize the number of sedol translations that occur by only checking the sedol map if the ri isn't on the master.  This causes all the
      //bonds with something like <0,145923> to recognize that they aren't in the commodity or equity models and skip sedol translation.


      typedef Map<String, int>::iterator iter_t;
      std::pair<iter_t, bool> created_pair = mSymbolToRMIndex.create(sIds[j], -1);
      int& iRMIndex = created_pair.first->second;

      if ( created_pair.second ) { // This is to provide Protfolio Universe -> RM Universe maping to reduce the number of symbology calls
        const String fl_entry = "$$SYMB_sedolFromUnknownId_pamc2";
        const FDS::SymFormulaStats fl_stats( fl_entry);
        holdsSymbolsForSedol.append(sIds[j]);
    }
    if (FDS::sedolFromUnknownId( sedol, holdsSymbolsForSedol, true ))
          //put in loop to add each
          //do i need to keep it in order? check that!         
          returnArray.append(mSymbolToRMIndex[sedol]);
      }
    return iRMIndex;
  }
}
