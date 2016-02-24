# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
window.client = new Faye.Client('/faye')

jQuery ->

  try
    client.unsubscribe '/comments'
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/comments', (payload) ->
    console.log(payload)
    $('#chat').append(payload.message) if payload.message

  try
    client.unsubscribe '/entity/create/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/entity/create/' + gon.diagram_id  , (message) ->
    createEntity(message.x, message.y);

  try
    client.unsubscribe '/entity/move/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/entity/move/'+ gon.diagram_id, (message) ->
    moveEntity(message.entity_id, message.transform);
    moveRelation(message.entity_id);

  try
    client.unsubscribe '/entity/updateTitle/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/entity/updateTitle/'+ gon.diagram_id, (message) ->
    updateTitle(message.entity_id, message.text);

  try
    client.unsubscribe '/entity/delete/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/entity/delete/'+ gon.diagram_id, (message) ->
    deleteEntity(message.entity_id);

  try
    client.unsubscribe '/relation/create/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/relation/create/'+ gon.diagram_id, (message) ->
    createRelation(message);

  try
    client.unsubscribe '/relation/delete/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/relation/delete/'+ gon.diagram_id, (message) ->
    deleteRelationByID(message.relation_id);

  try
    client.unsubscribe '/relation/updateStart/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/relation/updateStart/'+ gon.diagram_id, (message) ->
    updateStartRelationByID(message.relation_id, message.marker_start);

  try
    client.unsubscribe '/relation/updateEnd/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/relation/updateEnd/'+ gon.diagram_id, (message) ->
    updateEndRelationByID(message.relation_id, message.marker_end);

  try
    client.unsubscribe '/relation/updateName/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/relation/updateName/'+ gon.diagram_id, (message) ->
    updateRelationName(message.relation_id, message.text);

  try
    client.unsubscribe '/atribute/updateName/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/atribute/updateName/'+ gon.diagram_id, (message) ->
    updateAtributeName(message.atribute_id, message.text);

  try
    client.unsubscribe '/atribute/delete/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/atribute/delete/'+ gon.diagram_id, (message) ->
    deleteAtribute(message.atribute_id, message.rect_height);

  try
    client.unsubscribe '/atribute/increase/'+ gon.diagram_id
  catch
    console?.log "Can't unsubscribe." # print a message only if console is defined

  client.subscribe '/atribute/increase/'+ gon.diagram_id, (message) ->
    increaseAtributes(message.entidad_id, message.atribute_id , message.texts, message.size, message.count, message.offset);

