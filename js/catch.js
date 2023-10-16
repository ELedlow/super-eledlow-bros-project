//---- Import
import {elementFromHtml} from './element.js';

//---- Context just in case
const mycanvas = document.getElementById('screenE');
//console.log(document)
function loadTheError(loadError){
    document.body.appendChild(loadError);
}
//---- Try and Catch Statments
try{
    amongus();
}catch(err){
    //new HtmlError(err.message);
    console.error(err.message);
    var Error00 = elementFromHtml(`
            <div id="Error-Screen" style="float:right;border-width: thick;border-style: solid;border-color: #4a4949;border-width: thick;border-width: 4px;border-style: thick;border-radius: 10px;background: white;">
                <h1>${err.message}</h1>
            </div>
    `);
    loadTheError(Error00); 
}
function amongus(){
    let imposter = 0
    imposter;
}

