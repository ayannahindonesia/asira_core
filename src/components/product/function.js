export function constructFees (dataFees) {
    let fees = [];

    for(const key in dataFees) {
        if(
            dataFees[key].label && dataFees[key].label.toString().trim().length > 0 &&
            dataFees[key].value && dataFees[key].value.toString().trim().length > 0 &&
            dataFees[key].type && dataFees[key].type.toString().trim().length > 0
        ) {
            fees.push(
                {
                    description: dataFees[key].label,
                    amount:`${dataFees[key].value}${dataFees[key].type === 'percent' ? '%':''}`
                }
            )
        }
    }

    return fees.length > 0 ? fees : false;
}

export function constructCollaterals (dataCollaterals) {
    let collaterals = [];

    for(const key in dataCollaterals) {
        if(
            dataCollaterals[key].label && dataCollaterals[key].label.toString().trim().length > 0
        ) {
            collaterals.push(dataCollaterals[key].label)
        }
    }

    return collaterals.length > 0 ? collaterals : false;
}

export function constructSector (dataSector) {
    let collaterals = [];

    for(const key in dataSector) {
        if(
            dataSector[key].label && dataSector[key].label.toString().trim().length > 0
        ) {
            collaterals.push(dataSector[key].label)
        }
    }

    return collaterals.length > 0 ? collaterals : false;
}

export function constructMandatory (dataMandatory) {
    let mandatory = [];

    for(const key in dataMandatory) {
        if(
            dataMandatory[key].label && dataMandatory[key].label.toString().trim().length > 0 &&
            dataMandatory[key].type && dataMandatory[key].type.toString().trim().length > 0 &&
            dataMandatory[key].value && dataMandatory[key].value.toString().trim().length > 0
        ) {  
            mandatory.push(dataMandatory[key])   
        }
    }

    return mandatory.length > 0 ? mandatory : false;
}