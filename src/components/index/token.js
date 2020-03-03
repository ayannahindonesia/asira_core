import SecureLS from 'secure-ls';
import md5 from 'md5';

const newLs = new SecureLS({encodingType: 'aes', isCompression: true, encryptionSecret:'r3a(t@yaN&Ah'}); 

export function setTokenAuth(token) {
    newLs.set(md5('tokenAuth'), token);
}

export function setToken(token, expires) {
    newLs.set(md5('token'), token);
    newLs.set(md5('tokenTime'), expires);
}

export function setTokenGeo(tokenGeo) {
    newLs.set(md5('tokenGeo'), tokenGeo);
}

export function setTokenLog(tokenLog) {
    newLs.set(md5('tokenLog'), tokenLog);
}

export function setProfileUser(profileUser) {
    newLs.set(md5('profileUser'), profileUser);
}

export function getTokenAuth() {
    return newLs.get(md5('tokenAuth'));
}

export function getToken() {
    const newDateToken = new Date().getTime();
    const timeExpires = newLs.get(md5('tokenTime')) ? parseInt(newLs.get(md5('tokenTime'))) : new Date().getTime();

    if(newDateToken > timeExpires) {
        localStorage.clear();
        return null
    }
    
    return newLs.get(md5('token'));
}

export function getTokenGeo() {
    const newDateToken = new Date().getTime();
    const timeExpires = newLs.get(md5('tokenTime')) ? parseInt(newLs.get(md5('tokenTime'))) : new Date().getTime();
    
    if(newDateToken > timeExpires) {
        localStorage.clear();
        return null
    }

    return newLs.get(md5('tokenGeo'));
}

export function getProfileUser() {
    const newDateToken = new Date().getTime();
    const timeExpires = newLs.get(md5('tokenTime')) ? parseInt(newLs.get(md5('tokenTime'))) : new Date().getTime();
    
    if(newDateToken > timeExpires) {
        localStorage.clear();
        return null
    }

    return newLs.get(md5('profileUser'));
}

export function getTokenLog() {
    const newDateToken = new Date().getTime();
    const timeExpires = newLs.get(md5('tokenTime')) ? parseInt(newLs.get(md5('tokenTime'))) : new Date().getTime();
    
    if(newDateToken > timeExpires) {
        localStorage.clear();
        return null
    }

    return newLs.get(md5('tokenLog'));
}