function loadRecent(e) {
	var name, users, mdate, cdate, image, recent, bigDiv, user,rowDiv;
	xmlFile = e.target.responseXML;
	bigDiv = document.querySelector("#mine");
	recent = xmlFile.getElementsByTagName("file");
	rowDiv = document.createElement("div");
	for (i = 0; i < recent.length; i++) {
		var div, img, p1, p2, p3, p4, sep, a,rowDiv;
		name = recent[i].getElementsByTagName("name")[0].firstChild.nodeValue;
		users = recent[i].getElementsByTagName("user");
		mdate = recent[i].getElementsByTagName("mdate")[0].firstChild.nodeValue;
		cdate = recent[i].getElementsByTagName("cdate")[0].firstChild.nodeValue;
		image = recent[i].getElementsByTagName("image")[0].firstChild.nodeValue;

		div = document.createElement("div");
		img = document.createElement("img");
		p1 = document.createElement("p");
		p2 = document.createElement("p");
		p3 = document.createElement("p");
		p4 = document.createElement("p");
		sep = document.createElement("div");

		div.setAttribute("class", "recent thumbnail flex-item boxshadow");
		p1.setAttribute("class", "center")
		img.setAttribute("src", image);
		img.setAttribute("class", "img-responsive");
		p1.innerHTML = name;
		/*
		 p2.innerHTML = "Shared: ";
		 p3.innerHTML = "Modificado: " + mdate;
		 p4.innerHTML = "Creado: " + cdate;

		 for (j = 0; j < users.length; j++) {
		 user = users[j].firstChild.nodeValue;
		 a = document.createElement("a");
		 if((j + 1) != users.length){
		 a.innerHTML = user + ",";
		 } else {
		 a.innerHTML = user;
		 }
		 p2.appendChild(a);
		 }
		 */
		div.appendChild(p1);
		div.appendChild(img);

		if(p2.children.length != 0){
			div.appendChild(p2);
		}
		div.appendChild(p3);
		div.appendChild(p4);
		bigDiv.appendChild(div);
		bigDiv.appendChild(div);
	}
}

function loadRecentS(e) {
	var name, mdate, cdate, image, recent, bigDiv, user,rowDiv;
	xmlFile = e.target.responseXML;
	bigDiv = document.querySelector("#shared");
	recent = xmlFile.getElementsByTagName("file");
	rowDiv = document.createElement("div");
	for (i = 0; i < recent.length; i++) {
		var div, img, p1, p2, p3, p4, sep, a,rowDiv;
		name = recent[i].getElementsByTagName("name")[0].firstChild.nodeValue;
		user = recent[i].getElementsByTagName("owner")[0].firstChild.nodeValue;
		mdate = recent[i].getElementsByTagName("mdate")[0].firstChild.nodeValue;
		cdate = recent[i].getElementsByTagName("cdate")[0].firstChild.nodeValue;
		image = recent[i].getElementsByTagName("image")[0].firstChild.nodeValue;

		div = document.createElement("div");
		img = document.createElement("img");
		p1 = document.createElement("p");
		p2 = document.createElement("p");
		p3 = document.createElement("p");
		p4 = document.createElement("p");
		sep = document.createElement("div");

		div.setAttribute("class", "recent thumbnail flex-item boxshadow");
		p1.setAttribute("class", "center")
		img.setAttribute("src", image);
		img.setAttribute("class", "img-responsive");
		p1.innerHTML = name;
		/*p2.innerHTML = "Shared: ";
		 p3.innerHTML = "Modificado: " + mdate;
		 p4.innerHTML = "Creado: " + cdate;
		 a = document.createElement("a");
		 a.innerHTML = user;*/
		//p2.appendChild(a);
		div.appendChild(p1);
		div.appendChild(img);

		div.appendChild(p2);
		div.appendChild(p3);
		div.appendChild(p4);
		bigDiv.appendChild(div);
		bigDiv.appendChild(div);
	}
}

function loadXML() {
	var file = "resources/xml/recent.xml";
	var request = new XMLHttpRequest();
	request.addEventListener("load", loadRecent, false);
	request.open("GET", file, true);
	request.send();
}

function loadXMLS() {
	var file = "resources/xml/shared.xml";
	var request = new XMLHttpRequest();
	request.addEventListener("load", loadRecentS, false);
	request.open("GET", file, true);
	request.send();
}

//window.addEventListener("load", loadXML, false);
//window.addEventListener("load", loadXMLS, false);