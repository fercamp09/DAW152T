# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
window.client = new Faye.Client('/faye')

jQuery ->
  try
    client.unsubscribe '/entity/create'
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/entity/create', (message) ->
    createEntity(message.x, message.y);

  try
    client.unsubscribe '/entity/move'
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/entity/move', (message) ->
    moveEntity(message.entity_id, message.transform);
    moveRelation(message.entity_id);

  try
    client.unsubscribe '/entity/updateTitle'
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/entity/updateTitle', (message) ->
    updateTitle(message.entity_id, message.text);

  try
    client.unsubscribe '/entity/delete'
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/entity/delete', (message) ->
    deleteEntity(message.entity_id);

  try
    client.unsubscribe '/relation/create'
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/relation/create', (message) ->
    createRelation(message);

  try
    client.unsubscribe '/relation/delete'
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/relation/delete', (message) ->
    deleteRelationByID(message.relation_id);

  try
    client.unsubscribe '/relation/updateStart'
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/relation/updateStart', (message) ->
    updateStartRelationByID(message.relation_id, message.marker_start);

  try
    client.unsubscribe '/relation/updateEnd'
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/relation/updateEnd', (message) ->
    updateEndRelationByID(message.relation_id, message.marker_end);

  try
    client.unsubscribe '/relation/updateName'
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/relation/updateName', (message) ->
    updateRelationName(message.relation_id, message.text);

