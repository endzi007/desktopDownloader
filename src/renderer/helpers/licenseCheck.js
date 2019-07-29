import persistStore from '../../main/helpers/persistStore';
import fetch from 'node-fetch';
import { machineId } from 'node-machine-id';
import { CHECK_LICENSE_ADDRESS } from '../../appConfig';

export default () => {
    let storageItem = persistStore.get("license");
    return new Promise(async (resolve, reject)=>{
        if(storageItem !== undefined){
            let parsedStorage = JSON.parse(storageItem);
            let key = parsedStorage.license_key;
            let url = `${CHECK_LICENSE_ADDRESS}${key}`;
            let licenseResponse;
            try {
                licenseResponse = await fetch(url).then(response=> response.json());
                if(licenseResponse.status === "error"){
                    //dispatch licence failed and increase licence failed by 1
                    resolve("INC");
                } else {
                    let id = await machineId();
                    for(let domain of licenseResponse.registered_domains){
                        if(domain.registered_domain === id){
                            //dispatch licenced and reset failed counter to 0
                            resolve("RESET");
                            break;       
                        } else {
                            //dispatch licence failed and increase failed counter by 1
                            resolve("INC");
                        }
                    }
                }
            } catch (error) {
                reject("Fetch license server failed");
            }
        }
    });
}