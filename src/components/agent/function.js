export function isRoleAccountExecutive (kategori) {
  let flag = false;

  if(kategori === 'account_executive') {
    flag = true;
  }

  return flag;
}

export function constructAgent (dataState, post) {
  let dataAgent = {
    name: dataState.agentName,
    email: dataState.email,
    phone: dataState.phone,
    banks: isRoleAccountExecutive() ? [parseInt(dataState.instansi)] : redefineBank(dataState.bank, dataState.listBank),
    status: dataState.status ? 'active' : 'inactive',
  }

  if(post) {
    dataAgent.username = dataState.username;
    dataAgent.category = dataState.kategori;
    if(!isRoleAccountExecutive()) {
      dataAgent.agent_provider = parseInt(dataState.instansi)
    }
  }

  return dataAgent
}

export function redefineBank(dataBank) {
  let arrBank = [];

  for(const key in dataBank) {
    arrBank.push(parseInt((dataBank[key].id && dataBank[key].id) || dataBank[key]))
  }

  return arrBank;
}

export function destructAgent (dataAgent, dataBank, dataAgentProvider, list) {
  const dataListAgent = list ? dataAgent : [dataAgent];

  for(const key in dataListAgent) {
    dataListAgent[key].status = dataListAgent[key].status && dataListAgent[key].status.toString().toLowerCase() === 'active' ? (list ? 'Aktif' : true) : (list ? 'Tidak Aktif' : false)
    dataListAgent[key].category_name = isRoleAccountExecutive(dataListAgent[key].category) ? 'Account Executive' : 'Agen'
    dataListAgent[key].agent_provider = isRoleAccountExecutive(dataListAgent[key].category) ? ((dataListAgent[key].banks && dataListAgent[key].banks[0]) || 0) : (dataListAgent[key].agent_provider && dataListAgent[key].agent_provider.Int64)
    dataListAgent[key].agent_provider_name = findAgent(dataListAgent[key].agent_provider, isRoleAccountExecutive(dataListAgent[key].category) ? dataBank : dataAgentProvider)
    dataListAgent[key].banks_name = findBanks(dataListAgent[key].banks, dataBank, true);
    dataListAgent[key].banks = findBanks(dataListAgent[key].banks, dataBank);
  }

  return list ? dataListAgent : dataListAgent[0];
}

export function findAgent(idAgentProvider, dataAgentProvider) {
  let agentName = '';

  for(const key in dataAgentProvider) {
    if(dataAgentProvider[key].id && dataAgentProvider[key].id.toString().toLowerCase() === idAgentProvider.toString().toLowerCase()){
      agentName = dataAgentProvider[key].name
    }
  
  }

  return agentName;
}

export function findBanks(banks, dataListBank, stringBank) {
  let bankNew = [];
  let bankName = '';

  for(const keyBank in banks) {
    for(const key in dataListBank) {
      if(dataListBank[key].id && dataListBank[key].id.toString().toLowerCase() === banks[keyBank].toString().toLowerCase()){
        bankNew.push(dataListBank[key]);
        
        if(bankName.length !== 0) {
          bankName += ', '
        }

        bankName += dataListBank[key].name;
        
        break;
      }
    }
  }

  return stringBank ? bankName : bankNew;
}
