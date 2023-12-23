"use strict";
const addInput = document.querySelector(".add_input");
const yourDates = document.querySelector(".your_dates");

let elementName;

const IDBRequest = indexedDB.open("user", 1);
IDBRequest.addEventListener("upgradeneeded", ()=>{
    const db = IDBRequest.result;
    db.createObjectStore("names", {
        autoIncrement: true
    });
});
IDBRequest.addEventListener("success", ()=>{
    console.log("TODO SALIO BIEN");
    leerObjetos();
});
IDBRequest.addEventListener("error", ()=>{
    console.log("ERROR DE CONEXION BD");
});
document.getElementById("add_date").addEventListener("click", ()=>{
    elementName = document.getElementById("elementName").value;

    if(elementName.length > 0){
        if(document.querySelector(".possible") != undefined){
            if(confirm("EXISTEN DATOS SIN GUARDAR, DESEA ¿CONTINUAR?")){
                addObjeto({elementName});
                leerObjetos();
                addInput.value = "";
            };
        }else{
            addObjeto({elementName});
            leerObjetos();
            addInput.value = "";
        };
    };
});
const addObjeto = (objeto)=>{
    const IDBData = getIDBData("readwrite");
    IDBData[0].add(objeto);
    IDBData[1].addEventListener("complete", ()=>{
        console.log("SU OPINION FUE AGREGADA CORRECTAMENTE");
    });
};
const leerObjetos = ()=>{
    const IDBData = getIDBData("readonly");
    const cursor = IDBData[0].openCursor();
    const fragment = document.createDocumentFragment();

    yourDates.innerHTML = "";

    cursor.addEventListener("success", ()=>{
        if(cursor.result){
            let elemento = crearElemento(cursor.result.key, cursor.result.value);
            fragment.appendChild(elemento);
            cursor.result.continue();
        }else{
            yourDates.appendChild(fragment);
        };
    });
};
const modificarObjeto = (key, objeto)=>{
    const IDBData = getIDBData("readwrite");
    IDBData[0].put(objeto, key);
    IDBData[1].addEventListener("complete", ()=>{
        console.log("HA MODIFICADO SU TEXTO DE MANERA CORRECTA");
    });
};
const eliminarObjeto = (key)=>{
    const IDBData = getIDBData("readwrite");
    IDBData[0].delete(key);
    IDBData[1].addEventListener("complete", ()=>{
        console.log("SEGURO QUE DESEA ELIMINAR SU OPINION");
    });
};
const getIDBData = (mode)=>{
    const db = IDBRequest.result;
    const IDBtransaction = db.transaction("names", mode);
    const objectStore = IDBtransaction.objectStore("names");
    return [objectStore, IDBtransaction];
};
const crearElemento = (id, date)=>{
    const container = document.createElement("ARTICLE");
    const input = document.createElement("INPUT");
    const saveBtn = document.createElement("BUTTON");
    const deleteBtn = document.createElement("BUTTON");

    container.classList.add("elementName");
    input.classList.add("your_input");
    saveBtn.classList.add("impossible");
    deleteBtn.classList.add("delete");

    saveBtn.textContent = "Guardar";
    deleteBtn.textContent = "Borrar";

    input.value = date.elementName;
    input.setAttribute("contenteditable", "true");
    input.setAttribute("spellcheck", "false");

    container.appendChild(input);
    container.appendChild(saveBtn);
    container.appendChild(deleteBtn);

    input.addEventListener("keyup", ()=>{
        saveBtn.classList.replace("impossible", "possible");
    });
    saveBtn.addEventListener("click", ()=>{
        if(saveBtn.className == "possible"){
            modificarObjeto(id, {elementName: input.value});
            saveBtn.classList.replace("possible", "impossible");
        };
    });
    deleteBtn.addEventListener("click", ()=>{
        if(confirm("SEGURO QUE DESEA ELIMINAR SU OPINION? ")){
            eliminarObjeto(id);
            yourDates.removeChild(container);
        };
    });
    return container
};
//////boton
if (window.screen.width < 768) {
 
    var list;
    list = document.querySelectorAll(".miboton");
    for (var i = 0; i < list.length; ++i) {
        list[i].classList.add('btn-chico');
    }
 
    console.log('Ventana Menor que 768px');
 
}
else if (window.screen.width < 900) {
 
    var list;
    list = document.querySelectorAll(".miboton");
    for (var i = 0; i < list.length; ++i) {
        list[i].classList.add('btn-mediano');
    }
 
    console.log('Ventana Menor que 900px');
 
}
else if (window.screen.width < 1200) {
 
    var list;
    list = document.querySelectorAll(".miboton");
    for (var i = 0; i < list.length; ++i) {
        list[i].classList.add('btn-grande');
    }
 
    console.log('Ventana Menor que 1200px');
    
}