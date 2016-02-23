var texts = [];
var offset, size, count = 0;
var selectedLine;
var client;
$(document).ready(
    function(){
        $( ".draggable" ).draggable({
            revert: false
        });
        $( ".work-area" ).droppable({
            drop: function( event, ui ) {
                cloneMouseup();
            },
            over: function( event, ui ) {
            },
            out: function( event, ui ) {
            }
        });
        $(".btn-share").click(function() {
            $( ".highlight" ).effect( "highlight" );
        });
    });


/*$(function() {
 $( "#accordion" ).accordion({
 heightStyle: "fill",
 minHeight: 200
 });
 });*/
//<script src="http://code.jquery.com/jquery-1.10.2.js"></script> -->
//$('#imagen-svg').val('<?xml version="1.0" encoding="iso-8859-1"?><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 500" style="enable-background:new 0 0 1000 500;" xml:space="preserve">' + s.toString() + '</svg>');

// Funcion para guardar al dar click en guardar
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $('#guardar').click(function(){
        saveDiagram();
    })
});

function saveDiagram(){
    var diagram_entities = Object.create(null);
    //var diagram_entities = [];
    var diagram_relations = [];

    var entities = s.selectAll('.entidad');
    for (var i = 0; i < entities.length; i++) {
        var borde = entities[i].select('.cuadrado');
        var entidad = {
            x0: borde.attr('x'),
            y0: borde.attr('y'),
            width: borde.attr('width'),
            height: borde.attr('height'),
            title: entities[i].select('.titulo').attr('text'),
            transform: entities[i].attr('transform').toString(),
            svg_id: entities[i].attr('id'),
            atributes: []
        };
        atributes = entities[i].selectAll('.atributo');
        for (var j = 0; j < atributes.length; j++) {
            atribute = atributes[j];
            atributo = {
                info: atribute.attr('text'),
                x: atribute.attr('x'),
                y: atribute.attr('y'),
                atribute_class: atribute.attr('class'),
                svg_id: atribute.attr('id')
            };
            entidad.atributes.push(atributo);
        }
        diagram_entities[i] = entidad;
    }

    relations = s.selectAll('.relation');
    for (var i = 0; i < relations.length; i++) {
        var line = relations[i].select('line');
        var styles = line.attr('style').toString().split(';');
        var relation = {
            arrow_start: styles[1].split(':')[1],
            arrow_end: styles[2].split(':')[1],
            relation_class: line.attr('class'),
            x1: line.attr('x1'),
            y1: line.attr('y1'),
            x2: line.attr('x2'),
            y2: line.attr('y2'),
            name: relations[i].select('text').attr('text'),
            svg_id: relations[i].attr('id')
        };
        diagram_relations[i] = relation;
    }
    $('#imagen-svg-entities').val(JSON.stringify(diagram_entities));
    $('#imagen-svg-relations').val(JSON.stringify(diagram_relations));
}

$(function() {
    $( "#accordion-resizer" ).resizable({
        minHeight: 200,
        minWidth: 140,
        resize: function() {
            //$( "#accordion" ).accordion( "refresh" );
        }
    });
});

function changeTitle (event){
    var input = $("#modificadorTexto");
    input.attr("value","px");
    input.attr("type","text");
    input.css("top","" +  event.target.getBoundingClientRect().top  + "px");
    input.css("left","" + event.target.getBoundingClientRect().left + "px");
    input.css("width","" + event.target.getBoundingClientRect().width + "px");

    input.change(function(){
        event.target.innerHTML = input.attr("value");
    });
}

// Para crear la entidad en el area de dibujo
function cloneMouseup(event) {
    var svg = $("#svg");
    var x0 = svg.position().left;
    var y0 = svg.position().top;
    var x_in_canvas = this.event.clientX -x0;
    var y_in_canvas = this.event.clientY -y0;
    //var x_in_canvas = 0;
    //var y_in_canvas = 0;
    client.publish('/entity/create/'+ gon.diagram_id, {
        x: x_in_canvas,
        y: y_in_canvas
    });
    //createEntity(x_in_canvas, y_in_canvas);
    // No funciona porque se carga como imagen
    //var loadedImage = s.image("resources/paleta/entidad.svg", x_in_canvas , y_in_canvas , 100, 100);
    //processImage(loadedImage);
}

// Para cargar las imagenes de la paleta mediante ajax, en realidad solo hay una entidad
function loadThumbnails(e) {
    var name, image, recent, bigDiv;
    xmlFile = e.target.responseXML;
    bigDiv = document.querySelector("#paleta1");
    recent = xmlFile.getElementsByTagName("file");
    rowDiv = document.createElement("div");
    for (i = 0; i < recent.length; i++) {
        var div, img, p1,  sep, a, rowDiv;
        name = recent[i].getElementsByTagName("name")[0].firstChild.nodeValue;
        image = recent[i].getElementsByTagName("image")[0].firstChild.nodeValue;

        div = document.createElement("div");
        img = document.createElement("img");
        sep = document.createElement("div");

        div.setAttribute("class", "paleta-icon ui-widget-content col-xs-6 thumbnail");
        img.setAttribute("src", image);
        img.setAttribute("data-toggle", "tooltip");
        img.setAttribute("alt", name);
        img.setAttribute("title", name);
        img.setAttribute("class", "tamanio-grande");
        img.setAttribute("id", "imagen-entidad");

        if (i % 2 == 0){
            rowDiv = document.createElement("div");
            rowDiv.setAttribute("class", "row");
        }
        $( img ).draggable({
            helper: 'clone'/*,
             start: function (e, ui) {
             ui.helper.animate({
             width: 80,
             height: 50
             });
             },*/
            //cursorAt: {left:40, top:25}
        });
        //$( div ).mouseup(cloneMouseup);
        div.appendChild(img);
        rowDiv.appendChild(div);
        bigDiv.appendChild(rowDiv);
    }
}

function addTextListener (text){
    text.ondblclick = (function (event) {
        var input = $("#modificadorTexto");
        input.val("");
        input.css("visibility", "visible");
        input.css("top", "" + event.target.getBoundingClientRect().top + "px");
        input.css("left", "" + event.target.parentNode.getBoundingClientRect().left + "px");
        input.css("width", "" + event.target.parentNode.getBoundingClientRect().width + "px");
        // Cambiar la referencia al titulo actual del doble click
        selectedTitle = this;
    });
}

function increaseAtributes(entidad_id, atribute_id , text, size, count, offset){
    var texts = text.split(",");
    nodoActual = document.getElementById(atribute_id);
    rectangulo = nodoActual.parentNode.parentNode.children[0].children[0];
    console.log(texts);
    console.log(nodoActual);
    console.log(rectangulo);

    for(var i = 0; i < texts.length; i++){
        if(texts[i] != ""){
            $(nodoActual).removeAttr('id');
            var nuevoNodo = nodoActual.cloneNode(true);
            nuevoNodo.setAttribute("id", "atrib" + "-" + entidad_id + "-" + offset++);
            nuevoNodo.setAttribute("y", size);
            nuevoNodo.innerHTML = texts[i];
            nodoActual.parentNode.appendChild(nuevoNodo);
            size = parseInt(size) + 18;
            addTextListener(nuevoNodo);
            count = count + 1;
        }
    }
    rectangulo.setAttribute("height", parseInt(rectangulo.getAttribute("height")) + parseInt(20*(count-1)));
    //position = parseInt(rectangulo.getAttribute("height"));
    nodoActual.parentNode.removeChild(nodoActual);
}

function initializePage() {
    // Enable pusher logging - don't include this in production
    /*Pusher.log = function(message) {
     if (window.console && window.console.log) {
     window.console.log(message);
     }
     };

     var pusher = new Pusher('a9b2299f7e5ae6b4e8a7', {
     encrypted: true
     });
     var channel = pusher.subscribe('my-channel');
     channel.bind('my_event', function(data) {
     alert(data.message);
     });
     */
    var file = "resources/xml/panel.xml";
    var request = new XMLHttpRequest();
    request.addEventListener("load", loadThumbnails, false);
    request.open("GET", file, true);
    request.send();
    //document.getElementById("guardar").addEventListener("click", guardarSVG, false);
    // Load Snap
    s = Snap("#svg");
    // Create input type:text
    var textbox = document.createElement("input");
    $( "body" ).append(textbox);
    var input = $(textbox);
    input.attr("id","modificadorTexto");
    input.css("position","absolute");
    input.css("top","-100px");
    input.css("left","-100px");
    input.attr("value","px");
    input.attr("type","text");
    // Registrar el event handler para el enter en el input
    input = $("#modificadorTexto");
    var i, nodoActual, rectangulo, position;
    input.keypress(function (e) {
        nodoActual = selectedTitle.node || selectedTitle;
        rectangulo = nodoActual.parentNode.parentNode.children[0].children[0];
        var rectChildren = nodoActual.parentNode.children;
        var input = $("#modificadorTexto");
        if (e.keyCode == 13) {
            count = 0;
            // Para el enter en el ultimo atributo de la entidad
            if(nodoActual == nodoActual.parentNode.lastElementChild){
                // Aumentar atributos desde el ultimo atributo
                if(input.val() != ""){
                    // offset es una variable para indicar el ultimo numero de id de la entidad actual, o cero en caso de no existir
                    offset = parseInt(nodoActual.getAttribute("id").toString().split("-")[2]) || 0;
                    size = nodoActual.getAttribute("y");
                    // Dividir el texto del input en un arreglo de textos, cada uno sera un nuevo atributo
                    //texts = input.val().toString().split(",");
                    var entidad_id = nodoActual.parentNode.parentNode.getAttribute('id').split("-")[1];
                    client.publish('/atribute/increase/'+ gon.diagram_id, {
                        entidad_id: entidad_id,
                        atribute_id: nodoActual.getAttribute("id"),
                        texts: input.val().toString(),
                        size: size,
                        count: count,
                        offset: offset
                    });
                    /*
                    for(i = 0; i < texts.length; i++){
                        if(texts[i] != ""){
                            $(nodoActual).removeAttr('id');
                            var nuevoNodo = nodoActual.cloneNode(true);
                            //if(offset == 0){ //Puede ser atributo[0] o caso inicial de creacion de mas atributos
                                nuevoNodo.setAttribute("id", "atrib" + "-" + entidad_id + "-" + offset++);
                            //} else { //offset != 0 significa que estoy trabajando con el ultimo atributo
                            //    nuevoNodo.setAttribute("id", nodoActual.getAttribute("id").toString().split("-")[0]
                            //        + "-" + nodoActual.getAttribute("id").toString().split("-")[1] + "-" + (offset + i));
                            //}
                            nuevoNodo.setAttribute("y", size);
                            nuevoNodo.innerHTML = texts[i];
                            nodoActual.parentNode.appendChild(nuevoNodo);
                            size = parseInt(size) + 18;
                            addTextListener(nuevoNodo);
                            count = count + 1;
                        }
                    }
                    rectangulo.setAttribute("height", parseInt(rectangulo.getAttribute("height")) + parseInt(20*(count-1)));
                    position = parseInt(rectangulo.getAttribute("height"));
                    nodoActual.parentNode.removeChild(nodoActual);*/
                    input.css("visibility", "hidden");
                    console.log('aumento_atributos');
                }
                // Para el enter en el titulo de la entidad
            } else if(nodoActual == rectChildren[1] || nodoActual == rectChildren[0]){
                if(input.val() != ""){
                    nodoActual.innerHTML = input.val();
                    var parent = selectedTitle.parent();
                    if (parent.attr('id')){
                        client.publish('/relation/updateName/'+ gon.diagram_id, {
                            relation_id: parent.attr('id'),
                            text: selectedTitle.attr('text')
                        });
                    }else {
                        client.publish('/entity/updateTitle/'+ gon.diagram_id, {
                            entity_id: parent.parent().attr('id'),
                            text: selectedTitle.attr('text')
                        });
                    }
                }
                // Para el enter en los atributos de la entidad
            } else {
                var whois, w;
                // Eliminar un atributo
                if(input.val() == ""){
                    var rectHeight = parseInt(rectangulo.getAttribute("height"));
                    //rectangulo.setAttribute("height", rectHeight - 20);
                    //position = parseInt(rectangulo.getAttribute("height"));
                    /*// Identificar el numero del atributo que quedo vacio
                    for(w = 0; w < rectChildren.length; w++){
                        if(nodoActual == rectChildren[w]){
                            whois = w;
                        }
                    }
                    // Recorrer los atributos, desde el siguiente al que quedo vacio y subirlos
                    for(w = (whois+1); w < rectChildren.length; w++){
                        var resize = rectChildren[w].getAttribute("y");
                        rectChildren[w].setAttribute("y", parseInt(resize) - 18);
                    }*/
                    // Remover el atributo que quedo vacio
                    //nodoActual.parentNode.removeChild(nodoActual);
                    console.log('eliminar atributo');
                    client.publish('/atribute/delete/'+ gon.diagram_id, {
                        atribute_id: nodoActual.getAttribute('id'),
                        rect_height:  rectHeight
                    });
                    // Editar un atributo
                } else {
                    //nodoActual.innerHTML = input.val();
                    var text = input.val();
                    addTextListener(nodoActual);
                    console.log('editar atributo');
                    client.publish('/atribute/updateName/'+ gon.diagram_id, {
                        atribute_id: nodoActual.getAttribute('id'),
                        text: text
                    });
                }
            }
            input.css("visibility", "hidden");
        }
    });

    var svg = $("#svg");
    x0 = svg.offset().left;
    y0 = svg.offset().top;

    var markerStartString;
    var markerEndString;

    // Select menu para las relaciones desde y hasta
    $(function() {
        $.widget("custom.iconselectmenu", $.ui.selectmenu, {
            _renderItem: function (ul, item) {
                var li = $("<li>", {text: item.label});

                if (item.disabled) {
                    li.addClass("ui-state-disabled");
                }

                $("<span>", {
                    style: item.element.attr("data-style"),
                    "class": "ui-icon " + item.element.attr("data-class")
                })
                    .appendTo(li);

                return li.appendTo(ul);
            }
        });
        $("#desde")
            .iconselectmenu({
                change: function( event, data ) {
                    if (selectedLine){
                        switch(data.item.index){
                            case 0:
                                markerStartString = "url(#uno)";
                                break;
                            case 1:
                                markerStartString = "url(#muchos)";
                                break;
                            case 2:
                                markerStartString = "url(#uno-uno)";
                                break;
                            case 3:
                                markerStartString = "url(#cero-uno)";
                                break;
                            case 4:
                                markerStartString = "url(#uno-muchos)";
                                break;
                            case 5:
                                markerStartString = "url(#cero-muchos)";
                                break;
                        }
                        /*$(selectedLine.node).css({
                            markerStart: markerStartString
                        });*/
                        client.publish('/relation/updateStart/'+ gon.diagram_id, {
                            relation_id: selectedLine.parent().attr("id"),
                            marker_start: markerStartString
                        });
                    }
                }
            })
            .iconselectmenu("menuWidget")
            .addClass("ui-menu-icons avatar");
        $("#hasta")
            .iconselectmenu({
                change: function( event, data ) {
                    if (selectedLine){
                        switch(data.item.index){
                            case 0:
                                markerEndString = "url(#uno-reverse)";
                                break;
                            case 1:
                                markerEndString  = "url(#muchos-reverse)";
                                break;
                            case 2:
                                markerEndString = "url(#uno-uno-reverse)";
                                break;
                            case 3:
                                markerEndString  = "url(#cero-uno-reverse)";
                                break;
                            case 4:
                                markerEndString  = "url(#uno-muchos-reverse)";
                                break;
                            case 5:
                                markerEndString = "url(#cero-muchos-reverse)";
                                break;
                        }
                        /*$(selectedLine.node).css({
                            markerEnd: markerEndString
                        });*/
                        client.publish('/relation/updateEnd/'+ gon.diagram_id, {
                            relation_id: selectedLine.parent().attr("id"),
                            marker_end: markerEndString
                        });
                    }
                }
            })
            .iconselectmenu("menuWidget")
            .addClass("ui-menu-icons avatar");
    });
}

// Para descargar archivos
function encode_as_img_and_link() {
    var svg = '<?xml version="1.0" encoding="iso-8859-1"?><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 500" style="enable-background:new 0 0 1000 500;" xml:space="preserve">' + document.getElementById("svg").innerHTML + '</svg>';
    saveAs(new Blob([svg], { type: "application/svg+xml" }), "descarga.svg");
    //saveAs(new Blob([svg], { type: "application/svg+xml" }), gon.push({ :diagram_name => @diagram.name }));
}

function saveSVG() {
    var svg = document.getElementById("svg").innerHTML;
    sessionStorage.SVG = svg;
}

function showSVG() {
    svg = sessionStorage.SVG;
    alert(svg );
}

function recreateEntity(entity_data){
    var x_in_canvas = parseInt(entity_data.x0);
    var y_in_canvas = parseInt(entity_data.y0);
    // Create elements
    var rectEntity = s.rect(x_in_canvas, y_in_canvas, 100, 100, 0.5, 0.5);
    var rectTitle = s.rect(x_in_canvas, y_in_canvas, 100, 30, 0.5, 0.5);
    var closeButton = s.circle(x_in_canvas + 100, y_in_canvas, 0);
    var title = s.text(x_in_canvas + 20,y_in_canvas + 20, entity_data.title);
    var entityOutline = s.group(rectEntity);
    //var titleOutline = s.group(rectTitle , title, closeButton , attribute );
    var titleOutline = s.group(rectTitle , title, closeButton);
    // For recreating the attributes
        for (var i = 0; i < entity_data.atributes.length; i++) {
            var attribute = s.text(x_in_canvas + 10, entity_data.atributes[i].y , entity_data.atributes[i].info);
            addTextListeners(attribute);
            titleOutline.append(attribute);
            attribute.attr({
                //class: "atributo atributo-" + globalID
                class: entity_data.atributes[i].atribute_class,
                id: entity_data.atributes[i].svg_id
            });
        }
    var line_handlers_1 = s.circle(x_in_canvas + 50, y_in_canvas, 0);
    var line_handlers_2 = s.circle(x_in_canvas + 100, y_in_canvas + 50, 0);
    var line_handlers_3 = s.circle(x_in_canvas + 50, y_in_canvas + 100, 0);
    var line_handlers_4 = s.circle(x_in_canvas , y_in_canvas + 50, 0);
    var line_handlers = s.group(line_handlers_1, line_handlers_2, line_handlers_3, line_handlers_4);
    var entity = s.group(entityOutline, titleOutline, line_handlers);


    // Personalize elements
    entity.attr({
        id: entity_data.svg_id,
        class: "entidad",
        transform: entity_data.transform
    });
    entityOutline.attr ({
        cursor: "move"
    });
    closeButton.attr({
        class: "closeButton",
        fill: "#ff0000",
        stroke: "#ff0000",
        strokeWidth: 0
    });
    title.attr({
        class: "titulo"
    });
    rectTitle.attr({
        fill: "#ffffff",
        stroke: "#000",
        strokeWidth: 2
    });

    rectEntity.attr({
        class: "cuadrado",
        id: "cuadrado-"+ entity_data.svg_id.split('-')[1],
        fill: "#ffffff",
        stroke: "#000",
        strokeWidth: 2
    });

    line_handlers.attr({
        class: "line-handlers"
    });
    line_handlers_1.attr ({
        class: "handler-1",
        fill: "#78BF24"
    });
    line_handlers_2.attr ({
        class: "handler-2",
        fill: "#78BF24"
    });
    line_handlers_3.attr ({
        class: "handler-3",
        fill: "#78BF24"
    });
    line_handlers_4.attr ({
        class: "handler-4",
        fill: "#78BF24"
    });

    addToEntidadesArray(entity);

    // Set events
    addEntityListener(entity);
    addCloseButtonListener(closeButton);
    addTextListeners(title);
    drawRelations(entity.selectAll(".line-handlers circle"), start);

    incrementID();
    return entity;
}

function createEntity(x_in_canvas, y_in_canvas){
    // Create elements
    var rectEntity = s.rect(x_in_canvas, y_in_canvas, 100, 100, 0.5, 0.5);
    var rectTitle = s.rect(x_in_canvas, y_in_canvas, 100, 30, 0.5, 0.5);
    var closeButton = s.circle(x_in_canvas + 100, y_in_canvas, 0);
    var title = s.text(x_in_canvas + 20,y_in_canvas + 20, "Entidad");
    var attribute = s.text(x_in_canvas + 10,y_in_canvas + 50, "Atributo");
    var entityOutline = s.group(rectEntity);
    var titleOutline = s.group(rectTitle , title, closeButton , attribute );
    var line_handlers_1 = s.circle(x_in_canvas + 50, y_in_canvas, 0);
    var line_handlers_2 = s.circle(x_in_canvas + 100, y_in_canvas + 50, 0);
    var line_handlers_3 = s.circle(x_in_canvas + 50, y_in_canvas + 100, 0);
    var line_handlers_4 = s.circle(x_in_canvas , y_in_canvas + 50, 0);
    var line_handlers = s.group(line_handlers_1, line_handlers_2, line_handlers_3, line_handlers_4);
    var entity = s.group(entityOutline, titleOutline, line_handlers);

    // Personalize elements
    entity.attr({
        id: "entidad-"+globalID,
        class: "entidad"
    });
    entityOutline.attr ({
        cursor: "move"
    });
    closeButton.attr({
        class: "closeButton",
        fill: "#ff0000",
        stroke: "#ff0000",
        strokeWidth: 0
    });
    title.attr({
        class: "titulo"
    });
    rectTitle.attr({
        fill: "#ffffff",
        stroke: "#000",
        strokeWidth: 2
    });
    rectEntity.attr({
        class: "cuadrado",
        id: "cuadrado-"+ globalID,
        fill: "#ffffff",
        stroke: "#000",
        strokeWidth: 2
    });
    attribute.attr({
        //class: "atributo atributo-" + globalID
        class: "atributo",
        id: "atrib-"+ globalID + '-0'
    });
    line_handlers.attr({
        class: "line-handlers"
    });
    line_handlers_1.attr ({
        class: "handler-1",
        fill: "#78BF24"
    });
    line_handlers_2.attr ({
        class: "handler-2",
        fill: "#78BF24"
    });
    line_handlers_3.attr ({
        class: "handler-3",
        fill: "#78BF24"
    });
    line_handlers_4.attr ({
        class: "handler-4",
        fill: "#78BF24"
    });

    addToEntidadesArray(entity);

    // Set events
    addEntityListener(entity);
    addCloseButtonListener(closeButton);
    addTextListeners(title);
    addTextListeners(attribute);
    drawRelations(entity.selectAll(".line-handlers circle"), start);

    incrementID();

}

function moveEntity(entity, matrix){
    var entidad = s.select('#'+entity);
    entidad.attr({
        transform: matrix
    });
}

function adjustText(relation,line){
    lineBBox = line.getBBox();
    textBBox = relation.select("text").getBBox();
    if(Snap.path.isBBoxIntersect(lineBBox, textBBox)){
        relation.select("text").attr({
            x: lineBBox.cx - (textBBox.cx - textBBox.x) + 40,
            y: lineBBox.cy - (textBBox.cy - textBBox.y)
        });
    }else{
        relation.select("text").attr({
            x: lineBBox.cx - (textBBox.cx - textBBox.x),
            y: lineBBox.cy - 15
        });
    }
}

function moveEntityRelations(entidad, entidadActual){
    var lineBBox, textBBox;
    var position;
    for(var i = 0; i < entidadActual.from.length; i++) {
        position = chooseSide(entidadActual.fromPos[i], entidad);
        var line = entidadActual.from[i].select("line");
        line.attr({
            x1: position[0],
            y1: position[1]
        });
        adjustText(entidadActual.from[i], line);
    }
    for(var i = 0; i < entidadActual.to.length; i++) {
        position = chooseSide(entidadActual.toPos[i], entidad);
        line = entidadActual.to[i].select("line");
        line.attr({
            x2: position[0],
            y2: position[1]
        });
        adjustText(entidadActual.to[i], line);
    }
}

function moveRelation(entity){
    var entidad = s.select('#'+entity);
    var id = entidad.attr("id").split("-");
    var entidadActual = entidades[id[1]];
    moveEntityRelations(entidad, entidadActual);
}

function updateTitle(entity, title){
    var entidad = s.select('#' + entity);
    var titulo = entidad.select('.titulo');
    titulo.attr({
       text: title
    });
}

function createRelation(relation){
    relacion = recreateRelation(relation);
    var relations = [];
    relations.push(relacion);
    joinRelations(relations);
}

function deleteRelationByID(relation_id){
    var relation = s.select('#' + relation_id);
    deleteRelation(relation);
}

function updateRelationName(relation_id, texto){
    var relation = s.select('#' + relation_id);
    var text = relation.select('text');
    text.attr({
        text: texto
    });
}

function updateStartRelation(relation, markerStartString){
    var line = selectedLine;
    selectedLine = relation.select('line');
    $(selectedLine.node).css({
        markerStart: markerStartString
    });
    selectedLine = line;
}

function updateStartRelationByID(relation_id, marker){
    var relation = s.select('#' + relation_id);
    updateStartRelation(relation, marker);
}

function updateEndRelation(relation, markerEndString){
    var line = selectedLine;
    selectedLine = relation.select('line');
    $(selectedLine.node).css({
        markerEnd: markerEndString
    });
    selectedLine = line;
}

function updateEndRelationByID(relation_id, marker){
    var relation = s.select('#' + relation_id);
    updateEndRelation(relation, marker);
}

function updateAtributeName(atribute_id, text){
    var atribute = s.select('#' + atribute_id);
    atribute .attr({
        text: text
    });
}

function deleteAtribute(atribute_id, rectHeight){
    var nodoActual = document.getElementById(atribute_id);
    var rectChildren = nodoActual.parentNode.children;
    var rectangulo = nodoActual.parentNode.parentNode.children[0].children[0];
    rectangulo.setAttribute("height", rectHeight - 20);
    // Identificar el numero del atributo que quedo vacio
    for(var w = 0; w < rectChildren.length; w++){
        if(nodoActual == rectChildren[w]){
            whois = w;
        }
    }
    // Recorrer los atributos, desde el siguiente al que quedo vacio y subirlos
    for(w = ( whois + 1 ); w < rectChildren.length; w++){
        var resize = rectChildren[w].getAttribute("y");
        rectChildren[w].setAttribute("y", parseInt(resize) - 18);
    }
    // Remover el atributo que quedo vacio
    nodoActual.parentNode.removeChild(nodoActual);
}


window.addEventListener("load", initializePage, false);
//window.addEventListener("load", loadSVG, false);
