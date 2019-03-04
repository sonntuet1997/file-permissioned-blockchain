'use strict';

// --------------------------------------EMPLOYEE-----------------------------------------
/**
 * Create the LOC asset
 * @param {transaction.file.CreateFileEncrypted} createFileEncrypted
 * @transaction
 */
async function createFileEncrypted(request) {
    const factory = getFactory();
    const namespace = 'file';
    const asset = factory.newResource(namespace, 'FileEncrypted', request.uid);
    const assetRegistry = await getAssetRegistry(asset.getFullyQualifiedType());
    let check = true;
    let original;
    try{
        original = await assetRegistry.get(request.uid);
    } catch (e){
        check = false
    }
    if(original != null){
        if (original.checksum != '') throw error(16,{},"error 16");
    }
    copyProperty(asset, request);
    asset.propose_list = [];
    asset.vote_result_list = [];
    // asset.issuer = factory.newRelationship(namespace, 'Employee', getCurrentAsset().getIdentifier());
    try{
        if(asset.control_info.required_list == null 
            || asset.control_info.required_list.some(val => { 
            return !asset.access_info_list.some(x => val.getIdentifier() == x.user.getIdentifier());}
        )){
            throw error(4,{}, "error 4");
        };
        if(asset.control_info.optional_list == null 
            || asset.control_info.optional_list.some(val => { 
            return !asset.access_info_list.some(x => val.getIdentifier() == x.user.getIdentifier());}
        )){
            throw error(5,{}, "error 5");
        };
        if(asset.control_info.thresh_hold > asset.control_info.optional_list.length)
            throw error(6,{}, "error 6");
        asset.access_info_list.forEach(element => {
            element.crypto_list.forEach(e =>{
                e.issuer = element.user;
            })
        });
        if(check){
            await assetRegistry.update(asset);
        } else{
            await assetRegistry.add(asset);
        }        
    } catch (e){
        throw e;
        // throw error(3,e,"error 3");
    }
    const event = factory.newEvent('transaction.file', 'CreateFileEncryptedEvent');
    event.file = asset;
    const time = Date.now();
    const log = factory.newResource(namespace, 'Log', request.uid+Date.now());
    log.timestamp = new Date(time);
    log.action = "CREATE";
    log.file = asset;
    log.user = getCurrentParticipant();
    const logRegistry = await getAssetRegistry(log.getFullyQualifiedType());
    await logRegistry.add(log);
    emit(event);
}

/**
 * Create the LOC asset
 * @param {transaction.file.UpdateFileEncrypted} updateFileEncrypted
 * @transaction
 */
async function updateFileEncrypted(request) {
    const factory = getFactory();
    const namespace = 'file';
    const asset = factory.newResource(namespace, 'FileEncrypted', request.uid);
    copyProperty(asset, request);
    asset.propose_list = [];
    asset.vote_result_list = [];
    const assetRegistry = await getAssetRegistry(asset.getFullyQualifiedType());
    const original = await assetRegistry.get(request.uid);
    // asset.issuer = factory.newRelationship(namespace, 'Employee', getCurrentAsset().getIdentifier());
    try{
        if(original.control_info.required_list == null 
            || original.control_info.required_list.some(val => { 
            return !original.access_info_list.some(x => val.getIdentifier() == x.user.getIdentifier());}
        )){
            throw error(4,{}, "error 4");
        };
        if(original.control_info.optional_list == null 
            || original.control_info.optional_list.some(val => { 
            return !original.access_info_list.some(x => val.getIdentifier() == x.user.getIdentifier());}
        )){
            throw error(5,{}, "error 5");
        };
        if(asset.control_info.thresh_hold > asset.control_info.optional_list.length)
            throw error(6,{}, "error 6");
        let propose = factory.newConcept(namespace,"ProposeFile");
        propose.proposing_file = asset;
        propose.file_action = 'UPDATE'; 
        const time = Date.now();
        propose.timestamp = new Date(time);
        original.propose_list.push(propose);
        await assetRegistry.update(original);
    } catch (e){
        throw e;
        // throw error(3,e,"error 3");
    }
    const event = factory.newEvent('transaction.file', 'UpdateFileEncryptedEvent');
    event.file = asset;
    const time = Date.now();
    const log = factory.newResource(namespace, 'Log', request.uid+Date.now());
    log.timestamp = new Date(time);
    log.action = "PROPOSE_UPDATE";
    log.file = asset;
    log.user = getCurrentParticipant();
    const logRegistry = await getAssetRegistry(log.getFullyQualifiedType());
    await logRegistry.add(log);
    emit(event);
}

/**
 * Create the LOC asset
 * @param {transaction.file.DeleteFileEncrypted} deleteFileEncrypted
 * @transaction
 */
async function deleteFileEncrypted(request) {
    const factory = getFactory();
    const namespace = 'file';
    const asset = factory.newResource(namespace, 'FileEncrypted', request.uid);
    asset.propose_list = [];
    asset.vote_result_list = [];
    asset.control_info = factory.newConcept(namespace,"ControlInfo");
    asset.control_info.required_list = [];
    asset.control_info.optional_list = [];
    asset.control_info.thresh_hold = 0;
    asset.meta_data = '';
    asset.checksum = '';
    asset.access_info_list = [];
    const assetRegistry = await getAssetRegistry(asset.getFullyQualifiedType());
    const original = await assetRegistry.get(request.uid);
    // asset.issuer = factory.newRelationship(namespace, 'Employee', getCurrentAsset().getIdentifier());
    try{
        if(original.control_info.required_list == null 
            || original.control_info.required_list.some(val => { 
            return !original.access_info_list.some(x => val.getIdentifier() == x.user.getIdentifier());}
        )){
            throw error(4,{}, "error 4");
        };
        if(original.control_info.optional_list == null 
            || original.control_info.optional_list.some(val => { 
            return !original.access_info_list.some(x => val.getIdentifier() == x.user.getIdentifier());}
        )){
            throw error(5,{}, "error 5");
        };
        let propose = factory.newConcept(namespace,"ProposeFile");
        propose.proposing_file = asset;
        propose.file_action = 'DELETE'; 
        const time = Date.now();
        propose.timestamp = new Date(time);
        original.propose_list.push(propose);
        await assetRegistry.update(original);
    } catch (e){
        throw e;
        // throw error(3,e,"error 3");
    }
    const event = factory.newEvent('transaction.file', 'DeleteFileEncryptedEvent');
    event.file = asset;
    const time = Date.now();
    const log = factory.newResource(namespace, 'Log', request.uid+Date.now());
    log.timestamp = new Date(time);
    log.action = "PROPOSE_DELETE";
    log.file = asset;
    log.user = getCurrentParticipant();
    const logRegistry = await getAssetRegistry(log.getFullyQualifiedType());
    await logRegistry.add(log);
    emit(event);
}

/**
 * Create the LOC asset
 * @param {transaction.file.AcceptProposedFileEncrypted} acceptProposedFileEncrypted
 * @transaction
 */
async function acceptProposedFileEncrypted(request) {
    const factory = getFactory();
    const namespace = 'file';
    const assetRegistry = await getAssetRegistry(namespace + ".FileEncrypted");
    const asset = await assetRegistry.get(request.uid);
    if(asset.propose_list == null) throw error(8, {}, "error 8");
    let filePropose = asset.propose_list.find(d => d.timestamp.getTime() == request.timestamp_id.getTime());
    if(filePropose == null) throw error(14,{},"error 14");
    if(asset.control_info.required_list.every(val => val.getIdentifier() != getCurrentParticipant().getIdentifier())
    &&asset.control_info.optional_list.every(val => val.getIdentifier() != getCurrentParticipant().getIdentifier())){
        throw error(7,{}, "error 7");
    }
    const index = filePropose.proposing_file.vote_result_list.findIndex(x => x.user.getIdentifier() == getCurrentParticipant().getIdentifier());
    if(index < 0){
        let vote = factory.newConcept(namespace,"Vote");
        vote.user = getCurrentParticipant();
        vote.is_accept = true;
        filePropose.proposing_file.vote_result_list.push(vote);
    } else {
        filePropose.proposing_file.vote_result_list[index].is_accept = true;
    };
    const voted_number = asset.control_info.optional_list.filter(x => filePropose.proposing_file.vote_result_list.some(y => x.getIdentifier() == y.user.getIdentifier()));
    if(voted_number >= asset.control_info.thresh_hold && 
        asset.control_info.required_list.every(x => filePropose.proposing_file.vote_result_list.some(y => x.getIdentifier() == y.user.getIdentifier()))){
            copyProperty(asset,filePropose.proposing_file);
            asset.propose_list = [];
        }
    await assetRegistry.update(asset);
    const event = factory.newEvent('transaction.file', 'AcceptProposedFileEncryptedEvent');
    event.file = asset;
    const time = Date.now();
    const log = factory.newResource(namespace, 'Log', request.uid+Date.now());
    log.timestamp = new Date(time);
    log.action = "APPROVE_UPDATE";
    log.file = asset;
    log.user = getCurrentParticipant();
    const logRegistry = await getAssetRegistry(log.getFullyQualifiedType());
    await logRegistry.add(log);
    emit(event);
}


/**
 * Create the LOC asset
 * @param {transaction.file.RejectProposedFileEncrypted} rejectProposedFileEncrypted
 * @transaction
 */
async function rejectProposedFileEncrypted(request) {
    const factory = getFactory();
    const namespace = 'file';
    const assetRegistry = await getAssetRegistry(namespace + ".FileEncrypted");
    const asset = await assetRegistry.get(request.uid);
    if(asset.propose_list == null) throw error(8, {}, "error 8");
    let filePropose = asset.propose_list.find(d => d.timestamp.getTime() == request.timestamp_id.getTime());
    if(filePropose == null) throw error(14,{},"error 14");
    if(asset.control_info.required_list.every(val => val.getIdentifier() != getCurrentParticipant().getIdentifier())
    &&asset.control_info.optional_list.every(val => val.getIdentifier() != getCurrentParticipant().getIdentifier())){
        throw error(7,{}, "error 7");
    }
    const index = filePropose.proposing_file.vote_result_list.findIndex(x => x.user.getIdentifier() == getCurrentParticipant().getIdentifier());
    if(index < 0){
        let vote = factory.newConcept(namespace,"Vote");
        vote.user = getCurrentParticipant();
        vote.is_accept = false;
        filePropose.proposing_file.vote_result_list.push(vote);
    } else {
        filePropose.proposing_file.vote_result_list[index].is_accept = false;
    };
    await assetRegistry.update(asset);
    const event = factory.newEvent('transaction.file', 'RejectProposedFileEncryptedEvent');
    event.file = asset;
    const time = Date.now();
    const log = factory.newResource(namespace, 'Log', request.uid+Date.now());
    log.timestamp = new Date(time);
    log.action = "REJECT_UPDATE";
    log.file = asset;
    log.user = getCurrentParticipant();
    const logRegistry = await getAssetRegistry(log.getFullyQualifiedType());
    await logRegistry.add(log);
    emit(event);
}


/**
 * Create the LOC asset
 * @param {transaction.file.ProposeReadFileEncrypted} proposeReadFileEncrypted
 * @transaction
 */
async function proposeReadFileEncrypted(request) {
    const factory = getFactory();
    const namespace = 'file';
    const assetRegistry = await getAssetRegistry(namespace + ".FileEncrypted");
    const asset = await assetRegistry.get(request.uid);
    let propose = asset.access_info_list.find(x => x.user.getIdentifier() == getCurrentParticipant().getIdentifier());
    if (propose == null) {
        propose = factory.newConcept(namespace,"AccessInfo");
        propose.user = getCurrentParticipant();
        propose.crypto_list = []; 
        asset.access_info_list.push(propose);
    };
    propose.crypto_list = propose.crypto_list.filter(x => x.encrypted_key != "");
    await assetRegistry.update(asset);
    const event = factory.newEvent('transaction.file', 'ProposeReadFileEncryptedEvent');
    event.file = asset;
    const time = Date.now();
    const log = factory.newResource(namespace, 'Log', request.uid+Date.now());
    log.timestamp = new Date(time);
    log.action = "READ_PROPOSE";
    log.file = asset;
    log.user = getCurrentParticipant();
    const logRegistry = await getAssetRegistry(log.getFullyQualifiedType());
    await logRegistry.add(log);
    emit(event);
}

/**
 * Create the LOC asset
 * @param {transaction.file.AcceptReadFileEncrypted} acceptReadFileEncrypted
 * @transaction
 */
async function acceptReadFileEncrypted(request) {
    const factory = getFactory();
    const namespace = 'file';
    const assetRegistry = await getAssetRegistry(namespace + ".FileEncrypted");
    const asset = await assetRegistry.get(request.uid);
    if(request.access_info.crypto_list.length < 1) throw error(11,{}, "error 11");
    if(asset.control_info.required_list.every(val => val.getIdentifier() != getCurrentParticipant().getIdentifier())
    &&asset.control_info.optional_list.every(val => val.getIdentifier() != getCurrentParticipant().getIdentifier())){
        throw error(7,{}, "error 7");
    }
    if(request.access_info.user.getIdentifier() == getCurrentParticipant().getIdentifier()){
        throw error(13,{},"error 13");
    }
    let access_info = asset.access_info_list.find(x => x.user.getIdentifier() == request.access_info.user.getIdentifier());
    if (access_info == null) throw error(10,{},"error 10");
    let crypto = access_info.crypto_list.find(x => x.issuer.getIdentifier() == getCurrentParticipant().getIdentifier());
    if (crypto == null){
        crypto = factory.newConcept(namespace,"Crypto");
        access_info.crypto_list.push(crypto);
    }
    copyProperty(crypto,request.access_info.crypto_list[0]);
    crypto.issuer = getCurrentParticipant();
    await assetRegistry.update(asset);
    const event = factory.newEvent('transaction.file', 'AcceptReadFileEncryptedEvent');
    event.file = asset;
    const time = Date.now();
    const log = factory.newResource(namespace, 'Log', request.uid+Date.now());
    log.timestamp = new Date(time);
    log.action = "APPROVE_READ_PROPOSE";
    log.file = asset;
    log.user = getCurrentParticipant();
    const logRegistry = await getAssetRegistry(log.getFullyQualifiedType());
    await logRegistry.add(log);
    emit(event);
}

/**
 * Create the LOC asset
 * @param {transaction.file.RejectReadFileEncrypted} rejectReadFileEncrypted
 * @transaction
 */
async function rejectReadFileEncrypted(request) {
    const factory = getFactory();
    const namespace = 'file';
    const assetRegistry = await getAssetRegistry(namespace + ".FileEncrypted");
    const asset = await assetRegistry.get(request.uid);
    if(request.access_info.crypto_list.length < 1) throw error(11,{}, "error 11");
    if(asset.control_info.required_list.every(val => val.getIdentifier() != getCurrentParticipant().getIdentifier())
    &&asset.control_info.required_list.every(val => val.getIdentifier() != getCurrentParticipant().getIdentifier())){
        throw error(7,{}, "error 7");
    }
    if(request.access_info.user.getIdentifier() == getCurrentParticipant().getIdentifier()){
        throw error(13,{},"error 13");
    }
    let access_info = asset.access_info_list.find(x => x.user.getIdentifier() == request.access_info.user.getIdentifier());
    if (access_info == null) throw error(10,{},"error 10");
    let crypto = access_info.crypto_list.find(x => x.issuer.getIdentifier() == getCurrentParticipant().getIdentifier());
    if (crypto == null){
        crypto = factory.newConcept(namespace,"Crypto");
        access_info.crypto_list.push(crypto);
    }
    copyProperty(crypto,request.access_info.crypto_list[0]);
    crypto.issuer = getCurrentParticipant();
    crypto.encrypted_key = "";
    await assetRegistry.update(asset);
    const event = factory.newEvent('transaction.file', 'AcceptReadFileEncryptedEvent');
    event.file = asset;
    const time = Date.now();
    const log = factory.newResource(namespace, 'Log', request.uid+Date.now());
    log.timestamp = new Date(time);
    log.action = "REJECT_READ_PROPOSE";
    log.file = asset;
    log.user = getCurrentParticipant();
    const logRegistry = await getAssetRegistry(log.getFullyQualifiedType());
    await logRegistry.add(log);
    emit(event);
}