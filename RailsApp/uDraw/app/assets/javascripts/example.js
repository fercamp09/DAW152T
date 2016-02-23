var lineVariables = [0, 0];
var selected;
var selectedHandler;
var globalID = 0; //gon.globalID
//var entidades = [];
var entidades = Object.create(null);
var selectedTitle;

function incrementID(){
    globalID++;
}

function addToEntidadesArray(entity){
    // Crear un objeto para tener las referencias de las conexiones
    var entidad = {
        id: entity.attr("id"),
        fromPos: [],
        from: [],
        toPos: [],
        to: []
    };
    var id = entidad.id.split("-");
    // Agregar la entidad a la lista de entidades
    //entidades.push(entidad);
    entidades[id[1]] = entidad;
    //entidades[parseInt(entidad.id)] = entidad;
}

function endDrag(event){
    var parent = event.target.parentElement.parentElement;
    client.publish('/entity/move/'+ gon.diagram_id, {
        entity_id: parent.getAttribute('id'),
        transform: parent.getAttribute('transform'),
        dx: event.x,
        dy: event.y
    });
}

function addEntityListener(entity){
    // Para definir el evento de arrastar
    entity.drag(updateLines, start, endDrag);
    // Obtener una referencia al circulo para eliminar la entidad y agregar un eventhandler para hover y click
    entity.hover(function showDeleteButton (event){
            ///closeButton.animate({r: 10}, 250);
            this.select(".closeButton").animate({r: 8}, 150);
            var lineHandlers = Snap(event.target.parentNode.parentNode).selectAll(".line-handlers circle");
            for(var i=0; i<lineHandlers.length; i++) {
                lineHandlers[i].animate({r: 5}, 150);
            }
        },
        function unShowDeleteButton (event){
            //closeButton.animate({r: 0}, 250);
            this.select(".closeButton").animate({r: 0}, 150);
            var lineHandlers = Snap(event.target.parentNode.parentNode).selectAll(".line-handlers circle");
            for(var i=0; i<lineHandlers.length; i++) {
                lineHandlers[i].animate({r: 0}, 150);
            }
        });
}

function deleteEntity(entity_id) {
    var entity = s.select('#'+ entity_id);
    entity.remove();
    var id = entity.attr('id');
    eliminarRelaciones(id.split("-")[1]);
}

function addCloseButtonListener(closeButton){
    closeButton.click( function() {
        client.publish('/entity/delete/'+ gon.diagram_id, {
            entity_id: this.parent().parent().attr("id")
        });
        //deleteEntity(this);
        //var id = this.parent().parent().attr("id");
        //this.parent().parent().remove();
        //eliminarRelaciones(id.split("-")[1]);
    });
}

function addLineListeners (relation){
    relation.click(function () {
        if (selectedLine){
            selectedLine.attr({
                stroke: "#000000"
            });
        }
        selectedLine = this.select("line");
        $(selectedLine.node).css({
            //markerMid: "url(#markerArrow)"
            //filter: "url(#shadowBlack)"
        });
        selectedLine.attr({
            stroke: "#00ff00"
        });
    });
    relation.hover(function showDeleteButton (event){
            var line = this.select("line").getBBox();
            this.select(".closeButton")
                .animate({r: 8}, 150)
                .attr({
                    cx: line.cx,
                    cy: line.cy
                });
        },
        function unShowDeleteButton (event){
            this.select(".closeButton").animate({r: 0}, 150);
        });
    relation.select(".closeButton").click( function() {
        //deleteRelation(this.parent());
        client.publish('/relation/delete/'+ gon.diagram_id, {
            relation_id: this.parent().attr("id")
        });
    });

}

function deleteRelation(relation){
    relation.remove();
}

function addTextListeners (text){
    text.dblclick(function (event) {
        var input = $("#modificadorTexto");
        input.val(this.attr('text'));
        input.css("visibility", "visible");
        input.css("top", "" + event.target.getBoundingClientRect().top + "px");
        input.css("left", "" + event.target.parentNode.getBoundingClientRect().left + "px");
        input.css("width", "" + event.target.parentNode.getBoundingClientRect().width + "px");
        // Cambiar la referencia al titulo actual del doble click
        selectedTitle = this;
    });
}

function joinRelations(relations) {
    var classes, ids;
    for (var i = 0; i < relations.length; i++) {
        // Divide el string de clases de la linea en un arreglo de clases
        classes = relations[i].select("line").attr("class").split(" ");
        for (var j = 0; j < classes.length; j++) {
            ids = classes[j].split("-");
             entidades[ids[0]].from.push(Snap(relations[i]));
             entidades[ids[0]].fromPos.push(ids[1]);
             entidades[ids[2]].to.push(Snap(relations[i]));
             entidades[ids[2]].toPos.push(ids[3]);
        }
        addTextListeners(relations[i].select("text"));
        addLineListeners(relations[i]);
    }
}

function chooseSide(id, entity) {
    var point = [0,0];
    if(id=="1"){
        point[0] = entity.getBBox().cx;
        point[1] = entity.getBBox().y;
    }else if (id=="2"){
        point[0] = entity.getBBox().x2;
        point[1] = entity.getBBox().cy;
    }else if (id=="3"){
        point[0] = entity.getBBox().cx;
        point[1] = entity.getBBox().y2;
    }else if (id=="4"){
        point[0] = entity.getBBox().x;
        point[1] = entity.getBBox().cy;
    }
    return point;
}

/*function updateLinesAndTexts(elementos, positions){
 for(i = 0; i < elementos.length; i++) {
 position = chooseSide(positions[i], this);
 var line = elementos[i].select("line");
 line.attr({
 x2: position[0],
 y2: position[1]
 });
 lineBBox = line.getBBox();
 elementos[i].select("text").attr({
 x: lineBBox.cx,
 y: lineBBox.cy
 });
 }
 }
 */

function updateLines(dx, dy){
    var id = this.attr("id").split("-");
    var entidadActual = entidades[id[1]];
    this.attr({
        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
    });
    moveEntityRelations(this, entidadActual);
    /*
    var position;
    var lineBBox, textBBox;
    for(var i = 0; i < entidadActual.from.length; i++) {
        position = chooseSide(entidadActual.fromPos[i], this);
        var line = entidadActual.from[i].select("line");
        line.attr({
            x1: position[0],
            y1: position[1]
        });
        lineBBox = line.getBBox();
        textBBox = entidadActual.from[i].select("text").getBBox();
        if(Snap.path.isBBoxIntersect(lineBBox, textBBox)){
            entidadActual.from[i].select("text").attr({
                x: lineBBox.cx - (textBBox.cx - textBBox.x) + 40 ,
                y: lineBBox.cy - (textBBox.cy - textBBox.y)
            });
        }else{
            entidadActual.from[i].select("text").attr({
                x: lineBBox.cx - (textBBox.cx - textBBox.x),
                y: lineBBox.cy - 15
            });
        }
    }
    for(var i = 0; i < entidadActual.to.length; i++) {
        position = chooseSide(entidadActual.toPos[i], this);
        line = entidadActual.to[i].select("line");
        line.attr({
            x2: position[0],
            y2: position[1]
        });
        lineBBox = line.getBBox();
        textBBox = entidadActual.to[i].select("text").getBBox();
        if(Snap.path.isBBoxIntersect(lineBBox, textBBox)){
            entidadActual.to[i].select("text").attr({
                x: lineBBox.cx - (textBBox.cx - textBBox.x) + 40,
                y: lineBBox.cy - (textBBox.cy - textBBox.y)
            });
        }else{
            entidadActual.to[i].select("text").attr({
                x: lineBBox.cx - (textBBox.cx - textBBox.x),
                y: lineBBox.cy - 15
            });
        }
    }*/
}

function loadXML() {
    //var file = "resources/xml/figuras.xml";
    //var request = new XMLHttpRequest();
    //request.addEventListener("load", draw, false);
    //request.open("GET", file, true);
    //request.send();
}

function eliminarRelaciones (entidadID) {
    /*var relations = s.selectAll("line");
     for (i = relations.length - 1; i >= 0 ; i--) {
     if(relations[i].hasClass(entidadID)){
     relations[i].remove();
     }
     }*/
    var classes, ids;
    var lines = s.selectAll("line");
    for (i = 0; i < lines.length; i++) {
        // Divide el string de clases de la relacion en un arreglo de clases
        classes = lines[i].attr("class").split(" ");
        for (j = 0; j < classes.length; j++) {
            ids = classes[j].split("-");
            // Verifica si el primer y tercer numero de la clase es igual a la entidad que se va a eliminar
            if (ids[0] == entidadID) {
                lines[i].parent().remove();
            } else if (ids[2] == entidadID) {
                lines[i].parent().remove();
            }
        }
    }
}

function drawRelations(lineHandlers, start){
    for (var i = 0; i < lineHandlers.length; i++) {
        var lineHandler = lineHandlers[i];
        lineHandler.click(function (event) {
            var entity = Snap(event.target.parentNode.parentNode);
            var x_in_canvas = event.clientX - x0;
            var y_in_canvas = event.clientY - y0;
            entity.undrag();
            this.animate({fill: "#ff0000"}, 50);

            if (selected == entity) {
                this.animate({fill: "#78BF24"}, 50);
                lineVariables[0] = 0;
                lineVariables[1] = 0;
                selected.drag(updateLines, start, endDrag);
            } else if (lineVariables[0] != 0 && lineVariables[1] != 0) {

                /*// Crea la linea y modifica sus atributos
                var line = s.line(lineVariables[0], lineVariables[1], x_in_canvas, y_in_canvas);
                //var line = s.polyline(lineVariables[0], lineVariables[1],(lineVariables[0]+x_in_canvas)/2,(lineVariables[1]+y_in_canvas)/2 ,x_in_canvas, y_in_canvas);

                var lineBBox = line.getBBox();
                var relationName = s.text(lineBBox.cx,lineBBox.cy - 3, "Relacion");
                var relationCloseButton = s.circle(x_in_canvas, y_in_canvas, 0);
                var relationGroup = s.g(relationName, line, relationCloseButton);
                relationGroup.attr({
                    class: "relation"
                });
                line.attr({
                    fill: "#000000",
                    stroke: "#000000",
                    style: "stroke-width: 2px; marker-start: url(#uno); marker-end: url(#uno-reverse);"
                });
                relationCloseButton .attr({
                    class: "closeButton",
                    fill: "#ff0000",
                    stroke: "#ff0000",
                    strokeWidth: 0
                });
                addTextListeners(relationName);
                addLineListeners(relationGroup);
                // Añade la linea a la entidad y la entidad a las entidades
                // Añade la posicion desde donde se creo y termino la linea
                 */
                var idFrom = selected.attr("id").split("-");
                //entidades[idFrom[1]].from.push(relationGroup);
                var id1Pos = selectedHandler.attr("class").split("-");
                //entidades[idFrom[1]].fromPos.push(id1Pos[1]);

                var idTo = entity.attr("id").split("-");
                //entidades[idTo[1]].to.push(relationGroup);
                var id2Pos = this.attr("class").split("-");
                //entidades[idTo[1]].toPos.push(id2Pos[1]);
                // Agregar los ids de las entidades como clases de la linea
                //line.attr({class: "" + idFrom[1] + "-" + id1Pos[1] + "-" + idTo[1] + "-" + id2Pos[1]});
                var id = "" + idFrom[1] + "-" + id1Pos[1] + "-" + idTo[1] + "-" + id2Pos[1];
                //var parent = event.target.parentElement.parentElement;
                client.publish('/relation/create/'+ gon.diagram_id, {
                    relation_class: id,
                    x1: lineVariables[0],
                    y1: lineVariables[1],
                    x2: x_in_canvas,
                    y2: y_in_canvas,
                    arrow_start: 'url(#uno)',
                    arrow_end: 'url(#uno-reverse)',
                    name: "Relacion",
                    svg_id: "rel" + id
                });

                // Permite que puedan volver a moverse
                selected.drag(updateLines, start, endDrag);
                entity.drag(updateLines, start, endDrag);
                lineVariables[0] = 0;
                lineVariables[1] = 0;
            } else {
                selected = entity;
                lineVariables[0] = x_in_canvas;
                lineVariables[1] = y_in_canvas;
                selectedHandler = this;
            }
        });

        // Animar el linea handler al que se hace hover
        lineHandler.hover(function (event) {
            Snap(event.target).animate({r: 7}, 150);
        }, function (event) {
            Snap(event.target).animate({r: 5}, 150);
        });
    }
}

function loadEntity(){
    // Cargar el archivo svg y procesarlo antes de dibujarlo
    Snap.load("resources/paleta/entidad.svg", function (imagen) {
        // Seleccionar la imagen por id
        var g = imagen.select(".entidad");
        // s es el area de dibujo, agregar la imagen cargada al area de dibujo
        s.append(g);

        // Agregar el atributo id="entidad-{numero}" a la entidad
        g.attr({ id: "entidad-" + globalID });

        addToEntidadesArray(g);

        // Obtener una referencia al titulo de la entidad y agregar un eventhandler de dblclick
        var title = g.select(".titulo");
        var att = g.select(".atributo");
        var sqr = g.select(".cuadrado");
        att.attr("class", "atributo-" + globalID);
        sqr.attr("id", "cuadrado-" + globalID);
        // Seleccionar los handlers para conectar lineas
        var lineHandlers = g.selectAll(".line-handlers circle");
        var closeButton = g.select(".closeButton");

        addEntityListener(g);
        addCloseButtonListener(closeButton);
        addTextListeners(title);
        addTextListeners(att);
        drawRelations(lineHandlers, start);
        incrementID();
    });
}

function start() {
    this.data('origTransform', this.transform().local);
}

function loadSVG(){
    // Funcion para permitir que se pueda arrastrar
    //Cargar ejemplo
    //Snap.load("resources/paleta/example.svg", function (imagen) {
    // s es el area de dibujo, agregar la imagen cargada al area de dibujo
    var myFrag = gon.diagram_image;
    //var myFrag = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"> <g class="entidad" x="0" y="0">            <g class="cuadrado" style="cursor:move">                <rect x="0" y="0" width="100" height="100" rx="0.5" ry="0.5" fill="#ffffff" stroke="#000000" style="-stroke-width: 2px;"/>            </g>            <g>                <rect x="0" y="0" width="100" height="30" rx="0.5" ry="0.5" fill="#ffffff" stroke="#000000" style="stroke-width: 2px;"/>                <text class="titulo" x="20" y="20">Entidad</text>                <circle class="closeButton" cx="100" cy="0" r="0" fill="#ff0000" stroke="#ff0000" style="stroke-width: 0px;"/>                <text class="atributo" x="10" y="50">Atributo</text>            </g>            <g class="line-handlers">                <circle class="handler-1" cx="50" cy="0" r="0" fill="#78BF24" stroke="#ff0000" style="stroke-width: 0px;"/>                <circle class="handler-2" cx="100" cy="50" r="0" fill="#78BF24"  stroke="#ff0000" style="stroke-width: 0px;"/>                <circle class="handler-3" cx="50" cy="100" r="0" fill="#78BF24" stroke="#ff0000" style="stroke-width: 0px;"/>                <circle class="handler-4" cx="0" cy="50" r="0" fill="#78BF24" stroke="#ff0000" style="stroke-width: 0px;"/>            </g>        </g></svg>';

    //var imagen = Snap.parse(gon.diagram_image);
    var imagen = Snap.parse(myFrag);
    //s.append(imagen);
    //imagen = svg;
    //s.append(imagen);
    // Seleccionar los handlers para conectar lineas

    var g = imagen.selectAll(".entidad");
    for (i = 0; i < g.length; i++) {
        // s es el area de dibujo, agregar la imagen cargada al area de dibujo
        s.append(g[i]);
        // Obtener una referencia al titulo de la entidad y agregar un eventhandler de dblclick
        var title = g[i].select(".titulo");
        var att = g[i].select(".atributo");
        var sqr = g[i].select(".cuadrado");
        var closeButton = g[i].select(".closeButton");
        var lineHandlers = g[i].selectAll(".line-handlers circle");
        att.attr("class", "atributo atributo-" + globalID);
        sqr.attr("id", "cuadrado-" + globalID);

        addToEntidadesArray(g[i]);

        // Set events
        addEntityListener(g[i]);
        addCloseButtonListener(closeButton);
        addTextListeners(title);
        addTextListeners(att);
        drawRelations(lineHandlers,start);

        incrementID();

    }
    var imagen = Snap.parse(myFrag);
    var relations = imagen.selectAll(".relation");
    if (relations.length > 0){
        selectedLine = relations[0].select("line");
        joinRelations(relations);
        s.append(relations);
    }
}

function recreateRelation(relation_data){
    // Crea la linea y modifica sus atributos
    var line = s.line(relation_data.x1, relation_data.y1,
                      relation_data.x2, relation_data.y2);

    var lineBBox = line.getBBox();
    var relationName = s.text(lineBBox.cx,lineBBox.cy - 3, relation_data.name);
    var relationCloseButton = s.circle(relation_data.x1, relation_data.y1, 0);
    var relationGroup = s.g(relationName, line, relationCloseButton);
    relationGroup.attr({
        class: "relation",
        id: relation_data.svg_id
    });
    line.attr({
        fill: "#000000",
        stroke: "#000000",
        style: "stroke-width: 2px; " +
        "marker-start:"+ relation_data.arrow_start + "; " +
        "marker-end: "+ relation_data.arrow_end + ";",
        class: relation_data.relation_class
    });
    relationCloseButton .attr({
        class: "closeButton",
        fill: "#ff0000",
        stroke: "#ff0000",
        strokeWidth: 0
    });

    // Agregar los ids de las entidades como clases de la linea
    line.attr({class: relation_data.relation_class});

    //addTextListeners(relationName);
    //addLineListeners(relationGroup);
    return relationGroup;
}

function loadDocument(){
    var relations = [];
    var diagram_entities = gon.diagram_entities; // json con todas las entidades
    if (diagram_entities != null && diagram_entities.length > 0) {
        for (var i = 0; i < diagram_entities.length; i++) {
            var entity = recreateEntity(diagram_entities[i]);
        }
    }
    var diagram_relations = gon.diagram_relations; // json con todas las relaciones
    if (diagram_relations != null && diagram_relations.length > 0){
        for (i = 0; i < diagram_relations.length; i++) {
            var relation = recreateRelation(diagram_relations[i]);
            relations.push(relation);
        }
        joinRelations(relations);
    }
    if (relation != null){
        selectedLine = relation.select("line");
    }
}

//window.addEventListener("load", loadXML, false);
//window.addEventListener("load", loadSVG, false);
window.addEventListener("load", loadDocument, false);
