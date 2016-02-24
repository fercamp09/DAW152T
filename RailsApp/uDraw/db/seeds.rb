# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
user1 = User.create({ name: 'ferecamp', espol: 'ferecamp', role: 'admin' })
user2 = User.create({ name: 'apinargo', espol: 'apinargo', role: 'editor' })
user3 = User.create({ name: 'leras', espol: 'leras', role: 'editor' })

#user1.diagrams.create({name: 'Diagram Fer', image: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"> <g class="entidad" id="entidad-0" x="0" y="0">            <g class="cuadrado" style="cursor:move">                <rect x="0" y="0" width="100" height="100" rx="0.5" ry="0.5" fill="#ffffff" stroke="#000000" style="-stroke-width: 2px;"/>            </g>            <g>                <rect x="0" y="0" width="100" height="30" rx="0.5" ry="0.5" fill="#ffffff" stroke="#000000" style="stroke-width: 2px;"/>                <text class="titulo" x="20" y="20">Entidad</text>                <circle class="closeButton" cx="100" cy="0" r="0" fill="#ff0000" stroke="#ff0000" style="stroke-width: 0px;"/>                <text class="atributo" x="10" y="50">Atributo</text>            </g>            <g class="line-handlers">                <circle class="handler-1" cx="50" cy="0" r="0" fill="#78BF24" stroke="#ff0000" style="stroke-width: 0px;"/>                <circle class="handler-2" cx="100" cy="50" r="0" fill="#78BF24"  stroke="#ff0000" style="stroke-width: 0px;"/>                <circle class="handler-3" cx="50" cy="100" r="0" fill="#78BF24" stroke="#ff0000" style="stroke-width: 0px;"/>                <circle class="handler-4" cx="0" cy="50" r="0" fill="#78BF24" stroke="#ff0000" style="stroke-width: 0px;"/>            </g>        </g></svg>'})
user1.diagrams.create({name: 'Diagram Fer', image: 'diagram_fer.png', global_id: 4})
diagram1 = user1.diagrams.last
entity1 = diagram1.entities.create({height: '100', width: '100', y0: '166', x0: '138', title: 'Entidad 0', transform: 'matrix(1,0,0,1,0,-1)', svg_id: 'entidad-0'})
entity1.atributes.create({info: 'Atributo 1', x: '148', y: '216', atribute_class: 'atributo atributo-0-0-0'})
entity1.atributes.create({info: 'Atributo 2', x: '148', y: '234', atribute_class: 'atributo atributo-0-0-4'})
entity2 = diagram1.entities.create({height: '100', width: '100', y0: '107' , x0: '428', title: 'Entidad 1', transform: 'matrix(1,0,0,1,20,51)', svg_id: 'entidad-1'})
entity2.atributes.create({info: 'Atributo 1', x: '438', y: '157', atribute_class: 'atributo atributo-0-0-1'})
entity3 = diagram1.entities.create({height: '100', width: '100', y0: '361' , x0: '178', title: 'Entidad 2', transform: 'matrix(1,0,0,1,0,-1)', svg_id: 'entidad-2'})
entity3.atributes.create({info: 'Atributo 1', x: '188', y: '411', atribute_class: 'atributo atributo-0-0-2'})
entity4 = diagram1.entities.create({height: '100', width: '100', y0: '379' , x0: '451', title: 'Entidad 3', transform: 'matrix(1,0,0,1,-4,-10)', svg_id: 'entidad-3'})
entity4.atributes.create({info: 'Atributo 1', x: '461', y: '429', atribute_class: 'atributo atributo-0-0-3'})

diagram1.relations.create({name: 'Relacion 0', arrow_start: 'url("#uno")', arrow_end: 'url("#uno-reverse")', relation_class: '0-2-1-4' , x1: '238', y1: '216', x2: '443', y2: '206.5'})
diagram1.relations.create({name: 'Relacion 1', arrow_start: 'url("#uno")', arrow_end: 'url("#uno-reverse")', relation_class: '2-2-3-4' , x1: '284', y1: '423', x2: '442', y2: '417.5'})
diagram1.relations.create({name: 'Relacion 2', arrow_start: 'url("#uno")', arrow_end: 'url("#uno-reverse")', relation_class: '3-1-1-3' , x1: '498.5', y1: '361', x2: '508', y2: '270'})

user2.diagrams.create({name: 'Diagrama Adriano', image: 'diagram_adriano.png', global_id: 0})
user3.diagrams.create({name: 'Diagrama Leonardo', image: 'diagram_leonardo.png', global_id: 0})
DiagramsUser.create(diagram_id: Diagram.find(3).id, user_id: user1.id, shared:true)
DiagramsUser.create(diagram_id: Diagram.find(1).id, user_id: user2.id, shared:true)
DiagramsUser.create(diagram_id: Diagram.find(2).id, user_id: user3.id, shared:true)

#d.entities.update(1,{height: '100', width: '100', y0: '166', x0: '138', title: 'Entidad 6', transform: 'matrix(1,0,0,1,0,-1)', svg_id: 'entidad-0'})