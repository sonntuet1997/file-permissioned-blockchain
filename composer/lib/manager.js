'use strict';

// --------------------------------------ADMIN / MANAGER-----------------------------------------
/**
 * Create the LOC asset
 * @param {transaction.manager.CreateUser} createUser
 * @transaction
 */
async function createUser(request) {
    const factory = getFactory();
    const namespace = 'manager';
    const participant = factory.newResource(namespace, 'User', request.uid);
    copyProperty(participant,request);
    if(isNetworkAdmin()){
        if(participant.manager == false) throw error(1,{id : getCurrentParticipant().getIdentifier()},"Unauthorized!");
        participant.admin = factory.newRelationship("org.hyperledger.composer.system", 'NetworkAdmin', getCurrentParticipant().getIdentifier());
        participant.issuer = null;
    } else{
        if(participant.manager == true) throw error(2,{id : getCurrentParticipant().getIdentifier()},"Unauthorized!");
        participant.admin = null;
        participant.issuer = factory.newRelationship(namespace, 'User', getCurrentParticipant().getIdentifier());
    }
    const participantRegistry = await getParticipantRegistry(participant.getFullyQualifiedType());
    await participantRegistry.add(participant);
    const event = factory.newEvent('transaction.manager', 'CreateUserEvent');
    event.user = participant;
    emit(event);
}

/**
 * Create the LOC asset
 * @param {transaction.manager.UpdateUser} updateUser
 * @transaction
 */
async function updateUser(request) {
    const factory = getFactory();
    const namespace = 'manager';
    const participantRegistry = await getParticipantRegistry(namespace + '.User'); // eslint-disable-line no-undef
    const participant = await participantRegistry.get(request.uid);
    if(isNetworkAdmin()){
        if(participant.manager == false) throw error(1,{id : getCurrentParticipant().getIdentifier()},"Unauthorized!");
        participant.admin = factory.newRelationship("org.hyperledger.composer.system", 'NetworkAdmin', getCurrentParticipant().getIdentifier());
        participant.issuer = null;
    } else{
        if(participant.manager == true) throw error(2,{id : getCurrentParticipant().getIdentifier()},"Unauthorized!");
        participant.admin = null;
        participant.issuer = factory.newRelationship(namespace, 'User', getCurrentParticipant().getIdentifier());
    }
    copyProperty(participant,request);
    await participantRegistry.update(participant);
    const event = factory.newEvent('transaction.manager', 'UpdateUserEvent');
    event.user = participant;
    emit(event);
}

/**
 * Create the LOC asset
 * @param {transaction.manager.DeleteUser} deleteUser
 * @transaction
 */
async function deleteUser(request) {
    const factory = getFactory();
    const namespace = 'manager';
    const participantRegistry = await getParticipantRegistry(namespace + '.User'); // eslint-disable-line no-undef
    const participant = await participantRegistry.get(request.uid);
    if(isNetworkAdmin()){
        if(participant.manager == false) throw error(1,{id : getCurrentParticipant().getIdentifier()},"Unauthorized!");
    } else{
        if(participant.manager == true) throw error(2,{id : getCurrentParticipant().getIdentifier()},"Unauthorized!");
    }
    await participantRegistry.remove(participant);
    const event = factory.newEvent('transaction.manager', 'DeleteUserEvent');
    event.user = participant;
    emit(event);
}

// --------------------------------------ADMIN / MANAGER-----------------------------------------
/**
 * Create the LOC asset
 * @param {transaction.manager.CreateFileServer} createFileServer
 * @transaction
 */
async function createFileServer(request) {
    const factory = getFactory();
    const namespace = 'manager';
    const participant = factory.newResource(namespace, 'FileServer', request.uid);
    copyProperty(participant,request);
    if(!isNetworkAdmin()){
         throw error(1,{id : getCurrentParticipant().getIdentifier()},"Unauthorized!");
    }
    const participantRegistry = await getParticipantRegistry(participant.getFullyQualifiedType());
    await participantRegistry.add(participant);
    const event = factory.newEvent('transaction.manager', 'CreateFileServerEvent');
    event.fileServer = participant;
    emit(event);
}

/**
 * Create the LOC asset
 * @param {transaction.manager.UpdateFileServer} updateFileServer
 * @transaction
 */
async function updateFileServer(request) {
    const factory = getFactory();
    const namespace = 'manager';
    const participantRegistry = await getParticipantRegistry(namespace + '.FileServer'); // eslint-disable-line no-undef
    const participant = await participantRegistry.get(request.uid);
    if(!isNetworkAdmin()){
        throw error(1,{id : getCurrentParticipant().getIdentifier()},"Unauthorized!");
    }
    copyProperty(participant,request);
    await participantRegistry.update(participant);
    const event = factory.newEvent('transaction.manager', 'UpdateFileServerEvent');
    event.fileServer = participant;
    emit(event);
}


// --------------------------------------FILE SERVER-----------------------------------------
/**
 * Create the LOC asset
 * @param {transaction.manager.LogRequest} logRequest
 * @transaction
 */
async function logRequest(request) {
    const factory = getFactory();
    const event = factory.newEvent('transaction.manager', 'LogRequestEvent');
    const log = factory.newResource('file', 'Log', request.file.getIdentifier()+Date.now());
    const time = Date.now();
    log.timestamp = new Date(time);
    log.action = request.action;
    log.file = request.file;
    log.user = request.user;
    const logRegistry = await getAssetRegistry(log.getFullyQualifiedType());
    await logRegistry.add(log);
    event.file = request.file;
    emit(event);
}
