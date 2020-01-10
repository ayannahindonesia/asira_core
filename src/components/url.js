//  export const serverUrl="https://virtserver.swaggerhub.com/ayannahindonesia/Asira_Lender/1.0.0/"
//  export const serverUrlBorrower="https://cors-anywhere.herokuapp.com/http://asira.ayannah.com/api-borrower/"

export const serverUrl=window.location.origin.includes('staging') ? 
"https://staging.ayannah.co.id/api-lender/" :
"https://cors-anywhere.herokuapp.com/http://staging.ayannah.co.id/api-lender/";

export const serverUrlBorrower=window.location.origin.includes('staging') ? 
"https://staging.ayannah.co.id/api-borrower/" :
"https://cors-anywhere.herokuapp.com/http://staging.ayannah.co.id/api-borrower/";

export const serverUrlGeo=window.location.origin.includes('staging') ? 
"https://staging.ayannah.co.id/api-geomapping/" :
"https://cors-anywhere.herokuapp.com/http://staging.ayannah.co.id/api-geomapping/"
