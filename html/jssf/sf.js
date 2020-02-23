function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

var MSGS=[];

function addMsg(titolo,testo, classe,image,t,perm){
	var time=500;
	var stk=false;
/*	console.log('DENTRO addMsg'+testo);*/
	try {
		
	
	if (perm!=undefined ){
		stk=perm;
		}
	/*if (t!=undefined && !isNaN(t)){
		time=t;
	}*/
	if (classe==undefined){
		classe='';
	}
	if (image==undefined){
		image='';
    }
    var colore=CSSroot.HOP;

	switch (classe) {
		case 'NORM':
            classe='info';
			break;

		case 'INFO':
			classe='info';
			break;	

		case 'WARN':
            colore=CSSroot.HOPO;
			classe='warning';
			break;	
		
		case 'KO':
            colore='red';
			classe='error';
			break;
			
		case 'ERR':
                colore='red';
			classe='error';
			break;	
		
		case 'OK':
			clsse='info';
			break;

		default:
		 	break;	
	}

	/*var id= $.gritter.add({
				// (string | mandatory) the heading of the notification
				title: titolo,
				// (string | mandatory) the text inside the notification
				text: testo,
				// (string | optional) the image to display on the left
				image: image,
				// (bool | optional) if you want it to fade out on its own or just sit there
				sticky: stk,
				// (int | optional) the time you want it to be alive for before fading out
				time: t,
				class_name: classe
			});*/
			var dt=new Date();
			var giorno=getGiorno(dt);
			var data=giorno.DATAITALIANA;
			var ora=giorno.ORASECMILLIS;
        var rec={
			HID:'MSGLOG_'+generateID(),
			TIPO:'MSGLOG',
			DATA:data,
			ORA:ora,
            TITOLO:titolo,
            MSG:testo,
			COLORE:colore,
			CLASSE:classe,
            DATA: giorno.DATAITALIANA,
            ORA: giorno.ORASECMILLIS
        	};
        $('#msgs').html(titolo+":"+testo);
        $('#msgs').css('color',colore);
   
        MSGS.unshift(rec);    
        if (MSGS.length>100){
			MSGS.pop();
			
		}    
		try {
            var tipo="LOG";
           
            HOPsendWS(tipo,rec);
        } catch (error) {
        addMsg2('HHOPsendWS','Errore '+errore);
        }
		//alert('DIMENSIONE MSGS:'+MSGS.length);
	} catch (error) {
		console.log('ERRORE IN FASE DI LOGGING:'+error.stack);	
	}
		return(rec);	
}

function addMsg2(titolo,testo, classe,image,t,perm){
	var time=500;
	var stk=false;
	if (perm!=undefined ){
		stk=perm;
		}
	if (t!=undefined && !isNaN(t)){
		time=t;
	}
	if (classe==undefined){
		classe='';
	}
	if (image==undefined){
		image='';
    }
    var colore=CSSroot.HOP;

	switch (classe) {
		case 'NORM':
            classe='info';
			break;

		case 'INFO':
			classe='info';
			break;	

		case 'WARN':
            colore=CSSroot.HOPO;
			classe='warning';
			break;	
		
		case 'KO':
            colore='red';
			classe='error';
			break;
			
		case 'ERR':
                colore='red';
			classe='error';
			break;	
		
		case 'OK':
			clsse='info';
			break;

		default:
		 	break;	
	}

	/*var id= $.gritter.add({
				// (string | mandatory) the heading of the notification
				title: titolo,
				// (string | mandatory) the text inside the notification
				text: testo,
				// (string | optional) the image to display on the left
				image: image,
				// (bool | optional) if you want it to fade out on its own or just sit there
				sticky: stk,
				// (int | optional) the time you want it to be alive for before fading out
				time: t,
				class_name: classe
            });*/
        var dt=new Date();
        var giorno=getGiorno(dt);

        var rec={
            TITOLO:titolo,
            MSG:testo,
            COLORE:colore,
           
            DATA: giorno.DATAITALIANA,
            ORA: giorno.ORASECMILLIS

        };
        $('#msgs').html(titolo+":"+testo);
        $('#msgs').css('color',colore);
        
        MSGS.unshift(rec);    
        if (MSGS.length>100){
            MSGS.pop();
        }    
      
		return(rec);	
}

function getParametri(parms){
	var strparms="";
	if (Array.isArray(parms)){
		 for (var i = 0, length = parms.length; i < length; ++i)
			{
				var v='#'+parms[i];
			 strparms=strparms+'&'+parms[i]+'='+encodeURI($(v).val());
			} 
	}else{
			
			var v='#'+parms;
			if ($(v).is("form"))
				{
				strparms='&'+$(v).serialize();	
				}else{
				strparms='&'+parms+'='+encodeURI($(v).val());
				}
	}
	return(strparms);
}

function getJSON(href,param) {
	href=href+"&_T="+getDataOraElab();
	var outJSON = null;
	DisplayProgressMessage('Esecuzione richiesta server ...'+href,'getJSON');
	$.ajaxSetup({async: false});
	
	$.post(href, param,function(response) {
		  console.log( "success" );
		   outJSON=response;
		//	   StopProgressMessage();
		})
		  .done(function(response) {
			 //console.log('done data:' + JSON.stringify(response));    			 			 
			// outJSON=response;
		  })
		  .fail(function(response) {
		    console.log( "error" );
		  })
		  .always(function(response, status) {
		    console.log( "complete" );
		  });
	//$.ajaxSetup({async: true});		
	//console.log( "end outJSON:" + outJSON);
	StopProgressMessage();
	return outJSON;
}



var server='';
function postandgetJSON(service,action,json,callback,parm,prms) {
	var href=server+"/ecs/?Service="+service+"&Action="+action;
	console.log('Richiesta:'+href);
	href=href+"&_T="+getDataOraElab();
	if (prms!=undefined){
		href=href+'&'+prms;
	}
	var outJSON=undefined;
	var async=true;
	if (callback!=undefined){
		$.ajaxSetup({async: true,beforeSend:undefined});
		
	}else{
	//DisplayProgressMessage('Esecuzione richiesta server ...'+service+"."+action,action);

	//$.ajaxSetup({async: false});
	/*	$.ajaxSetup({async: false,
		beforeSend: function() {
			DisplayProgressMessage('Esecuzione richiesta server ...'+service+"."+action,'Beforesend:'+action);
			
		}
		});*/
	//	async=false;
		
	}
	var t1=new Date().getTime();
	console.log("PRE ELAPSED:"+t1);
	/* $.ajaxSetup({headers:{
		Connection: 'keep-alive'
	}}); */
	$.post(href, {"parametri":JSON.stringify(json)},function(response) {
		  console.log( "success" );
		   outJSON=response;
		},"json")
		  .done(function(response) {
			 //console.log('done data:' + JSON.stringify(response));    			 			 
			// outJSON=response;
			/*if (callback!=undefined){
				callback(response,parm);
				}*/
			/*if (!async){
				StopProgressMessage();
			}*/	
			var t2=new Date().getTime()-t1;
   console.log("ELAPSED:"+t2+" "+t1);
		  })
		  .fail(function(response) {
		    console.log( "error:"+JSON.stringify(response) );
		  })
		  .always(function(response, status,xhr) {
			console.log( "complete" );
		
			if (callback!=undefined){
				callback(response,parm,xhr);
				}
			});	


		  
	return outJSON;	  
}





var cbresponse={};
var cbparm={};

function CBpostandgetJSON(response,req){
//	console.log('Ricevuto response:'+req);
	cbresponse[req]=response;
}

function sleeping(ms) {
	//console.log('Sleeping');
	return new Promise(resolve => setTimeout(resolve, ms));
  }
  

var timeout=50000;
var deltaDefault=20;
var traceLog=false;

async function apostandgetJSON(service,action,json,callback,parm,prms) {

	if (callback==undefined){
		DisplayProgressMessage('Esecuzione richiesta server ...'+service+"."+action,action);

		var req='REQ'+generateID();
		console.log('REQ:'+req+' '+service+'.'+action+' '+JSON.stringify(json));
		var tx1=new Date().getTime();
		postandgetJSON(service,action,json,CBpostandgetJSON,req,prms);
		var ret=cbresponse[req];
		var d=new Date();
		var t1=d.getTime();
		var count=0;
		var delta=deltaDefault;
			
		var maxdelta=500;	
		while (ret==undefined) {
			count=count+1;
			var slt=delta*count;
			if (slt>maxdelta){
				slt=maxdelta;
			}
			await sleeping(slt);
			d=new Date();
			var t2=d.getTime();
			t2=t2-t1;
			console.log('sleeping:'+t2+' millisecs:'+req+' '+ret);
			var msg='Esecuzione richiesta server ...'+service+"."+action+' durata:'+t2+' msec';
			if (service=='Pr7'){
				if (action=='getgenerepr7') {
					msg='Accesso alla banca dati Pr7 - Recupero connessioni classi. Durata:'+t2+' msec';
						var query=json.QUERY;
						if (query!=undefined){
							var codice=query.CLASSE;
							if (codice!=undefined){
								msg='Accesso alla banca dati Pr7 - Recupero connessioni per la classe:'+codice+'. Durata:'+t2+' msec';
							}
						}
					}
					if (action=='getarticlepr7') {
						msg='Accesso alla banca dati Pr7 - Recupero dettagli sull\'articolo neutro. Durata:'+t2+' msec';
						var query=json.QUERY;
						if (query!=undefined){
							var codice=query.CODICETEMPLATE;
							if (codice!=undefined){
									msg='Accesso alla banca dati Pr7 - Recupero dettagli sull\'articolo neutro:'+codice+'. Durata:'+t2+' msec';
							}
						}
					}

				

			}
			if (service=='Pr7'||traceLog){
			DisplayProgressMessage(msg,action);
			}
			ret=cbresponse[req];
			if (t2>timeout){
				ret={
					'Esito':'KO',
					'Msg':'Timeout interrogando il server'
				};
			}
		}
		StopProgressMessage();
		
		delete cbresponse[req];
		var tx2=new Date().getTime()-tx1;
   //console.log("ELAPSED:"+t2+" "+t1);
	//	console.log('RETURN CALL '+req+':'+tx2+":"+JSON.stringify(ret));

		return(ret);

	}else{
		return(postandgetJSON(service,action,json,callback,parm));
	}


}

function pgJSON(app,service,action,json,callback,parm,prms) {
	var href=server+"/"+app+"/?Service="+service+"&Action="+action;
	//console.log('Richiesta 2:'+href);
	href=href+"&_T="+getDataOraElab();
	if (prms!=undefined){
		href=href+'&'+prms;
	}
	var outJSON=undefined;
	var async=true;
	if (callback!=undefined){
		$.ajaxSetup({async: true,beforeSend:undefined});
		
	}else{
	//DisplayProgressMessage('Esecuzione richiesta server ...'+service+"."+action,action);

	$.ajaxSetup({async: false});
	/*	$.ajaxSetup({async: false,
		beforeSend: function() {
			DisplayProgressMessage('Esecuzione richiesta server ...'+service+"."+action,'Beforesend:'+action);
			
		}
		});*/
		async=false;
		
	}
	console.log('Richiesta 2:'+href);

	$.post(href, {"parametri":JSON.stringify(json)},function(response) {
		  console.log( "success" );
		   outJSON=response;
		},"json")
		  .done(function(response) {
			 //console.log('done data:' + JSON.stringify(response));    			 			 
			// outJSON=response;
			/*if (callback!=undefined){
				callback(response,parm);
				}*/
			/*if (!async){
				StopProgressMessage();
			}*/	
		  })
		  .fail(function(response) {
		    console.log( "error:"+JSON.stringify(response) );
		  })
		  .always(function(response, status,xhr) {
			console.log( "complete" );
			//console.log( "second complete2:"+xhr.getAllResponseHeaders()  );
		/*	var cookie=xhr.getResponseHeader('Set-Cookie');
			console.log('Cookie:'+cookie);*/
			console.log('Cookie2:'+document.cookie);
			if (callback!=undefined){
				callback(response,parm);
				}
		  });
	if (!async){
		$.ajaxSetup({async: true,
			beforeSend: undefined
			});
	//	StopProgressMessage();
	}		  
	return outJSON;	  
}

async function apgJSON(app,service,action,json,callback,parm,prms) {

	if (callback==undefined){
		DisplayProgressMessage('Esecuzione richiesta server ...'+service+"."+action,action);

		var req='REQ'+generateID();
		console.log('REQ:'+req+' '+service+'.'+action+' '+JSON.stringify(json));

		pgJSON(app,service,action,json,CBpostandgetJSON,req,prms);
		var ret=cbresponse[req];
		var d=new Date();
		var t1=d.getTime();
		var count=0;
		var delta=20;	
		var maxdelta=500;	
		while (ret==undefined) {
			count=count+1;
			var slt=delta*count;
			if (slt>maxdelta){
				slt=maxdelta;
			}
			await sleeping(slt);
			d=new Date();
			var t2=d.getTime();
			t2=t2-t1;
			console.log('sleeping:'+t2+' millisecs:'+req+' '+ret);
			var msg='Esecuzione richiesta server ...'+service+"."+action+' durata:'+t2+' msec';
			if (service=='Pr7'){
				if (action=='getgenerepr7') {
					msg='Accesso alla banca dati Pr7 - Recupero connessioni classi. Durata:'+t2+' msec';
						var query=json.QUERY;
						if (query!=undefined){
							var codice=query.CLASSE;
							if (codice!=undefined){
								msg='Accesso alla banca dati Pr7 - Recupero connessioni per la classe:'+codice+'. Durata:'+t2+' msec';
							}
						}
					}
					if (action=='getarticlepr7') {
						msg='Accesso alla banca dati Pr7 - Recupero dettagli sull\'articolo neutro. Durata:'+t2+' msec';
						var query=json.QUERY;
						if (query!=undefined){
							var codice=query.CODICETEMPLATE;
							if (codice!=undefined){
									msg='Accesso alla banca dati Pr7 - Recupero dettagli sull\'articolo neutro:'+codice+'. Durata:'+t2+' msec';
							}
						}
					}

				

			}
			DisplayProgressMessage(msg,action);
			ret=cbresponse[req];
			if (t2>timeout){
				ret={
					'Esito':'KO',
					'Msg':'Timeout interrogando il server'
				};
			}
		}
		StopProgressMessage();
		
		delete cbresponse[req];
		console.log('RETURN CALL'+req+':'+JSON.stringify(ret));
		return(ret);

	}else{
		return(pgJSON(app,service,action,json,callback,parm));
	}


}

$.fn.estraiJSON = function()
{
   var o = {}; // final object
   var a = this.serializeArray(); // retrieves an array of all form values as
   
                               // objects { name: "", value: "" }
	var currentElement={};
	var currentPosition="";
	currentElement[currentPosition]=o;
	var typeElement="HASH";
							   
   $.each(a, function() {
  //     var ns = this.name.split("."); // split name to get namespace
  //     AddToTree(o, ns, this.value); // creates a tree structure
                                     // with values in the namespace
		 var name=this.name;
		 var valore=this.value;
		 if (name!=undefined && name=="_SECTION")
			{
			var nome=this.value;
			var v=nome.split(".");
			console.log("VALORE:"+nome+":"+v[0]+":"+v[1]);
			if (v[1] == undefined)
				{
				v[1]="NNNN";
				}
			var test=v[1];	
			switch(test) {
						case "ARRAY":
							var objcurr=currentElement[currentPosition];
							if (objcurr[v[0]]== undefined)
								{
									console.log("CREO ARRAY PER "+v[0]+":Posizione:"+currentPosition);
									console.log("OGGETTO CORRENTE "+JSON.stringify(objcurr));
									objcurr[v[0]]=[];
								}	
							var pos=addLevel(currentPosition,v[0]);
							currentPosition=pos;
							currentElement[currentPosition]=objcurr[v[0]];
							break;
						case "ENDARRAY":
							var pos=reduceLevel(currentPosition);
							currentPosition=pos;
							console.log("Posizione:"+currentPosition);
							break;
						case "ARRAYELEMENT":
							var objcurr=currentElement[currentPosition];
							if (objcurr[v[0]]== undefined)
								{
									console.log("CREO HASH PER ARRAY ALL'INDICE:"+v[0]+":Posizione:"+currentPosition);
									console.log("OGGETTO CORRENTE "+JSON.stringify(objcurr));
									objcurr[v[0]]={};
								}	
							var pos=addLevel(currentPosition,v[0]);
							currentPosition=pos;
							currentElement[currentPosition]=objcurr[v[0]];
							break;
						case "ENDARRAYELEMENT":
							var pos=reduceLevel(currentPosition);
							currentPosition=pos;
							console.log("Posizione2:"+currentPosition);
							break;
						case "HASH":
							var objcurr=currentElement[currentPosition];
							if (objcurr[v[0]]== undefined)
								{
									console.log("CREO HASH PER :"+v[0]+":Posizione:"+currentPosition);
									console.log("OGGETTO CORRENTE "+JSON.stringify(objcurr));
									objcurr[v[0]]={};
								}	
							var pos=addLevel(currentPosition,v[0]);
							currentPosition=pos;
							currentElement[currentPosition]=objcurr[v[0]];
							break;
						case "ENDHASH":
							var pos=reduceLevel(currentPosition);
							currentPosition=pos;
							console.log("Posizione3:"+currentPosition);
							break;	
						default:
							
				}	
			}else{
			var objcurr=currentElement[currentPosition];
			objcurr[name]=valore;
			}	
			
   });

   return o;
};

function reduceLevel(n){
var v=n.split(".");
var o=v[0];
for (var i = 1, length = v.length; i < length-1; ++i)
		o=o+"."+v[i];
if (v.length==1)
	{
	o="";
	}
return(o);	
}

function addLevel(old,n){
if (old == '')
	{
	return(n);
	}else{
	return(old+"."+n);
	}	
}

function getDistance(luogo_part_id,luogo_dest_id){
	var parametri={'LUOGO_PART_ID':luogo_part_id,'LUOGO_DEST_ID':luogo_dest_id};
	var res=postandgetJSON('AddressQuery','getdistance',parametri);
	//console.log(res);
	return(res);
}

async function getIndirizzoFromLatLon(lat, lon){
	// var parametri={'LUOGO_PART_ID':luogo_part_id,'LUOGO_DEST_ID':luogo_dest_id};
	var parms = "lat="+lat + "&lon=" + lon;
	var res = await apostandgetJSON('AddressQuery', 'querybylatlon', undefined, undefined, undefined, parms);
	//console.log(res);
	return(res);
}

function generateID(){
	var ret=new Date().getTime()+"_"+idsequence;
	idsequence=idsequence+1;
	return(ret);
}


function getServerModule(moduledir,module,count){
	var savedata={};
   
   savedata.DIR=moduledir;
   savedata.MODULE=module;
   if (count!=undefined){
	   savedata.COUNT=count;
		}
   var res=postandgetHTML("PageGet","moduledirmodule",savedata);
   return(res);
}

function getSrcUserImage(u){ // restituisce l'src dell'immagine profilo utente
    var user = USERS[u];
    if(user == undefined){
        var veic = Risorsa.get(u);
        if(veic == undefined){ Risorsa.load(u) }
        if(veic != undefined && veic.IMMAGINE != undefined){
            var src_image = server+'/ecs/?Service=Document&Action=getdoc&hid='+veic.IMMAGINE+'&tipodoc=DOC';
        } else if(veic != undefined && veic.IMAGE != undefined){
            var src_image = server+'/ecs/?Service=Document&Action=getdoc&hid='+veic.IMAGE+'&tipodoc=DOC';
        } else {
            return server+'/img/blank_male.png';
        }
    } else {
        if( (user.IMAGE==undefined) || (user.IMAGE.length < 1) ){
            var src_image = server+'/img/blank_male.png';
        } else {
            var src_image = server+'/ecs/?Service=Document&Action=getdoc&hid='+user.IMAGE+'&tipodoc=DOC';
        }
    }

    return src_image;
}

 var PROFILO=undefined;

async function getProfiloUtente(){
	var savedata={};
   var res=await apostandgetJSON("ProfiloUtente","getProfilo",savedata);
   if (res!=undefined && res.Esito=='OK'){
		var ret=res.PROFILO;
	//	console.log("PROFILO UTENTE:"+$('body').find('[tipo="user-name2"]').length + ";" + JSON.stringify(ret));
		PROFILO=ret;
		$('body').find('[tipo="user-name2"]').text(PROFILO.NOMINATIVO);
		var src_user_image = server+'/img/blank_male.png';
		if(PROFILO.IMMAGINE!=undefined && PROFILO.IMMAGINE.length > 1){
            var src_user_image = server+'/ecs/?Service=Document&Action=getdoc&hid='+PROFILO.IMMAGINE+'&tipodoc=DOC';
        }
		$('body').find('#userDropdown img').attr('src', src_user_image);
		return(ret);
	}
   return(undefined);
}

//getProfiloUtente();

function getServerPage(pagedir,page){
	var savedata={};
   
   savedata.DIR=pagedir;
   savedata.MODULE=page;
   savedata.PAGE=page;
   var res=postandgetHTML("PageGet","PagedirPage",savedata);
   return(res);
}

function cloneObj(obj){
    return(JSON.parse(JSON.stringify(obj)));
}

function getBaseUrl(){
	var baseurl=window.location.href;
var surl=baseurl.split('\/');
var url=surl[0]+'//'+surl[2];
return(url);
}

function SC(c){
    switch (c){
        case 'a':
            return(String.fromCharCode(224));
        break;
        case 'e':
            return(String.fromCharCode(232));
        break;
        case 'i':
            return(String.fromCharCode(236));
        break;
        case 'o':
            return(String.fromCharCode(242));
        break;
        case 'u':
            return(String.fromCharCode(249));
        break;
        case 'ea':
            return(String.fromCharCode(233));
        break;

    }
}

if ($.fn.datepicker!=undefined){
	if ($.fn.datepicker.dates!=undefined){
$.fn.datepicker.dates['it'] = {
    days: ["Domenica", "Luned"+SC('i'), "Marted"+SC('i'), "Mercoled"+SC('i'), "Gioved"+SC('i'), "Venerd"+SC('i'), "Sabato"],
    daysShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
    daysMin: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"],
    months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
    monthsShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
    today: "Oggi",
    clear: "Canc",
    format: "dd/mm/yyyy",
    titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
    weekStart: 0
};
	}
}

var campiDoc=['HID','PHID','NOMEFILE','TIPO_DOCUMENTO','CATEGORIA','TIPO','SIZE'];
function allineaCampiDocumento(docS,docT){
	for (var i=0;i<campiDoc.length;i++){
		var c=campiDoc[i];
		//console.log('C:'+c+' --->'+docS[c] );
		if (docS[c]!=undefined){
			docT[c]=docS[c];
		}
	}
}


function getUrlLink(url){
	window.open(url,'_blank');
}

function getDocUrl(hid){
	return(server+'/ecs/?Service=Document&Action=getdoc&hid='+hid+'&tipodoc=DOC');
}

function getPDFUrl(hid){
	console.log('URL DOC PDF:'+server+'/ecs/?Service=Document&Action=getdoc&hid='+hid+'&tipodoc=PDF');
	return(server+'/ecs/?Service=Document&Action=getdoc&hid='+hid+'&tipodoc=PDF');
}

function getDocumentoServer(hid,tipodoc){
	if (hid!=undefined &&tipodoc!=undefined){
		window.open(server+'/ecs/?Service=Document&Action=getdoc&hid='+hid+'&tipodoc='+tipodoc,'_blank');
		return;
			
	}
	var doc=Risorsa.get(hid);
	
	console.log('Get Documnento:'+hid+' --->'+doc);
	if (doc!=undefined){
		window.open(server+'/ecs/?Service=Document&Action=getdoc&hid='+hid+'&tipodoc='+doc.TIPO_DOCUMENTO,'_blank');
		}
}

function getDocumentoServer2(el){
	var hid=$(el).attr('hid');
var ogg=Risorsa.get(hid);
if (ogg!=undefined){
	var dochid=ogg.DOCHID;
	if (dochid!=undefined){
	getDocumentoServer(dochid,'DOC');
	}else{
	getDocumentoServer(hid,'DOC');
	}
}else{
getDocumentoServer(hid,'DOC');
}
}
function getDocumentoServer3(el){
		var hid=$(el).attr('hid');
		var campo=$(el).attr('campo');
    var ogg=Risorsa.get(hid);
    if (ogg!=undefined){

        var dochid=ogg[campo];
        if (dochid!=undefined){
        	getDocumentoServer(dochid,'DOC');
        }else{
        	 getDocumentoServer(hid,'DOC');
        }
    }else{
		if (hid!=undefined && hid.length>0){
			getDocumentoServer(hid,'DOC');
		}
		// getDocumentoServer(hid,'DOC');
		
    }
}

function getDocumentoServer4(el,campo){
	var hid=$(el).attr('hid');

var ogg=Risorsa.get(hid);
if (ogg!=undefined){

	var dochid=ogg[campo];
	if (dochid!=undefined){
	getDocumentoServer(dochid,'DOC');
	}else{
	getDocumentoServer(hid,'DOC');
	}
}else{
getDocumentoServer(hid,'DOC');
}
}




function getDocumentoServer2Pdf(el){
	var hid=$(el).attr('hid');
	var ogg=Risorsa.get(hid);
	if (ogg!=undefined){
			var dochid=ogg.DOCHID;
			if (dochid!=undefined){
			getDocumentoServer(dochid,'PDF');
			}else{
			getDocumentoServer(hid,'PDF');
			}
	}else{
	getDocumentoServer(hid,'PDF');
	}
}

async function getSintesiDocumento(hid,td){
	if (td==undefined){
		td='DOC';
	}
	var savedata={
		'hid':hid,
		'tipodoc':td
	};
	var ret=await apostandgetJSON('Document','getsintesi',savedata);
	console.log('GETSINTESIDOC:'+JSON.stringify(ret));
	if (ret!=undefined && ret.Esito=='OK'){
		
		var ndoc=ret.DOCUMENTO;
		if (ndoc!=undefined){
		 ndoc.SIZE='';
			var szlab='SIZE_'+ndoc.TIPO_DOCUMENTO;
			//console.log("SZLAB:"+szlab);
			for (var x in ndoc){
			//	console.log("COMPARA:"+szlab+"< >"+x+"<");
				if (x===szlab){
				try {
					ndoc.SIZE=ndoc[x];
					ndoc.SIZE=Math.round(ndoc.SIZE*100/1024)/100;
					ndoc.SIZE=''+formatNumero(ndoc.SIZE)+' kbyte';
				} catch (error) {
					
				}	
				
				//console.log('INTO:'+ndoc.SIZE);
				}
			}
		}
		return(ndoc);
	}
		

}


function docLink(el){
	var link=$(el).attr('link');
	if (link!=undefined){
		window.open('/ecs/?Service=Document&Action=getdoc&hid='+link+'&tipodoc=DOC','_blank');
		}
}

function docLinkPdf(el){
	var link=$(el).attr('link');
	if (link!=undefined){
		window.open('/ecs/?Service=Document&Action=getdoc&hid='+link+'&tipodoc=PDF','_blank');
		}
}

/**
 * Load Images
 */
var imgCache={};
var datiCache={};

async function loadImage(url,dati,nome,callback){
	if (dati==undefined){
		dati=datiCache;
	}
   var rc=undefined;
    if (dati[nome]==undefined){
        console.log('Open Url:'+url);
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
         
        oReq.responseType = 'arraybuffer';
        oReq.onload = function(oEvent) {
        var blob = oReq.response;
        console.log('LOADED IMAGE ! '+url+' size:'+blob.byteLength);
        dati[nome]=blob;
        imgCache[url]=blob;
        if (callback!=undefined){
            callback(dati,nome);
		  }
		  rc={"Esito":'OK',"Msg":"Immagine caricata"}
        };
    
        oReq.send();
	}
	var timeo=10000;
	var t=0;
	while (rc==undefined && t<timeo){
		await sleeping(30);
		t=t+30;
	}
	if (t>=timeo){
		rc={"Esito":'KO',"Msg":'Timeout nel caricamento della immagine '+url};
	}
	return(rc);
}


async function getFileDoc(hid,nome,callback){
	var dati=datiCache;
	if (dati[nome]==undefined){
		var url=getDocUrl(hid);
        console.log('Open Url:'+url);
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
         
        oReq.responseType = 'arraybuffer';
        oReq.onload = function(oEvent) {
        var blob = oReq.response;
        console.log('LOADED FILE !	 '+url+' size:'+blob.byteLength);
        dati[nome]=blob;
        if (callback!=undefined){
            callback(blob,nome);
          }
        };
    
        oReq.send();
	}
	
	var t=0;
	var timeo=20000;
	while (dati[nome]==undefined && t<timeo){
		await sleeping(50);
		t=t+50;
	}
	return(dati[nome]);
}

function getImage(url,nome){
	if (nome==undefined&& url!=undefined){
		nome=url;
	}
	
	if (url==undefined&& nome!=undefined){
		url=nome;
	}
	if (imgCache[url]!=undefined){
		return(imgCache[url]);
	}
	if (datiCache[nome]!=undefined){
		return(datiCache[nome]);
	}
	if (url.startsWith('#')){
		url=url.replace('#','');
		loadImageContent(url,undefined,nome);
		return;
	}
	loadImage(url,undefined,nome);
	
}

function getCanvasBlob(canvas) {
	return new Promise(function(resolve, reject) {
	  canvas.toBlob(function(blob) {
		resolve(blob);
	  })
	})
  }

function loadImageContent(tag,dati,nome){
	var canvas = document.getElementById(tag);
	if (dati==undefined){
				dati=datiCache;
			}
   
    if (dati[nome]==undefined){
			canvas.toBlob(function(blob) {
				dati[nome]=blob;
        imgCache[tag]=blob;
        if (callback!=undefined){
            callback(dati,nome);
          }
			});
		}


}


var hashCode = function(s){
	var ret=s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
	if (parseInt(ret)<0){
		ret=-1*parseInt(ret);
		ret='S'+ret;
	}           
	return(ret);   

  }


  /*
  Calendar functions
  */


 function getDateFromServerDate(data){
    var anno=data.substring(0,4);
    var mese=data.substring(4,6);
    var giorno=data.substring(6,8);
    var dt=anno+'-'+mese+'-'+giorno;
    var res=new Date(dt);
    console.log('getDateFromServer:'+data+':'+dt+':'+res);
    return(res);
}

function getGiorno(data){
    var giorno={};
    if (data==undefined){
        return(giorno);
    }
    if (!(data instanceof Date)){
        return(giorno);
    }
    var cDate = new Date(data.getTime());
/*     cDate.setFullYear(data.getFullYear());
    cDate.setMonth(data.getMonth());
    cDate.setDate(data.getDate()); */
    
    giorno.DATE=cDate;
    giorno.DAY=cDate.getDate();
    if (giorno.DAY<10){
        giorno.DD='0'+giorno.DAY;
    }else{
        giorno.DD=''+giorno.DAY;
    }
    giorno.DAYOFWEEK=cDate.getDay();
    if (giorno.DAYOFWEEK==0){
        giorno.DAYOFWEEK=0;
    }
    giorno.DAYOFWEEK7=cDate.getDay();
    if (giorno.DAYOFWEEK7==0){
        giorno.DAYOFWEEK7=7;
    }
    giorno.GIORNO=getGiornoSettimana(giorno.DAYOFWEEK);
    giorno.GIORNOBREVE=getGiornoSettimanaBreve(giorno.DAYOFWEEK);
    giorno.YEAR=cDate.getFullYear();
    giorno.ANNO=cDate.getFullYear();
    giorno.MONTH=cDate.getMonth()+1;

    

    giorno.MM=''+giorno.MONTH;
    if ( giorno.MONTH<10){
        giorno.MM='0'+giorno.MONTH;
    }
    giorno.DATAFORM=getDataForm(giorno);
    giorno.MESE=getMese(giorno.MONTH);
    giorno.DATA=getData(giorno);
    giorno.DATAITALIANA=getDataItaliana(giorno);
    giorno.DATAESTESA=getDataEstesa(giorno);
    giorno.DATAINPUT=getDataInput(giorno);
    giorno.DATASERVER=giorno.DATA;
    var ora=cDate.getHours();
    if (ora<10){
        ora='0'+ora
    }
    giorno.HH=ora;
    var min=cDate.getMinutes();
    if (min<10){
        min='0'+min;
    }
    giorno.MI=min;
    giorno.ORA=ora+":"+min;

    var sec=cDate.getSeconds();
    if (sec<10){
        sec='0'+sec;
    }
    giorno.SS=sec;
    var millis=cDate.getMilliseconds();
    if (millis<10){
        millis='00'+millis;
    }else{
        if (millis<100){
            millis='0'+millis;
        }
    }
    giorno.ORASECMILLIS=ora+":"+min+":"+sec+"."+millis;
    return(giorno);
}

function getData(giorno){
    var ret=''+giorno.ANNO;
    if (giorno.MONTH<10){
        ret=ret+'0'+giorno.MONTH;
    }else{
        ret=ret+giorno.MONTH;
    }
    if (giorno.DAY<10){
        ret=ret+'0'+giorno.DAY;
    }else{
        ret=ret+giorno.DAY;
    }
    return(ret);
}


function getDataForm(giorno){
    var ret=''+giorno.ANNO;
    if (giorno.MONTH<10){
        ret=ret+'-'+'0'+giorno.MONTH;
    }else{
        ret=ret+'-'+giorno.MONTH;
    }
    if (giorno.DAY<10){
        ret=ret+'-'+'0'+giorno.DAY;
    }else{
        ret=ret+'-'+giorno.DAY;
    }
    return(ret);
}

function getDataItaliana(giorno){
    var ret='';
    if (giorno.DAY<10){
        ret=ret+'0'+giorno.DAY;
    }else{
        ret=ret+giorno.DAY;
    }
    if (giorno.MONTH<10){
        ret=ret+'/'+'0'+giorno.MONTH;
    }else{
        ret=ret+'/'+giorno.MONTH;
    }
    ret=ret+'/'+giorno.ANNO;
    return(ret);
}

function getDataEstesa(giorno){
    var ret='';
    ret=ret+giorno.GIORNO+' '+giorno.DAY+' '+giorno.MESE;
    
    ret=ret+' '+giorno.ANNO;
    return(ret);
}

function parseDataItaliana(data){
var v=data.split('\\/',-1);
if (v.length==3){
    var cDate = new Date();
    cDate.setFullYear(1*v[2]);
    var m=1*v[1]-1;
    cDate.setMonth(m);
    cDate.setDate(1*v[0]);
    return(cDate);
    }
 return(null);   
}

function parseDataServer(data){
    //var v=data.split('\\/',-1);
    var v=[];
    v[0]=data.substring(6,8);
    v[1]=data.substring(4,6);
    v[2]=data.substring(0,4);
   
    if (v.length==3){
        var cDate = new Date();
        cDate.setFullYear(1*v[2]);
        var m=1*v[1]-1;
        cDate.setMonth(m);
        cDate.setDate(1*v[0]);
        return(cDate);
        }
     return(null);   
    }

    function parseDataForm(data){
        //var v=data.split('\\/',-1);
        var v=[];
        v[0]=data.substring(8,10);
        v[1]=data.substring(5,7);
        v[2]=data.substring(0,4);
       
        if (v.length==3){
            var cDate = new Date();
            cDate.setFullYear(1*v[2]);
            var m=1*v[1]-1;
            cDate.setMonth(m);
            cDate.setDate(1*v[0]);
            return(cDate);
            }
         return(null);   
        }   


function getDataInput(giorno){
    var ret=''+giorno.ANNO;
    if (giorno.MONTH<10){
        ret=ret+'-'+'0'+giorno.MONTH;
    }else{
        ret=ret+'-'+giorno.MONTH;
    }
    if (giorno.DAY<10){
        ret=ret+'-'+'0'+giorno.DAY;
    }else{
        ret=ret+'-'+giorno.DAY;
    }
    return(ret);
}

function getGiornoSettimana(v){
    switch (v) {
        case 0:
            return("Domenica");
            break;
        
        case 1:
            return("Lunedi'");
            break;    
    
        case 2:
            return("Martedi'");
            break;    
        
        case 3:
            return("Mercoledi'");
            break;        
        
        case 4:
            return("Giovedi'");
            break;        
        
        case 5:
            return("Venerdi'");
            break;        
        
        case 6:
            return("Sabato");
            break;     
            
        default:
            return("");
            break;
    }

}

function getGiornoSettimanaBreve(v){
    switch (v) {
        case 0:
            return("Dom.");
            break;
        
        case 1:
            return("Lun.");
            break;    
    
        case 2:
            return("Mar.");
            break;    
        
        case 3:
            return("Mer.");
            break;        
        
        case 4:
            return("Gio.");
            break;        
        
        case 5:
            return("Ven.");
            break;        
        
        case 6:
            return("Sab.");
            break;     
            
        default:
            return("");
            break;
    }

}

function getMese(v){
    switch (v) {
        case 1:
            return("Gennaio");
            break;
        
        case 2:
            return("Febbraio");
            break;    
    
        case 3:
            return("Marzo");
            break;

        case 4:
            return("Aprile");
            break;

        case 5:
            return("Maggio");
            break;        
        
        case 6:
            return("Giugno");
            break;        
        
        case 7:
            return("Luglio");
            break;        
        
        case 8:
            return("Agosto");
            break;     

        case 9:
            return("Settembre");
            break;        
        
        case 10:
            return("Ottobre");
            break;        
        
        case 11:
            return("Novembre");
            break;        
        
        case 12:
            return("Dicembre");
            break;         
            
        default:
            return("");
            break;
    }

}

  /*
  End Calendar functions
  */
/**
 * Risorse Functions
 */
var cntRes=0;

var resLists={};
var resDir={};
var resRef={};


 function Risorsa(tipo,rec){
   
    if (rec==undefined){
            
    if (tipo==undefined){
        return(undefined);
    }
    tipo=tipo.toUpperCase();
    this.TIPO = tipo;
    this.MODIFIED = true;
    cntRes++;
    
    var hid=this.TIPO+'_'+new Date().getTime()+"_"+cntRes;
    this.HID = hid;
    
    var lista=resLists[tipo];
    if (lista==undefined){
        lista=[];
        resLists[tipo]=lista;
    }
    if (resDir[hid]==undefined){
        resDir[hid]=this;
        lista.push(this);
    }
    
   // console.log('IN CLASS:'+JSON.stringify(this));
    return(this);
    }

    /**
    * Usato internamente
    */

    if (tipo==undefined){
        return(undefined);
    }
    if (rec==undefined){
        return(undefined);
    }
    if (rec.HID==undefined || rec.HID.length<3){
        return(undefined);
    }
    for (var x in rec){
        this[x]=rec[x];
    }
    
    this.MODIFIED = false;

    tipo=this.TIPO;
    var hid=this.HID;
    this.HID = hid;
    var lista=resLists[tipo];
    if (lista==undefined){
        lista=[];
        resLists[tipo]=lista;
    }
    if (resDir[hid]==undefined){
        resDir[hid]=this;
        lista.push(this);
    }else{
        resDir[hid]=this;
        toRemove=[];
        for (var i=0;i<lista.length;i++){
            var l=lista[i];
            if (l.HID==this.HID){
                toRemove.push(l);
            }
        }
        for (var i=0;i<toRemove.length;i++){
            var l=toRemove[i];
            var pos=lista.indexOf(l);
            if (pos>=0){
                lista.splice(pos,1);
            }
        }
        lista.push(this);

    }
    return(this);
 }
 
 // Aggiunge metodi come questo. Tutti gli oggetti "persona" saranno in grado di invocarlo:
 Risorsa.prototype.save = async function(showResult){
     if (showResult==undefined){
         showResult=true;
     }
     console.log("Question Mark:"+JSON.stringify(showResult));
    var savedata={};
    savedata.TIPO=this.TIPO;
    savedata[this.TIPO]=this;
    var res=await apostandgetJSON("RisorsaService","modifyObj",savedata);
    if (showResult){
        addMsgFromResp('Salvataggio',res);
        }
    return(res);
 }

 Risorsa.prototype.saveChanged = function(showResult){
     if (this.MODIFIED){
         this.MODIFIED=false;
         this.save(showResult);
     }
 }

 Risorsa.prototype.changed = function(showResult){
     this.MODIFIED=true;
 }

Risorsa.prototype.delete = async function(showResult){
    if (showResult==undefined){
        showResult=true;
    }
   var savedata={};
   savedata.TIPO=this.TIPO;
   savedata[this.TIPO]=this;
   var res=await apostandgetJSON("RisorsaService","deleteObj",savedata);
   if (showResult){
       addMsgFromResp('Cancellazione',res);
       }
    console.log('RESULT:'+JSON.stringify(res));   
   if (res.Esito=='OK'){
      console.log('DELETED:'+this.HID); 
      this._deleteInternal();
      var tsk=Risorsa.get(this.HID);
      console.log('RESULTED:'+JSON.stringify(tsk));
   }    
   return(res);
}


Risorsa.delete =async  function(ogg,showResult){
    if (showResult==undefined){
        showResult=true;
    }
   var savedata={};
   savedata.TIPO=ogg.TIPO;
   savedata[ogg.TIPO]=ogg;
   var res=await apostandgetJSON("RisorsaService","deleteObj",savedata);
   if (showResult){
       addMsgFromResp('Cancellazione',res);
       }
    console.log('RESULT:'+JSON.stringify(res));   
   if (res.Esito=='OK'){
      console.log('DELETED:'+ogg.HID); 
      Risorsa._deleteInternal(ogg);
      var tsk=Risorsa.get(ogg.HID);
      console.log('RESULTED:'+JSON.stringify(tsk));
   }    
   return(res);
}


Risorsa.save = async function(ogg,showResult){
    if (showResult==undefined){
        showResult=true;
    }
    console.log("Question Mark:"+JSON.stringify(showResult));
    ogg.MODIFIED = false;
    console.log(ogg);
   var savedata={};
   savedata.TIPO=ogg.TIPO;
   savedata[ogg.TIPO]=ogg;
   var res=await apostandgetJSON("RisorsaService","modifyObj",savedata);
   if (showResult){
       addMsgFromResp('Salvataggio',res);
       }
   return(res);
}

Risorsa.asave = async function(ogg,showResult){
    if (showResult==undefined){
        showResult=true;
    }
    console.log("Question Mark:"+JSON.stringify(showResult));
    ogg.MODIFIED = false;
   var savedata={};
   savedata.TIPO=ogg.TIPO;
   savedata[ogg.TIPO]=ogg;
   var res=await apostandgetJSON("RisorsaService","modifyObj",savedata);
   if (showResult){
       addMsgFromResp('Salvataggio',res);
       }
   return(res);
}

Risorsa.saveChanged = function(ogg,showResult){
    if (ogg.MODIFIED){
        ogg.MODIFIED=false;
        Risorsa.save(ogg,showResult);
    }
}

Risorsa.changed = function(ogg,showResult){
    ogg.MODIFIED=true;
}

Risorsa.prototype.delete = async function(ogg,showResult){
   if (showResult==undefined){
       showResult=true;
   }
  var savedata={};
  savedata.TIPO=ogg.TIPO;
  savedata[ogg.TIPO]=ogg;
  var res=await apostandgetJSON("RisorsaService","deleteObj",savedata);
  if (showResult){
      addMsgFromResp('Cancellazione',res);
      }
   console.log('RESULT:'+JSON.stringify(res));   
  if (res.Esito=='OK'){
     console.log('DELETED:'+ogg.HID); 
     this._deleteInternal();
     var tsk=Risorsa.get(ogg.HID);
     console.log('RESULTED:'+JSON.stringify(tsk));
  }    
  return(res);
}

Risorsa.get = function(hid){
    return(resDir[hid]);
}

Risorsa.getLista= function(tipo){
var lista=resLists[tipo];
    if (lista==undefined){
        lista=[];
        resLists[tipo]=lista;
    }

    return(lista);
}

Risorsa.load = async function(hid,showResult){
    if (showResult==undefined){
        showResult=false;
    }
   var savedata={};
   var v=hid.split('\_',-1);
   var tipo=v[0];
   savedata.TIPO=tipo;
   var rec={};
   rec.TIPO=tipo;
   rec.HID=hid;
   savedata[tipo]=rec;
   
   var res=await apostandgetJSON("RisorsaService","getObj",savedata);
   if (showResult){
       addMsgFromResp('Recupero Oggetto',res);
       }
   if (res.Esito=='OK'){
    var resRec=res[tipo];
    if (resRec!=undefined){
       
        var r=new Risorsa(tipo,resRec);
        return(r);
    }    
}
   return(undefined);
  
}

Risorsa.aload = async function(hid,showResult){
    if (showResult==undefined){
        showResult=true;
    }
   var savedata={};
   var v=hid.split('\_',-1);
   var tipo=v[0];
   savedata.TIPO=tipo;
   var rec={};
   rec.TIPO=tipo;
   rec.HID=hid;
   savedata[tipo]=rec;
   
   var res=await apostandgetJSON("RisorsaService","getObj",savedata);
   if (showResult){
       addMsgFromResp('Salvataggio',res);
       }
   if (res.Esito=='OK'){
    var resRec=res[tipo];
    if (resRec!=undefined){
       
        var r=new Risorsa(tipo,resRec);
        return(r);
    }    
}
   return(undefined);
  
}

Risorsa.lista=function(res){
    this.Esito=res.Esito;
    this.Msg=res.Msg;
    
    this.LISTA=[];
    if (this.Esito=='OK'){
        var lista=res.LISTA;
        for (var i=0;i<lista.length;i++){
            var l=lista[i];
           /*** Attenzione non scommentare mai questa riga!!! */
            //var r=new Risorsa(l.TIPO,l);
            this.LISTA.push(l);
            }
        }
   

}


Risorsa.query=async function(tipo,query,sort,skip,limit,showResult){
    if (showResult==undefined){
        showResult=false;
    }
   var savedata={};
   savedata.QUERY=query;
   if (sort!=undefined){
    savedata.SORT=sort;
    }
    if (limit!=undefined){
        savedata.LIMIT=limit;
        }
    if (skip!=undefined){
        savedata.SKIP=skip;
        }    
   savedata.TIPO=tipo;
   var res=undefined;
   var t1=new Date().getTime();
   var res=await apostandgetJSON("RisorsaService","query",savedata);
   var t2=new Date().getTime()-t1;
   console.log("ELAPSED:"+t2+" "+t1);
   if (showResult){
       addMsgFromResp('Query:'+query,res);
       }
    var lista=new Risorsa.lista(res);
    return(lista);   

};

Risorsa.aquery=async function(tipo,query,sort,skip,limit,showResult,proj){
    if (showResult==undefined){
        showResult=false;
    }
   var savedata={};
   savedata.QUERY=query;
   if (sort!=undefined){
    savedata.SORT=sort;
    }
    if (proj!=undefined){
        savedata.PROJECTION=proj;
        }
    if (limit!=undefined){
        savedata.LIMIT=limit;
        }
    if (skip!=undefined){
        savedata.SKIP=skip;
        }    
   savedata.TIPO=tipo;
   var res=undefined;
   var res=await apostandgetJSON("RisorsaService","query",savedata);
   if (showResult){
       addMsgFromResp('Query:'+query,res);
       }
    var lista=new Risorsa.lista(res);
    return(lista);   

};

Risorsa.acount=async function(tipo,query,sort,skip,limit,showResult,proj){
    if (showResult==undefined){
        showResult=false;
    }
   var savedata={};
   savedata.QUERY=query;
   if (sort!=undefined){
    savedata.SORT=sort;
    }
    if (proj!=undefined){
        savedata.PROJECTION=proj;
        }
    if (limit!=undefined){
        savedata.LIMIT=limit;
        }
    if (skip!=undefined){
        savedata.SKIP=skip;
        }    
   savedata.TIPO=tipo;
   var res=undefined;
   var res=await apostandgetJSON("RisorsaService","count",savedata);
   if (showResult){
       addMsgFromResp('Query:'+query,res);
       }
       console.log('COUNT ESITO:'+tipo+' '+query+' '+JSON.stringify(res));
       if (res.Esito=='OK'){
           return(res.COUNT);
       }else{
           return(undefined);
       }
  

};


Risorsa.queryByService=async function(service,action,tipo,query,sort,skip,limit,showResult){
    if (showResult==undefined){
        showResult=false;
    }
   var savedata={};
   savedata.QUERY=query;
   if (sort!=undefined){
    savedata.SORT=sort;
    }
    if (limit!=undefined){
        savedata.LIMIT=limit;
        }
    if (skip!=undefined){
        savedata.SKIP=skip;
        }    
   savedata.TIPO=tipo;
   var res=await apostandgetJSON(service,action,savedata);
   if (showResult){
       addMsgFromResp('Query:'+query,res);
       }
    //console.log('Response:'+JSON.stringify(res));   
    var lista=new Risorsa.lista(res);
    return(lista);   

};

Risorsa.aqueryByService=async function(service,action,tipo,query,sort,skip,limit,showResult){
    if (showResult==undefined){
        showResult=false;
    }
   var savedata={};
   savedata.QUERY=query;
   if (sort!=undefined){
    savedata.SORT=sort;
    }
    if (limit!=undefined){
        savedata.LIMIT=limit;
        }
    if (skip!=undefined){
        savedata.SKIP=skip;
        }    
   savedata.TIPO=tipo;
   var res=await apostandgetJSON(service,action,savedata);
   if (showResult){
       addMsgFromResp('Query:'+query,res);
       }
    console.log('Response:'+JSON.stringify(res));   
    var lista=new Risorsa.lista(res);
    return(lista);   

};




Risorsa.search=async function(tipo,searchobject,limit,showResult){
   var savedata={};
   
   savedata.QUERY=searchobject;
   if (showResult==undefined){
    showResult=false;
}
    if (limit!=undefined){
        savedata.LIMIT=limit;
        }
   savedata.TIPO=tipo;
   var res=await apostandgetJSON("RisorsaService","search",savedata);
   if (showResult){
       addMsgFromResp('Search',res);
       }
    /**
     * res contains:
     *  Esito: OK|KO
     *  Msg: text message
     *  LISTA: Array of Object response (simple javascript array - cannot be used as Risorsa Object 
     *     to get Risorsa Object we should call query by HID (load function) on interesting items )
     */
    return(res);  
};

Risorsa.asearch=async function(tipo,searchobject,limit,showResult){
    var savedata={};
    
    savedata.QUERY=searchobject;
    if (showResult==undefined){
     showResult=false;
 }
     if (limit!=undefined){
         savedata.LIMIT=limit;
         }
    savedata.TIPO=tipo;
    var res=await apostandgetJSON("RisorsaService","search",savedata);
    if (showResult){
        addMsgFromResp('Search',res);
        }
     /**
      * res contains:
      *  Esito: OK|KO
      *  Msg: text message
      *  LISTA: Array of Object response (simple javascript array - cannot be used as Risorsa Object 
      *     to get Risorsa Object we should call query by HID (load function) on interesting items )
      */
     return(res);  
 };

Risorsa.searchByService=function(service,action,tipo,searchobject,limit,showResult){
    var savedata={};
    
    savedata.QUERY=searchobject;
    if (showResult==undefined){
     showResult=false;
 }
     if (limit!=undefined){
         savedata.LIMIT=limit;
         }
    savedata.TIPO=tipo;
    var res=postandgetJSON(service,action,savedata);
    if (showResult){
        addMsgFromResp('Search',res);
        }
     /**
      * res contains:
      *  Esito: OK|KO
      *  Msg: text message
      *  LISTA: Array of Object response (simple javascript array - cannot be used as Risorsa Object 
      *     to get Risorsa Object we should call query by HID (load function) on interesting items )
      */
     return(res);  
 };

Risorsa.copy=function (source,target){
    for (var x in source){
        if (x!='TIPO' && x!='HID' && x!='PHID' && x!='_id' && x!='TBLHID' && x!='_ALL'){
            target[x]=source[x];
        }
    }
}

Risorsa.removeHidInLista=function(lista,dochid){

if (lista!=undefined && lista.length>0 && dochid!=undefined){
    for (var k=0;k<lista.length;k++){
        var doc2=lista[k];
        if (doc2.HID==dochid){
            var pos=lista.indexOf(doc2);
            console.log('Risorsa.removeInlista:'+pos+':'+dochid);
                    if (pos>=0){
                        lista.splice(pos,1);
                        
                    }
        }
    }
}
}

Risorsa.registerElements=function (els){
    if (els!=undefined){
        for (var i=0;i<els.length;i++){
            var el=els[i];
            if (els[i].TIPO!=undefined){
                el.MODIFIED = false;
                Risorsa._addInternalElement(els[i]);
            }
        }
    }
    
}

Risorsa.registerElement=function (el){
    if (el!=undefined){
            if (el.TIPO!=undefined){
                el.MODIFIED = false;
               Risorsa._addInternalElement(el);
            }
        
    }
    
}

Risorsa.clear=function (tipo){
    var lista=resLists[tipo];
    if (lista!=undefined){
        for (var i=0;i<lista;i++){
        var el=lista[i];
        if (el!=undefined){
            var hid=el.HID;
            delete resDir[hid];
            }
        }
    delete lista;
    delete resLists[tipo];    
    }
}
    

Risorsa.setref=function (res,campo,valore){
    if (res==undefined){
        return(false);
    }
    var rec=resRef[res.HID];
    if (rec==undefined){
        rec={};
        resRef[res.HID]=rec;
    }
    rec[campo]=valore;
    return(true);
}

Risorsa.getref=function (res,campo){
    if (res==undefined){
        return(undefined);
    }
    var rec=resRef[res.HID];
    if (rec==undefined){
        return(undefined);
    }
    return(rec[campo]);
}

Risorsa.hasrefs=function (res){
    if (res==undefined){
        return(false);
    }
    var rec=resRef[res.HID];
    if (rec==undefined){
        return(false);
    }else{
        return(true);
    }
}

Risorsa.clearrefs=function (res){
    if (res==undefined){
        return(false);
    }
    delete resRef[res.HID];
    return(true);
}

 /*Risorsa.prototype.get = function(hid){
     return(resDir[hid]);
 }*/
 /**
  * Internals functions notused yet perhaps
  * 
  */
 Risorsa._addInternalElement = function(res){
    var tipo=res.TIPO;
    var hid=res.HID;
 var lista=resLists[tipo];
    if (lista==undefined){
        lista=[];
        resLists[tipo]=lista;
    }else{
        var toRemove=[];
        for (var i=0;i<lista.length;i++){
            var el=lista[i];
            if (el.HID==hid){
                
                toRemove.push(el);
            }
        }
        for (var i=0;i<toRemove.length;i++){
            var pos=lista.indexOf(toRemove[i]);
            lista.splice(pos,1);
        }
    }
    //if (resDir[hid]==undefined){
        resDir[hid]=res;
        lista.push(res);
        delete resRef[hid];
    //}
   
};

 Risorsa.prototype._deleteInternal = function(){
    var tipo=this.TIPO;
    var hid=this.HID;
 var lista=resLists[tipo];
    if (lista==undefined){
        lista=[];
        resLists[tipo]=lista;
    }
    if (resDir[hid]!=undefined){
        delete resDir[hid];
        //resDir[hid]=undefined;
        delete resRef[hid];
        }

    var pos=lista.indexOf(this);
    if (pos>=0){
        lista.splice(pos,1);
        }   
   
};

Risorsa._deleteInternal = function(ogg){
    var tipo=ogg.TIPO;
    var hid=ogg.HID;
 var lista=resLists[tipo];
    if (lista==undefined){
        lista=[];
        resLists[tipo]=lista;
    }
    if (resDir[hid]!=undefined){
        delete resDir[hid];
        //resDir[hid]=undefined;
        delete resRef[hid];
        //resDir[hid]=undefined;
       }
    var pos=lista.indexOf(ogg);
    if (pos>=0){
        lista.splice(pos,1);
    }   
   
};

Risorsa.prototype._addInternal = function(){
    var tipo=this.TIPO;
    var hid=this.HID;
 var lista=resLists[tipo];
    if (lista==undefined){
        lista=[];
        resLists[tipo]=lista;
    }else{
        var toRemove=[];
        for (var i=0;i<lista.length;i++){
            var el=lista[i];
            if (el.HID==hid){
                
                toRemove.push(el);
            }
        }
        for (var i=0;i<toRemove.length;i++){
            var pos=lista.indexOf(toRemove[i]);
            lista.splice(pos,1);
        }
    }
    if (resDir[hid]==undefined){
        resDir[hid]=this;
        lista.push(this);
    }
   
};


 /**
  * End Risorse Functions
  */



  /**
   * Viste Functions
   */
  var viste=[];
  var evtfdg=undefined;
  
  var currentVista={};
  
  var currentSearchElement=undefined;
  var visteSTD={};
  var visteTreeSTD={};
  
  var detailRender={};
  var cacheContenuto={};
  
  var panelsActive={};
  
  var scanContext={};
  
  $( document ).tooltip({
      items: "td,th,input",
      position: {
          my: "center bottom-20",
          at: "center top",
      },
      content: function() {
        var element = $( this );
       /* if ( element.is( "[data-geo]" ) ) {
          var text = element.text();
          return "<img class='map' alt='" + text +
            "' src='http://maps.google.com/maps/api/staticmap?" +
            "zoom=11&size=350x350&maptype=terrain&sensor=false&center=" +
            text + "'>";
        }
        if ( element.is( "[title]" ) ) {
          return element.attr( "title" );
        }*/
        var tooltip=$(element).attr('tooltip');
        if ( tooltip!=undefined ) {
          return tooltip;
        }
      }
    });
  
    function getDimensions(el){
      try {
          var offset=$(el).offset();
          var x1=offset.left;
          var y1=offset.top;
          var x2=offset.left+$(el).width();
          var y2=offset.top+$(el).height();
          var dim={'x1':x1,'y1':y1,'x2':x2,'y2':y2};
          return(dim);     
      } catch (error) {
          return(null);
      }
     
  }
  
  
  function refreshVisteFromServer(){
      var rec=postandgetJSON('Views','getviews','');
      console.log('VISTE:'+JSON.stringify(rec));
      if (rec !=undefined && rec.Esito=='OK'){
          var lista=rec.LISTA;
          Risorsa.registerElements(lista);
          for (var i=0;i<lista.length;i++){
              Risorsa.registerElement(lista[i]);
              viste.push(lista[i]);
          }
      }
  }
  
  function getViste(target){
      if (viste.length==0){
       refreshVisteFromServer();
      }
      var listaviste=[];
      for (var i=0;i<viste.length;i++){
          var vista=viste[i];
          if (target==undefined || target=='' || vista.TARGET==target ){
              listaviste.push(vista);
             
          }
      }
      return(listaviste);
  }
  
  //var currentVista={};
  
  function getCurrentVista(target){
      if (target==undefined||target==''){
          return(undefined);
      }
      if (currentVista[target]==undefined){
          var lista=getViste(target);
          if (lista.length>0){
              setCurrentVista(target,lista[0]);
              
          }
      }
      return(currentVista[target]);
  }
  
  
  
  function setCurrentVista(target,el){
      if (el!=undefined && target!=undefined && target!=''){
          currentVista[target]=el;
      }
  }
  
  function StdEliminaElemento(el){
      
      var hid=$(el).attr('hid');
      var tblhid=hid;
      if (!tblhid.startsWith('TBL')){
          var table=$(el).closest('table');
          tblhid=$(table).attr('hid');
          if (tblhid==undefined){
              tblhid=$(table).attr('id');
              }
          }
      var tbl=Risorsa.get(tblhid);
      //console.log('Tabella :'+JSON.stringify(tbl));
      if (tbl!=undefined){
          var lista=tbl.LISTA;
          for (var i=0;i<lista.length;i++){
              var ogg=lista[i];
              if (ogg.HID==hid){
                  lista.splice(i,1);
                  redrawTable(el,lista);
                  return;
              }
          }
      
      }
  }
  
  
  
  function renderTable(tableType,oggettoH,oggettiTD,vista,azione,paginare,titolo){
      if (tableType==undefined||tableType==''){
          tableType='TabellaStd';
      }
      var table=$('#'+tableType).clone();
      var addRow=false;
      var vv=$(table).find('table').attr('closerow');
      if (vv!=undefined && vv=='S'){
         
          addRow=true;
      }
      var tbl=new Risorsa("TBL");
      tbl.TABLETYPE=tableType;
      tbl.HEADEROGG=oggettoH;
      tbl.LISTA=oggettiTD;
      tbl.VISTA=vista;
      tbl.AZIONE=azione;
      if ( (window.SMARTPHONE!=undefined && window.SMARTPHONE) || (window.APPWEB!=undefined && window.APPWEB) ){
          tbl.SMARTPHONE=true;
      }
      //var idTbl='TBL'+generateID();
      var idTbl=tbl.HID;
      if ($(table).is('table')){
          $(table).attr('id',idTbl);
      }else{
          $(table).find('table').attr('id',idTbl);
          $(table).attr('id',idTbl+'_'+generateID());
      }
      
      $(table).css('display','');
      $(table).attr('TGVISTA',vista.TARGET);
      var thead=$(table).find('thead');
      var stdhriga=$(thead).find('tr');
      if (tbl.SMARTPHONE!=undefined && tbl.SMARTPHONE){
     //     $(thead).find('[tipo="smarthead"]').css('display','');
          var theadtr=$('#StdTable').find('[tipo="smarthead"]').clone();
          $(thead).empty();
          $(thead).append(theadtr);
      }else{
          if (oggettoH!=undefined){
              renderTh(stdhriga,oggettoH,vista,thead);
              $(stdhriga).attr('hid',oggettoH.HID);
              //$(thead).append(stdhriga);
              $(thead).prepend(stdhriga);
              $(stdhriga).show(50);
              $(thead).find('tr').show(50);
          }
      }
      var tbody=$(table).find('tbody');
      var stdriga=$(tbody).find('tr')[0];
          if (paginare!=undefined && paginare!='NO' && paginare!='no'){
  
              tbl.RIGHEPERPAGINA=20;
              if (isNumber(paginare)){
                  tbl.RIGHEPERPAGINA=paginare;
              }
              if (tbl.SMARTPHONE!=undefined && tbl.SMARTPHONE){
                  tbl.RIGHEPERPAGINA=1;
              }
              tbl.PAGINARE=paginare;
              tbl.STARTROW=0;
              tbl.NUMPAG = 1;
              var span_pag = $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_info"]');
              // var numpagtot = parseInt(tbl.LISTA.length / tbl.RIGHEPERPAGINA) + 1;
              var numpagtot = Math.ceil(tbl.LISTA.length / tbl.RIGHEPERPAGINA);
              tbl.NUMPAGTOT = numpagtot;
              $(span_pag).html("Pagina " + tbl.NUMPAG + " di " + tbl.NUMPAGTOT);
              var span1 = $(table).closest('[tipo="tabella"]').find('[tipo="pagcorr"]');
              $(span1).val(tbl.NUMPAG);
              var span2 = $(table).closest('[tipo="tabella"]').find('[tipo="pagtot"]');
              $(span2).text(tbl.NUMPAGTOT);
              $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_prev"]').addClass('isDisabled');
              if(tbl.NUMPAGTOT == 1 || tbl.NUMPAGTOT == 0){
                  $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_next"]').addClass('isDisabled');
              }
  
              var listaDaMostrare=[];
              if(tbl.LISTA.length < 1){
                  var riga_vuota = '<tr hid="RIGAVUOTA"><td colspan="100" style="font-size: 0.7rem">Tabella Vuota</td></tr>';
                  $(tbody).append(riga_vuota);
              }
              for (var i=0;i<tbl.RIGHEPERPAGINA;i++){
                  var numrow=tbl.STARTROW+i;
                  var ogg=oggettiTD[numrow];
                  if (ogg!=undefined){
                      ogg.TBLHID=idTbl;
                      var riga=$(stdriga).clone();
                      
                  // console.log('Passing data for row building:'+JSON.stringify(ogg));
                      if (tbl.SMARTPHONE!=undefined && tbl.SMARTPHONE){
  
                      renderTdSmart(riga,ogg,vista,undefined,tbody);
                      }else{
                      renderTd(riga,ogg,vista);
                      $(riga).attr('hid',ogg.HID);
                      $(tbody).append(riga);
                      $(riga).show(50);
                      }
                      
                  }
              }
              if (addRow){
                  var rfin='<tr class="close-row"><td colspan="100"></td></tr>';
                
                  $(tbody).append(rfin);
              }
          }else{
              $(table).closest('[tipo="tabella"]').find('[tipo="paginazione-table"]').css({display: 'none'});
      if (oggettiTD!=undefined){
          for (var i=0;i<oggettiTD.length;i++){
              var ogg=oggettiTD[i];
              ogg.TBLHID=idTbl;
              var riga=$(stdriga).clone();
              
             // console.log('Passing data for row building:'+JSON.stringify(ogg));
              renderTd(riga,ogg,vista);
              $(riga).attr('hid',ogg.HID);
              $(tbody).append(riga);
              
              $(riga).show(50);
          }
          
          }
          if (addRow){
              var rfin='<tr class="close-row"><td colspan="100"></td></tr>';
            
              $(tbody).append(rfin);
          }
      }
  
          //bottone minimizza e massimizza
          if(azione != undefined )
          {
              /**
               * Creiamo il pulsante che minimizza e massimizza
               */
             /* var el=$(table).find('table tbody');
              el.append('<button class="fa fa-angle-up" onclick="minimizzaLaVista(this); return false;" href="#">HOLA</button>');
              console.log("PULSANTE CREATO");*/
              //$(table).find('[tipo="comandi"]').css('display','inline');
              $(table).find('[tipo="comandi"]').css('display','inline-flex');
              if (azione=='COMPRIMI'){
                  /**
                   * $(pulsante).click();
                   */
                  $(table).find('[tipo="comandi"]').find('[azione="COMPRIMI"]').attr('compresso','N');
                  $(table).find('[tipo="comandi"]').find('[azione="COMPRIMI"]').click();
                 
              }
              //el.removeClass("fa fa-angle-up");
              //el.addClass("fa fa-angle-down");
          }
  
      if (titolo!=undefined){
          $(table).find('[campoagg="TITOLO"]').html(titolo);
  
      }   else{
          $(table).find('[campoagg="TITOLO"]').html('Tabella');
  
      } 
  
      /* $(table).find('th:not(:first)').resizable({
         // animate: true,
          grid: [1,10000]
        });
          */
      return(table);
  }
  
  async function paginaPrev(el){
      var tablecont=$(el).closest('[tipo="tabella"]');
      var table=$(tablecont).find('table');
      var hid=$(table).attr('id');
      var tbl=Risorsa.get(hid);
      /* var but_prev = el.parent();
      var but_next = but_prev.parent().find('[tipo="cardTabella_next"]');
  
      if(tbl.NUMPAG == 1){
          $(but_prev).addClass('disabled');
      }
  
      if(tbl.NUMPAG != tbl.NUMPAGTOT){
          $(but_next).removeClass('disabled');
      } */
  
      if (tbl!=undefined){
          tbl.NUMPAG -= 1;
          console.log("NUOVO TBL.NUMPAG PREV: " + tbl.NUMPAG);
          var curstart=tbl.STARTROW;
          curstart=curstart-tbl.RIGHEPERPAGINA;
          if (curstart<0){
              curstart=0;
          }
          tbl.STARTROW=curstart;
          redrawTable($(table).find('tbody'));
  
          
  
  
          
      }
  }
  
  async function paginaNext(el){
      var tablecont=$(el).closest('[tipo="tabella"]');
      var table=$(tablecont).find('table');
      var hid=$(table).attr('id');
      var tbl=Risorsa.get(hid);
  
      if (tbl!=undefined){
          tbl.NUMPAG += 1;
          console.log("NUOVO TBL.NUMPAG NEXT: " + tbl.NUMPAG);
          var curstart=tbl.STARTROW;
          curstart=curstart+tbl.RIGHEPERPAGINA;
          if (curstart>tbl.LISTA.length){
              curstart=tbl.LISTA.length-tbl.RIGHEPERPAGINA;
          }
          if (tbl.LISTATEMP!=undefined){
              curstart=tbl.STARTROW;
              curstart=curstart+tbl.RIGHEPERPAGINA;
              if (curstart>tbl.LISTATEMP.length){
                  curstart=tbl.LISTATEMP.length-tbl.RIGHEPERPAGINA;
              }
          }
          tbl.STARTROW=curstart;
          redrawTable($(table).find('tbody'));
      }
  }
  
  async function filtraTable(el){
      var val=$(el).val();
      
      var tablecont=$(el).closest('[tipo="tabella"]');
      var table=$(tablecont).find('table');
      var hid=$(table).attr('id');
      var tbl=Risorsa.get(hid);
      if (tbl!=undefined){
          if (val==undefined ||val.length<1){
              delete tbl.LISTATEMP;
          }else{
              var listatemp=[];
              var lista=tbl.LISTA;
              var vals=val.split(' ',-1);
              for (var i=0;i<lista.length;i++){
                  var rec=lista[i];
                  var found=true;
                  for (var j=0;j<vals.length;j++){
                      var v=vals[j];
                      var fnd=false;
                  for (var x in rec){
                      if (x!='HID' && x!='_id' && x!='_CLOK' && x!='_UPD' && x!='_INS'  && x!='PHID' && x!='FROMDBLCLICK'){
                      var s=''+rec[x];
                      s=s.toUpperCase();
                      v=v.toUpperCase();
                      if (s.includes(v)){
                          fnd=true;
                         }
                      }
                  }
                  if (!fnd){
                      found=false;
                  }
              }
              if (found){
                  listatemp.push(rec);
              }
                  if (listatemp.length>tbl.RIGHEPERPAGINA){
                     // break;
                  }
              }
              tbl.LISTATEMP=listatemp;
          }
          tbl.STARTROW=0;
          redrawTable($(table).find('tbody'));
      }
  }
  
  async function returnPageOne(el){
      var tablecont=$(el).closest('[tipo="tabella"]');
      var table=$(tablecont).find('table');
      var hid=$(table).attr('id');
      var tbl=Risorsa.get(hid);
  
      if(tbl != undefined){
          tbl.NUMPAG = 1;
          console.log("NUOVO TBL.NUMPAG PREV: " + tbl.NUMPAG);
          tbl.STARTROW = 0;
          redrawTable($(table).find('tbody'));        
      }
  }
  
  async function goToPage(el){
      var tablecont=$(el).closest('[tipo="tabella"]');
      var table=$(tablecont).find('table');
      var hid=$(table).attr('id');
      var tbl=Risorsa.get(hid);
      var n=$(el).val();
      console.log('N:'+n);
      n=1*n;
      if (n==undefined || n<1){
          n=1;
      }
      console.log('N:'+n);
      if(tbl != undefined){
          if (n>tbl.NUMPAGTOT){
              n=tbl.NUMPAGTOT;
          }
          tbl.NUMPAG = n;
          console.log("NUOVO TBL.NUMPAG PREV: " + tbl.NUMPAG);
          tbl.STARTROW = 0+(n-1)*tbl.RIGHEPERPAGINA;
          // console.log("goToPage tbl.STARTROW: " + tbl.STARTROW);
          redrawTable($(table).find('tbody'));        
      }else{
          addMsg('TABELLA','Oggetto TBL non definito');
      }
  }
  
  async function minimizzaLaVista(el){
      $(el).closest('[tipo="comandi"]').parent().parent().find('table tbody tr:gt(1)').hide(50);
      $(el).attr('onclick',"massimizzaLaVista(this);return(false);");
      $(el).attr('compresso','S');
      $(el).find('i').removeClass("mdi mdi-chevron-up");
      $(el).find('i').addClass("mdi mdi-chevron-down");
     
  }
  async function massimizzaLaVista(el){
      $(el).closest('[tipo="comandi"]').parent().parent().find('table tbody tr:gt(1)').css('display','');
      $(el).attr('onclick',"minimizzaLaVista(this);return(false);");
      $(el).attr('compresso','N');
      $(el).find('i').removeClass("mdi mdi-chevron-down");
      $(el).find('i').addClass("mdi mdi-chevron-up");
  }
  
  
  function renderTh(riga,oggetto,vista,thead){
      var table=$('#StdTable');
      var lista=vista.LISTACAMPI;
     // console.log("DIMENSIONE LISTA:"+lista.length);
      var tipo=oggetto.TIPO;
      var hid=oggetto.HID;
      var phid=oggetto.PHID;
      $(riga).addClass('tipo_'+oggetto.TIPO);
      var rowspant=vista.ROWSPAN;
      var multirowHead=false;
      if (rowspant!=undefined && rowspant>1){
          multirowHead=true;
      }
      var riga2=undefined;
      if (multirowHead){
          riga2=$(riga).clone();
          $(riga2).addClass('th2');
      }
  
      for (var i=0;i<lista.length;i++){
          
          var rec=lista[i];
          var pannello = rec.PANNELLO;
  
          var disp=rec.DISPLAY;
          if (disp=='ACTIONS' && pannello==undefined){
              pannello='SI';
          }
          if(pannello == 'SI'){
              console.log("PANNELLO ---> SI");
              var displayh = rec.DISPLAYH;
              var qry='th[tipo=\''+displayh+'\']';
              var th=$(table).find(qry).clone();
              if (th.length==0){
                  console.log("WARNING: tipo TH:"+displayh+" NON TROVATO!");
              }
  
              var num_actions = 0;
              var sp=document.createElement('nobr');
              $(sp).css('align','center');
              $(th).addClass('td-actions');
              $(th).css('align','center');
              $(th).css('white-space','nowrap');
              var idpa="IDPA"+generateID();
              var toadd='<div style="min-width:20px; min-height:20px;" ><span class="tabazioni" onclick="showPopupNuvola(event,this, \'click\');"><i class="ho hop-iplus"></i></span>'+
              '<div class="leaflet-popup  leaflet-zoom-animated pannelloaction" id="'+idpa+'" style="display: none; word-wrap: break-word; width: auto; z-index: 100;" >' +
                                  '<div class="leaflet-popup-content-wrapper">' +
                                  '<div tipo="close" style="display:none;background-color:var(--hop);margin:-2px; border-radius:8px 8px 0 0;"><span style="float:right;margin-top:6px;margin-right:6px;color:white;" tipo="close" ><i class="fa fa-times" onclick="closePopupNuvola(this);"></i></span>'+
                                  '<span style="float:left;margin-top:6px;margin-left:6px;color:white;" ><i class="fa fa-times" onclick="closePopupNuvola(this);"></i></span></div>'+    
                                  '<div class="leaflet-popup-content" tipo="ACTIONS" style="display: flex;"><div style="display:inline-flex;"></div><div tipo="COMANDI">';
                          
                                          if (displayh=='ACTIONSTH'){
                                              
                                              var actions = rec.ACTIONSTH;
                                              var actionsthPers='ACTIONSTH_'+tipo;
                                              if (rec[actionsthPers]!=undefined){
                                                  actions=rec[actionsthPers];
                                              }
                                              for(var k=0; k<actions.length; k++){
                                                  num_actions++;
                                                  var azione = actions[k];
                                                  var click = azione.ACTION;
                                                  click += '(this); return false;';
                                                  var title = azione.TITLE;
                                                  var icon = azione.ICON;
  
                                                  if(azione.ISI != undefined){
                                                      //toadd += '<i class="'+icon+'" style="margin-right: 10px;"></i>';
                                                      toadd += '<a href="#" onclick="'+click+'" vista="'+vista.HID+'" hid="'+hid+'" phid="'+phid+'">'+'<i class="'+icon+'" style="margin-right: 10px;"></i>'+title+'</a>';
                                                  } else {
                                                      //toadd += '<img src="'+icon+'" style="margin-right: 10px;">';
                                                      toadd += '<a href="#" onclick="'+click+'" vista="'+vista.HID+'" hid="'+hid+'" phid="'+phid+'">'+'<img src="'+icon+'" style="margin-right: 5px;" width="30" height="30">'+title+'</a>';
                                                  }
                                                  
                                                  
                                                  toadd += '<br>';
  
                                              }
                                          }
                                          
                                  toadd += '<div tipo="TREE"></div></div><div tipo="SEPARATOR" style="border-color:var(--hop)"></div><div tipo="RICERCHE"></div></div>' +
                                  '</div>' +
                              '</div>'+
                              
                              '</div>';
  
              if(num_actions>0){
                  $(th).append(toadd);
                  
                  $(th).find('div.pannelloaction:first').draggable();
                  $(th).find('div.pannelloaction:first').resizable();
              }
              $(th).attr('hid',hid);
              if (multirowHead){
                  $(th).attr('rowspan',rowspant);
              }
              
              $(riga).append(th);
              
  
          } else {
              var campo=rec.CAMPO;
              var desc=rec.DESCRIZIONE;
              var desc2=rec.DESCRIZIONE1;
              var desc_lunga=rec.DESCRIZIONE_LUNGA;
              var desc_lunga2=rec.DESCRIZIONE_LUNGA2;
              var display=rec.DISPLAY;
              var displayH=rec.DISPLAYH;
              var classe=rec.CLASSE;
              var vis=rec.VISIBILITY;
              if (vis==undefined ||vis=='hidden'){
                  continue;
              }
              var rowspan=rec.ROWSPAN;
              var colspan=rec.COLSPAN;
              var rown=rec.ROWN;
              var colspan1=rec.COLSPAN1;
              var rowspan1=rec.ROWSPAN1;
              if (displayH==undefined){
                  displayH='STDTH';
              }
      
              var qry='th[tipo=\''+displayH+'\']';
              var th=$(table).find(qry).clone();
      
              var isAction=false;
              var isButton=false;
              if (displayH=='ACTIONSTH'){
                  isAction=true;
                  var actionsth=rec.ACTIONSTH;
                  var actionsthPers='ACTIONSTH_'+tipo;
                  if (rec[actionsthPers]!=undefined){
                      actionsth=rec[actionsthPers];
                  }
                  var sp=document.createElement('nobr');
                      $(sp).css('align','center');
                      $(th).css('align','center');
                      $(th).css('white-space','nowrap');
                  for (var k=0;k<actionsth.length;k++){
                      var azione=actionsth[k];
                      var click=azione.ACTION;
                      var src=azione.ICON;
                      var title=azione.TITLE;
                      var isi=azione.ISI;
      
                      
                      var img=document.createElement('img');
                      //$(img).addClass('action');
                      if (isi!=undefined){
                          img=document.createElement('i');
                          $(img).addClass(src);
                        //  $(img).css({'margin-top':'0px','margin-left':'6px','position':'relative','transform':'rotate(0deg)'});
                          $(img).css({'margin-top':'0px','position':'relative','transform':'rotate(0deg)'});
                      }
                      // $(img).css({'max-width': '110%','max-height': '110%'});
                      $(img).css({'max-width': '110%','max-height': '110%', 'top':'0.02rem', 'left':'-0.01rem'});
                      $(img).attr('src',src);
                      $(img).attr('title',title);
                      //$(img).attr('onclick',click+'(this);');
                      
                    /*   $(img).attr('onclick',click+'(this);'); */
                      $(img).attr('vista',vista.HID);
                      //$(img).attr('width','30px');
                      $(img).attr('hid',hid);
                      if (phid!=undefined){
                          $(img).attr('phid',phid);
                      }
                      /*
      
                      $(sp).append(img);
                     */
                      var bt=document.createElement('div');
                      //'<button type="button" class="btn btn-info"></button>';
                      $(bt).addClass('btn btn-primary btn-sm');
                     // $(bt).css({'margin-left':'2px','height': '30px','width': '40px','padding': '0px 0px'});
                      // $(bt).css({'margin-left':'0.7rem','padding': '0.2rem'});
                      $(bt).css({'margin-left':'0.7rem','padding': '0.3rem', 'border': '0', 'border-radius': '50%', 'font-size': '1rem', 'background-color': '#75ABAB', 'cursor': 'pointer'});
                      $(bt).attr('onclick',click+'(this);');
                      $(bt).attr('hid',hid);
                      $(bt).append(img);
                      $(sp).append(bt);
                      // Cancellato in data 20190403 per doppi click
                      //$(bt).attr('onclick',click+'(this);');
                      }
                      $(th).append(sp);
              }
              
              if (displayH=='THBUTTON'||displayH.startsWith('THB')){
                  isButton=true;
                  var funz=rec.FUNZIONEH;
                  if (funz!=undefined){
                      var funzione=funz+'(this);';
                      $(th).find("[campoass]").attr('onclick',funzione);
                  }
                  $(th).find("[campoass]").html(desc);
                  $(th).find("[campoass]").attr('hid',hid);
                  }
              
              if ((!isAction)&&(!isButton)){
                  $(th).html(desc);
              }
              $(th).attr('hid',hid);
              
              if (phid!=undefined){
                  $(th).attr('phid',phid);
                  $(th).find('img').attr('phid',hid);
              }
              if (classe!=undefined && classe!=''){
                  $(th).addClass(classe);
              }
              $(th).attr('tooltip',desc_lunga);
              $(th).find('img').attr('hid',hid);
              if (!multirowHead){
                   $(riga).append(th);
  
              }else{
                  if (rown!=undefined && rown>0){
  
                      $(th).attr('rowspan',rowspan1);
                      $(th).attr('colspan',colspan1);
                      $(riga2).append(th);
                  }else{
                      
                      if (rown==undefined && rowspan==undefined){
                          $(th).attr('rowspan',rowspant);
                          $(riga).append(th);
                      }else{
                          $(th).attr('rowspan',rowspan);
                          $(th).attr('colspan',colspan);
                          $(th).css('text-align','center');
                          $(riga).append(th);
                      
                      var th2=$(table).find(qry).clone();
  
                      if ((!isAction)&&(!isButton)){
                          $(th2).html(desc2);
                      }
                      $(th2).attr('hid',hid);
                      
                      if (phid!=undefined){
                          $(th2).attr('phid',phid);
                          $(th2).find('img').attr('phid',hid);
                      }
                      if (classe!=undefined && classe!=''){
                          $(th2).addClass(classe);
                      }
                      $(th2).attr('tooltip',desc_lunga2);
                      $(th2).find('img').attr('hid',hid);
                      $(th2).attr('rowspan',rowspan1);
                      $(th2).attr('colspan',colspan1);
                      
                      $(riga2).append(th2);
                  }
                  }
              }
          }
    
      }
      if (multirowHead){
          $(thead).append(riga2);
      }
  }
  
  async function updateListaTable(el,oggettiTD){
      var hid=$(el).attr('hid');
      var id=$(el).attr('id');
      var table=undefined;
      if (id!=undefined && id.startsWith('TBL')){
          hid=id;
      }
      if (hid==undefined){
          table=$(el).closest('table');
      }else{
          if (hid.startsWith('TBL')){
              table=el;
          }else{
              table=$(el).closest('table');
          }
      }
      var tblhid=$(table).attr('id');
      var tbl=Risorsa.get(tblhid);
      if (tbl!=undefined){
         var tableType= tbl.TABLETYPE;
          var oggettoH=tbl.HEADEROGG;
          var oggettiTD=tbl.LISTA;
          var vista=tbl.VISTA;
          tbl.LISTA=oggettiTD;
      }
  }
  
  function getListaOggettiTD(el){
      var hid=$(el).attr('hid');
      var id=$(el).attr('id');
      var table=undefined;
      if (id!=undefined && id.startsWith('TBL')){
          hid=id;
      }
      if (hid==undefined){
          table=$(el).closest('table');
      }else{
          if (hid.startsWith('TBL')){
              table=el;
          }else{
              table=$(el).closest('table');
          }
      }
      var tblhid=$(table).attr('id');
      var tbl=Risorsa.get(tblhid);
      if (tbl!=undefined){
         var tableType= tbl.TABLETYPE;
          var oggettoH=tbl.HEADEROGG;
          var oggettiTD=tbl.LISTA;
          var vista=tbl.VISTA;
          return(oggettiTD);
      }
  }
  
  
  
  async function redrawTable(el,newlista){
      var hid=$(el).attr('hid');
      var id=$(el).attr('id');
      var table=undefined;
      if (id!=undefined && id.startsWith('TBL')){
          hid=id;
      }
      if (hid==undefined){
          table=$(el).closest('table');
      }else{
          if (hid.startsWith('TBL')){
              table=el;
          }else{
              table=$(el).closest('table');
          }
      }
      var effectiveLista=[];
      var tblhid=$(table).attr('id');
      console.log('TABELLA SU CUI FARE REDRAW:'+tblhid);
      var tbl=Risorsa.get(tblhid);
      var addRow=false;
      var vv=$(table).attr('closerow');
      if (vv!=undefined && vv=='S'){
         
          addRow=true;
      }
      if (tbl!=undefined){
         var tableType= tbl.TABLETYPE;
         var smartphone=tbl.SMARTPHONE;
         var azione=tbl.AZIONE;
          var oggettoH=tbl.HEADEROGG;
          var oggettiTD=tbl.LISTA;
          if (newlista!=undefined){
                  tbl.LISTA=newlista;
                  oggettiTD=newlista;
                  console.log('Ora Ci Sono:'+oggettiTD.length+' righe predisposte per la visualizzazione');
                  if (tbl.PAGINARE!=undefined){
                
                      tbl.STARTROW=0;
                      tbl.NUMPAG = 1;
                      var span_pag = $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_info"]');
                      // var numpagtot = parseInt(tbl.LISTA.length / tbl.RIGHEPERPAGINA) + 1;
                      var numpagtot = Math.ceil(tbl.LISTA.length / tbl.RIGHEPERPAGINA);
                      tbl.NUMPAGTOT = numpagtot;
                      $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_next"]').removeClass('isDisabled');
                      $(span_pag).html("Pagina " + tbl.NUMPAG + " di " + tbl.NUMPAGTOT);
                      var span1 = $(table).closest('[tipo="tabella"]').find('[tipo="pagcorr"]');
                      $(span1).val(tbl.NUMPAG);
                      var span2 = $(table).closest('[tipo="tabella"]').find('[tipo="pagtot"]');
                      $(span2).html(tbl.NUMPAGTOT);
                      $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_prev"]').addClass('isDisabled');
                      if(tbl.NUMPAGTOT == 1 || tbl.NUMPAGTOT == 0){
                          $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_next"]').addClass('isDisabled');
                      }
                  }
          } else {
              if (tbl.PAGINARE!=undefined){
                
                  // tbl.STARTROW=0;
                  // tbl.NUMPAG = 1;
                  var span_pag = $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_info"]');
                  // var numpagtot = parseInt(tbl.LISTA.length / tbl.RIGHEPERPAGINA) + 1;
                  var numpagtot = Math.ceil(tbl.LISTA.length / tbl.RIGHEPERPAGINA);
                  tbl.NUMPAGTOT = numpagtot;
                  $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_next"]').removeClass('isDisabled');
                  $(span_pag).html("Pagina " + tbl.NUMPAG + " di " + tbl.NUMPAGTOT);
                  var span1 = $(table).closest('[tipo="tabella"]').find('[tipo="pagcorr"]');
                  $(span1).val(tbl.NUMPAG);
                  var span2 = $(table).closest('[tipo="tabella"]').find('[tipo="pagtot"]');
                  $(span2).html(tbl.NUMPAGTOT);
                  $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_prev"]').addClass('isDisabled');
                  if(tbl.NUMPAGTOT == 1 || tbl.NUMPAGTOT == 0){
                      $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_next"]').addClass('isDisabled');
                  }
              }
          }
  
            /**
           * Remove doppioni
           */
         /*  var fatto2={};
          var redo=true;
          while(redo){
              redo=false;
              fatto2={};
              for (var i=0;i<oggettiTD.length;i++){
                  var riga=oggettiTD[i];
                  var hidr=riga.HID;
                  if (fatto2[hidr]!=undefined){
                      redo=true;
                      oggettiTD.splice(i,1);
                      console.log('Rimosso doppione:'+hidr);
                      break;
                  }else{
                      fatto2[hidr]=1;
  
                  }
              
              }
          } */
              /**
               * Fine remove doppioni
               */
          var vista=tbl.VISTA;
          console.log('VISTA:'+JSON.stringify(vista));
  
          /*var tbodies=$(table).children();
          var tbody=undefined;
          for (var j=0;j<tbodies.length;j++){
              var elm=tbodies[j];
              if (elm.nodeName==='tbody'||elm.nodeName==='TBODY'){
                  tbody=elm;
              }else{
                  console.log('ELM NAME:'+elm.nodeName);
              }
          }*/
          var tbody=$(table).find('tbody').first();
          console.log('tbody length:'+tbody.length);
          var lastr=undefined;
          var lista=vista.LISTACAMPI;
          
          var listaRigheAttuali=$(tbody).find('tr[hid]');
          var childs=$(tbody).children();
          var vals={};
          for (var j=0;j<childs.length;j++){
              var h3=$(childs[j]).attr('hid');
              if (h3!=undefined){
                  vals[h3]=true;
              }
          }
          var toRemove={};
        //  for (var i=0;i<listaRigheAttuali.length;i++){
          for (var i=0;i<childs.length;i++){
              //var riga2=listaRigheAttuali[i];
              var riga2=childs[i];
              var h=$(riga2).attr('hid');
  
              if (h!=undefined && vals[h]!=undefined){
                  toRemove[h]=riga2;
              }
          }
         /* for (var x in toRemove){
              console.log('Rimosso:'+x);
              $(toRemove[x]).remove();
          }  */
          var prevriga=undefined;
  
          effectiveLista=oggettiTD;
  
          if (tbl.PAGINARE!=undefined){
  
              var span_pag = $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_info"]');
              console.log("PROVA PRIMA: " + $(span_pag).html());
              $(span_pag).html("Pagina " + tbl.NUMPAG + " di " + tbl.NUMPAGTOT);
              console.log("PROVA DOPO: " + $(span_pag).html());
              var span1 = $(table).closest('[tipo="tabella"]').find('[tipo="pagcorr"]');
              $(span1).val(tbl.NUMPAG);
              var span2 = $(table).closest('[tipo="tabella"]').find('[tipo="pagtot"]');
              $(span2).html(tbl.NUMPAGTOT);
  
              var but_prev = $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_prev"]');
              var but_next = $(table).closest('[tipo="tabella"]').find('[tipo="cardTabella_next"]');
  
              if(tbl.NUMPAG == 1){
                  $(but_prev).addClass('isDisabled');
              } else {
                  $(but_prev).removeClass('isDisabled');
              }
  
              if(tbl.NUMPAG != tbl.NUMPAGTOT){
                  $(but_next).removeClass('isDisabled');
              } else {
                  $(but_next).addClass('isDisabled');
              }
  
              var listaDaMostrare=[];
              console.log("applyFormRecord tbl.STARTROW: " + tbl.STARTROW);
              if (tbl.LISTATEMP==undefined){
                  for (var i=0;i<tbl.RIGHEPERPAGINA;i++){
                      var numrow=tbl.STARTROW+i;
                      var ogg=oggettiTD[numrow];
                      if (ogg!=undefined){
                      listaDaMostrare.push(ogg);
                      }
                  }
              effectiveLista=listaDaMostrare;
              }else{
                  for (var i=0;i<tbl.RIGHEPERPAGINA;i++){
                      var numrow=tbl.STARTROW+i;
                      var ogg=tbl.LISTATEMP[numrow];
                      if (ogg!=undefined){
                      listaDaMostrare.push(ogg);
                      }
                  }
                  effectiveLista=listaDaMostrare;
              }
  
              if(effectiveLista.length < 1){
                  var riga_vuota = '<tr hid="RIGAVUOTA"><td colspan="100">Tabella Vuota</td></tr>';
                  $(tbody).append(riga_vuota);
              }
          }
          /**
           * Remove doppioni
           */
         var fatto={};
          var redo=true;
          while(redo){
              redo=false;
              fatto={};
              for (var i=0;i<effectiveLista.length;i++){
                  var riga=effectiveLista[i];
                  var hidr=riga.HID;
                  if (fatto[hidr]!=undefined){
                      redo=true;
                      effectiveLista.splice(i,1);
                      console.log('Rimosso doppione:'+hidr);
                      break;
                  }else{
                      fatto[hidr]=1;
  
                  }
              
              }
          } 
              /**
               * Fine remove doppioni
               */
          for (var i=0;i<effectiveLista.length;i++){
              var riga=effectiveLista[i];
              var hidr=riga.HID;
              var tipo=riga.TIPO;
              var tipocampo=tipo;
              if (riga.TIPOCAMPO!=undefined && riga.TIPOCAMPO.length>0){
                  tipocampo=riga.TIPOCAMPO;
              }
  
              var r=$(tbody).find('> tr[hid=\''+hidr+'\']');
              if (r.length>0){
                  console.log('RIMUOVO DALLA LISTA DI RIMOZIONE:'+hidr);
                  delete toRemove[hidr];
                  for (var j=0;j<lista.length;j++){
                      var cmps=lista[j];
                      var display=cmps.DISPLAY;
                      var campo=cmps.CAMPO;
                      var vis=cmps.VISIBILITY;
                      var dominio = cmps.DOMINIO;
                      var selectizesng = cmps.SELECTIZESINGLE;
                      var multiselect = cmps.MULTI;
                      var libero = cmps.FREE;
                      var hop = cmps.HOP;
                  /*     console.log('CAMPO:'+campo); */
  
  
                          var dispPers='DISPLAY_'+tipocampo;
                          if (cmps[dispPers]!=undefined){
                              display=cmps[dispPers];
                              //var dompers='DOMINIO_'+tipo;
                              var dompers='DOMINIO_'+tipocampo;
                              if (cmps[dompers]!=undefined){
                                  dominio=cmps[dompers];
                              }
                              //dompers='SELECTIZESINGLE_'+tipo;
                              dompers='SELECTIZESINGLE_'+tipocampo;
                              if (cmps[dompers]!=undefined){
                                  selectizesng=cmps[dompers];
                              }
                          }
                     
  
  
                      if (vis=='visible' && (!(campo=='ACTIONS'))){
                          
                          var tdact=$(r[0]).find('td input[campoass=\''+campo+'\']');
                          if (tdact.length>0){
                              var valact=$(tdact).val();
                             
                              var valn = getValore(riga, campo);
                              if (valn!=valact){
                             
                                  $(tdact).val(valn);
  
                                  if ($(tdact).attr('limit5')!=undefined){
                                
                                      try {
                                          var vpj=valn;
                                       
                                          vpj=Math.round(100000*vpj)/100000;
                                          $(tdact).val(vpj);
      
                                      } catch (error) {
                                       //   console.log('PJSTEFAN4');
                                          
                                      }
                                  }
                                  if ($(tdact).attr('limit2')!=undefined){
                                                
                                      try {
                                          var vpj=valn;
                                       //   console.log('PJSTEFAN1:'+vpj);
                                          vpj=Math.round(100*vpj)/100;
                                          $(tdact).val(vpj);
                                      } catch (error) {
                                         // console.log('PJSTEFAN2');
                                      }
                                  }
  
                                  var selectized=$(tdact).attr('selectize');
                                  if (selectized!=undefined){
                                      try {
                                          var selectize = $(tdact)[0].selectize; // This stores the selectize object to a variable (with name 'selectize')
  
  // 2. Access the selectize object with methods later, for ex:
                                          //selectize.addOption(data);
                                          selectize.setValue(valn, true);
  
                                      } catch (error) {
                                          console.log('Errore refresh selectize:'+error);
                                      }
                                  }
                              }
  
                             
                          }
                          tdact=$(r[0]).find('td span[campoass=\''+campo+'\']');
                          if (tdact.length>0){
                              var valact=$(tdact).text();
                              // var valn=riga[campo];
                              var valn = getValore(riga, campo);
                              if (valn!=valact){
                               //   console.log('Aggiorno:'+campo+' per '+hidr);
                                  $(tdact).text(valn);
                              }
                          }
                          tdact=$(r[0]).find('td select[campoass=\''+campo+'\']');
                          if (tdact.length>0){
                              var valact=$(tdact).val();
                              // var valn=riga[campo];
                              var valn = getValore(riga, campo);
                              if (valn!=valact){
                               //   console.log('Aggiorno:'+campo+' per '+hidr);
                                  $(tdact).val(valn);
                                  $(tdact).find('option').removeAttr('selected');
                                  $(tdact).find('option[value=\'valn\']').attr('selected','selected');
                              }
                          }
  
                          tdact=$(r[0]).find('td textarea[campoass=\''+campo+'\']');
                          if (tdact.length>0){
                              var valact=$(tdact).text();
                              // var valn=riga[campo];
                              var valn = getValore(riga, campo);
                              if (valn!=valact){
                               //   console.log('Aggiorno:'+campo+' per '+hidr);
                                  $(tdact).text(valn);
                              }
                          }
  
                          tdact=$(r[0]).find('td [campoass=\''+campo+'\']');
                          if (tdact.length>0){
                              
                              tdact=$(tdact).closest('td');
                              var campoflag=campo+'_FLAG';
                              var campomsg=campo+'_MSG';
                              var flag=riga[campoflag];
                              var tooltip=riga[campomsg];
                           //   console.log('Per il campo '+campo+' di '+ riga.DESCRIZIONE+' il flag e\':'+flag);
                              if (flag!=undefined && flag!=''){
                                  $(tdact).addClass(flag);
                                 
                              }else{
                                  $(tdact).removeClass('ECSforzatura');
                                  $(tdact).removeClass('ECSerrore');
                                  $(tdact).removeClass('ECSwarning');
                              }
                              if (tooltip!=undefined && tooltip!=''){
                                  $(tdact).attr('tooltip',tooltip);
                              }
                          }
  
                          tdact=$(r[0]).find('td [camposelect=\''+campo+'\']');
                          if (tdact.length>0){
                              
                              tdact=$(tdact).closest('td');
                              var campoflag=campo+'_FLAG';
                              var campomsg=campo+'_MSG';
                              var flag=riga[campoflag];
                              var tooltip=riga[campomsg];
                           //   console.log('Per il campo '+campo+' di '+ riga.DESCRIZIONE+' il flag e\':'+flag);
                              if (flag!=undefined && flag!=''){
                                  $(tdact).addClass(flag);
                                 
                              }else{
                                  $(tdact).removeClass('ECSforzatura');
                                  $(tdact).removeClass('ECSerrore');
                                  $(tdact).removeClass('ECSwarning');
                              }
                              if (tooltip!=undefined && tooltip!=''){
                                  $(tdact).attr('tooltip',tooltip);
                              }
                          }
                         
                          tdact=$(r[0]).find('td [campoflag=\''+campo+'\']');
                          if (tdact.length>0){
                              tdact=$(tdact).closest('td');
                              var tickEl = $(tdact).find('.custom-tick').addBack('.custom-tick');
                              var valn = getValore(riga, campo);
                              /* if (riga[campo]!=undefined && riga[campo]==false){
                                  tickEl.css('visibility', 'hidden');
                              }else{
                                  if(riga[campo]==undefined){
                                      tickEl.css('visibility', 'hidden');
                                  } else {
                                      tickEl.css('visibility', 'visible');
                                  }   
                              } */
  
                              if (valn!=undefined && valn==false){
                                  tickEl.css('visibility', 'hidden');
                              }else{
                                  if(valn==undefined){
                                      tickEl.css('visibility', 'hidden');
                                  } else {
                                      tickEl.css('visibility', 'visible');
                                  }   
                              }
  
  
                         
                          } 
                          var oggetto=riga;
                          //tst=$(r).find('td [camposemaforo]');
                          var tst='[camposemaforo]';   
                          $(r[0]).find(tst).each(function (){
                          
                              $(this).attr('hid',hid);
                              /* if (phid!=undefined){
                                  $(this).attr('phid',phid);
                              } */
                              var campo=$(this).attr('camposemaforo');
                              var valn = getValore(oggetto, campo);
                             /* if (oggetto[campo]!=undefined){
                                 $(this).css('background-color',oggetto[campo]);
                             } */
                             if (valn!=undefined){
                              $(this).css('background-color',valn);
                              }
                         
                          }); 
                          //tst=$(r).find('td [camposemaforo]');
                          tst='[campocolore]';   
                          $(r[0]).find(tst).each(function (){
                          
                              $(this).attr('hid',hid);
                            /*   if (phid!=undefined){
                                  $(this).attr('phid',phid);
                              } */
                              var campo=$(this).attr('campocolore');
                              var valn = getValore(oggetto, campo);
                             /* if (oggetto[campo]!=undefined){
                                 $(this).css('color',oggetto[campo]);
                             } */
  
                             if (valn!=undefined){
                              $(this).css('color',valn);
                              }
                         
                          });
  
  
                          tst='[campo]';   
                         
                          $(r[0]).find('[tipo="TDVEDIFILE"]').find(tst).each(function(){
                              var campo=$(this).attr('campo');
                              var valn = getValore(oggetto, campo);
                              if( valn == undefined){
                                  $(this).hide();
                              } else {
                                  $(this).show();
                              }
                          });
  
                          tst='[camposelect=\''+campo+'\']';
                          $(r[0]).find(tst).each(function (){
                          
                                  $(this).attr('hid',oggetto.HID);
                              
                              
                                  if (dominio!=undefined){
                                      var dom=oggetto[dominio];
                                      var lista2=[];
                                      if (dom==undefined) {
                                          var s=dominio.split(".",-1);
                                                  var rec=window;
                                                  var go=true;
                                                  for (var j=0;j<s.length;j++){
                                                      if (rec!=undefined){
                                                          rec=rec[s[j]];
                                                          }else{
                                                              go=false;
                                                          }
                                                  }   
                                                  if (go){
                                                      dom=rec;
                                                      }
                                      }
                                      if (dom!=undefined){
                                          lista2=dom;
                                          for (var j=0;j<lista2.length;j++){
                                              var rc=lista2[j];
                                              var opt=$(this).find('option[value="'+rc.VAL+'"]');
                                              if (opt.length==0){
                                                  var testo=rc.TESTO;
                                                  if (testo==undefined){
                                                      if (rc.DESCRIZIONE!=undefined){
                                                          testo=rc.DESCRIZIONE;
                                                      }
                                                  }
                                                  opt='<option value="'+rc.VAL+'">'+testo+'</option>';
                                                  $(this).append(opt);
                                              }
                                          }
                                      }
                                  }
                  
                                  var campo2=$(this).attr('camposelect');
                                  var v=oggetto[campo2];
                                  var qry='option[value="'+v+'"]';
                                  $(this).find(qry).attr('selected','selected');
                              });
  
                              if (selectizesng!=undefined){
                                  var v=selectizesng.split(".",-1);
                                 
                                  var lstsel=undefined;
                                  if (oggetto[selectizesng]!=undefined){
                                      lstsel=oggetto[selectizesng];
                                     // console.log('SELECTIZESNG oggetto:'+JSON.stringify(lstsel));
                                  }else{
                                      try {
                                          lstsel=window[v[0]];
                                          for (var seli=1;seli<v.length;seli++){
                                          lstsel=lstsel[v[seli]];
                                          } 
                                          console.log('SELECTIZESNG oggetto2:'+JSON.stringify(lstsel));   
                                      } catch (error) {
                                          console.log('SELECTIZESNG:'+error);
                                      }
                                  }
                                  var tst2='[campoass=\''+campo+'\']';
                                  $(r[0]).find(tst2).each(function (){
                                      if (multiselect==undefined){
                                          if(libero == undefined){
                                              console.log('SONO QUA SELECTIZE-SInGLE-NON LIBERO');
                                              if (hop!=undefined ){
                                                  console.log("GIULIA STA CERCANDO DI FAR FUNZIONARE UNA COSA DA UN GIORNO INTERO: " + $(this).parent().html());
                                                  StdSelectizeSingleHop($(this),lstsel, true);
                                              } else{
                                              StdSelectizeSingle($(this),lstsel);    
                                              }
                                          }
                                          else{
                                              console.log('SONO QUA SELECTIZE-SInGLE-LIBERO');
                                              StdSelectizeSingleLibero($(this),lstsel, hid, campo);    
                                          }
                                      }else{
                                          if(hop==undefined){
                                              StdSelectizeMulti($(this),lstsel);
                                          } else {
                                              StdSelectizeMultiHop($(this),lstsel);
                                          }
                                      }
                                  });
                              }
                         
                          
                              var indent=oggetto.INDENT;
                              if (indent>0){
                                  var indspan= $(r).find('td').find('span[tipo=\'INDENT\']');
                                  if (indspan.length>0){
                                      $(indspan).css('margin-left',indent+"px");
                                  }
                              }
                          
                          
                      }else{
                          if (campo=='ACTIONS'){
                          console.log('Skipped:'+campo);
                          }
                      }
                  }
              /*     console.log('FIne loop campo'); */
                  prevriga=r[0];
              }else{
                  console.log('RIGA:'+hidr+' assente');
                  /**
                   * Codice per inserire una riga
                   */
                  //var funct=oggettoH.addRow;
                  var nriga=undefined;
                  // nriga=document.createElement('tr');
                  
                  /** NON AGGIUNGERE LA RIGA SOTTO FA MALE */
                 // var tbody=$(table).find('tbody');
  
  
                  var stdriga=$(tbody).find('tr')[0];
                 
                  if (typeof oggettoH.addRow === 'function'){
                     nriga=oggettoH.addRow(tbl,riga);
                     console.log('addRow called: '+$(nriga).html());
                  }else{
                     nriga=document.createElement('tr');
                  //    nriga=$(stdriga).clone();
                    
  
                  }
                  $(nriga).attr('hid',hidr);
                  riga.TBLHID=tblhid;
                  console.log('Pre Row : '+$(nriga).html());
                  if (smartphone!=undefined && smartphone){
                      renderTdSmart($(nriga),riga,vista,undefined,$(table).find('tbody'));
                  }else{
                      renderTd($(nriga),riga,vista);
                      
                      if (prevriga==undefined){
                          $(table).find('tbody').append(nriga);
                          console.log('Add new row:'+nriga);
                          }else{
                          //$(prevriga).after(nriga);
                          $(nriga).insertAfter(prevriga);
                          //$(table).find('tbody').append(nriga);
                          console.log('Add new row after:'+$(nriga).html()+' DOPO:'+$(prevriga).html()); 
                          }
                  }    
              }
          }
          for (var x in toRemove){
              console.log('Rimosso:'+x);
              
              $(toRemove[x]).remove();
              if (smartphone!=undefined && smartphone){
               $(table).find('tbody tr[hid="'+x+'"]').remove();
               $(table).find('tbody tr[lhid="'+x+'"]').remove();   
              }
          }
          /**
           * Riaggiusto l'ordine
           */
          if (smartphone==undefined || !smartphone){
                  var ncorr=true;
                  var maxcycles=200;
                  var cycles=0;
                  while (ncorr && cycles<maxcycles){
                      ncorr=false;
                      cycles++;
                      var postr={};
                      //console.log('TBODY LENGHT:'+tbody.length);
                      var lr=$(tbody).find('> tr[hid]');
                  /*    var lr2=$(tbody).find('table tr[hid]');
                      var pj=0;
                      console.log('LR2 LENGTH:'+lr2.length); */
                      for (var j=0;j<lr.length;j++){
                          var trj=lr[j];
                      /*  var tst=true;
                          for (var k=0;k<lr2.length;k++){
                              var tr2k=lr2[k];
                              if (trj==tr2k){
                                  tst=false;
                              }
                          }
                          if (tst){ */
                              var hi=$(trj).attr('hid');
                              postr[hi]=j;
                          // pj++;
                          
                      //      }
                          //console.log('HI:'+hi+":"+$(trj).html());
                      }
                      fatto={};
                      for (var i=0;i<effectiveLista.length;i++){
                          var riga=effectiveLista[i];
                          var hidr=riga.HID;
                          var j=postr[hidr];
                          //
                          console.log('I:J:'+i+":"+j+":"+hidr);
                          if (fatto[hidr]==undefined){
                              fatto[hidr]=1;
                          if (j!=i){
                              ncorr=true;
                              $(lr[j]).remove();
                              $(lr[j]).insertBefore(lr[i]);
                              break;
                          }
                      }else{
                          console.log('Grave anomalia:hidr:'+hidr);
                      }
                          
                      }
                  }
                  if (cycles>maxcycles){
                      addMsg('ERRORE CYCLES','ERRORE GRAVE MAX CYCLES:'+JSON.stringify(effectiveLista));
                  }
              }
          /**
           * Fine riaggiusto l'ordine
           */
  
          StdApplyVisibility(vista);
          console.log('AZIONE:'+azione);
          if(azione != undefined )
          {
              /**
               * Creiamo il pulsante che minimizza e massimizza
               */
             /* var el=$(table).find('table tbody');
              el.append('<button class="fa fa-angle-up" onclick="minimizzaLaVista(this); return false;" href="#">HOLA</button>');
              console.log("PULSANTE CREATO");*/
            //  $(table).parent().find('[tipo="comandi"]').css('display','inline');
            var compresso=$(table).parent().find('[tipo="comandi"]').find('[azione="COMPRIMI"]').attr('compresso');
              if (compresso!=undefined ){
                  /**
                   * $(pulsante).click();
                   */
                  if (compresso=='S'){
                  $(table).parent().find('table tbody tr:gt(1)').hide(5);
                  }else{
                      $(table).parent().find('table tbody tr:gt(1)').show(5);
                  }
                 
              }
              //el.removeClass("fa fa-angle-up");
              //el.addClass("fa fa-angle-down");
          }
          if (addRow){
              $(table).find('.close-row').remove();
              var rfin='<tr class="close-row"><td colspan="100"></td></tr>';
              $(tbody).append(rfin);
          }
      }else{
          console.log('redrawTable:'+tblhid+' : oggetto TBL non identificato.'+$(el).parent().html());
      }
      
  }
  
  function StdWy(campo){
      var wy=$(campo).attr('wy');
      if (wy==undefined){
      $(campo).wysihtml5({
          locale: "it-IT",
          toolbar: { 
              fa: true,
              "blockquote": false,
              "font-styles": false,
              "html": true,
          },
          "events": {
              "change": function() {
                  var val=''; 
                  var el=this.textarea.element;
                  for (var x in el){
                      val=val+''+x+':'+el[x]+'\n';
  
                  }
                  //console.log("Changed!:"+' '+val);
                  console.log('lancio change!:'+$(el).val());
                  
                  $(el).change();
  
              }
          }
        });
        $(campo).attr('wy','s');
      
      }else{
          var tchange=$(campo).parent().find('.wysihtml5-sandbox').contents().find('body');
          $(tchange).empty();
          $(tchange).html($(campo).val());
        /*  $(tchange).css('font-weight','400');
          alert('BODY:'+$(tchange).html());*/
        //  $(campo).wysihtml5.;
      }
  }
  
  function StdApplyVisibility(vista){
      var lista=vista.LISTACAMPI;
      //console.log("DIMENSIONE LISTA:"+lista.length);
      for (var i=0;i<lista.length;i++){
          
          var rec=lista[i];
          var campo=rec.CAMPO;
          var desc=rec.DESCRIZIONE;
          var desc_lunga=rec.DESCRIZIONE_LUNGA;
          var display=rec.DISPLAY;
          var classe=rec.CLASSE;
          var visibility=rec.VISIBILITY;
          if (visibility=='hidden'){
              $(document).find('.'+classe).css('display','none');
              }
          if (visibility=='visible'){
              $(document).find('.'+classe).css('display','');
              }    
      }
  }
  
  
  function StdInitEdit(el,target,servertiposerch,vista,spanel){
      var hid=$(el).attr('hid');
      console.log('called:'+'PrvInitEdit on '+hid);
      if (hid!=undefined){
              var panelname=target+'_SEARCHPANEL';
              var panel=getPanel(panelname);
              console.log('PANEL:'+panel);
              if (panel==undefined){
                  /*
                  */
                  //makeArticleDescrizioneAutocomplete3();
                  
                  $(el).find('input').attr('oninput','StdAutocomplete(this,\''+panelname+'\',\''+target+'\',\''+vista+'\',\''+spanel+'\');');
                  
                  panel=$('#search_container').clone();
  
                  $(panel).attr('id','PANEL'+generateID());
                  $(panel).find('[titolo]').html('Ricerca articolo ...');
                  var container=$(panel).find('[tipo=\'container\']');
                  var vistaRic=getCurrentVista(vista);
                  if (vistaRic==undefined){
                      vistaRic=visteSTD[vista];
                  }
                  var nodo=Risorsa.get(hid);
                  
                  var elementi=[];
                  var tiposearch=target+'RIC';
                  var srcfld=target+'SRCFLD';
                  Risorsa.clear(srcfld);
                  var recsearch=new Risorsa(srcfld);
                  recsearch.PHID=hid;
                  
                  var listacampi=vistaRic.LISTACAMPI;
                  recsearch.ISSEARCHFLD=true;
                  for (var j=0;j<listacampi.length;j++){
                      var campo=listacampi[j].CAMPO;
                      recsearch[campo]='';
                  }
                  recsearch.callbackSearch=function (hid,campo,valore){
                      var vista2='\''+vista+'\'';
                      var target2='\''+target+'\'';
                          var vistaRic=getCurrentVista(vista);
                          if (vistaRic==undefined){
                              vistaRic=visteSTD[vista];
                          }
                          console.log('Invoco:'+hid+' '+target2+' '+panelname+' '+tiposearch+' '+JSON.stringify(vistaRic));
                          StdSearchQuery(hid,servertiposerch,panelname,tiposearch,vistaRic,spanel);
                  }
                  elementi.push(recsearch);
                  var table=renderTable('',nodo,elementi,vistaRic);
                  
  
  
                  container.append(table);
                  if (recsearch.LIMIT==undefined){
                      recsearch.LIMIT=15;
                      }
                  $(panel).find('div.modal-footer').find('[campoass=\'LIMIT\']').each(function(){
                      $(this).attr('hid',recsearch.HID);
                      $(this).val(recsearch.LIMIT);
                    });
                  StdApplyVisibility(vistaRic);
                  $(panel).draggable({
                      handle: '.section-header, .modal-footer',
                  });
                  
                  $(panel).css('display','');
  
                  var pos=getDimensions(el);
                  var posp=getDimensions(panel);
                  var x1=pos.x1+250;
                  //x1=20;
                  //var y1=pos.y1+150-posp.y2+posp.y1;
                  var y1=pos.y1-80;
              //	console.log('Panel position:'+x1+' '+y1+' '+JSON.stringify(posp));
                  $(panel).css({'background-color':'#ffffff','position':'absolute','left': x1, 'top': y1, 'display': 'block'});
                  addPanel(panelname,panel);
                  StdApplyVisibility(vistaRic);
                  //showDettaglio(e,el,obj,panel,fillPanel);	
              }else{
                  console.log('Aggiorno puntamento all\'articolo');
                  $(panel).find('table').find('tbody').find('td[tipo=\'ACTIONS\']').each(function(index,el){
                      var hid2=$(this).attr('hid');
                      var ogg=Risorsa.get(hid2);
                      if (ogg!=undefined){
                          ogg.PHID=hid;
                      }
                  });
              }
          
      }
  }		
  
  async function StdSearchPhrase(phrase,el,target,campo,vista){
      var max=15;
      var query={};
      if (campo==undefined){
          query._ALL=phrase;
      }else{
          query[campo]=phrase;
      }
      console.log('RICERCA:'+phrase+' : '+JSON.stringify(query));
      var ret=await Risorsa.asearch(target,query,max);
      if (ret.Esito=='OK'){
          ret.inputPhrase=phrase;
          return(ret);
      }
  }
  
  function StdAutocompleteInputG(el){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      if (ogg!=undefined){
          var nomevista=ogg.NOMEVISTA;
          if (nomevista==undefined){
              nomevista=visteRicercaBase[ogg.TIPO];
              if (ogg.TIPOBOM!=undefined && ogg.TIPOBOM=='PR7'){
                  nomevista=visteRicercaBase["BOMPR7"];
              }
              if (ogg.TIPOBOM!=undefined && ogg.TIPOBOM=='OK'){
                  nomevista=visteRicercaBase["BOMOK"];
              }
          }
          var vista=undefined;
          if (nomevista!=undefined){
              vista=getCurrentVista(nomevista);
              vista.TARGETELEMENT=el;
          }
          var target=ogg.TIPO;
          if (ogg.TARGETSEARCH!=undefined){
              target=ogg.TARGETSEARCH;
          }
          if (ogg.TIPOBOM!=undefined && ogg.TIPOBOM=='PR7'){
              target='BOMPR7';
          }
          console.log('Using nomevista:'+nomevista+":"+vista);
          console.log('Dentro alla mia vista: '+JSON.stringify(vista));
          StdAutocompleteInput(el,target,campo,vista);
      }
  }
  
  async function toggleSearch(el){
  
      var input=$(el).parent().find('input');
      var has=$(el).hasClass('fa-search');
  
      if (has){
          $(el).removeClass('fa-search').addClass('fa-close');
          $(input).attr('oninput',' StdAutocompleteInputG(this);');
          StdAutocompleteInputG(input);
      }else{
          $(el).removeClass('fa-close').addClass('fa-search');
          $(input).attr('oninput','');
      }
  }
  
  async function toggleRicercaLibera(el){
  
      var riclib=$(el).closest('table').find('.ricerca_libera');
      var has=$(el).hasClass('fa-search');
      var vista=Risorsa.get($(el).attr('vista'));
      if (has){
          if (vista!=undefined){
              var campi=vista.LISTACAMPI;
              if (campi!=undefined){
                  for (var i=0;i<campi.length;i++){
                      var r=campi[i];
                      if (r.CAMPO=='_ALL'){
                          r.VISIBILITY='visible';
                      }
                  }
              }
          }
          $(el).removeClass('fa-search').addClass('fa-close');
          $(riclib).css('display','');
          $(riclib).find('input').attr('oninput',' StdAutocompleteInputG(this);');
         // StdAutocompleteInputG(input);
      }else{
          if (vista!=undefined){
              var campi=vista.LISTACAMPI;
              if (campi!=undefined){
                  for (var i=0;i<campi.length;i++){
                      var r=campi[i];
                      if (r.CMPO=='_ALL'){
                          r.VISIBILITY='hidden';
                      }
                  }
              }
          }
          $(el).removeClass('fa-close').addClass('fa-search');
          $(riclib).css('display','none');
          //$(input).attr('oninput','');
      }
  }
  
  async function StdAutocompleteInput(el,target,campo,vista){
      var phrase=$(el).val();
      var ret=await StdSearchPhrase(phrase,el,target,campo,vista);
      var ogg=Risorsa.get($(el).attr('hid'));
      
      var lista=ret.LISTA;
      if (lista!=undefined){
          Risorsa.registerElements(lista);
          var div=$('#autocompletepj');
          if ($(div).length==0){
              pjautocompactive=true;
              div=document.createElement('div');
              $(div).attr('id','autocompletepj');
              $(div).css('z-index','80000');
            
             
              var dim=getDimensions($(el));
              var x=dim.x1+0;
              var y=dim.y2+8;
              var width='50%';
              var riga=$(el).closest('tr');
              if (riga.length>0){
                  var dimr=getDimensions($(riga));
                  width=dimr.x2-dim.x1;
                  width=' '+width+'px';
              }
              $(div).css({'background-color':'white',position:'absolute',top:y+'px', 'left':x+'px', 'max-width':width, border:'solid','border-radius':'8px','border-width':'1px' })
              $('body').append(div);
            //  $(div).attr('onmouseout','$(this).remove();');
              }
          $(div).find('table').remove();
          var listaris=[];
          var vistaRic=vista;
         // var vistaRic=getCurrentVista('RICERCA_ARTICOLI');
          for (var i=0;i<lista.length;i++){
  
              
              var riga=lista[i];
              var res=riga;
              if (riga.TIPO==undefined){
                  res=new Risorsa('SEARCH');
                  Risorsa.copy(riga,res);
                  }
              //var riga2=new Risorsa(target+'_RIC');       
              /*var riga2=new Risorsa(target);
              
              Risorsa.copy(riga,riga2);
             */
              //    riga2.PHID=ogg.HID;
              res.PHID=ogg.HID;
              console.log('LISTA '+i+":"+JSON.stringify(riga));
             //listaris.push(riga2);
             listaris.push(res);
          }
          var table=renderTable('',ogg,listaris,vistaRic);
          $(div).append(table);
          $(div).find('thead').addClass('todrag');
          $(div).draggable({
              handle: '.todrag'
          });
         
          }
  }
  
  function StdAutocomplete(el,panelname,target,vista,spanel){
      var val=$(el).val();
      //console.log('digitato so far:'+val);
      if (val!=undefined && val.length>1){
          var max=15;
          var query={};
          query._ALL=val;
          var ret=Risorsa.search(target,query,max);
          if (ret.Esito=='OK'){
              var panel=getPanel(panelname);
                      var table=$(panel).find('table');
                      
                  //	console.log('PANEL:'+panel.length+' TABLE:'+table.length+' TBODY:'+$(table).find('tbody').length);
                  var tiposearch=target+'RIC';
                  var fndtype='tr.tipo_'+tiposearch;
                      $(table).find('tbody').find(fndtype).remove();
                      var vistaRic=getCurrentVista(vista);
                      if (vistaRic==undefined){
                          vistaRic=visteSTD[vista];
                      }
                      var lista=ret.LISTA;
                      $(panel).find('[msg]').html(ret.Msg+': '+lista.length+' risultati');
                   //   var tiposearch=target+'RIC';
                      Risorsa.clear(tiposearch);
                      var intestaLista=Risorsa.getLista('SEARCHFIELD');
                      var phid=undefined;
                      if (intestaLista!=undefined && intestaLista.length>0){
                          var recsearch=intestaLista[0];
                      /*	var tr=$(document.createElement('tr'));
                          renderTd(tr,recsearch,vistaRic);
                          $(table).find('tbody').append(tr);*/
                          phid=recsearch.PHID;
                      }
                      for (var i=0;i<lista.length;i++){
                          var tr=$(document.createElement('tr'));
                          var riga=lista[i];
                          var riga2=new Risorsa(tiposearch);
                          riga.TIPO=tiposearch;
                          Risorsa.copy(riga,riga2);
                          if (phid!=undefined){
                              riga2.PHID=phid;
                          }
                      //	console.log('Riga:'+$(table).find('tbody').length+' JSON:'+JSON.stringify(riga2));
                          
                          renderTd(tr,riga2,vistaRic);
                          $(tr).find('img').attr('spanel',spanel);
                          $(table).find('tbody').append(tr);
                          
                          }
                  StdApplyVisibility(vistaRic);
  
          }
          
          
      }
  }
  
  
  function renderCampo(oggetto,campo,vistaGen){
      var vista=vistaGen[oggetto.TIPO];
      if (vista==undefined){
          console.log('VISTA NON DEFINITA PER:'+oggetto.TIPO);
          return(undefined);
      }
      var es=vista[campo];
      if (es==undefined){
          console.log('VISTA NON DEFINITA PER:'+campo);
          return(undefined);
      }
      var nome=vista[campo].DISPLAY;
      if (nome==undefined){
          console.log('DISPLAY NON DEFINITO PER:'+oggetto.TIPO);
          return(undefined);
      }
      var newel=$('#template_campi').find('[tipo=\''+nome+'\']').clone();
      $(newel).find('[campo]').each(function (){
          var n=$(this).attr('campo');
          n=n.replace('NOMECAMPO',campo);
          $(this).attr('campo',n);
      });
      $(newel).find('[campoass]').each(function (){
          var n=$(this).attr('campoass');
          n=n.replace('NOMECAMPO',campo);
          $(this).attr('campoass',n);
      });
      if (nome.includes('_E_LISTA')){
          var tmp=campo+'_LISTA';
          var listaCampi=oggetto[tmp];
          if (listaCampi!=undefined){
              var sel=$(newel).find('select');
              for (var j=0;j<listaCampi.length;j++){
                  $(sel).append('<option value="'+listaCampi[j]+'">'+listaCampi[j]+'</option>');
              }
          }
      }
  
      
  
  
      $(newel).find('span').attr('hid',oggetto.HID);
      $(newel).find('input').attr('hid',oggetto.HID);
      $(newel).find('img').attr('hid',oggetto.HID);
      $(newel).find('select').attr('hid',oggetto.HID);
      if (oggetto.PHID!=undefined){
          $(newel).find('span').attr('phid',oggetto.PHID);
          $(newel).find('input').attr('phid',oggetto.PHID);
          $(newel).find('img').attr('phid',oggetto.PHID);
          $(newel).find('select').attr('phid',oggetto.PHID);
      
      }
     
      $(newel).find('select[campoass]').val(oggetto[campo]);
      $(newel).find('span[campoass]').html(oggetto[campo]);
      $(newel).find('input[campoass]').val(oggetto[campo]);
   //   $(newel).find('input[campoass]').html(oggetto[campo]); 
      return(newel);
  }
  
  //var evtfdg=undefined;
  function fileDropGo(ev,el,categoria){
      console.log('File(s) dropped');
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      ev.preventDefault();
      if (ogg!=undefined){
  
      // Prevent default behavior (Prevent file from being opened)
  
    
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (ev.dataTransfer.items[i].kind === 'file') {
            var file = ev.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            var lastupdload=false;
            if (i==ev.dataTransfer.items.length){
                lastupload=true;
            }
            uploadFileStd(file,file.name,categoria,ogg,el,ogg.callbackUpload,lastupdload);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        console.log("fileDropGo... else ");
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
          console.log('... second log  file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
          var file=ev.dataTransfer.files[i];
          var lastupdload=false;
          if (i==ev.dataTransfer.items.length){
              lastupload=true;
          }
          uploadFileStd(file,file.name,categoria,ogg,el,ogg.callbackUpload,lastupload);
        }
      }
  }
  }
  
  
  //var evtfdg=undefined;
  function fileDropGoRid(ev,el,categoria){
      console.log('File(s) dropped');
      var hid=$(el).attr('hid');
      var rid=$(el).attr('rid');
      var ogg=Risorsa.get(hid);
      if (ogg==undefined){
          ogg=Risorsa.get(rid);
      }
      ev.preventDefault();
      console.log('FDROP FOR:'+ogg.HID);
      if (ogg!=undefined){
          console.log('FDROP FOR 2:'+ogg.HID);
      // Prevent default behavior (Prevent file from being opened)
  
    
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (ev.dataTransfer.items[i].kind === 'file') {
            var file = ev.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            var lastupdload=false;
            if (i==ev.dataTransfer.items.length){
                lastupload=true;
            }
            uploadFileStd(file,file.name,categoria,ogg,el,ogg.callbackUpload,lastupdload);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
          console.log('... second log  file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
          var file=ev.dataTransfer.files[i];
          var lastupdload=false;
          if (i==ev.dataTransfer.items.length){
              lastupload=true;
          }
          uploadFileStd(file,file.name,categoria,ogg,el,ogg.callbackUpload,lastupload);
        }
      }
  }else{
      console.log('NO FILE FOR:'+hid+":"+rid);
  }
  }
  
  
  var callbackUploadStd=function(ogg,el,docfs,lastupload){
      var campo=$(el).attr('campo');
     // console.log('Aggiorno:'+ogg);
      if (ogg!=undefined){
              if (campo!=undefined){
                  ogg[campo]=docfs.HID;
                  try {
                      closeDialog('loaddocumentpanel')
                  } catch (error) {
                      
                  }
                 // console.log('Aggiornato:'+JSON.stringify(ogg));
                  if (typeof ogg.callbackUpdate === 'function'){
                      //     console.log('Richiamo callbackUpdate');
                          ogg.callbackUpdate(ogg.HID,campo,docfs.HID,el);
                      }
              }else{
                  console.log('ANOMALIA ATTRIBUTO CAMPO MANCANTE IN '+el+' - '+campo);
              }
              
              }else{
                      console.log('Very bad in callbackUploadStd:'+ogg);
              }
      }
  
  function StdFileDropGo(ev,el){
      console.log('File(s) dropped');
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      ev.preventDefault();
      if (ogg!=undefined){
          var categoria=$(el).attr('categoria');
          if (categoria==undefined){
              categoria='DOCUMENTO';
          }
  
      // Prevent default behavior (Prevent file from being opened)
      
      
    
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (ev.dataTransfer.items[i].kind === 'file') {
            var file = ev.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            var lastupdload=false;
            if (i==ev.dataTransfer.items.length){
                lastupload=true;
            }
            var cllback=ogg.callbackUpload;
            if (cllback==undefined){
                cllback=callbackUploadStd;
            }
            
            uploadFileStd(file,file.name,categoria,ogg,el,cllback,lastupdload);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
          console.log('... second log  file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
          var file=ev.dataTransfer.files[i];
          var lastupdload=false;
          if (i==ev.dataTransfer.items.length){
              lastupload=true;
          }
          uploadFileStd(file,file.name,categoria,ogg,el,ogg.callbackUpload,lastupload);
        }
      }
  }
  }
  
  function dragOverHandler(ev) {
      console.log('File(s) in drop zone'); 
    
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();
    }
  
  function getVistaWithDefault(){
      var vista={
          'DEFAULT':{'DISPLAY':'EDITABILE'},
          '_DEFAULT':{'DISPLAY':'EDITABILE'},
          'HID':{'DISPLAY':'NOTEDIT'},
          'PHID':{'DISPLAY':'NOTEDIT'},
          'TIPO':{'DISPLAY':'NOTEDIT'},
          'CLIENTE':{'DISPLAY':'NOTEDIT'},
        
          '_id':{'NODISPLAY':true},
          '_CLOK':{'NODISPLAY':true},
          'MODIFIED':{'NODISPLAY':true},
          'CLASSE_LISTA':{'NODISPLAY':true},
          '_UPD':{'NODISPLAY':true},
          '_INS':{'NODISPLAY':true},
          'save':{'NODISPLAY':true},
          'saveChanged':{'NODISPLAY':true},
          'changed':{'NODISPLAY':true},
          'delete':{'NODISPLAY':true},
          '_deleteInternal':{'NODISPLAY':true},
          '_addInternal':{'NODISPLAY':true},
  
         
      };
      
      
      return(vista);
  }
  
  function renderCampoWithDefault(oggetto,campo,path,vista){
      if (vista==undefined){
          vista=getVistaWithDefault();
      }
      var v=vista[path+';'+campo];
      var nome=undefined;
      var listaC=undefined;
      if (v!=undefined){
          nome=v.DISPLAY;
          listaC=v.LISTA;
          }
  
      if (nome==undefined){    
          v=vista[campo];
          if (v!=undefined){
              nome=v.DISPLAY;
              listaC=v.LISTA;
              }
          }    
      
      if (nome==undefined){
         
          v=vista[path+';'+campo];
          if (v!=undefined){
              nome=v.NODISPLAY;
              if (nome!=undefined){
                  console.log('NODISPLAY DEFINITO PER '+path+';'+campo);
                  return(undefined);
                }
              }
  
      }
      if (nome==undefined){
          v=vista[campo];
          if (v!=undefined){
              nome=v.NODISPLAY;
              }
              if (nome!=undefined){
                  console.log('NODISPLAY DEFINITO PER '+campo);
                  return(undefined);
                }    
         
      }
      if (nome==undefined){
          v=vista._DEFAULT;
          if (v!=undefined){
              nome=v.NODISPLAY;
              }
              if (nome!=undefined){
                  console.log('NODISPLAY DEFINITO PER _DEFAULT');
                  return(undefined);
                }  
         
      }
      if (nome==undefined){
          v=vista._DEFAULT;
          if (v!=undefined){
              nome=v.DISPLAY;
              }
          
      }
     
      if (nome==undefined){
          console.log('DISPLAY NON DEFINITO PER NULLA:'+campo+'('+path+' ) . NON DOVREBBE SUCCEDERE:'+JSON.stringify(vista));
          return(undefined);
      }
      var newel=$('#template_campi').find('[tipo=\''+nome+'\']').clone();
      $(newel).find('[campo]').each(function (){
          var n=$(this).attr('campo');
          n=n.replace('NOMECAMPO',campo);
          $(this).attr('campo',n);
      });
      $(newel).find('[campoass]').each(function (){
          var n=$(this).attr('campoass');
          n=n.replace('NOMECAMPO',campo);
          $(this).attr('campoass',n);
      });
      if (nome.includes('_E_LISTA')){
          //var tmp=campo+'_LISTA';
          
          var listaCampi=[];
          if (listaC!=undefined){
              listaCampi=listaC;
          }
          if (listaCampi!=undefined){
              var sel=$(newel).find('select');
              for (var j=0;j<listaCampi.length;j++){
                  $(sel).append('<option value="'+listaCampi[j]+'">'+listaCampi[j]+'</option>');
              }
          }
      }
  
      
  
  
      $(newel).find('span').attr('hid',oggetto.HID);
      $(newel).find('input').attr('hid',oggetto.HID);
      $(newel).find('img').attr('hid',oggetto.HID);
      $(newel).find('select').attr('hid',oggetto.HID);
      if (oggetto.PHID!=undefined){
          $(newel).find('span').attr('phid',oggetto.PHID);
          $(newel).find('input').attr('phid',oggetto.PHID);
          $(newel).find('img').attr('phid',oggetto.PHID);
          $(newel).find('select').attr('phid',oggetto.PHID);
      
      }
  
      $(newel).find('input[campoass]').val(oggetto[campo]);
      $(newel).find('select[campoass]').val(oggetto[campo]);
      $(newel).find('span[campoass]').html(oggetto[campo]);
      console.log('HTML '+campo+":"+$(newel).html());
      console.log(' CE NON CE:'+$(newel).find('input[campoass]').length+" :"+$(newel).find('input[campoass]').val()+":"+oggetto[campo]);
      return(newel);
  }
  
  
  function formatNumero(n, c, d, t) {
      var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "," : d,
        t = t == undefined ? "." : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    
      return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
  
    function numeroArr(num,dec){
        if (dec==undefined){
            dec=100;
        }
        if (num==undefined){
            return(undefined);
        }
        if (isNaN(num)){
            return(undefined);
        }
        return(Math.round(num*dec)/dec);
    }
  
  function applyFormRecord(form,ogg){
      $(form).find('[campoass]').each(function(){
          $(this).attr('hid',ogg.HID);
          var campo=$(this).attr('campoass');
         /* var v=campo.split('.',-1);
          if (v.length>1){
          var refogg=ogg[v[0]];
          for (var k=1;k<v.length;k++){
              if (refogg!=undefined){
                  refogg=refogg[v[k]];
                  }
          }
          $(this).html(refogg);
          $(this).val(refogg);
      }else{
          if (ogg[campo]!=undefined){
  
              $(this).html(ogg[campo]);
              $(this).val(ogg[campo]);
  
          }
      }*/
          var v=getValore(ogg,campo);
          $(this).html(v);
          $(this).val(v);
  
          var campoflag=campo+'_FLAG';
          var campomsg=campo+'_MSG';
          var flag=ogg[campoflag];
          var tooltip=ogg[campomsg];
          $(this).removeClass('ECSforzatura ECSerrore ECSwarning');
          //$(this).removeClass('ECSerrore');
          $(this).removeAttr('tooltip');
          $(this).removeAttr('onmouseover');
          $(this).removeAttr('onmouseout');
          if (flag!=undefined && flag!=''){
              $(this).addClass(flag);
             
          }else{
              $(this).removeClass('ECSforzatura ECSerrore ECSwarning');
          }
          if (tooltip!=undefined && tooltip!=''){
              $(this).attr('tooltip',tooltip);
              // $(this).attr('onmouseover','showToolTipThis(this);');
              // $(this).attr('onmouseout','hideToolTipThis(this);');
          }else{
  
          }
          
          
  
          var tipo=$(this).attr('tipo');
          if (tipo!=undefined && tipo=='SELECTIZE'){
              var dominio=$(this).attr('dominio');
           
              var libero=$(this).attr('free');
              var multi=$(this).attr('multi');
              var hop=$(this).attr('hop');
              if (libero==undefined){
                  libero=false;
              }else{
                  libero=true;
              }
              if (multi==undefined){
                  multi=false;
              }else{
                  multi=true;
              }
              var lista2=[];
              if (dominio!=undefined){
                  var dom=ogg[dominio];
                  if (dom!=undefined){
                      var listaind=dom;
                      var lista2=[];
                      //console.log(''+listaind.length+':'+listaind[0]);
                      for (var j=0;j<listaind.length;j++){
                          var v={'TESTO':listaind[j],'VAL':listaind[j]};
                          //console.log(''+i+':'+listaind[j]);
                          lista2.push(v);
                      }
                      if (libero){
                          if (multi){
                              StdSelectizeMultiLibero(this,lista2);
                          }else{
                          StdSelectizeSingleLibero(this, lista2);
                          }
                      }else{
                          if (multi){
                              if(hop==undefined){
                                  StdSelectizeMulti(this,lista2);
                              } else {
                                  StdSelectizeMultiHop(this,lista2);
                              }
                          }else{
                          StdSelectizeSingle(this,lista2);
                          }
                      }
                      
                  
  
              }else{
              
                      if (dominio!=undefined){
                          var s=dominio.split(".",-1);
                          var rec=window;
                          var go=true;
                          for (var j=0;j<s.length;j++){
                              if (rec!=undefined){
                                  rec=rec[s[j]];
                                  }else{
                                      go=false;
                                  }
                          }   
                          if (go){
                              lista2=rec;
                              }
                      }
                      if (libero){
                          if (multi){
                              StdSelectizeMultiLibero(this,lista2);
                          }else{
                          StdSelectizeSingleLibero(this,lista2);
                          }
                      }else{
                          if (multi){
                              StdSelectizeMulti(this,lista2);
                              }else{
                          StdSelectizeSingle(this,lista2);
                              }
                      }
              }
          }
              
          }
  
          var selectize2=$(this).attr('selectize2');
          if (selectize2!=undefined && selectize2=='S'){
              var dominio=$(this).attr('dominio');
              var dominiogruppi=$(this).attr('dominiogruppi');
              var libero=$(this).attr('free');
              var multi=$(this).attr('multi');
              var hop=$(this).attr('hop');
              var group=$(this).attr('group');
              if (libero==undefined){
                  libero=false;
              }else{
                  libero=true;
              }
              if (multi==undefined){
                  multi=false;
              }else{
                  multi=true;
              }
              if (hop==undefined){
                  hop=false;
              }else{
                  hop=true;
              }
              if (group==undefined){
                  group=false;
              }else{
                  group=true;
              }
              var lista2=[];
              if (dominio!=undefined){
                  // GIULIA IL 20.01.2020
                  // var dom=ogg[dominio];
                  var dom = getValore(ogg, dominio);
                  if (dom!=undefined){
                      
                      var lista2=dom;
                      
                      if (libero){
                          if (multi){
                              StdSelectizeMultiLibero(this, lista2, ogg.HID, campo);
                          }else{
                              // console.log("dw Giulia, sei nel posto giusto ;)");
                              // console.log("campo: " + campo);
                              StdSelectizeSingleLibero(this, lista2, ogg.HID, campo);
                          }
                      }else{
                          if (multi){
                              if(hop){
                                  StdSelectizeMultiHop(this,lista2);
                              } else {
                                  StdSelectizeMulti(this,lista2);
                              }
                          }else{
                              if(hop){
                                  console.log("SIAM PASSATI DI QUA");
                                  StdSelectizeSingleHop(this,lista2);
                              } else {
                                  StdSelectizeSingle(this,lista2);
                              }
                          }
                      }
                      
                  
  
              }else{
  
  
              
                      if (dominio!=undefined){
                          console.log('DOMINIO:'+dominio);
                          var s=dominio.split(".",-1);
                          var rec=window;
                          var go=true;
                          for (var j=0;j<s.length;j++){
                              if (rec!=undefined){
                                  rec=rec[s[j]];
                                  }else{
                                      go=false;
                                  }
                          }   
                          if (go){
                              lista2=rec;
                              }
                             // console.log('LISTA2:'+lista2);    
                      }
  
                      
                      if (dominiogruppi!=undefined){
                          console.log('DOMINIOGRUPPI:'+dominiogruppi);
                          var s=dominiogruppi.split(".",-1);
                          var rec=window;
                          var go=true;
                          for (var j=0;j<s.length;j++){
                              if (rec!=undefined){
                                  rec=rec[s[j]];
                                  }else{
                                      go=false;
                                  }
                          }
                          if (go){
                              dominiogruppi=rec;
                              }
                          console.log('LISTA DOMINIO GRUPPI:'+JSON.stringify(dominiogruppi));    
                      }
  
                      if (libero){
                          if (multi){
                              StdSelectizeMultiLibero(this, lista2, ogg.HID, campo);
                              }else{
                                  /*console.log("SONO LONTANO DA QUI SOPRA");
                                  StdSelectizeSingleLibero(this,lista2);*/
                                  if(group){
                                      console.log("Cadiamo qui dentro: "+JSON.stringify(lista2));
                                      StdSelectizeGroupSingleLibero(this,lista2,dominiogruppi, ogg.HID, campo);
                                  }else{
                                      // console.log("dw Giulia, sei nel posto giusto ;)");
                                      StdSelectizeSingleLibero(this, lista2, ogg.HID, campo);
                              }
                          }
                      }else{
                          if (multi){
                              if (group){
                                  console.log('SONO QUI in StdSelectizeGroupMulti');
                              StdSelectizeGroupMultiple(this,lista2,dominiogruppi, ogg.HID, campo);
                              }else{
                                  //console.log('Cadiamo qui dentro:'+JSON.stringify(lista2));
                                  if(!hop){
                                      StdSelectizeMulti(this, lista2, ogg.HID, campo);
                                  } else {
                                      StdSelectizeMultiHop(this, lista2, ogg.HID, campo);
                                  }
                              }
                              }else{
                                  if (group){
                                      //StdSelectizeGroupSingle(this,lista2,dominiogruppi);
                                      if (libero){
                                              StdSelectizeGroupSingleLibero(this,lista2,dominiogruppi, ogg.HID, campo);
                                          }else{
                                              StdSelectizeGroupSingle(this,lista2,dominiogruppi);
                                          }
                                      //StdSelectizeGroupSingle(this,lista2,dominiogruppi);
                                  }else{
                                  
                                      if(hop){
                                          console.log("SIAM PASSATI DI QUA");
                                          StdSelectizeSingleHop(this,lista2);
                                      } else {
                                          StdSelectizeSingle(this,lista2);
                                      }
                                  }
                              }
                      }
              }
  
  
              // per inserire il tooltip nelle selectize nel caso in cui ci fosse
              var tooltip = $(this).attr('tooltip');
              if(tooltip!=undefined && tooltip.length>0){
                  var onmouseover = $(this).attr('onmouseover');
                  var onmouseout = $(this).attr('onmouseout');
                  var secondInput = $(this).parent().find('input')[1];
                  $(secondInput).attr('tooltip', tooltip);
                  // $(secondInput).attr('onmouseover', onmouseover);
                  // $(secondInput).attr('onmouseout', onmouseout);
              }
          }
      }
          if (tipo!=undefined && tipo=='WY'){
              StdWy(this);
          }
  
          if (tipo!=undefined && tipo=='INDIRIZZO'){
              var tmp=campo+'_LISTAINDIRIZZI';
              if (ogg[tmp]!=undefined){
                  var listaind=ogg[tmp];
                  var lista2=[];
                  for (var i=0;listaind.length;i++){
                      var v={'TESTO':listaind[i],'VAL':listaind[i]};
                      lista2.push(v);
                  }
                  StdSelectizeSingleLibero(this,lista2);
                 
              }
              var dominio=$(this).attr('dominio');
              if (dominio!=undefined){
                  var dom=ogg[dominio];
                  if (dom!=undefined){
                      var listaind=dom;
                  var lista2=[];
                  //console.log(''+listaind.length+':'+listaind[0]);
                  for (var j=0;j<listaind.length;j++){
                      var v={'TESTO':listaind[j],'VAL':listaind[j]};
                      //console.log(''+i+':'+listaind[j]);
                      lista2.push(v);
                  }
                  StdSelectizeSingleLibero(this,lista2);
                  }
              }
              StdSearchMappaIndirizzo(this,$(this).attr('howmany'));
          }
  
      });
  
      $(form).find('[campoassr]').each(function (){
          $(this).attr('hid',ogg.HID);
      });
  
      $(form).find('[campobarpct]').each(function (){
          var campo=$(this).attr('campobarpct');
          var v=getValore(ogg,campo);
          if (v!=undefined && v>=0 && v<=101){
              $(this).css('width',''+v+'%');    
          }
          
      });
  
      $(form).find('[camposelect]').each(function(){
          $(this).attr('hid',ogg.HID);
          var campo=$(this).attr('camposelect');
          var v=getValore(ogg,campo);
          //var v=ogg[campo];
  
          var dominio=$(this).attr('dominio');
          if (dominio!=undefined){
              var dom=ogg[dominio];
              var lista2=[];
              if (dom==undefined) {
                  var s=dominio.split(".",-1);
                          var rec=window;
                          var go=true;
                          for (var j=0;j<s.length;j++){
                              if (rec!=undefined){
                                  rec=rec[s[j]];
                                  }else{
                                      go=false;
                                  }
                          }   
                          if (go){
                              dom=rec;
                              }
              }
              if (dom!=undefined){
                  lista2=dom;
                  for (var j=0;j<lista2.length;j++){
                      var rc=lista2[j];
                      var opt=$(this).find('option[value="'+rc.VAL+'"]');
                      if (opt.length==0){
                          var testo=rc.TESTO;
                          if (testo==undefined){
                              if (rc.DESCRIZIONE!=undefined){
                                  testo=rc.DESCRIZIONE;
                              }
                          }
                         // opt='<option value="'+rc.VAL+'">'+rc.TESTO+'</option>';
                          opt='<option value="'+rc.VAL+'">'+testo+'</option>';
                          $(this).append(opt);
                      }else{
                          $(opt).removeAttr('selected');
                      
                      }
                  }
              }
          }
  
  
  
          if (v!=undefined){
              $(this).find('option[value="'+v+'"]').attr('selected','selected');
          } 
      });
  
      $(form).find('[campocalendar]').each(function(){
          $(this).attr('hid', ogg.HID);
          
          var campo = $(this).attr('campocalendar');
          var v = getValore(ogg, campo);
  
          var t = getGiorno(new Date());
          var num_g_t = t.DAY;
          var num_m_t = t.MONTH;
  
          var d = getGiorno(ogg.DATACORRENTE);
          var num_giorno_oggi = d.DAY;
          var num_mese_oggi = d.MONTH;
          var anno_oggi = d.ANNO;
          var nome_mese = d.MESE;
          
  
          var cerco_titolo = $(this).find('[tipo="current-mouth"]');
          console.log("campocalendar cerco_titolo.length: " + cerco_titolo.length+" DATACORRENTE:"+ogg.DATACORRENTE);
  
          var dt=ogg.DATACORRENTE;
          var firstDay = new Date(dt.getFullYear(), dt.getMonth(), 1);
          var gf=getGiorno(firstDay);
          var lastDayPrev = new Date(firstDay);
          lastDayPrev.setDate(lastDayPrev.getDate()-1);
          var gf=getGiorno(firstDay);
          var gfs=gf.DAYOFWEEK7;
          var lastdprev=getGiorno(lastDayPrev);
          var lastdp=lastdprev.DAY;
          var toDispl=gfs-1;
          var posday=new Date(firstDay);
          posday.setDate(posday.getDate()-toDispl);
  
  
          var lastDay = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
          console.log("campocalendar lastDay: " + lastDay);
          var firstDayNext = new Date(lastDay);
          firstDayNext.setDate(firstDayNext.getDate()+1);
          console.log("campocalendar firstDayNext: " + firstDayNext);
          var gl = getGiorno(lastDay);
          var gl_num = gl.DAY;
          var gls = gl.DAYOFWEEK7;
          var firstdnext = getGiorno(firstDayNext);
          var firstdn = firstdnext.DAY;
          var toDisplFINE = gls-1;
  
      
          
          var elallafine=undefined;
          var modello='#StdCalendar';
          if (ogg.MODELLO!=undefined){
              modello='#'+ogg.MODELLO;
          }
          var calendar=$(modello).clone();
          // $(this).empty();
          $(this).html($(calendar).html());
          var pos=1;
          // var pos=0;
          $(this).find('[tipo="current-mouth"]').html(nome_mese+' '+anno_oggi);
          $(this).find('.day-list .circle').each(function(){
              var gc=getGiorno(posday);
              var dtrif=gc.DATAFORM;
              
              $(this).attr('giorno',gc.DATAFORM);
              $(this).attr('dataestesa',gc.DATAESTESA);
              var pjtg=$(this).parent().find(".arrow").find("a");
                  $(pjtg).attr('giorno',gc.DATAFORM);
                  $(pjtg).attr('dataestesa',gc.DATAESTESA);
              if (pos<=toDispl){
                  $(this).addClass('deactive');
                  var nday=lastdp-toDispl+pos;
                  $(this).text(nday);
              }else{
                  $(this).removeClass('deactive');
                  var nday=pos-toDispl;
                  console.log("campocalendar nday: " + nday);
                  console.log("campocalendar gl_num: " + gl_num);
                  if(nday > gl_num){
                      $(this).addClass('deactive');
                      $(this).text(nday - gl_num);
                  } else {
                      $(this).text(nday);
                  }
              }
  
              if( (pos - toDispl) == num_g_t ){
                  var mese_cal = ogg.DATACORRENTE.getMonth() + 1;
                  if(mese_cal == num_m_t){
                      $(this).addClass('color-verde-medio');
                  }
                  elallafine=this;
              }
  
              var list=ogg.EVENTI[dtrif];
              if (list!=undefined){
                  if (list.length==0){
                      console.log('Nessun elemento contenuto nella lista:'+JSON.stringify(list));
                  }
                  for (var j=0;j<list.length;j++){
                      var ev=list[j];
                      console.log("campocalendar giorno evento colore: " + ev.DESCRIZIONE + " ; " + ev.start + " ; " + ev.backgroundColor);
                      $(this).css({'background-color':ev.backgroundColor});
                      //$(this).attr('onclick','getEventoGiorno(this);return(false);');
                  }
              }else{
                  console.log('NESSUN EVENTO SULLA DATA:'+dtrif);
              }
  
              $(this).attr('onclick','getEventoGiorno(this);return(false);');
  
              console.log('POSDAY:'+posday+" dtrif:"+dtrif);
              posday.setDate(posday.getDate()+1);
              pos=pos+1;
          });
          getEventoGiorno(elallafine);
      });
  
      $(form).find('[bottone]').each(function(){
          $(this).attr('hid',ogg.HID);
      });
  
      $(form).find('[campophoto]').each(function(){
          $(this).attr('hid',ogg.HID);
          if (ogg.PHID!=undefined){
              $(this).attr('phid',ogg.PHID);
          }
          var campo=$(this).attr('campophoto');
          var v=getValore(ogg,campo);
          if (v!=undefined){
              $(this).attr('src',getDocUrl(v));
              $(this).parent().parent().find('[tipo="ModificaImmagine"]').css('display','');
              $(this).parent().parent().find('[tipo="CancellaImmagine"]').css('display','');
          } else {
              var src = '';
              if(ogg.TIPO=="CLIENTE" || ogg.TIPO=="UTENTI"){
                  src = "/img/blank_male.png";
              } else {
                  src = "/img/files/FotoVerde.svg";
              }
              $(this).attr('src', src);
              $(this).parent().parent().find('[tipo="ModificaImmagine"]').css('display','none');
              $(this).parent().parent().find('[tipo="CancellaImmagine"]').css('display','none');
          }
      });
  
      $(form).find('[campoimage]').each(function(){
          $(this).attr('hid',ogg.HID);
          if (ogg.PHID!=undefined){
              $(this).attr('phid',ogg.PHID);
          }
          var campo=$(this).attr('campoimage');
          var v=getValore(ogg,campo);
          if (v!=undefined){
              $(this).attr('src',v);
          }
      });
  
      $(form).find('[campoanchor]').each(function(){
          $(this).attr('hid',ogg.HID);
          if (ogg.PHID!=undefined){
              $(this).attr('phid',ogg.PHID);
          }
          var campo=$(this).attr('campoanchor');
          var v=getValore(ogg,campo);
          if (v!=undefined){
              $(this).attr('href',getDocUrl(v));
          }
      });
    
  
      $(form).find('[campoflag]').each(function(){
          $(this).attr('hid',ogg.HID);
          var campo=$(this).attr('campoflag');
          var v=getValore(ogg,campo);
          var tickEl = $(this).find('.custom-tick').addBack('.custom-tick');
          if (v!=undefined && v==false){
              tickEl.css('visibility', 'hidden');
          }else{
              if (v==undefined){
                  tickEl.css('visibility', 'hidden');
              } else{
              tickEl.css('visibility', 'visible');
              }
          }
  
          
      });
  
      $(form).find('[campodoc]').each(function(){
          $(this).attr('hid',ogg.HID);
          var campo=$(this).attr('campodoc');
          var v=getValore(ogg,campo);
          
          /**
           * pulizia sezione
           */
          $(this).empty();
          /**
           * Ricostruzione sezione
           */
          var listasezioni='DOCUMENTI';
          var dominio=$(this).attr('dominio');
          var sezs=getDominioObject(ogg,dominio);
          if (sezs!=undefined){
              listasezioni=sezs;
          }
          var sezioni=listasezioni.split(",");
          var docsezs=v;
              if (docsezs==undefined){
                  docsezs=[];
                  
                  var s=campo.split('.');
                  var rec=ogg;
                  for (var i=0;i<s.length-1;i++){
                      if (rec[s[i]==undefined]){
                          rec[s[i]]={};
                      }
                      rec=rec[s[i]];
                  }
                  rec[s[s.length-1]]=docsezs;
                  //ogg[campo]=docsezs;
              }
          var fatta={};    
          for (var i=0;i<docsezs.length;i++){
              var sezogg=docsezs[i];
              sezogg.CAMPOSEZ=campo;
              var sez=sezogg.SEZIONE;
              var docs=sezogg.DOCUMENTI;
              Risorsa.registerElement(sezogg);
              fatta[sez]=true;
              var sezione=creaSezioneDocumenti(sezogg);
              $(this).append(sezione);
          }    
  
          console.log('SEZIONI DOCUMENTI:'+listasezioni);
          for (var i=0;i<sezioni.length;i++){
              var sez=sezioni[i];
              console.log('SEZIONE:'+sez);
              if (fatta[sez]==undefined){
                  fatta[sez]=true;
                  var sezogg=new Risorsa('SEZIONEDOCUMENTI');
                  sezogg.PHID=ogg.HID;
                  sezogg.PARENT=ogg.TIPO;
                  sezogg.SEZIONE=sez;
                  sezogg.DOCUMENTI=[];
                  docsezs.push(sezogg);
                  var sezione=creaSezioneDocumenti(sezogg);
                  $(this).append(sezione);
              }
              
              
  
          }
      });
  
      $(form).find('[campodoclist]').each(function(){
          $(this).attr('hid',ogg.HID);
          var campo=$(this).attr('campodoclist');
          var campoactexpl=$(this).attr('activeexploded');
          if (campoactexpl==undefined){
              campoactexpl=campo+"_ACTIVEEXPLODED";
          }
          var activeexpl=ogg[campoactexpl];
          if (activeexpl==undefined){
              activeexpl={};
              ogg[campoactexpl]=activeexpl;
          }
          var v=getValore(ogg,campo);
          // console.log("GIULIA DEVE CAPIRE: " + JSON.stringify(v));
          /**
           * pulizia sezione
           */
          $(this).empty();
          /**
           * Ricostruzione sezione
           */
          var listasezioni='DOCUMENTI';
          var dominio=$(this).attr('dominio');
          var sezs=getDominioObject(ogg,dominio);
          if (sezs!=undefined){
              listasezioni=sezs;
          }
          var sezioni=listasezioni.split(",");
          var docsezs=v;
              if (docsezs==undefined){
                  docsezs=[];
                  
                  var s=campo.split('.');
                  var rec=ogg;
                  for (var i=0;i<s.length-1;i++){
                      if (rec[s[i]==undefined]){
                          rec[s[i]]={};
                      }
                      rec=rec[s[i]];
                  }
                  rec[s[s.length-1]]=docsezs;
                  //ogg[campo]=docsezs;
              }
          var fatta={};    
          /* for (var i=0;i<docsezs.length;i++){
              var sezogg=docsezs[i];
              sezogg.CAMPOSEZ=campo;
              var sez=sezogg.SEZIONE;
              var docs=sezogg.DOCUMENTI;
              Risorsa.registerElement(sezogg);
              fatta[sez]=true;
              var sezione=creaSezioneDocumenti(sezogg);
              $(this).append(sezione);
          }    */ 
  
          console.log('SEZIONI DOCUMENTI:'+listasezioni);
          /* for (var i=0;i<sezioni.length;i++){
              var sez=sezioni[i];
              console.log('SEZIONE:'+sez);
              if (fatta[sez]==undefined){
                  fatta[sez]=true;
                  var sezogg=new Risorsa('SEZIONEDOCUMENTI');
                  sezogg.PHID=ogg.HID;
                  sezogg.PARENT=ogg.TIPO;
                  sezogg.SEZIONE=sez;
                  sezogg.DOCUMENTI=[];
                  docsezs.push(sezogg);
                  var sezione=creaSezioneDocumenti(sezogg);
                  $(this).append(sezione);
              }
              
              
  
          } */
            for (var i=0;i<docsezs.length;i++){
              var sezogg=docsezs[i];
              sezogg.CAMPOSEZ=campo;
              var sez=sezogg.SEZIONE;
              sezogg.NOMEFILE=sez;
              sezogg.ACTIVEEXPLODED=campoactexpl;
              sezogg.PARENTHID=ogg.HID;
              sezogg.TIPOCAMPO='DIRECTORY';
              sezogg.IMAGE="/hopperix/Icone/Download Documento.svg";
              var docs=sezogg.DOCUMENTI;
  
              /* var nfile=0;
              var ndir=0;
              if (docs!=undefined){
                      for (var k=0;k<docs.length;k++){
                          var doc=docs[k];
                          Risorsa.registerElement(doc);
                          if (doc.TIPOCAMPO=='DIRECTORY'){
                              ndir=ndir+1;
  
                          }else{
                              nfile=nfile+1;
                          }
                      }
                  }
              sezogg.SIZE=''+nfile+" file e "+ndir+" directory"; */
              /*if (sezogg.NOMEFILE==undefined){
                  sezogg.NOMEFILE=sez;
              }*/
              
              var docs=sezogg.DOCUMENTI;
              Risorsa.registerElement(sezogg);
            //  sezogg.callbackUpdate=callbackDocumentiDir;
              fatta[sez]=true;
             
          }     
  
         // console.log('SEZIONI DOCUMENTI:'+listasezioni);
         for (var i=0;i<sezioni.length;i++){
              var sez=sezioni[i];
              console.log('SEZIONE:'+sez);
              if (fatta[sez]==undefined){
                  fatta[sez]=true;
                  var sezogg=new Risorsa('SEZIONEDOCUMENTI');
                  sezogg.PHID=ogg.HID;
                  sezogg.PARENT=ogg.TIPO;
                  sezogg.ACTIVEEXPLODED=campoactexpl;
                  sezogg.TIPOCAMPO='DIRECTORY';
                  sezogg.SEZIONE=sez;
                  sezogg.PARENTHID=ogg.HID;
                  sezogg.NOMEFILE=sez;
                //  sezogg.callbackUpdate=callbackDocumentiDir;
                  sezogg.IMAGE="/hopperix/Icone/Download Documento.svg";
                  sezogg.DOCUMENTI=[];
                  docsezs.push(sezogg);
                 
              }
          }
          var lista=[];
          setCallbacksDoc(docsezs,ogg,'DOCUMENTI');
          /*for (var i=0;i<docsezs.length;i++){
              var sezogg=docsezs[i];
              buildindent(activeexpl,sezogg,lista,0,'DOCUMENTI');
              
          }*/
  
          buildindent(activeexpl,docsezs,lista,0,'DOCUMENTI');
          
  
          var vista=getCurrentVista('LISTADOCUMENTI');
          var table=renderTable('cardTabella',ogg,lista,vista,undefined,100,'Lista Directory Documenti');
          $(table).css('min-width','100%');
          $(this).append(table);
          $(table).find('thead').find('tr').attr('activeexploded',campoactexpl);
          $(table).find('thead').find('tr').attr('campo',campo);
          $(table).find('thead').find('tr').attr('campolista','DOCUMENTI');
          $(table).find('tr').addClass('dropmespec');
  
          var ogg_campoactexpl = ogg[campoactexpl];
          if(ogg_campoactexpl != undefined){
              for(var x in ogg_campoactexpl){
                  if(ogg_campoactexpl[x] == 1){
                      console.log("(applyFormRecord [campodoclist]) tr relativo all'hid: " + x);
                      var riga_da_espandere = $(table).find('tbody').find('tr[hid="'+x+'"]');
                      var riga_da_espandere2 = $(riga_da_espandere).find('[godown]');
                      console.log("riga_da_espandere.length: " + riga_da_espandere2.length);
                      $(riga_da_espandere2).attr('onclick', 'StdHideUp(this);')
                      $(riga_da_espandere2).removeClass('mdi-arrow-down-bold-circle-outline');
                      $(riga_da_espandere2).addClass('mdi-arrow-up-bold-circle-outline');
                  }
              }
          }
  
          StdDragDrop('dragmespec','dropmespec',checkDrgDrpDoc,dropDrgDrpDoc);
          //$(this).find('i').attr('hid',hid);
      });
  
      
      
      $(form).find('[campoalberatura]').each(function(){
          $(this).attr('hid', ogg.HID);
          var campo = $(this).attr('campoalberatura');
          var filtra = $(this).attr('filtra');
  
          var campoactexpl = $(this).attr('activeexploded');
          if (campoactexpl == undefined){
              campoactexpl = campo + "_ACTIVEEXPLODED";
          }
          var activeexpl=ogg[campoactexpl];
          if (activeexpl==undefined){
              activeexpl={};
              ogg[campoactexpl]=activeexpl;
              console.log("campoalberatura METTO IL CAMPO SCONTI_ACTIVEEXPLODED NELL'OGGETTO: " + campoactexpl + " ; " + ogg.HID);
          }
  
          $(this).empty();
  
          var lista = [];
          var lista2 = undefined;
          if(ogg[campo] != undefined){
              lista2 = ogg[campo];
          } else {
              ogg[campo] = [];
              lista2 = ogg[campo];
          }
  
          if(filtra == 'si'){
              for(var i=0; i<lista2.length; i++){
                  var pl = lista2[i];
                  if(pl.PRINCIPALE != undefined && pl.PRINCIPALE == true){
                      lista.push(pl);
                  }
              }
          } else {
              lista = lista2;
          }
          /* var cmps = ogg[campo];
          buildindent(activeexpl, cmps, lista, 0, campo); */
  
          var vista = getCurrentVista('LISTAALBERATURA');
          var table = renderTable('cardTabella', ogg, lista, vista, undefined, 50, 'Griglia Sconti');
          $(table).css('min-width','100%');
          $(this).append(table);
          $(table).find('thead').find('tr').attr('activeexploded', campoactexpl);
          $(table).find('thead').find('tr').attr('campo', campo);
          $(table).find('thead').find('tr').attr('campolista', 'SCONTI');
  
          var ogg_campoactexpl = ogg[campoactexpl];
          if(ogg_campoactexpl != undefined){
              for(var x in ogg_campoactexpl){
                  if(ogg_campoactexpl[x] == 1){
                      console.log("(applyFormRecord [campodoclist]) tr relativo all'hid: " + x);
                      var riga_da_espandere = $(table).find('tbody').find('tr[hid="'+x+'"]');
                      var riga_da_espandere2 = $(riga_da_espandere).find('[godown]');
                      console.log("riga_da_espandere.length: " + riga_da_espandere2.length);
                      $(riga_da_espandere2).attr('onclick', 'StdHideUp(this);')
                      $(riga_da_espandere2).removeClass('mdi-arrow-down-bold-circle-outline');
                      $(riga_da_espandere2).addClass('mdi-arrow-up-bold-circle-outline');
                  }
              }
          }
          
      });
  
  }
  
  function setCallbacksDoc(docs,parent,campo){
      if (docs==undefined){
          return;
      }
      for (var i=0;i<docs.length;i++){
          var doc=docs[i];
          if (doc.TIPOCAMPO=='DIRECTORY'){
              doc.IMAGE="/hopperix/Icone/Download Documento.svg";
              doc.callbackUpdate=callbackDocumentiDir;
              doc.callbackUpload=callbackUploadDocumentiDir;
          }else{
              doc.TIPOCAMPO=='FILE'
              doc.IMAGE="/hopperix/Icone/Documento.svg";
              doc.callbackUpdate=callbackDocumentiFile;
          }
          if (doc.PARENTHID!=undefined){
              doc.PARENTHID=parent.HID;
          }
          Risorsa.registerElement(doc);
          setCallbacksDoc(doc[campo],parent,campo);
      }
  }
  
  var callbackUploadDocumentiDir=async function(sezogg,el,docfs,lastupload){
      var phid=sezogg.PHID;
      var ogg=Risorsa.get(phid);
      if (ogg!=undefined){
          sezogg.DOCUMENTI.push(docfs);
          docfs.SEZHID=sezogg.HID;
          docfs.PARENTHID=sezogg.PARENTHID;
          docfs.PHID=sezogg.HID;
          if (docfs.SIZE==undefined){
              setDocSize(docfs);
          }
         var parent=Risorsa.get(sezogg.PARENTHID);
         if (parent!=undefined){
          //var tg=$(target).closest('[tipo="doc-container"]').parent();
              var tr=$(el).closest('table').find('thead tr');
              var campoactive=$(tr).attr('activeexploded');
              var campolista=$(tr).attr('campolista');
              var campo=$(tr).attr('campo');
              var active=parent[campoactive];
              if (active!=undefined){
                  active[sezogg.HID]=1;
              }
              var tg=$(el).closest('[tiposez="docs-container"]'); 
              var tg2 = $('[tipo="doclist-container"][hid="'+parent.HID+'"]').closest('[tiposez="docs-container"]');
              // var tg=$(el).closest('[tipo="doclist-container"]');
              applyFormRecord(tg2,parent);
              // applyFormRecord(tg2,parent);
              // await Risorsa.asave(parent);
              console.log("HIDDOC: " + docfs.HID + " ; lastupload: " + lastupload + " ; tg.length: " + tg.length + " ; tg2.length: " + tg2.length);
                 await Risorsa.asave(parent);
                 /* if (lastupload!=undefined && lastupload){
                  applyFormRecord(tg2,ogg);
                  } */
              }
         /*  if (lastupload!=undefined && lastupload){
              applyFormRecord(tg2,ogg);
          }
       */
          }else{
              console.log('Very bad in:'+phid+':'+sezogg.HID);
          }
      }
      
  
  async function callbackDocumentiFile(hid,campo,loc,el){
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          var parenthid=ogg.PARENTHID;
          var parent=Risorsa.get(parenthid);
          if (parent!=undefined){
              var cont=$(el).closest('[tiposez="docs-container"]');
              applyFormRecord(cont,parent);
              await Risorsa.asave(parent);
          }
      }
      
  }
  
  async function callbackDocumentiDir(hid,campo,loc,el){
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          switch (campo) {
              case 'NOMEFILE':
                  ogg.SEZIONE=ogg.NOMEFILE;
                  break;
          
              default:
                  break;
          }
          var parenthid=ogg.PARENTHID;
          var parent=Risorsa.get(parenthid);
          if (parent!=undefined){
              var cont=$(el).closest('[tiposez="docs-container"]');
              StdRebuildTableComponents(el);
              applyFormRecord(cont,parent);
              await Risorsa.asave(parent);
          }
      }
  }
  
  async function StdRemoveDoc(el){
  
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          var titolo='Cancellazione directory';
          var docs=ogg.DOCUMENTI;
          if (docs!=undefined && docs.length>0){
              await hopnotify(titolo,'Impossibile cancellare una directory non vuota! Cancellare o spostare i file rimanenti','Annulla');
              console.log('Cancellazione file canceled');
              return;
          }
          if (ogg.TIPOCAMPO!='DIRECTORY'){
              titolo="Cancellazione File";
          }
          var conf=await hopconfirm(titolo,'Sei sicuro di voler eliminare '+ogg.NOMEFILE+'?','S\xEC','No');
          console.log('Cancellazione file:'+conf);
          if (conf){
              var phid=ogg.PHID;
              var par=Risorsa.get(phid);
              var tr=$(el).closest('table').find('thead tr');
              var campoactive=$(tr).attr('activeexploded');
              var campolista=$(tr).attr('campolista');
              var campo=$(tr).attr('campo');
              if (par!=undefined){
                  var docs=par[campo];
                  if (docs!=undefined){
                      for (var j=0;j<docs.length;j++){
                          var doc=docs[j];
                          if (doc!=undefined && doc.HID==hid){
                              docs.splice(j,1);
                              StdRebuildTableComponents(el);
                              var cont=$(el).closest('[tiposez="docs-container"]');
                              var parenthid=ogg.PARENTHID;
                              var parent=Risorsa.get(parenthid);
                              if (parent!=undefined){
                                  applyFormRecord(cont,parent);
                                  await Risorsa.asave(parent);
                                  }
                              return;
                          }
                      }
                  }
              }
          }
          
      }
  }
  
  function StdShowDown(el){
      var td=$(el).closest('td');
      var hid=$(td).attr('hid');
      var tr=$(td).closest('table').find('thead tr');
      var phid=$(tr).attr('hid');
      console.log('Expand showDown: '+hid);
      var active=undefined;
      if (hid!=undefined){
              var ogg=Risorsa.get(hid);
              if (ogg!=undefined){
                  /* var campoactive=$(tr).attr('activeexploded');
                  var campolista=$(tr).attr('campolista');
                   */
                  var campoactive=$(tr).attr('activeexploded');
                  var par=Risorsa.get(ogg.PARENTHID);
                  if (par!=undefined){
                    
                      active=par[campoactive];
                      if (active!=undefined){
                          
                          active[hid]=1;
                          StdRebuildTableComponents(el, par.TIPO);
                          $(el).attr('onclick','StdHideUp(this);');
                          // console.log('LUNG GIULIA:'+$(el).length);
                             $(el).removeClass('mdi-arrow-down-bold-circle-outline').addClass('mdi-arrow-up-bold-circle-outline');
                      }else{
                          console.log('PJ QUI NON CI SIAMO:'+campoactive+":"+active);
                      }
                  }else{
                      console.log('PJ NO PARENT:'+ogg.PARENTHID);
                  }
              }else{
                  console.log('PJ NO OBJECT:'+hid);
              }
          
              
          
          
          }
      }
  
      function StdHideUp(el){
      var td=$(el).closest('td');
      var hid=$(td).attr('hid');
      var tr=$(td).closest('table').find('thead tr');
      var active=undefined;
      var phid=$(tr).attr('hid');
          if (hid!=undefined){
              $(el).attr('onclick','StdShowDown(this);');
              $(el).removeClass('mdi-arrow-up-bold-circle-outline').addClass('mdi-arrow-down-bold-circle-outline');
              var ogg=Risorsa.get(hid);
              if (ogg!=undefined){
                  var campoactive=$(tr).attr('activeexploded');
                  var par=Risorsa.get(ogg.PARENTHID);
                  if (par!=undefined){
                      active=par[campoactive];
                      if (active!=undefined){
                      delete active[hid];
                      StdRebuildTableComponents(el, par.TIPO);
                      }
                  }else{
                      console.log('PJ NO PARENT:'+ogg.PARENTHID);
                  }
              }
              
          }
      }
      
  
  
      async function StdRebuildTableComponents(el, par_tipo){
          var table=$(el).closest('table');
          var lista=[];
        
              var tr=$(table).find('thead').find('tr');
                  var hid=$(tr).attr('hid');
                  var padre=Risorsa.get(hid);
                  var campoactive=$(tr).attr('activeexploded');
                  var campolista=$(tr).attr('campolista');
  
                  var campo=$(tr).attr('campo');
                  console.log('PJ PRIMA DI buildindent:'+campoactive+":"+campolista+":"+campo+":"+padre);
                  if (padre!=undefined){
                  var activeexpl=padre[campoactive];
                  console.log('PJ PRIMA DI buildindent:'+JSON.stringify(activeexpl));
                  var cmps=padre[campolista];
                /*   var campo=padre[campolista]; */
                  if (activeexpl!=undefined){
                      buildindent(activeexpl,cmps,lista,0,campo)
                      await redrawTable(el,lista);
                      //StdDragDrop('dragmespec','dropmespec',checkDrgDrpDoc,dropDrgDrpDoc);
                   //   el=$(table).find('tbody');
                   }else{
                       console.log('PJ ACTIVEEXPLODED ASSENTE:'+campoactive);
                   }
                  }else{
                      console.log('PJ PADRE ASSENTE:'+hid);
                  }
                 // applyDropdownPrev(el);
                 if(par_tipo != 'FASCIASCONTI'){
                  $(table).find('tr').addClass('dropmespec');
                  StdDragDrop('dragmespec','dropmespec',checkDrgDrpDoc,dropDrgDrpDoc);
                 }
          }  
  
  
  var deltaindV=26;
  
  function buildindent(activeexpl,cmps,lista,indent,campo){
      if (cmps==undefined){
          return;
      }
      if (indent==undefined){
              indent=0;
      }
  
      
      
      if (cmps!=undefined){
              for (var i=0;i<cmps.length;i++){
                      var comp=cmps[i];
                      var hid=comp.HID;
                      var tipo=comp.TIPO;
                      console.log('PJ INDENT DOCS:'+comp.NOMEFILE+":"+campo+":"+activeexpl[hid]+":"+JSON.stringify(activeexpl)+":"+JSON.stringify(comp));
                      var image=comp.IMAGE;
                      if (image==undefined){
                          image=getVisteIconByHid(hid);
                          if (image!=undefined){
                              comp.IMAGE=image;
                              }
                      }
                      comp.INDENT=indent;
                      var nfile=0;
                       var ndir=0;
                       var docs=comp[campo];
                       if (comp.TIPOCAMPO=='DIRECTORY'){
                       if (docs!=undefined){
                          for (var k=0;k<docs.length;k++){
                              var doc=docs[k];
                              Risorsa.registerElement(doc);
                              if (doc.TIPOCAMPO=='DIRECTORY'){
                                  ndir=ndir+1;
  
                              }else{
                                  nfile=nfile+1;
                              }
                              }
                          }
                      comp.SIZE=''+nfile+" file e "+ndir+" directory";
                      comp.callbackUpdate=callbackDocumentiDir;
                      comp.callbackUpload=callbackUploadDocumentiDir;
                       }
                       
                      lista.push(comp);
                      if (activeexpl[hid]!=undefined){
                              var newindent=indent+deltaindV;
                              buildindent(activeexpl,comp[campo],lista,newindent,campo);
                              
                      }
              }
      }
  }
  
  async function checkDrgDrpDoc(drg,drp){
  console.log('CHECK DRG DRP:'+drg+":"+drp);
  if (drg!=undefined && drp!=undefined){
      if (drp==drg){
          return(false);
      }
      
      var drgogg=Risorsa.get(drg);
      var drpogg=Risorsa.get(drp);
      if (drgogg!=undefined && drpogg!=undefined){
          if (drpogg.TIPOCAMPO=='FILE'){
              return(false);
          }
          var parenthid=drgogg.PARENTHID;
      
          if (parenthid==drpogg.HID && drgogg.TIPOCAMPO=='FILE'){
              return(false);
          }
          return(true);
      }
  }
  }
  
  async function dropDrgDrpDoc(el,drg,drp,ctrl){
      console.log('DROP DRG DRP:'+drg+":"+drp+":"+ctrl);
      console.log('CHECK DRG DRP:'+drg+":"+drp);
  
      if (drg!=undefined && drp!=undefined){
          if (drp==drg){
              return(false);
          }
          var cont=$(el).closest('[tiposez="docs-container"]');    
          var tr=$(el).closest('table').find('thead tr');
          var campoactive=$(tr).attr('activeexploded');
          var campolista=$(tr).attr('campolista');
          var campo=$(tr).attr('campo');
  
          var drgogg=Risorsa.get(drg);
          var drpogg=Risorsa.get(drp);
          if (drgogg!=undefined && drpogg!=undefined){
              if (drpogg.TIPOCAMPO=='FILE'){
                  return(false);
              }
              var parenthid=drgogg.PARENTHID;
              var parent=Risorsa.get(parenthid);
              var par=Risorsa.get(drgogg.PHID);
              if (par!=undefined){
              if (parenthid==drpogg.HID && drgogg.TIPOCAMPO=='FILE'){
                  return(false);
              }
              if (parenthid==drpogg.HID){
                  
                  if (parent!=undefined){
                      var docs=parent[campolista];
                      var docsold=par[campolista];
                      if (docs!=undefined && docsold!=undefined){
  
                          for (var j=0;j<docsold.length;j++){
                              var doc=docsold[j];
                              if (doc.HID==drg){
                                  docsold.splice(j,1);
                                  docs.push(drgogg);
                                  drgogg.PHID=parent.HID;
                                  StdRebuildTableComponents(el);
                                  applyFormRecord(cont,parent); 
                                  return;
                              }
                          }
                      }
                  }
                  return;
              }
              var docs=drpogg[campo];
              var docsold=par[campo];
              if (docs!=undefined && docsold!=undefined){
                  console.log('docs:'+docs.length+" docsold:"+docsold.length);
                  for (var j=0;j<docsold.length;j++){
                      var doc=docsold[j];
                      if (doc.HID==drg){
                          docsold.splice(j,1);
                          docs.push(drgogg);
                          drgogg.PHID=drpogg.HID;
                          console.log('docs:'+docs.length+" docsold:"+docsold.length);
                          StdRebuildTableComponents(el);
                          applyFormRecord(cont,parent); 
                          return;
                      }
                  }
              }
  
  
              }
  
              return(true);
          }
      }
      }
  
  function StdDragDrop(classedrag, classedrop,checkFunc,dropFunc){
      var dragme=$('.'+classedrag);
      if (dragme.length>0){
          //dragme.jqxDragDrop();
          dragme.draggable({
              cursor: "crosshair",
               helper: function (){
                   console.log('Ritorno il padre del padre:'+this);
                  return($(this).parent().parent().parent().clone());
              },
               distance: 20
          });
      }
      var dropme=$('.'+classedrop);
      if (dropme.length>0){
          //dragme.jqxDragDrop();
          dropme.droppable({
              accept: function(el){
                  var drg=$(el).attr('hid');
                  var drp=$(this).attr('hid');
                  
                  var check=false;
                  if (checkFunc!=undefined){
                      check=checkFunc(drg,drp);
                  }
                  //console.log('droppable:'+drg+' in '+drp+':'+check);
                  //console.log('droppable:'+el+' in '+this);
                  if (check!=undefined  && (check.length>2||check))
                      {return(true);}
                  return(false);
              },
              over:function(event,ui){
                      var copy=false;
                       if (event.ctrlKey){
                          // console.log('Ctrl down');
                           copy=true;
                       }
                      var msg='Oggetto '+ui.helper.attr('hid')+' da spostare in '+$(this).attr('hid');
                      var azione='Spostamento di ';
                      var target=' all\'interno di ';
                      if (copy){
                          msg='Oggetto '+ui.helper.attr('hid')+' da copiare in '+$(this).attr('hid');
                          azione='Creazione di copia di ';
                          }
                      var drg=ui.helper.attr('hid');
                      var drp=$(this).attr('hid');
                      var check=false;
                  //	var check=checkAzione(drg,drp);
                      if (checkFunc!=undefined){
                          check=checkFunc(drg,drp);
                      }
                      if (check){
  
                      }
  
              },
              drop:function(event,ui){
  
                      var copy=false;
                       if (event.ctrlKey){
                          // console.log('Ctrl down');
                           copy=true;
                       }
                       
                      
                      var drg=ui.helper.attr('hid');
                      var drp=$(this).attr('hid');
                      //var check=checkAzione(drg,drp);
                      var actionJackson='';
                      if (dropFunc!=undefined){
                          dropFunc(this,drg,drp,copy);
                      } 
                      //removeAllMsg();
  /* 
                      console.log('ActionJackson:'+actionJackson);
                      switch (actionJackson){
                          case 'MOVEIN':
                              console.log('Moving:'+drg+" --->"+drp);
                              moveElemento(drg,drp);
                              break;
  
                          case 'MOVEATSAME':
                              console.log('Moving:'+drg+" --->"+drp);
                              moveElementoAt(drg,drp);
                              break;	
  
                          case 'COPYIN':
                              console.log('Moving:'+drg+" --->"+drp);
                              copyElemento(drg,drp);
                              break;	
                              
                          case 'COPYATSAME':
                              console.log('Moving:'+drg+" --->"+drp);
                              copyElementoAt(drg,drp);
                              break;		
                      }
                       */
                      
              },
              
               classes: {
                      'ui-droppable-hover':'highlight'
                  }
          });
      }
  }
  
  
  function getVisteIconByHid(hid){
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          if (ogg.IMAGE==undefined){
              ogg.IMAGE="/hopperix/Icone/Documento.svg";
          }
      }
      return(undefined);
  }
  
  
  async function addDir(el){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          var docs=ogg.DOCUMENTI;
          if (docs==undefined){
              docs=[];
              ogg.DOCUMENTI=docs;
          }
          var sezogg=new Risorsa('SEZIONEDOCUMENTI');
          sezogg.PHID=ogg.HID;
          sezogg.PARENT=ogg.TIPO;
          //sezogg.ACTIVEEXPLODED=campoactexpl;
          sezogg.TIPOCAMPO='DIRECTORY';
          sezogg.SEZIONE='CLICK PER MODIFICARE';
          sezogg.PARENTHID=ogg.PARENTHID;
          sezogg.NOMEFILE='CLICK PER MODIFICARE';
        //  sezogg.callbackUpdate=callbackDocumentiDir;
          sezogg.IMAGE="/hopperix/Icone/Download Documento.svg";
          sezogg.DOCUMENTI=[];
          docs.push(sezogg);
          sezogg.callbackUpdate=callbackDocumentiDir;
          sezogg.callbackUpload=callbackUploadDocumentiDir;
          var parent=Risorsa.get(ogg.PARENTHID);
          if (parent!=undefined){
          var cont=$(el).closest('[tiposez="docs-container"]');
          applyFormRecord(cont,parent);
          await Risorsa.asave(parent);
          }
  
      }
  }
  
  async function hopconfirm(titolo,testo,btnok,btnko,icon,quanto){
      if (btnok==undefined){
          btnok='SI';
      }
      if (btnko==undefined){
          btnko='NO';
      }
      if (titolo==undefined){
          titolo="";
      }
      if (icon==undefined){
          icon='';
      }
      if (titolo==undefined || titolo.length<1){
          titolo='Pannello conferma dati';
      }
      $('#hopconfirm').attr('title',titolo);
      $('#hopconfirm').find('[tipo="testo"]').empty();
      $('#hopconfirm').find('[tipo="testo"]').append(testo);
      //$('#hopconfirm').find('[tipo="testo"]').html(testo);
      if (icon==undefined || icon.length<1){
          icon="mdi mdi-comment-question-outline";
      }
      $('#hopconfirm').find('[tipo="icon"]').removeClass();
      $('#hopconfirm').find('[tipo="icon"]').addClass(icon);
      
      var ret=undefined;
      var bottoni={};
      bottoni[btnok]=function() {
          ret=true;
        $( this ).dialog( "close" );
      };
      bottoni[btnko]= function() {
          ret=false;
        $( this ).dialog( "close" );
      };
      if (btnok.length<1){
          delete bottoni[btnok];
      }
      
      $( "#hopconfirm" ).dialog({
          title:titolo,
          resizable: false,
          height: "auto",
          width: "auto",
          maxWidth:"90%",
          modal: true,
          buttons: bottoni/* {
            btnok: function() {
                ret=true;
              $( this ).dialog( "close" );
            },
            btnko: function() {
                ret=false;
              $( this ).dialog( "close" );
            }
          } */
        });
       
        var t=0;
        var tmo=120000;
        if (quanto!=undefined && quanto>0){
            tmo=quanto;
        }
        while (ret==undefined && t<tmo){
            await sleeping(400);
            if (t>1000 && !$('#hopconfirm').is(':visible') && ret==undefined ){
                return(false);
            }
            t=t+400;
        }
      //  console.log('RETURN:'+ret);
        if (t>=120000){
            ret=false;
            $('#hopconfirm').dialog("close");
  
        }
        
        return(ret);
  
        
  }
  
  
  
  async function hopnotify(titolo,testo,btncancel,icon,quanto){
      if (btncancel==undefined||btncancel.length<1){
          btncancel='Chiudi';
      }
      if (titolo==undefined){
          titolo="";
      }
      if (icon==undefined){
          icon='';
      }
      if (titolo==undefined || titolo.length<1){
          titolo='Avviso';
      }
      $('#hopconfirm').attr('title',titolo);
      $('#hopconfirm').find('[tipo="testo"]').html(testo);
      if (icon==undefined  || icon.length<1){
          icon="mdi mdi-message-alert-outline";
      }
      
      $('#hopconfirm').find('[tipo="icon"]').removeClass();
      $('#hopconfirm').find('[tipo="icon"]').addClass(icon);
      var bottoni={};
      bottoni[btncancel]= function() {
          ret=false;
        $( this ).dialog( "close" );
      };
      var ret=undefined;
      $( "#hopconfirm" ).dialog({
          title:titolo,
          resizable: false,
          height: "auto",
          width: "auto",
          maxWidth:"90%",
          modal: true,
          buttons: bottoni /* {
           
            btncancel: function() {
                ret=false;
              $( this ).dialog( "close" );
            }
          } */
        });
        
        var t=0;
        var tmo=120000;
        if (quanto!=undefined && quanto>0){
          tmo=quanto;
      }
        while (ret==undefined && t<tmo){
            await sleeping(400);
            if (t>1000 && !$('#hopconfirm').is(':visible')){
                return(false);
            }
            t=t+400;
        }
        if (t>=120000){
            ret=false;
            $('#hopconfirm').dialog("close");
  
        }
        return(ret);
  
        
  }
  
  
  
  
  
  
  
  /*
  
  function buildindent(comps,indent,campo){
      if (comps==undefined){
          return;
      }
  for (var j=0;j<comps.length;j++){
      var rec=comps[j];
      rec.INDENT=indent;
      var nindent=indent+1;
      buildindent(rec[campo],nindent,campo);
      }
  }*/
  
  function meseprec(el){
      var hid = $(el).attr('hid');
      var cal = Risorsa.get(hid);
  
      if(cal != undefined){
          var dtc = cal.DATACORRENTE;
          dtc.setMonth(dtc.getMonth() - 1);
          var cont = $(el).closest('[campocalendar]');
          // $(cont).empty();
          applyFormRecord($(cont).parent(), cal);
      } else {
          console.log("CALENDARIO NON TROVATO: " + hid);
      }
  }
  
  function mesesucc(el){
      var hid = $(el).attr('hid');
      var cal = Risorsa.get(hid);
  
      if(cal != undefined){
          var dtc = cal.DATACORRENTE;
          dtc.setMonth(dtc.getMonth() + 1);
          var cont = $(el).closest('[campocalendar]');
          applyFormRecord($(cont).parent(), cal);
      } else {
          console.log("CALENDARIO NON TROVATO: " + hid);
      }
  }
  
  
  function getValore(ogg,campo){
      var v=campo.split('.',-1);
      if (v.length>1){
      var refogg=ogg[v[0]];
      for (var k=1;k<v.length;k++){
          if (refogg!=undefined){
              refogg=refogg[v[k]];
              }
      }
     return(refogg);
  }else{
      if (ogg[campo]!=undefined){
  
          return(ogg[campo]);
  
      }
  }
  }
  
  function setValore(ogg, campo, valore){
      var v=campo.split('.',-1);
      if (v.length>1){
      var refogg=ogg[v[0]];
      if (refogg==undefined){
          refogg={};
          ogg[v[0]]=refogg;
      }
      for (var k=1;k<v.length-1;k++){
          if (refogg!=undefined){
              refogg=refogg[v[k]];
              }else{
              refogg={};
              refogg[v[k]]=refogg;    
              }
           }
           refogg[v[v.length-1]]=valore;       
      }else{
          ogg[campo]=valore;
      }
     
  }
  
  function addSezioneDocumenti(el){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          // var padre=$(el).parent().parent();
          var padre = $(el).closest('[tiposez="docs-container"]');
          var sect=$(padre).find('[tipo="doc-container"]');
          var campo=$(sect).attr('campodoc');
          if (campo==undefined){
              // sect=$(padre).find('[tipo="doclist-container"]');
              sect=$(padre).find('[tipo="doclist-container"]');
              console.log("addSezioneDocumenti... padre: " + padre.length + " ; sect: " + sect.length);
              campo=$(sect).attr('campodoclist');
          }
          if (campo!=undefined){
              var docsezs=ogg[campo];
              if (docsezs!=undefined){
                  var sezogg=new Risorsa('SEZIONEDOCUMENTI');
                  sezogg.PHID=ogg.HID;
                  sezogg.PARENT=ogg.TIPO;
                  sezogg.SEZIONE="CLICK PER MODIFICA";
                  sezogg.CAMPOSEZ=campo;
                  sezogg.DOCUMENTI=[];
                  docsezs.push(sezogg);
                  applyFormRecord(padre,ogg);
              }
          }
      }else{
          console.log('ATTENZIONE - addSezioneDocumenti : oggetto non trovato '+hid);
      }
  }
  
  async function removeDocInList(el){
      var hid=$(el).attr('hid');
      var doc=Risorsa.get(hid);
      if (doc!=undefined){
          var sezogg=Risorsa.get(doc.PHID);
          if (sezogg!=undefined){
              var ogg=Risorsa.get(sezogg.PHID);
              if (ogg!=undefined){
                  var docs=sezogg.DOCUMENTI;
                  if (docs!=undefined){
                      for (var i=0;i<docs.length;i++){
                          var dc=docs[i];
                          if (hid==dc.HID){
                              docs.splice(i,1);
                              Risorsa.save(ogg);
                              var tg=$(el).closest('[tipo="doc-container"]').parent();
                              applyFormRecord(tg,ogg);
                              return;
                          }
                      }
                  }
              }else{
                  console.log('OGGETTO PADRE '+sezogg.PHID+' not defined ');
              }
          }else{
              console.log('SEZ '+doc.PHID+' not defined ');
          }
      }else{
          console.log('DOC '+hid+' not defined ');
  
      }
  
  } 
  
  function changeNomeSezioneDocumenti(el){
  var hid=$(el).attr('hid');
  var sezogg=Risorsa.get(hid);
  if (sezogg!=undefined){
      sezogg.SEZIONE=$(el).val();
      var phid=sezogg.PHID;
      var ogg=Risorsa.get(phid);
      if (ogg!=undefined){
          Risorsa.save(ogg);
      }
      $(el).parent().find('span').text($(el).val()).css('display','');
      $(el).css('display','none');
      }
  }
  
  var callbackUploadSezioneDocumenti=function(sezogg,target,docfs,lastupload){
  var phid=sezogg.PHID;
  var ogg=Risorsa.get(phid);
  if (ogg!=undefined){
      sezogg.DOCUMENTI.push(docfs);
      docfs.SEZHID=sezogg.HID;
      docfs.PARENTHID=phid;
      docfs.PHID=sezogg.HID;
      if (docfs.SIZE==undefined){
          setDocSize(docfs);
      }
      Risorsa.save(ogg);
      //var tg=$(target).closest('[tipo="doc-container"]').parent();
      var filter='[tipo="doc-container"][hid="'+phid+'"]';
      console.log('FILTER:'+filter);
      var tg=$(filter).parent();
      applyFormRecord(tg,ogg);
      /*if (lastupload!=undefined && lastupload){
          applyFormRecord(tg,ogg);
      }*/
  
      }else{
          console.log('Very bad in:'+phid+':'+sezogg.HID);
      }
  }
  
  
  
  function creaSezioneDocumenti(sezogg){
      var sez=sezogg.SEZIONE;
      var doctype=sezogg.PARENT;
      var docs=sezogg.DOCUMENTI;
      if (docs==undefined){
          docs=[];
          sezogg.DOCUMENTI=docs;
      }
      sezogg.callbackUpload=callbackUploadSezioneDocumenti;
      var sezh=$('#SezioneDocumenti').clone();
          
      $(sezh).removeAttr('id');
      $(sezh).find('[bottone]').attr('hid',sezogg.HID);
      var sect=$(sezh).find('[sezione="NOMESEZIONE"]');
      var sezcont=$(sezh).find('[tipo="sez-container"]');
      $(sect).attr('sezione',sez);
      $(sect).find('span').text(sez);
      $(sect).find('input').val(sez);
      $(sect).find('input').attr('hid',sezogg.HID);
      var NOMESEZIONE=doctype+"_"+sez;
      $(sezh).find('[tipo="sez-container"]').attr('ondrop',"fileDropGo(event,this,'"+NOMESEZIONE+"');");
      $(sezh).find('[tipo="CARICAFILE"]').attr('onclick',"try{console.log('load file on :'+$(this).attr('hid'));loadDocumentStd(this,'"+NOMESEZIONE+"');} catch(msg){alert(msg);}");
  
      for (var i=0;i<docs.length;i++){
          var doc=docs[i];
          doc.PHID=sezogg.HID;
          if (doc.SIZE==undefined||doc.SIZE.startsWith('Na')){
              delete doc.SIZE;
              setDocSize(doc);
          }
          Risorsa.registerElement(doc);
          var docel=$('#docelement').clone();
          $(docel).removeAttr('id');
          $(docel).find('[tipo="NOMEFILE"] a').text(doc.NOMEFILE);
          var href=server+"/ecs/?Service=Document&Action=getdoc&hid="+doc.HID+"&tipodoc="+"DOC";
          $(docel).find('[tipo="NOMEFILE"] a').attr('href',href);
          $(docel).find('[tipo="SIZE"]').text(doc.SIZE);
          $(docel).find('[bottone]').attr('hid',doc.HID);
          $(sezcont).append(docel);
      }
      return(sezh);
  }
  
  function setDocSize(ndoc){
      if (ndoc==undefined){
          return;
          }
          if (ndoc.SIZE==undefined || ndoc.length<2){
          ndoc.SIZE='';
          var szlab='SIZE_'+ndoc.TIPO_DOCUMENTO;
          //console.log("SZLAB:"+szlab);
    
          
          
              
          ndoc.SIZE=ndoc[szlab];
          if (ndoc.SIZE!=undefined){
              ndoc.SIZE=Math.round(ndoc.SIZE*100/1024)/100;
              ndoc.SIZE=''+ndoc.SIZE+' kbyte';
              }
          //console.log('INTO:'+ndoc.SIZE);
          
          } 
      }
  
  function getDominioObject(ogg,dominio){
      var dom=undefined;
      if (dominio!=undefined){
          dom=ogg[dominio];
          var lista2=[];
          if (dom==undefined) {
              var s=dominio.split(".",-1);
                      var rec=window;
                      var go=true;
                      for (var j=0;j<s.length;j++){
                          if (rec!=undefined){
                              rec=rec[s[j]];
                              }else{
                                  go=false;
                              }
                      }   
                      if (go){
                          dom=rec;
                          }
          }
         
      }
     return(dom); 
  }
  
  function displayMap(el){
      var input=$(el).parent().find('input[tipo=\'geo\']');
      var geohid=$(input).attr('geo');
      if (geohid==undefined){
          StdSearchIndirizzo(input,true);
          return;
      }
      var mappa=$('#'+geohid);
      if ($(mappa).is(":visible")){
          $('#'+geohid).css('display','none');
      }else{
      $('#'+geohid).css('display','');
      }
  }
  
  function createMapPanel(el){
     
      var panel=$('#search_generic').clone();
      var geohid='PANEL'+generateID();
      $(panel).attr('id',geohid);
           
      
      var x=getDimensions(el);
      var dimmc=getDimensions(panel);
     
      var ypos=x.y1-dimmc.y2+dimmc.y1-30;
      if (ypos<0){
          ypos=10;
      }
     $(panel).css({'background-color':'#ffffff','position':'absolute','left': x.x1+30, 'top': ypos, 'display': 'block'});
      $(panel).resizable();
      var cont=$(panel).find('[tipo=\'container\']');
     
      $(panel).draggable({
          handle: '.section-header, .modal-footer',
      });
      $(panel).find('button.aggiornaIndirizzo').css('display','none');
      addPanel($(panel),panel); 
  
      $(panel).find('[bottone=\'close\']').attr('onclick','$(this).closest(\'.std_search_generic\').css(\'display\',\'none\');');
     // $(panel).css('display','none');
      /*var hid=$(element).attr('hid');
      mc.find('.aggiornaIndirizzo').attr('hid',hid);
      mc.find('.aggiornaIndirizzo').data('element',element);
      mc.find('.aggiornaIndirizzo').data('campo',cosaeditare);
      mc.find('.annullaIndirizzo').attr('hid',hid);
      mc.find('.annullaIndirizzo').data('element',element);*/
     return(panel);
     // StdSearchIndirizzo(input,cont);
  }
  
  function StdModificaListaInd(el){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          var campo=$(el).attr('campoass');
          var val=$(el).val();
          var loc=LOCATIONS[val];
          if (loc!=undefined){
              ogg[campo+"_ID"]=val;
              ogg[campo]=loc;
              if (typeof ogg.callbackUpdate === 'function'){
                  //     console.log('Richiamo callbackUpdate');
                      ogg.callbackUpdate(hid,campo,loc,el);
                  }
          }
      }
  }
  
  function StdModificaListaInd2(el){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          var campo=$(el).attr('campoass');
          var val=$(el).val();
          console.log('VALORE:'+val);
          var loc=LOCATIONS2[val];
          if (loc!=undefined){
              ogg[campo+"_ID"]=loc.LUOGO_ID;
              ogg[campo]=val;
              if (typeof ogg.callbackUpdate === 'function'){
                  //     console.log('Richiamo callbackUpdate');
                      ogg.callbackUpdate(hid,campo,loc,el);
                  }
          }
      }
  }
  
  function StdSearchIndirizzo(el,mostramappa){
  
    
      if ($(el).attr('geo')==undefined){
  
          var panel=createMapPanel(el);
          var geohid=$(panel).attr('id');
          var mappa=$(panel).find('[tipo=\'container\']');
          $(panel).css('display','none');
          var options={ map: mappa,
              location: $(el).val(),
              markerOptions: {
                    draggable: false
                }, 
                detailScope:$(el).parent(),
                mapOptions:{scrollwheel:true}
            };
         // $(el).parent().find('.fa-search').css('display','none');
          console.log('Inizializzo  campo indirizzo');
      
          var geoc=$(el).geocomplete(options)
           .bind("geocode:multiple", function(event, results){
          
           });
           
           $(el).attr('geo',geohid);
  
           if (mostramappa){
               displayMap(el);
           }else{
            //   $('#'+geohid).css('display','none');
           }
          
             $(el).geocomplete().bind("geocode:result", function(event, result){
                 var mc=this;
                 console.log("THIS.ELELEMENT:"+mc+" mc.length:"+mc.length+" HID:"+$(this).attr('hid'));
                 //$(mc).find('.aggiornaIndirizzo').data('indirizzo',result);
                 var hid=$(this).attr('hid');
                 var ogg=Risorsa.get(hid);
                 console.log("Risultato:"+JSON.stringify(result));
                 if (ogg!=undefined){
                      ogg.NCIVICO = "";
                      ogg.VIA = "";
                      ogg.CITTA = "";
                      ogg.PROVINCIA = "";
                      ogg.NAZIONE = "";
                      ogg.CAP = "";
                      delete ogg.LUOGO_ID ;
  
                     $(this).val(result.formatted_address);
                     var campo=$(this).attr('campoass');
                     
                     var v=campo+"_ID";
                     var prev=ogg[v];
                     if (prev==undefined || prev!=result.place_id){
                          ogg[v]=result.place_id;
                          ogg[campo]=result.formatted_address;
                          $(this).val(result.formatted_address);
  
                          for(var i=0; i<result.address_components.length; i++){
                              var rec = result.address_components[i];
                              var type = rec.types[0];
                              if(type != undefined){
                                  switch (type) {
                                      case 'street_number':
                                          ogg.NCIVICO = rec.short_name;
                                          break;
      
                                      case 'route':
                                          ogg.VIA = rec.short_name;
                                          break;
      
                                      case 'administrative_area_level_3':
                                          ogg.CITTA = rec.short_name;
                                          break;
      
                                      case 'administrative_area_level_2':
                                          ogg.PROVINCIA = rec.short_name;
                                          break;
      
                                      case 'country':
                                          ogg.NAZIONE = rec.long_name;
                                          break;
      
                                      case 'postal_code':
                                          ogg.CAP = rec.short_name;
                                          break;
                                  
                                      default:
                                          break;
                                  }
                              }
                              /**
                               * Pj 2019/12/05
                               * Aggiunta dettagli indirizzo
                               */
                              var lid=result.place_id;
                              var indir=result.formatted_address;
                              var geo=result.geometry;
                              if (geo!=undefined && geo.location!=undefined){
                                  ogg.LUOGO_ID=lid;
                                  ogg.LUOGO=indir;
                                  ogg.LAT=geo.location.lat();
                                  ogg.LON=geo.location.lng();
                              }
  
                         }
      
                         var target = $(mc).closest('[agg-ind]');
                         console.log("EL: " + el.length);
                      //    var target = $(el).parent().parent();
                         applyFormRecord(target, ogg);
                 
                       console.log('Nuovo valore Oggetto:'+JSON.stringify(ogg));
                      if (typeof ogg.callbackUpdate === 'function'){
                          //     console.log('Richiamo callbackUpdate');
                              ogg.callbackUpdate(hid,campo,result,el);
                          }
  
                      }
                  }
   });	
               $(el).geocomplete().bind("geocode:dragged", function(event, result){
    // console.log(result);
   });
   $(el).geocomplete().bind("geocode:click", function(event, result){
     //console.log(result);
   //  console.log('Eseguito click sulla lista di indirizzi');
   //  $geocomplete.trigger("geocode");
   });
         /*$(templ).find('i').click(function(){
           $geocomplete.trigger("geocode");
         });*/
      }else{
    if ( mappa && mappa!=undefined ){
            //  var geo= $(el).geocomplete('map',mappa);
          /*  var elclone=$(el).clone();
            $(el).parent().append(elclone);
           $(el).remove();
           el=elclone;
           StdSearchIndirizzo(el,mappa);*/
          }
      }
  }
  
  
  function StdSearchMappaIndirizzo(target,numparent){
      var pos=$(target);
      if (numparent!=undefined && isNumber(numparent)){
          for (var j=0;j<numparent;j++){
              pos=$(pos).parent();
          }
      }else{
          pos=$(target).parent();
      }
      var mc=$(pos).find('[tipo=\'MAPPA\']');
      var templ=$(target).parent();
          console.log('MAPPA:'+mc.length);
          var $geocomplete = $(target),
          // $multiple = td.find('ul');
          $multiple = $('#multiple');
          $geocomplete
           .geocomplete({ map: mc,
           location: $(target).val(),
           markerOptions: {
                 draggable: false
             }, 
             mapOptions:{scrollwheel:true}
         })
           .bind("geocode:multiple", function(event, results){
          
           });
          
             $geocomplete.geocomplete().bind("geocode:result", function(event, result){
                 var mc=this;
                 console.log("THIS.ELELEMENT:"+mc+" mc.length:"+mc.length+" HID:"+$(this).attr('hid'));
                 //$(mc).find('.aggiornaIndirizzo').data('indirizzo',result);
                 var hid=$(this).attr('hid');
                 var ogg=Risorsa.get(hid);
                 console.log("Risultato:"+JSON.stringify(result));
                 if (ogg!=undefined){
                      ogg.NCIVICO = "";
                      ogg.VIA = "";
                      ogg.CITTA = "";
                      ogg.PROVINCIA = "";
                      ogg.NAZIONE = "";
                      ogg.CAP = "";
  
                     $(this).val(result.formatted_address);
                     var campo=$(this).attr('campoass');
                     ogg[campo]=result.formatted_address;
                     var v=campo+"_ID";
                     ogg[v]=result.place_id;
                     $(this).val(result.formatted_address);
                     /**
                               * Pj 2019/12/05
                               * Aggiunta dettagli indirizzo
                               */
                              var lid=result.place_id;
                              var indir=result.formatted_address;
                              var geo=result.geometry;
                              if (geo!=undefined && geo.location!=undefined){
                                  ogg.LUOGO_ID=lid;
                                  ogg.LUOGO=indir;
                                  ogg.LAT=geo.location.lat();
                                  ogg.LON=geo.location.lng();
                              }
  
                     /*if(result.address_components[1] != undefined){
                         ogg.VIA = result.address_components[1].long_name;
                     } else {
                         ogg.VIA = '';
                     }
                     
                     if(result.address_components[0] != undefined){
                         ogg.NCIVICO = result.address_components[0].long_name;
                     } else {
                         ogg.NCIVICO = '';
                     }
  
                     if(result.address_components[7] != undefined){
                          ogg.CAP = result.address_components[7].long_name;
                     } else {
                          ogg.CAP = '';
                     }
  
                     if(result.address_components[3] != undefined){
                          ogg.CITTA = result.address_components[3].long_name;
                     } else {
                          ogg.CITTA = '';
                     }
  
                     if(result.address_components[4] != undefined){
                          ogg.PROVINCIA = result.address_components[4].short_name;
                     } else {
                          ogg.PROVINCIA = '';
                     }
                     
                     if(result.address_components[6] != undefined){
                          ogg.NAZIONE = result.address_components[6].long_name;
                     } else {
                          ogg.NAZIONE = '';
                     }*/
  
                     for(var i=0; i<result.address_components.length; i++){
                          var rec = result.address_components[i];
                          var type = rec.types[0];
                          if(type != undefined){
                              switch (type) {
                                  case 'street_number':
                                      ogg.NCIVICO = rec.short_name;
                                      break;
  
                                  case 'route':
                                      ogg.VIA = rec.short_name;
                                      break;
  
                                  case 'administrative_area_level_3':
                                      ogg.CITTA = rec.short_name;
                                      break;
  
                                  case 'administrative_area_level_2':
                                      ogg.PROVINCIA = rec.short_name;
                                      break;
  
                                  case 'country':
                                      ogg.NAZIONE = rec.long_name;
                                      break;
  
                                  case 'postal_code':
                                      ogg.CAP = rec.short_name;
                                      break;
                              
                                  default:
                                      break;
                              }
                          }
                           /**
                               * Pj 2019/12/05
                               * Aggiunta dettagli indirizzo
                               */
                              var lid=result.place_id;
                              var indir=result.formatted_address;
                              var geo=result.geometry;
                              if (geo!=undefined && geo.location!=undefined){
                                  ogg.LUOGO_ID=lid;
                                  ogg.LUOGO=indir;
                                  ogg.LAT=geo.location.lat();
                                  ogg.LON=geo.location.lng();
                              }
                     }
  
                      var target = $(mc).closest('[agg-ind]');
                   //  applyFormRecord(target, ogg);
                  //  var target=$(mc).parent().parent();
                     applyFormRecord(target, ogg);
                 }
                 console.log('Nuovo valore Oggetto:'+JSON.stringify(ogg));
                 if (typeof ogg.callbackUpdate === 'function'){
                  //     console.log('Richiamo callbackUpdate');
                      ogg.callbackUpdate(hid,campo,result,mc);
                  }
  
   
   });	
               $geocomplete.geocomplete().bind("geocode:dragged", function(event, result){
    // console.log(result);
   });
   $geocomplete.geocomplete().bind("geocode:click", function(event, result){
     //console.log(result);
   });
         $(templ).find('i').click(function(){
           $geocomplete.trigger("geocode");
         });
  
  }
  
  function renderActions(tipo,oggetto,path,vista,actions){
      
      if (actions==undefined){
          actions='ACTIONS';
      }
      var idx=path+';'+tipo+';'+actions;
      var azioni=vista[idx];
      if (azioni==undefined){
          idx=tipo+';'+actions;
          azioni=vista[idx];
      }
      if (azioni==undefined){
          idx=actions;
          azioni=vista[idx];
      }
      if (azioni==undefined){
          console.log('NO ACTIONS FOR:'+path+"--->"+tipo+";"+actions+': '+JSON.stringify(vista));
      }
   
      if (azioni!=undefined){
          var nspan=document.createElement('span');
          for (var j=0;j<azioni.length;j++){
              var azione=azioni[j];
              var icon=azione.ICON;
              var cmd=azione.ACTION;
              var isi=azione.ISI;
  
              if (cmd!=undefined){
                  var img=document.createElement('img');
                  if (isi!=undefined){
                      img=document.createElement('i');
                      $(img).addClass(src);
                      $(img).css({'margin-top':'-3px','max-width':'80%','max-height':'80%'});
                  }
                  $(img).attr('src',icon);
                  $(img).attr('width','20px');
                  $(img).attr('onclick',cmd+'(this);');
                  console.log('AZIONI:'+cmd+' ON '+JSON.stringify(oggetto));
                  $(img).attr('hid',oggetto.HID);
     
          if (oggetto.PHID!=undefined){
                  $(img).attr('phid',oggetto.PHID);
              }
              if (oggetto.PFIELD!=undefined){
                  $(img).attr('pfield',oggetto.PFIELD);
              }   
              if (oggetto.PARRAY!=undefined){
                  $(img).attr('parray',oggetto.PARRAY);
              }
                  $(nspan).append(img);
              }
          }
          return(nspan);
      }
      return(undefined);
  }
  
  
  function renderTd(riga,oggetto,vista,classeAggiuntiva){
      var table=$('#StdTable');
      var lista=vista.LISTACAMPI;
      //console.log("DIMENSIONE LISTA:"+lista.length);
      var tipo=oggetto.TIPO;
      var tipocampo=tipo;
      if (oggetto.TIPOCAMPO!=undefined && oggetto.TIPOCAMPO.length>0){
          tipocampo=oggetto.TIPOCAMPO;
      }
      var hid=oggetto.HID;
      var phid=oggetto.PHID;
      $(riga).addClass('tipo_'+oggetto.TIPO);
      for (var i=0;i<lista.length;i++){
          
          var rec=lista[i];
          var pannello = rec.PANNELLO;
          var disp=rec.DISPLAY;
          /**Selectize con HID/DESCRIZIONE */
          var hop=rec.HOP;
          if (disp=='ACTIONS' && pannello==undefined){
              pannello='SI';
          }
          if ((pannello == 'SI')){
              console.log("PANNELLO ---> SI");
              var display=rec.DISPLAY;
              var qry='td[tipo=\''+display+'\']';
              var td=$(table).find(qry).clone();
              if (td.length==0){
                  console.log("WARNING: tipo TD:"+display+" NON TROVATO!");
              }
              $(td).addClass('td-actions');
              $(td).attr('data-label','Azioni');
              var num_actions = 0;
              var sp=document.createElement('nobr');
              $(sp).css('align','center');
              $(td).css('align','center');
              $(td).css('white-space','nowrap');
              var idpa="IDPA"+generateID();
              var toadd='<div style="min-width:20px; min-height:20px;"  ><span class="tabazioni" onclick="showPopupNuvola(event,this, \'click\');"><i class="ho hop-icircles"></i></span>'+
              '<div class="leaflet-popup  leaflet-zoom-animated pannelloaction" id="'+idpa+'" style="display: none; word-wrap: break-word; width: auto; z-index: 100;" >' +
                                  '<div class="leaflet-popup-content-wrapper">' +
                                  '<div tipo="close" style="display:none;background-color:var(--hop);margin:-2px; border-radius:8px 8px 0 0;padding:8px;text-align:center;"><span style="float:right;margin-top:6px;margin-right:6px;color:white;" tipo="close" ><i class="fa fa-times" onclick="closePopupNuvola(this);"></span></i>'+
                                  '<span style="color:white;font-size: 1.3rem;margin-top: 0.8rem;">Seleziona Azione</span><span style="float:left;margin-top:6px;margin-left:6px;color:white;" ><i class="fa fa-times" onclick="closePopupNuvola(this);"></i></span></div>'+
                                      '<div class="leaflet-popup-content tdfontaction"  tipo="ACTIONS" style="display: flex;"><div style="display:inline-flex;"></div><div tipo="COMANDI">';
  
                                          if (display=='ACTIONS'){
  
                                              var actions=rec.ACTIONS;
                                              //var actionsPers='ACTIONS_'+tipo;
                                              var actionsPers='ACTIONS_'+tipocampo;
                                              if (rec[actionsPers]!=undefined){
                                                  actions=rec[actionsPers];
                                              }
                                              for(var k=0; k<actions.length; k++){
                                                  num_actions++;
                                                  var azione = actions[k];
                                                  var click = azione.ACTION;
                                                  click += '(this); return false;';
                                                  if (azione.ACTIONDEF!=undefined){
                                                      click = azione.ACTIONDEF;
                                                  }
                                                  var title = azione.TITLE;
                                                  var icon = azione.ICON;
  
                                                  if(azione.ISI != undefined){
                                                      //toadd += '<i class="'+icon+'" style="margin-right: 10px;"></i>';
  
                                                      var toaddt = '<a href="#" onclick="'+click+'" vista="'+vista.HID+'" hid="'+hid+'" phid="'+phid+'">'+'<i class="'+icon+'" style="margin-right: 10px;"></i>'+title+'</a>';
                                                      toaddt=toaddt.replace('#HID#',hid);
                                                      toaddt=toaddt.replace('#PHID#',phid);
                                                      toadd += toaddt;
                                                      
                                                  } else {
                                                      //toadd += '<img src="'+icon+'" style="margin-right: 10px;">';
                                                      var toaddt = '<a href="#" onclick="'+click+'" vista="'+vista.HID+'" hid="'+hid+'" phid="'+phid+'">'+'<img src="'+icon+'" style="margin-right: 5px;" width="30" height="30">'+title+'</a>';
                                                      toaddt=toaddt.replace('#HID#',hid);
                                                      toaddt=toaddt.replace('#PHID#',phid);
                                                      toadd += toaddt;
                                                  }
                                                  
                                                  
                                                  toadd += '<br>';
  
                                              }
                                          }
                                          
                                  toadd += '<div tipo="TREE"></div></div><div tipo="SEPARATOR" style="border-color:var(--hop)"></div><div tipo="RICERCHE"></div></div>' +
                                  '</div>' +
                              '</div>'+
                              '</div>';
  
              if(num_actions>0){
                  $(td).append(toadd);
                  $(td).find('div.pannelloaction:first').draggable();
                  $(td).find('div.pannelloaction:first').resizable();
              }   
              if (classeAggiuntiva!=undefined && classeAggiuntiva!=''){
                  $(td).addClass(classeAggiuntiva);
              }
              $(riga).append(td);
          } else {
  
              var campo=rec.CAMPO;
              var desc=rec.DESCRIZIONE;
              var desc_lunga=rec.DESCRIZIONE_LUNGA;
              var display=rec.DISPLAY;
              var selectizesng=rec.SELECTIZESINGLE;
              var dominio=rec.DOMINIO;
              var multiselect=rec.MULTI;
              var libero=rec.FREE;
              var isfile=rec.FILE;
              
             
              if (oggetto.ISSEARCHFLD==true){
                  
                  display='TDSEARCHFIELD';
                  console.log('Search field:'+display)
              }
             // console.log("ISSEARCHFIELD:"+rec.ISSEARCHFLD);
              var classe=rec.CLASSE;
              
              //var dispPers='DISPLAY_'+tipo;
              var dispPers='DISPLAY_'+tipocampo;
              if (rec[dispPers]!=undefined){
                  display=rec[dispPers];
                  //var dompers='DOMINIO_'+tipo;
                  var dompers='DOMINIO_'+tipocampo;
                  if (rec[dompers]!=undefined){
                      dominio=rec[dompers];
                  }
                  //dompers='SELECTIZESINGLE_'+tipo;
                  dompers='SELECTIZESINGLE_'+tipocampo;
                  // console.log("GIULIA DEVE CAPIRE: " + JSON.stringify(rec));
                  if (rec[dompers]!=undefined){
                      selectizesng=rec[dompers];
                  }
              }
              var tstpj="NOSELECTIZE_"+tipocampo;
              var noselectize=rec[tstpj];
  
              if (noselectize!=undefined){
                  selectizesng=undefined;
              }
              var qry='td[tipo=\''+display+'\']';
              var td=$(table).find(qry).clone();
              if (td.length==0){
                  console.log("WARNING: tipo TD:"+display+" NON TROVATO!");
              }
              var pjtst=campo+"_LUNGA";
              if (oggetto[pjtst]!=undefined && oggetto[pjtst].length>2){
                  $(td).addClass('more-info');
              }
  
              $(td).attr('data-label',desc);
  
              if (oggetto.INDENT!=undefined && i==0){
                  $(td).addClass('indent'+oggetto.INDENT);
                  $(td).removeClass('text-center');    
                  }
              if (isfile!=undefined){
                  console.log('OGGETTO CATEGORIA:'+oggetto.CATEGORIA);
              }
              if (isfile!=undefined && oggetto.CATEGORIA!=undefined){
                  $(td).find('[campo]').each(function(){
                      $(this).attr('categoria', oggetto.CATEGORIA);
                  });
              }
           // console.log('QRY:'+qry+' per il campo:'+campo+' tdsize:'+td.length);
              /**
               * Sostituzione campo con il nome del campo corretto
               */
              var isAction=false;
              if (display=='ACTIONS'){
                  isAction=true;
                  
                  var actions=rec.ACTIONS;
                  //var actionsPers='ACTIONS_'+tipo;
                  var actionsPers='ACTIONS_'+tipocampo;
                  if (rec[actionsPers]!=undefined){
                      actions=rec[actionsPers];
                  }
            //      console.log('AZIONI PER '+tipo+' :'+JSON.stringify(actions));
                  var sp=document.createElement('nobr');
                  $(sp).css('align','center');
                  $(td).css('align','center');
                  $(td).css('white-space','nowrap');
                  for (var k=0;k<actions.length;k++){
                      var azione=actions[k];
                      var click=azione.ACTION;
                      click += '(this); return false;';
                      if (azione.ACTIONDEF!=undefined){
                          click = azione.ACTIONDEF;
                      }
                      var src=azione.ICON;
                      var title=azione.TITLE;
                      
                     var isi=azione.ISI;
      
                      var img=document.createElement('img');
                      if (isi!=undefined){
                          img=document.createElement('i');
                          $(img).addClass(src);
                          $(img).css({'margin-top':'-3px','max-width':'80%','max-height':'80%'});
                      }
                      /*
                      $(img).addClass('action');
                      $(img).attr('src',src);
                      $(img).attr('title',title);
                      $(img).attr('onclick',click+'(this);');
                      $(img).attr('vista',vista.HID);
                      $(img).attr('hid',hid);
                      if (phid!=undefined){
                          $(img).attr('phid',phid);
                      }
                      $(img).attr('width','20px');
                      $(img).css({'float':'left','margin-top':'2px','margin-left':'3px'});
                     // $(img).css({'margin-top':'25%','margin-left':'5px'});
                     
                      $(sp).append(img);*/
      
                      $(img).css({'max-width': '100%','max-height': '100%'});
                      $(img).attr('src',src);
                      $(img).attr('title',title);
                      //$(img).attr('onclick',click+'(this);');
                      //$(img).attr('onclick',click+'(this);');
                      $(img).attr('vista',vista.HID);
                      $(img).attr('hid',hid);
                      if (phid!=undefined){
                          $(img).attr('phid',phid);
                      }
                      //$(img).attr('width','30px');
                      
                      /*
      
                      $(sp).append(img);
                     */
                      var bt=document.createElement('div');
                      //'<button type="button" class="btn btn-info"></button>';
                     // $(bt).addClass('btn btn-default');
                     $(bt).addClass('btn btn-default bottone');
                  //    $(bt).css({'margin-left':'2px','width': '33px','padding': '0px 0px'});
                      $(bt).css({'margin-left':'2px','width': '33px','padding': '0px 0px', 'cursor': 'pointer'});
                     // $(bt).css({'margin-left':'2px','height': '25px','width': '33px','padding': '0px 0px'});
                     $(bt).attr('onclick',click+'(this);');
                     $(bt).attr('vista',vista.HID);
                      $(bt).attr('hid',hid);
                      if (phid!=undefined){
                          $(bt).attr('phid',phid);
                      }
                     // $(bt).css({'margin-left':'2px','padding': '3px 3px'});
                      $(bt).append(img);
                      $(sp).append(bt);
                     
                  }
                  $(td).append(sp);
              }
              if (i==0||i==1){
                  var indent=oggetto.INDENT;
                  if (indent>0){
                      var indspan= $(td).find('span[tipo=\'INDENT\']');
                      if (indspan.length>0){
                          $(indspan).css('margin-left',indent+"px");
                      }
                  }
              }
      
              $(td).find('[bottone]').each(function(){
                  $(this).attr('hid', oggetto.HID);
              });
              $(td).find('[campo]').each(function (){
                  
                  var val=$(this).attr('campo');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('campo',val);
              });
              $(td).find('[campoass]').each(function (){
                  var val=$(this).attr('campoass');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('campoass',val);
              });
              $(td).find('[campotel]').each(function (){
                  var val=$(this).attr('campotel');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('campotel',val);
              });
              $(td).find('[campomail]').each(function (){
                  var val=$(this).attr('campomail');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('campomail',val);
              });
      
      
         
              
              $(td).find('[campoflag]').each(function (){
                  var val=$(this).attr('campoflag');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('campoflag',val);
              });
      
              
              $(td).find('[camposelect]').each(function (){
                  var val=$(this).attr('camposelect');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('camposelect',val);
              });
  
              $(td).find('[campoqrcode]').each(function (){
                  var val=$(this).attr('campoqrcode');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('campoqrcode',val);
              });
      
      
              $(td).attr('hid',hid);
              if (phid!=undefined){
                  $(td).attr('phid',phid);
              }
             // $(td).attr('tooltip',desc_lunga);
              if (classeAggiuntiva!=undefined && classeAggiuntiva!=''){
                  $(td).addClass(classeAggiuntiva);
              }
              if (classe!=undefined && classe!=''){
                  $(td).addClass(classe);
              }
             
              
              var campoflag=campo+'_FLAG';
              var campomsg=campo+'_MSG';
              var flag=oggetto[campoflag];
              var tooltip=oggetto[campomsg];
              if (flag!=undefined && flag!=''){
                  $(td).addClass(flag);
                 
              }
              if (tooltip!=undefined && tooltip!=''){
                  $(td).attr('tooltip',tooltip);
              }
              
                  
              var tst='[campoass]';
              $(td).find(tst).each(function (){
                  
                      $(this).attr('hid',hid);
                      if (phid!=undefined){
                          $(this).attr('phid',phid);
                      }
                      var cmps=$(this).attr('campoass');
                      $(this).parent().find('textarea[campoass=\''+cmps+'\']').each(function (){
                          
                          // $(this).text(oggetto[cmps]);
                          $(this).text(getValore(oggetto, cmps));
                          
                      });
                 
                  }); 
                  
                  tst='[campoflag]';
                  $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campoflag');
                          var tickEl = $(this).find('.custom-tick').addBack('.custom-tick');
                          /* if (oggetto[campo]!=undefined && oggetto[campo]==false){
                              tickEl.css('visibility', 'hidden');
                          }else{
                              if(oggetto[campo]==undefined){
                                  tickEl.css('visibility', 'hidden');
                              } else {
                                  tickEl.css('visibility', 'visible');
                              }
                              
                          } */
                          var valo = getValore(oggetto, campo);
  
                          if (valo!=undefined && valo==false){
                              tickEl.css('visibility', 'hidden');
                          }else{
                              if(valo==undefined){
                                  tickEl.css('visibility', 'hidden');
                              } else {
                                  tickEl.css('visibility', 'visible');
                              }
                              
                          }
                     
                      }); 
                      
                      tst='[campoimage]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campoimage');
                          var valo = getValore(oggetto, campo);
                         /* if (oggetto[campo]!=undefined){
                             $(this).attr('src',oggetto[campo]);
                         } */
                          if (valo!=undefined){
                              $(this).attr('src',valo);
                          }
                  
                      }); 
                      tst='[camposemaforo]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('camposemaforo');
                          var valo = getValore(oggetto, campo);
                         /* if (oggetto[campo]!=undefined){
                             $(this).css('background-color',oggetto[campo]);
                         } */
  
                          if (oggetto[campo]!=undefined){
                              $(this).css('background-color',valo);
                          }
                     
                      }); 
  
                      tst='[campocolore]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campocolore');
                          var valo = getValore(oggetto, campo);
                         /* if (oggetto[campo]!=undefined){
                             $(this).css('color',oggetto[campo]);
                         } */
  
                         if (valo!=undefined){
                          $(this).css('color',valo);
                      }
                     
                      }); 
                      tst='[campoclasse]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campoclasse');
                          var valo = getValore(oggetto, campo);
                         /* if (oggetto[campo]!=undefined){
                          $(this).removeClass();
                          $(this).addClass(oggetto[campo]);
                            
                         } */
  
                         if (valo!=undefined){
                          $(this).removeClass();
                          $(this).addClass(valo);
                            
                         }
                     
                      }); 
                      tst='[campotel]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campotel');
                          var valo = getValore(oggetto, campo);
                         /* if (oggetto[campo]!=undefined  && oggetto[campo].length>0){
                             $(this).attr('href','tel:'+oggetto[campo]);
                         }else{
                          $(this).css('display','none');
                         } */
  
                          if (valo!=undefined  && valo.length>0){
                              $(this).attr('href','tel:'+valo);
                          }else{
                              $(this).css('display','none');
                          }
                     
                      }); 
                      tst='[campomail]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campomail');
                          var valo = getValore(oggetto, campo);
                         /* if (oggetto[campo]!=undefined && oggetto[campo].length>0){
                             $(this).attr('href','mailto:'+oggetto[campo]);
                         }else{
                          $(this).css('display','none');
                         } */
  
                          if (valo!=undefined && valo.length>0){
                              $(this).attr('href','mailto:'+valo);
                          }else{
                              $(this).css('display','none');
                          }
                      }); 
            //      console.log('OGGETTO:'+JSON.stringify(oggetto));
                  var tst='[campo=\''+campo+'\']';
                  $(td).find(tst).each(function (){
                      
                      var valo = getValore(oggetto, campo);
                      //$(this).find('span').html(oggetto[campo]);
                      // $(this).find('span:not([tipo])').html(oggetto[campo]);
                      $(this).find('span:not([tipo])').html(valo);
  
                      // --- display=='TDVEDIFILE' ---
                      if(display == 'TDVEDIFILE' && valo == undefined){
                          $(this).hide();
                      }
                     
                      
                      
                      $(this).find('span[campoass]').each(function (){
                          var x=$(this).attr('campoass');
                          var valo = getValore(oggetto, x);
                          // $(this).html(oggetto[x]);
                          $(this).html(valo);
                      });
                      $(this).find('input[campoass]').each(function (){
                          var x=$(this).attr('campoass');
                          var valo = getValore(oggetto, x);
                         // $(this).val(oggetto[x]);
                          /* if (display=='TDNOTEDITNUMBER'||display=='TDEDITNUMBER'){
                             
                           if (isNumber(oggetto[x])){
                               console.log("OGGETTO[X]: "+oggetto[x]);
                               console.log("OGGETTO X: "+x);
                                  var vv=Number(oggetto[x]);     
                                  var nv=vv.toFixed(2);
                                  console.log('Nuovo valore dentro Render TD:'+nv);
                                  $(this).val(nv);
                                  }else{
                                      console.log("OGGETTO[X]: "+oggetto[x]);
                                      console.log("OGGETTO X: "+x);
                                      $(this).val(oggetto[x]);
                                          if ($(this).attr('limit5')!=undefined){
                                            
                                              try {
                                                  var vpj=oggetto[x];
                                               //   console.log('PJSTEFAN1:'+vpj);
                                                  vpj=Math.round(100000*vpj)/100000;
                                                  $(this).val(vpj);
                                              } catch (error) {
                                                 // console.log('PJSTEFAN2');
                                              }
                                          }
                                          if ($(this).attr('limit2')!=undefined){
                                            
                                              try {
                                                  var vpj=oggetto[x];
                                               //   console.log('PJSTEFAN1:'+vpj);
                                                  vpj=Math.round(100*vpj)/100;
                                                  $(this).val(vpj);
                                              } catch (error) {
                                                 // console.log('PJSTEFAN2');
                                              }
                                          }
                                  }
                                 
                          }else{
                              $(this).val(oggetto[x]);
                              if ($(this).attr('limit5')!=undefined){
                                
                                  try {
                                      var vpj=oggetto[x];
                                   //   console.log('PJSTEFAN3:'+vpj);
                                      vpj=Math.round(100000*vpj)/100000;
                                      $(this).val(vpj);
  
                                  } catch (error) {
                                   //   console.log('PJSTEFAN4');
                                      
                                  }
                              }
                              if ($(this).attr('limit2')!=undefined){
                                            
                                  try {
                                      var vpj=oggetto[x];
                                   //   console.log('PJSTEFAN1:'+vpj);
                                      vpj=Math.round(100*vpj)/100;
                                      $(this).val(vpj);
                                  } catch (error) {
                                     // console.log('PJSTEFAN2');
                                  }
                              }
                          } */
  
                          if (display=='TDNOTEDITNUMBER'||display=='TDEDITNUMBER'){
                             
                              if (isNumber(valo)){
                                  console.log("valo: "+valo);
                                  console.log("OGGETTO X: "+x);
                                     var vv=Number(valo);     
                                     var nv=vv.toFixed(2);
                                     console.log('Nuovo valore dentro Render TD:'+nv);
                                     $(this).val(nv);
                                     }else{
                                         console.log("valo: "+valo);
                                         console.log("OGGETTO X: "+x);
                                         $(this).val(valo);
                                             if ($(this).attr('limit5')!=undefined){
                                               
                                                 try {
                                                     var vpj=valo;
                                                  //   console.log('PJSTEFAN1:'+vpj);
                                                     vpj=Math.round(100000*vpj)/100000;
                                                     $(this).val(vpj);
                                                 } catch (error) {
                                                    // console.log('PJSTEFAN2');
                                                 }
                                             }
                                             if ($(this).attr('limit2')!=undefined){
                                               
                                                 try {
                                                     var vpj=valo;
                                                  //   console.log('PJSTEFAN1:'+vpj);
                                                     vpj=Math.round(100*vpj)/100;
                                                     $(this).val(vpj);
                                                 } catch (error) {
                                                    // console.log('PJSTEFAN2');
                                                 }
                                             }
                                     }
                                    
                             }else{
                                 $(this).val(valo);
                                 if ($(this).attr('limit5')!=undefined){
                                   
                                     try {
                                         var vpj=valo;
                                      //   console.log('PJSTEFAN3:'+vpj);
                                         vpj=Math.round(100000*vpj)/100000;
                                         $(this).val(vpj);
     
                                     } catch (error) {
                                      //   console.log('PJSTEFAN4');
                                         
                                     }
                                 }
                                 if ($(this).attr('limit2')!=undefined){
                                               
                                     try {
                                         var vpj=valo;
                                      //   console.log('PJSTEFAN1:'+vpj);
                                         vpj=Math.round(100*vpj)/100;
                                         $(this).val(vpj);
                                     } catch (error) {
                                        // console.log('PJSTEFAN2');
                                     }
                                 }
                             }
  
  
                             // --- display=='TDVEDIFILE' ---
                             /* if(display == 'TDVEDIFILE' && valo == undefined){
                                  $(this).hide();
                             } */
                          
                      });
                      $(this).find('select[campoass]').each(function (){
                          var x=$(this).attr('campoass');
                          var valo = getValore(oggetto, x);
                          // $(this).val(oggetto[x]);
                          $(this).val(valo);
                      });
      
                      if (selectizesng!=undefined){
                          var v=selectizesng.split(".",-1);
                         
                          var lstsel=undefined;
                          if (oggetto[selectizesng]!=undefined){
                              lstsel=oggetto[selectizesng];
                             // console.log('SELECTIZESNG oggetto:'+JSON.stringify(lstsel));
                          }else{
                          try {
                              lstsel=window[v[0]];
                              for (var seli=1;seli<v.length;seli++){
                              lstsel=lstsel[v[seli]];
                              } 
                              console.log('SELECTIZESNG oggetto2:'+JSON.stringify(lstsel));   
                          } catch (error) {
                              console.log('SELECTIZESNG:'+error);
                          }
                      }
                          var tst2='[campoass=\''+campo+'\']';
                          if (multiselect==undefined){
                              if(libero == undefined){
                                  console.log('SONO QUA SELECTIZE-SInGLE-NON LIBERO');
                                  if (hop!=undefined ){
                                      console.log("SIAM PASSATI DI QUA");
                                      StdSelectizeSingleHop($(td).find('input[selectize]'+tst2),lstsel);
                                  } else{
                                  StdSelectizeSingle($(td).find('input[selectize]'+tst2),lstsel);    
                                  }
                              }
                              else{
                                  console.log('SONO QUA SELECTIZE-SInGLE-LIBERO');
                                  StdSelectizeSingleLibero($(td).find('input[selectize]'+tst2),lstsel, hid, campo);    
                              }
                          }else{
                              StdSelectizeMulti($(td).find('input[selectize]'+tst2),lstsel);
                          }
                      }
      
      
      
      
      
      
                  /* semplificazione per motivi di performance*/    
                  /*for (var x in oggetto){
                      //var tst2='[campoass=\''+x+'\']';
                  
                          
                          $(this).find('span[campoass=\''+x+'\']').each(function (){
                              $(this).html(oggetto[x]);
                          });
                          $(this).find('input[campoass=\''+x+'\']').each(function (){
                              $(this).val(oggetto[x]);
                          });
                          $(this).find('select[campoass=\''+x+'\']').each(function (){
                              $(this).val(oggetto[x]);
                          });
                  }*/
                  });    
      
                  tst='[camposelect]';
              $(td).find(tst).each(function (){
                 
                      $(this).attr('hid',oggetto.HID);
                    
                     
                      if (dominio!=undefined){
                          var dom=oggetto[dominio];
                          var lista2=[];
                          if (dom==undefined) {
                              var s=dominio.split(".",-1);
                                      var rec=window;
                                      var go=true;
                                      for (var j=0;j<s.length;j++){
                                          if (rec!=undefined){
                                              rec=rec[s[j]];
                                              }else{
                                                  go=false;
                                              }
                                      }   
                                      if (go){
                                          dom=rec;
                                          }
                          }
                          if (dom!=undefined){
                              lista2=dom;
                              for (var j=0;j<lista2.length;j++){
                                  var rc=lista2[j];
                                  var opt=$(this).find('option[value="'+rc.VAL+'"]');
                                  if (opt.length==0){
                                      var testo=rc.TESTO;
                                      if (testo==undefined){
                                          if (rc.DESCRIZIONE!=undefined){
                                              testo=rc.DESCRIZIONE;
                                          }
                                      }
                                      opt='<option value="'+rc.VAL+'">'+testo+'</option>';
                                      $(this).append(opt);
                                  }
                              }
                          }
                      }
      
                      var campo2=$(this).attr('camposelect');
                      var v=oggetto[campo2];
                      var qry='option[value="'+v+'"]';
                      $(this).find(qry).attr('selected','selected');
                  });
  
  
  
                  tst='[campoqrcode]';
              $(td).find(tst).each(function (){
                 
                      $(this).attr('hid',oggetto.HID);
                      var campo = $(this).attr('campoqrcode');
                      var valo = getValore(oggetto, campo);
                      var idqr='qr_'+generateID();
                      $(this).attr('id',idqr);
  
                      // if (oggetto[campo]!=undefined && oggetto[campo].length>0){
                      if (valo!=undefined && valo.length>0){
  
                          // var dochid = oggetto[campo];
                          var dochid = valo;
                          
                              var url = getPDFUrl(dochid);
                              // console.log('URL:'+url);
                              // var str = getQrCodeData(url);
                              var str = server+url;
                              // var str = getPDFUrl(ogg2[campo]);
                              var qrcode = new QRCode(this, {
                                  text: str,
                                  width: 128,
                                  height: 128,
                                  colorDark : "#000000",
                                  colorLight : "#ffffff",
                                  correctLevel : QRCode.CorrectLevel.H
                              });
                              // console.log("campo: " + campo + " ; oggetto[campo]: " + oggetto[campo]);
                              
                              if(dochid != undefined){
                                  $(this).attr('onclick', "window.open(getPDFUrl('"+dochid+"'), '_blank')");
                              } else {
                                  console.log("DOCUMENTO NON TROVATO!!!");
                              }
                              
                          
                      }
                  });
      
                         
      
              riga.append(td);
          }
  
      }
  
  
  
  }
  
  function newArrows(e){
      var test=e.which;
    
      if (e.which === 38 || e.which === 40) {
      e.preventDefault();
      var currCell=$(e.target).closest('td');
      var c='';
      if (test===40){
      c = $(currCell).closest('tr').next().find('td:eq(' + 
            $(currCell).index() + ')');
      }
      if (test===38){
          c = $(currCell).closest('tr').prev().find('td:eq(' + 
          $(currCell).index() + ')');
      }
      console.log('C:'+c.length);
      if (c.length > 0) {
          console.log('C:'+$(c).html());
          currCell = c;
          $(c).find('input').focus();
      }
      e.stopPropagation();
  }}
  
  function renderTdSmart(riga,oggetto,vista,classeAggiuntiva,tbody){
      var table=$('#StdTable');
      var origRiga=$(riga).clone();
      var lista=vista.LISTACAMPI;
      //console.log("DIMENSIONE LISTA:"+lista.length);
      var tipo=oggetto.TIPO;
      var tipocampo=tipo;
      if (oggetto.TIPOCAMPO!=undefined && oggetto.TIPOCAMPO.length>0){
          tipocampo=oggetto.TIPOCAMPO;
      }
      var hid=oggetto.HID;
      var phid=oggetto.PHID;
      $(riga).addClass('tipo_'+oggetto.TIPO);
      for (var i=0;i<lista.length;i++){
          
          var rec=lista[i];
          var classe=rec.CLASSE;
  
          
  
          var pannello = rec.PANNELLO;
          var disp=rec.DISPLAY;
          if (disp=='ACTIONS' && pannello==undefined){
              pannello='SI';
          }
          if ((pannello == 'SI')){
              $(riga).append('<td class="leg_smart '+classe+'"><legend>'+'Azioni'+'</legend></td>');
              $(riga).css('display','');
              $(riga).attr('lhid',oggetto.HID);
              $(tbody).append(riga);
              riga=origRiga.clone();
              console.log("PANNELLO ---> SI");
              var display=rec.DISPLAY;
              var qry='td[tipo=\''+display+'\']';
              var td=$(table).find(qry).clone();
              if (td.length==0){
                  console.log("WARNING: tipo TD:"+display+" NON TROVATO!");
              }
              $(td).addClass('td-actions');
              $(td).attr('data-label','Azioni');
              var num_actions = 0;
              var sp=document.createElement('nobr');
              $(sp).css('align','center');
              $(td).css('align','center');
              $(td).css('white-space','nowrap');
              var idpa="IDPA"+generateID();
              var toadd='<div style="min-width:20px; min-height:20px;"  ><span class="tabazioni" onclick="showPopupNuvola(event,this, \'click\');"><i class="ho hop-icircles"></i></span>'+
              '<div class="leaflet-popup  leaflet-zoom-animated pannelloaction" id="'+idpa+'" style="display: none; word-wrap: break-word; width: auto; z-index: 100;" >' +
                                  '<div class="leaflet-popup-content-wrapper">' +
                                  '<div tipo="close" style="background-color:var(--hop);height: 2rem;margin:-2px; border-radius:8px 8px 0 0;"><span style="float:right;margin-top:6px;margin-right:6px;color:white;" tipo="close" ><i class="fa fa-times" onclick="closePopupNuvola(this);"></span></i>'+
                                  '<span style="float:left;margin-top:6px;margin-left:6px;color:white;" >Azioni</span>'+
                                  '</div>'+
                                      '<div class="leaflet-popup-content"  tipo="ACTIONS" style="display: flex;"><div style="display:inline-flex;"></div><div tipo="COMANDI">';
  
                                          if (display=='ACTIONS'){
  
                                              var actions=rec.ACTIONS;
                                              //var actionsPers='ACTIONS_'+tipo;
                                              var actionsPers='ACTIONS_'+tipocampo;
                                              if (rec[actionsPers]!=undefined){
                                                  actions=rec[actionsPers];
                                              }
                                              for(var k=0; k<actions.length; k++){
                                                  num_actions++;
                                                  var azione = actions[k];
                                                  var click = azione.ACTION;
                                                  click += '(this); return false;';
                                                  var title = azione.TITLE;
                                                  var icon = azione.ICON;
  
                                                  if(azione.ISI != undefined){
                                                      //toadd += '<i class="'+icon+'" style="margin-right: 10px;"></i>';
                                                      toadd += '<a href="#" onclick="'+click+'" vista="'+vista.HID+'" hid="'+hid+'" phid="'+phid+'">'+'<i class="'+icon+'" style="margin-right: 10px;"></i>'+title+'</a>';
                                                  } else {
                                                      //toadd += '<img src="'+icon+'" style="margin-right: 10px;">';
                                                      toadd += '<a href="#" onclick="'+click+'" vista="'+vista.HID+'" hid="'+hid+'" phid="'+phid+'">'+'<img src="'+icon+'" style="margin-right: 5px;" width="30" height="30">'+title+'</a>';
                                                  }
                                                  
                                                  
                                                  toadd += '<br>';
  
                                              }
                                          }
                                          
                                  toadd += '<div tipo="TREE"></div></div><div tipo="SEPARATOR" style="border-color:var(--hop)"></div><div tipo="RICERCHE"></div></div>' +
                                  '</div>' +
                              '</div>'+
                              '</div>';
  
              if(num_actions>0){
                  $(td).append(toadd);
                  $(td).find('div.pannelloaction:first').draggable();
                  $(td).find('div.pannelloaction:first').resizable();
              }   
              if (classeAggiuntiva!=undefined && classeAggiuntiva!=''){
                  $(td).addClass(classeAggiuntiva);
              }
              $(riga).append(td);
              $(riga).attr('hid',oggetto.HID);
              $(riga).css({    'border-style': 'hidden' });
              $(riga).find('td').css({'border-radius':'12px','background-color':'var(--hop-sfondo-verde-leggero)'});
              $(tbody).append(riga);
              
              $(riga).css('display','');
             // console.log('Added Riga!:'+tbody.length+':'+$(riga).html());
              riga=origRiga.clone();
             
          } else {
  
              var campo=rec.CAMPO;
              var desc=rec.DESCRIZIONE;
              var desc_lunga=rec.DESCRIZIONE_LUNGA;
              var display=rec.DISPLAY;
              var selectizesng=rec.SELECTIZESINGLE;
              var dominio=rec.DOMINIO;
              var multiselect=rec.MULTI;
              var libero=rec.FREE;
              var isfile=rec.FILE;
              
              $(riga).append('<td class="leg_smart '+classe+'"><legend>'+rec.DESCRIZIONE+'</legend></td>');
              $(riga).attr('lhid',oggetto.HID);
              $(tbody).append(riga);
              $(riga).css('display','');
              riga=origRiga.clone();
              if (oggetto.ISSEARCHFLD==true){
                  
                  display='TDSEARCHFIELD';
                  console.log('Search field:'+display)
              }
             // console.log("ISSEARCHFIELD:"+rec.ISSEARCHFLD);
              //var classe=rec.CLASSE;
              
              //var dispPers='DISPLAY_'+tipo;
              var dispPers='DISPLAY_'+tipocampo;
              
              if (rec[dispPers]!=undefined){
                  display=rec[dispPers];
                  //var dompers='DOMINIO_'+tipo;
                  var dompers='DOMINIO_'+tipocampo;
                  if (rec[dompers]!=undefined){
                      dominio=rec[dompers];
                  }
                  //dompers='SELECTIZESINGLE_'+tipo;
                  dompers='SELECTIZESINGLE_'+tipocampo;
                  if (rec[dompers]!=undefined){
                      selectizesng=rec[dompers];
                  }
              }
              var qry='td[tipo=\''+display+'\']';
              var td=$(table).find(qry).clone();
              if (td.length==0){
                  console.log("WARNING: tipo TD:"+display+" NON TROVATO!");
              }
  
              $(td).attr('data-label',desc);
  
              if (oggetto.INDENT!=undefined && i==0){
                  $(td).addClass('indent'+oggetto.INDENT);
                  $(td).removeClass('text-center');    
                  }
              if (isfile!=undefined){
                  console.log('OGGETTO CATEGORIA:'+oggetto.CATEGORIA);
              }
              if (isfile!=undefined && oggetto.CATEGORIA!=undefined){
                  $(td).find('[campo]').each(function(){
                      $(this).attr('categoria', oggetto.CATEGORIA);
                  });
              }
           // console.log('QRY:'+qry+' per il campo:'+campo+' tdsize:'+td.length);
              /**
               * Sostituzione campo con il nome del campo corretto
               */
              var isAction=false;
              if (display=='ACTIONS'){
                  isAction=true;
                  
                  var actions=rec.ACTIONS;
                  //var actionsPers='ACTIONS_'+tipo;
                  var actionsPers='ACTIONS_'+tipocampo;
                  
                  if (rec[actionsPers]!=undefined){
                      actions=rec[actionsPers];
                  }
            //      console.log('AZIONI PER '+tipo+' :'+JSON.stringify(actions));
                  var sp=document.createElement('nobr');
                  $(sp).css('align','center');
                  $(td).css('align','center');
                  $(td).css('white-space','nowrap');
                  for (var k=0;k<actions.length;k++){
                      var azione=actions[k];
                      var click=azione.ACTION;
                      var src=azione.ICON;
                      var title=azione.TITLE;
                      
                     var isi=azione.ISI;
      
                      var img=document.createElement('img');
                      if (isi!=undefined){
                          img=document.createElement('i');
                          $(img).addClass(src);
                          $(img).css({'margin-top':'-3px','max-width':'80%','max-height':'80%'});
                      }
                      /*
                      $(img).addClass('action');
                      $(img).attr('src',src);
                      $(img).attr('title',title);
                      $(img).attr('onclick',click+'(this);');
                      $(img).attr('vista',vista.HID);
                      $(img).attr('hid',hid);
                      if (phid!=undefined){
                          $(img).attr('phid',phid);
                      }
                      $(img).attr('width','20px');
                      $(img).css({'float':'left','margin-top':'2px','margin-left':'3px'});
                     // $(img).css({'margin-top':'25%','margin-left':'5px'});
                     
                      $(sp).append(img);*/
      
                      $(img).css({'max-width': '100%','max-height': '100%'});
                      $(img).attr('src',src);
                      $(img).attr('title',title);
                      //$(img).attr('onclick',click+'(this);');
                      //$(img).attr('onclick',click+'(this);');
                      $(img).attr('vista',vista.HID);
                      $(img).attr('hid',hid);
                      if (phid!=undefined){
                          $(img).attr('phid',phid);
                      }
                      //$(img).attr('width','30px');
                      
                      /*
      
                      $(sp).append(img);
                     */
                      var bt=document.createElement('div');
                      //'<button type="button" class="btn btn-info"></button>';
                     // $(bt).addClass('btn btn-default');
                     $(bt).addClass('btn btn-default bottone');
                     $(bt).css({'margin-left':'2px','height': '25px','width': '33px','padding': '0px 0px'});
                     $(bt).attr('onclick',click+'(this);');
                     $(bt).attr('vista',vista.HID);
                      $(bt).attr('hid',hid);
                      if (phid!=undefined){
                          $(bt).attr('phid',phid);
                      }
                     // $(bt).css({'margin-left':'2px','padding': '3px 3px'});
                      $(bt).append(img);
                      $(sp).append(bt);
                     
                  }
                  $(td).append(sp);
              }
              if (i==0||i==1){
                  var indent=oggetto.INDENT;
                  if (indent>0){
                      var indspan= $(td).find('span[tipo=\'INDENT\']');
                      if (indspan.length>0){
                          $(indspan).css('margin-left',indent+"px");
                      }
                  }
              }
      
              $(td).find('[bottone]').each(function(){
                  $(this).attr('hid', oggetto.HID);
              });
              $(td).find('[campo]').each(function (){
                  
                  var val=$(this).attr('campo');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('campo',val);
              });
              $(td).find('[campoass]').each(function (){
                  var val=$(this).attr('campoass');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('campoass',val);
              });
              $(td).find('[campotel]').each(function (){
                  var val=$(this).attr('campotel');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('campotel',val);
              });
              $(td).find('[campomail]').each(function (){
                  var val=$(this).attr('campomail');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('campomail',val);
              });
         
              
              $(td).find('[campoflag]').each(function (){
                  var val=$(this).attr('campoflag');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('campoflag',val);
              });
      
              
              $(td).find('[camposelect]').each(function (){
                  var val=$(this).attr('camposelect');
                  val=val.replace(/NOMECAMPO/,campo);
                  $(this).attr('camposelect',val);
              });
      
      
              $(td).attr('hid',hid);
              if (phid!=undefined){
                  $(td).attr('phid',phid);
              }
             // $(td).attr('tooltip',desc_lunga);
              if (classeAggiuntiva!=undefined && classeAggiuntiva!=''){
                  $(td).addClass(classeAggiuntiva);
              }
              if (classe!=undefined && classe!=''){
                  $(td).addClass(classe);
              }
             
              
              var campoflag=campo+'_FLAG';
              var campomsg=campo+'_MSG';
              var flag=oggetto[campoflag];
              var tooltip=oggetto[campomsg];
              if (flag!=undefined && flag!=''){
                  $(td).addClass(flag);
                 
              }
              if (tooltip!=undefined && tooltip!=''){
                  $(td).attr('tooltip',tooltip);
              }
              
                  
              var tst='[campoass]';
              $(td).find(tst).each(function (){
                  
                      $(this).attr('hid',hid);
                      if (phid!=undefined){
                          $(this).attr('phid',phid);
                      }
                      var cmps=$(this).attr('campoass');
                      $(this).parent().find('textarea[campoass=\''+cmps+'\']').each(function (){
                          $(this).text(getValore(oggetto, cmps));
                      });
                 
                  }); 
                  
                  tst='[campoflag]';
                  $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campoflag');
                          var tickEl = $(this).find('.custom-tick').addBack('.custom-tick');
                          if (oggetto[campo]!=undefined && oggetto[campo]==false){
                              tickEl.css('visibility', 'hidden');
                          }else{
                              if(oggetto[campo]==undefined){
                                  tickEl.css('visibility', 'hidden');
                              } else {
                                  tickEl.css('visibility', 'visible');
                              }
                              
                          }
                     
                      }); 
                      
                      tst='[campoimage]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campoimage');
                         if (oggetto[campo]!=undefined){
                             $(this).attr('src',oggetto[campo]);
                         }
                     
                      }); 
                      tst='[camposemaforo]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('camposemaforo');
                         if (oggetto[campo]!=undefined){
                             $(this).css('background-color',oggetto[campo]);
                         }
                     
                      }); 
  
                      tst='[campocolore]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campocolore');
                         if (oggetto[campo]!=undefined){
                             $(this).css('color',oggetto[campo]);
                         }
                     
                      }); 
                      tst='[campoclasse]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campoclasse');
                         if (oggetto[campo]!=undefined){
                          $(this).removeClass();
                          $(this).addClass(oggetto[campo]);
                            
                         }
                     
                      }); 
                      tst='[campotel]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campotel');
                         if (oggetto[campo]!=undefined && oggetto[campo].length>0){
                             $(this).attr('href','tel:'+oggetto[campo]);
                         }else{
                          $(this).css('display','none');
                         }
                     
                      }); 
                      tst='[campomail]';   
                      $(td).find(tst).each(function (){
                      
                          $(this).attr('hid',hid);
                          if (phid!=undefined){
                              $(this).attr('phid',phid);
                          }
                          var campo=$(this).attr('campomail');
                         if (oggetto[campo]!=undefined && oggetto[campo].length>0){
                             $(this).attr('href','mailto:'+oggetto[campo]);
                         }else{
                          $(this).css('display','none');
                         }
                     
                      }); 
  
            //      console.log('OGGETTO:'+JSON.stringify(oggetto));
                  var tst='[campo=\''+campo+'\']';
                  $(td).find(tst).each(function (){
      
                      
                      //$(this).find('span').html(oggetto[campo]);
                      $(this).find('span:not([tipo])').html(oggetto[campo]);
                     
                      
                      
                      $(this).find('span[campoass]').each(function (){
                          var x=$(this).attr('campoass');
                          $(this).html(getValore(oggetto, x));
                      });
                      $(this).find('input[campoass]').each(function (){
                          /* var x=$(this).attr('campoass');
                          if (display=='TDNOTEDITNUMBER'||display=='TDEDITNUMBER'){
                             
                           if (isNumber(oggetto[x])){
                               console.log("OGGETTO[X]: "+oggetto[x]);
                               console.log("OGGETTO X: "+x);
                                  var vv=Number(oggetto[x]);     
                                  var nv=vv.toFixed(2);
                                  console.log('Nuovo valore dentro Render TD:'+nv);
                                  $(this).val(nv);
                                  }else{
                               console.log("OGGETTO[X]: "+oggetto[x]);
                               console.log("OGGETTO X: "+x);
                               $(this).val(oggetto[x]);
                                  }
                                 
                          }else{
                              $(this).val(oggetto[x]);
                          } */
  
                          var x=$(this).attr('campoass');
                          var valo = getValore(oggetto, x);
                         // $(this).val(oggetto[x]);
                          /* if (display=='TDNOTEDITNUMBER'||display=='TDEDITNUMBER'){
                             
                           if (isNumber(oggetto[x])){
                               console.log("OGGETTO[X]: "+oggetto[x]);
                               console.log("OGGETTO X: "+x);
                                  var vv=Number(oggetto[x]);     
                                  var nv=vv.toFixed(2);
                                  console.log('Nuovo valore dentro Render TD:'+nv);
                                  $(this).val(nv);
                                  }else{
                                      console.log("OGGETTO[X]: "+oggetto[x]);
                                      console.log("OGGETTO X: "+x);
                                      $(this).val(oggetto[x]);
                                          if ($(this).attr('limit5')!=undefined){
                                            
                                              try {
                                                  var vpj=oggetto[x];
                                               //   console.log('PJSTEFAN1:'+vpj);
                                                  vpj=Math.round(100000*vpj)/100000;
                                                  $(this).val(vpj);
                                              } catch (error) {
                                                 // console.log('PJSTEFAN2');
                                              }
                                          }
                                          if ($(this).attr('limit2')!=undefined){
                                            
                                              try {
                                                  var vpj=oggetto[x];
                                               //   console.log('PJSTEFAN1:'+vpj);
                                                  vpj=Math.round(100*vpj)/100;
                                                  $(this).val(vpj);
                                              } catch (error) {
                                                 // console.log('PJSTEFAN2');
                                              }
                                          }
                                  }
                                 
                          }else{
                              $(this).val(oggetto[x]);
                              if ($(this).attr('limit5')!=undefined){
                                
                                  try {
                                      var vpj=oggetto[x];
                                   //   console.log('PJSTEFAN3:'+vpj);
                                      vpj=Math.round(100000*vpj)/100000;
                                      $(this).val(vpj);
  
                                  } catch (error) {
                                   //   console.log('PJSTEFAN4');
                                      
                                  }
                              }
                              if ($(this).attr('limit2')!=undefined){
                                            
                                  try {
                                      var vpj=oggetto[x];
                                   //   console.log('PJSTEFAN1:'+vpj);
                                      vpj=Math.round(100*vpj)/100;
                                      $(this).val(vpj);
                                  } catch (error) {
                                     // console.log('PJSTEFAN2');
                                  }
                              }
                          } */
  
                          if (display=='TDNOTEDITNUMBER'||display=='TDEDITNUMBER'){
                             
                              if (isNumber(valo)){
                                  console.log("valo: "+valo);
                                  console.log("OGGETTO X: "+x);
                                     var vv=Number(valo);     
                                     var nv=vv.toFixed(2);
                                     console.log('Nuovo valore dentro Render TD:'+nv);
                                     $(this).val(nv);
                                     }else{
                                         console.log("valo: "+valo);
                                         console.log("OGGETTO X: "+x);
                                         $(this).val(valo);
                                             if ($(this).attr('limit5')!=undefined){
                                               
                                                 try {
                                                     var vpj=valo;
                                                  //   console.log('PJSTEFAN1:'+vpj);
                                                     vpj=Math.round(100000*vpj)/100000;
                                                     $(this).val(vpj);
                                                 } catch (error) {
                                                    // console.log('PJSTEFAN2');
                                                 }
                                             }
                                             if ($(this).attr('limit2')!=undefined){
                                               
                                                 try {
                                                     var vpj=valo;
                                                  //   console.log('PJSTEFAN1:'+vpj);
                                                     vpj=Math.round(100*vpj)/100;
                                                     $(this).val(vpj);
                                                 } catch (error) {
                                                    // console.log('PJSTEFAN2');
                                                 }
                                             }
                                     }
                                    
                              }else{
                                 $(this).val(valo);
                                 if ($(this).attr('limit5')!=undefined){
                                   
                                     try {
                                         var vpj=valo;
                                      //   console.log('PJSTEFAN3:'+vpj);
                                         vpj=Math.round(100000*vpj)/100000;
                                         $(this).val(vpj);
     
                                     } catch (error) {
                                      //   console.log('PJSTEFAN4');
                                         
                                     }
                                 }
                                 if ($(this).attr('limit2')!=undefined){
                                               
                                     try {
                                         var vpj=valo;
                                      //   console.log('PJSTEFAN1:'+vpj);
                                         vpj=Math.round(100*vpj)/100;
                                         $(this).val(vpj);
                                     } catch (error) {
                                        // console.log('PJSTEFAN2');
                                     }
                                 }
                              }
                          
                      });
                      $(this).find('select[campoass]').each(function (){
                          var x=$(this).attr('campoass');
                          $(this).val(oggetto[x]);
                      });
      
                      if (selectizesng!=undefined){
                          var v=selectizesng.split(".",-1);
                         
                          var lstsel=undefined;
                          if (oggetto[selectizesng]!=undefined){
                              lstsel=oggetto[selectizesng];
                             // console.log('SELECTIZESNG oggetto:'+JSON.stringify(lstsel));
                          }else{
                          try {
                              lstsel=window[v[0]];
                              for (var seli=1;seli<v.length;seli++){
                              lstsel=lstsel[v[seli]];
                              } 
                              console.log('SELECTIZESNG oggetto2:'+JSON.stringify(lstsel));   
                          } catch (error) {
                              console.log('SELECTIZESNG:'+error);
                          }
                      }
                          var tst2='[campoass=\''+campo+'\']';
                          if (multiselect==undefined){
                              if(libero == undefined){
                                  console.log('SONO QUA SELECTIZE-SInGLE-NON LIBERO');
                                  StdSelectizeSingle($(td).find('input[selectize]'+tst2),lstsel);    
                              }
                              else{
                                  console.log('SONO QUA SELECTIZE-SInGLE-LIBERO');
                                  StdSelectizeSingleLibero($(td).find('input[selectize]'+tst2),lstsel);    
                              }
                          }else{
                              StdSelectizeMulti($(td).find('input[selectize]'+tst2),lstsel);
                          }
                      }
      
      
      
      
      
      
                  /* semplificazione per motivi di performance*/    
                  /*for (var x in oggetto){
                      //var tst2='[campoass=\''+x+'\']';
                  
                          
                          $(this).find('span[campoass=\''+x+'\']').each(function (){
                              $(this).html(oggetto[x]);
                          });
                          $(this).find('input[campoass=\''+x+'\']').each(function (){
                              $(this).val(oggetto[x]);
                          });
                          $(this).find('select[campoass=\''+x+'\']').each(function (){
                              $(this).val(oggetto[x]);
                          });
                  }*/
                  });    
      
                  tst='[camposelect]';
              $(td).find(tst).each(function (){
                 
                      $(this).attr('hid',oggetto.HID);
                    
                     
                      if (dominio!=undefined){
                          var dom=oggetto[dominio];
                          var lista2=[];
                          if (dom==undefined) {
                              var s=dominio.split(".",-1);
                                      var rec=window;
                                      var go=true;
                                      for (var j=0;j<s.length;j++){
                                          if (rec!=undefined){
                                              rec=rec[s[j]];
                                              }else{
                                                  go=false;
                                              }
                                      }   
                                      if (go){
                                          dom=rec;
                                          }
                          }
                          if (dom!=undefined){
                              lista2=dom;
                              for (var j=0;j<lista2.length;j++){
                                  var rc=lista2[j];
                                  var opt=$(this).find('option[value="'+rc.VAL+'"]');
                                  if (opt.length==0){
                                      var testo=rc.TESTO;
                                      if (testo==undefined){
                                          if (rc.DESCRIZIONE!=undefined){
                                              testo=rc.DESCRIZIONE;
                                          }
                                      }
                                      //opt='<option value="'+rc.VAL+'">'+rc.TESTO+'</option>';
                                      opt='<option value="'+rc.VAL+'">'+testo+'</option>';
                                      $(this).append(opt);
                                  }
                              }
                          }
                      }
      
                      var campo2=$(this).attr('camposelect');
                      var v=oggetto[campo2];
                      var qry='option[value="'+v+'"]';
                      $(this).find(qry).attr('selected','selected');
                  });
      
                         
      
              riga.append(td);
              $(tbody).append(riga);
              $(riga).css({    'border-style': 'hidden', });
              $(riga).find('td').css({'border-radius':'12px','background-color':'var(--hop-sfondo-verde-leggero)'});
              $(riga).css('display','');
              $(riga).attr('hid',oggetto.HID);
              riga=origRiga.clone();
  
             // $(riga).css('display','');
              console.log('Added Riga!');
          }
  
      }
  
  
  
  }
  
  
  function disableMouseOutPopupNuvola(el){
      /*$(el).closest('.pannelloaction').find('[tipo="close"]').css('display','');*/
      $(el).closest('.pannelloaction').find('[tipo="close"]').css('display','flow-root');
      $(el).closest('.pannelloaction').attr('noclose','S');
      var div=$(el).closest('.pannelloaction');
      $(div).unbind('mouseout');
  }
  
  
  function closePopupNuvola(el){
      console.log('Closing popupNuvola:'+$(el).closest('.pannelloaction').attr('id'));
      //$(el).closest('.pannelloaction').css({"display":"none"});
     var div=$(el).closest('.pannelloaction');
      $(div).hide(50);
      $(div).css('display','none')
  }
  
  var mouseoutPopupNuvola=function(e){
      console.log("MOUSEOUT ON DIV: "+$(this).attr('id'));
      var noclose=$(this).attr('noclose');
      if (noclose!=undefined){
          return;
      }
      var x=e.pageX;
      var y=e.pageY;
      var dim=getDimensions(this);
      //console.log("MOUSEOUT ON DIV: "+x+":"+y+"   DIM:"+JSON.stringify(dim));
      var tolerance=0;
      if (dim.x1-tolerance<x && x<dim.x2+tolerance && dim.y1-tolerance<y && y<dim.y2+tolerance){
          var dx1=x-dim.x1;
          var dx2=dim.x2-x;
          var dy1=y-dim.y1;
          var dy2=dim.y2-y;
     //     console.log('Non chiudo:'+dx1+":"+dx2+" "+dy1+":"+dy2 );
          return;
      }
      $(this).css({"display":"none"});
  }
  
  function showPopupNuvola(e,el, evento){
      /**
       * Nuova gestione con pannello al di fuori della tabella
       */
     /* var nuvole = $('#POPUPNUVOLA');
      $(nuvole).css({"display":"none"});
      $(nuvole).removeAttr('noclose');
      var div = $(el).parent().find('.pannelloaction:first');
      var html=$(div).html();
      $(nuvole).empty();
      $(nuvole).html(html);
      var div=nuvole;
      $(div).css({"display":"", "position":"absolute",top:e.clientY+40,left:e.clientX});
      var dim = getDimensions(div);
      var wwidth = window.innerWidth;
    //  console.log("WWIDTH: "+wwidth+' DIM: '+JSON.stringify(dim));
      if (dim.x2>wwidth){
          var quanto = dim.x2-wwidth;
          quanto = dim.x2-dim.x1;
         // $(div).css('transform','translate(-'+quanto+'px)');
        //  console.log('TRASLATO DI:'+'translate(-'+quanto+'px)');
      }
      $(div).mouseout(mouseoutPopupNuvola);
      return;*/
  
      /**
       * Il nuovo metodo non funzionava in presenza di noiose situazioni perché non funzionava il refresh delle tabelle
       */
      if(evento != 'click'){
          /*var nuvole = $('#main-container').find('.leaflet-popup');
          $(nuvole).css({"display":"none"});*/
          //var nuvole = $('#main-container').find('.pannelloaction');
          var nuvole = $(el).closest('[tipo="tabella"]').find('.pannelloaction');
          $(nuvole).css({"display":"none"});
          
      }
     
      var nuvole = $(el).closest('[tipo="tabella"]').find('.pannelloaction');
      $(nuvole).css({"display":"none"});
      
    //  console.log($(el).parent().html());
    //  var div = $(el).find('div:first');
    var div = $(el).parent().find('.pannelloaction:first')
    var tabella = $(el).closest('[tipo="tabella"]');
  //  alert('CI SONO '+div.length+' stop propagate pannello action qui sotto: '+$(el).html());
  //  e.stopPropagation();
  var rect={};
  rect.top=0;
  rect.left=0;
  if (tabella[0]!=undefined){
      rect = tabella[0].getBoundingClientRect();
      }
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;  //y position within the element.
     // $(div).css({"display":"", "position":"absolute"});
      $(div).css({"display":"", "position":"absolute",top:e.clientY- rect.top+10,left:e.clientX- rect.left});
      $(div).find('[tipo="RICERCHE"]').empty();
      $(div).find('[tipo="SEPARATOR"]').css({'border-style':'none'});
     // $(div).find('[tipo="SEPARATOR"]').css('display','none');
      var dim = getDimensions(div);
      var wwidth = window.innerWidth;
    // console.log("WWIDTH: "+wwidth+' DIM: '+JSON.stringify(dim));
      if (dim.x2>wwidth){
          var quanto = dim.x2-wwidth;
          quanto = dim.x2-dim.x1;
       //   $(div).css('transform','translate(-'+quanto+'px)');
       //  console.log('TRASLATO DI:'+'translate(-'+quanto+'px)');
      }
      $(div).mouseout(function(e){
          console.log("MOUSEOUT ON DIV: "+$(this).attr('id'));
          var noclose=$(this).attr('noclose');
          if (noclose!=undefined){
              return;
          }
          var x=e.pageX;
          var y=e.pageY;
          var dim=getDimensions(this);
          //console.log("MOUSEOUT ON DIV: "+x+":"+y+"   DIM:"+JSON.stringify(dim));
          var tolerance=0;
          if (dim.x1-tolerance<x && x<dim.x2+tolerance && dim.y1-tolerance<y && y<dim.y2+tolerance){
              var dx1=x-dim.x1;
              var dx2=dim.x2-x;
              var dy1=y-dim.y1;
              var dy2=dim.y2-y;
         //     console.log('Non chiudo:'+dx1+":"+dx2+" "+dy1+":"+dy2 );
              return;
          }
          $(this).css({"display":"none"});
      });
  }
  
  /* function hidePopupNuvola(el){
      var div = $(el).parent().find('div')[1];
      $(div).css({"display":"none"});
  } */
  
  function Snodefault(e){
      if (e.target==mscrollelement){
          
          return(true);
      }else{
       if (mscrollelement!=undefined && mscrollelement.contains(e.target)) {
          return(true);
       }else {
          consolelog('No wheel scroll for '+e.target);
      e.preventDefault();
      return false;
       }
      }
  }
  
  
  
  var mscrolldisabled=false;
  var mscrollelement=undefined;
  
  
  function disableMouseScroll2(el) {
      if (!mscrolldisabled){
          mscrolldisabled=true;
      consolelog('Mouse Scroll disabled');
      $('body').css('overflow','hidden');
      }
  }
  function enableMouseScroll2(el) {
      if (mscrolldisabled){
          mscrolldisabled=false;
          consolelog('Mouse Scroll enabled');
          $('body').css('overflow','auto');
      }
  }
  
  function disableMouseScroll(el) {
      if (!mscrolldisabled){
  
      
      mscrolldisabled=true;
      consolelog('Mouse Scroll disabled');
      var table=$(el).closest('[tipo="tabella"]');
      var v=getDimensions(table);
      if (v!=undefined && v.y2!=undefined && v.y1!=undefined){
          var val=v.y2-v.y1;
          $(table).css({position:'absolute','heigth':''+val+'px'});
      }
     /*  mscrollelement=el;
      window.addEventListener('mousewheel', Snodefault, { passive: false });
      
      mscrolldisabled=true;
      consolelog('Mouse Scroll disabled'); */
      }
      
  }
  
  function enableMouseScroll(el) {
      if (mscrolldisabled){
  
          var table=$(el).closest('[tipo="tabella"]');
          $(table).css({position:'unset','heigth':'auto'});
          consolelog('Mouse Scroll enabled');
          mscrolldisabled=false;
         /*  window.removeEventListener('mousewheel',Snodefault);
         
          mscrolldisabled=false;
          consolelog('Mouse Scroll enabled'); */
      }
      
  }
  //document.onmousewheel=disableMouseScroll;
  
  function StdShowModalSingleCampo(oggetto,campo,modello,titolo,bottoniAzioni){
      var modal=$('#StdModal').clone();
      var id='MOD'+generateID();
      $(modal).attr('id',id);
      var valore='';
      if (oggetto!=undefined){
      var desc_lunga='';
      var hid=oggetto.HID;
      var phid=oggetto.PHID;
      var classe='';
      var classeAggiuntiva='';
      var el=modal.find('[tipo=\''+modello+'\']');
      $(modal).find('[titolo]').each(function (){
          $(this).html(titolo);
      });
      $(el).find('[campo]').each(function (){
              
          var val=$(this).attr('campo');
          val=val.replace(/NOMECAMPO/,campo);
          $(this).attr('campo',val);
      });
      $(el).find('[campoass]').each(function (){
          var val=$(this).attr('campoass');
          val=val.replace(/NOMECAMPO/,campo);
          $(this).attr('campoass',val);
      });
      $(el).attr('hid',hid);
      if (phid!=undefined){
          $(el).attr('phid',phid);
      }
      $(el).attr('tooltip',desc_lunga);
      if (classeAggiuntiva!=undefined && classeAggiuntiva!=''){
          $(el).addClass(classeAggiuntiva);
      }
      if (classe!=undefined && classe!=''){
          $(el).addClass(classe);
      }
     
      var campoflag=campo+'_FLAG';
      var campomsg=campo+'_MSG';
      var flag=oggetto[campoflag];
      var tooltip=oggetto[campomsg];
      if (flag!=undefined && flag!=''){
          $(el).addClass(flag);
          if (tooltip!=undefined && tooltip!=''){
              $(td).attr('tooltip',tooltip);
          }
      }
      var tst='[campoass]';
          $(el).find(tst).each(function (){
              
                  $(this).attr('hid',hid);
                  if (phid!=undefined){
                      $(this).attr('phid',phid);
                  }
              
             
              }); 
        //      console.log('OGGETTO:'+JSON.stringify(oggetto));
              var tst='[campo=\''+campo+'\']';
              $(el).find(tst).each(function (){
                  
                  $(this).find('span').html(oggetto[campo]);
                  
              for (var x in oggetto){
                  //var tst2='[campoass=\''+x+'\']';
              
                      
                      $(this).find('span[campoass=\''+x+'\']').each(function (){
                          $(this).html(oggetto[x]);
                      });
                      $(this).find('input[campoass=\''+x+'\']').each(function (){
                          $(this).val(oggetto[x]);
                      });
                      $(this).find('select[campoass=\''+x+'\']').each(function (){
                          $(this).val(oggetto[x]);
                      });
                      $(this).find('textarea[campoass=\''+x+'\']').each(function (){
                          $(this).text(oggetto[x]);
                      });
                  }
              });    
      $(modal).css('display','');
      $(el).css('display','');
      modal.find('[tipo=\'body\']').append(el);
    //  modal.css({'position':'absolute','left': 200, 'top': 200, 'display': 'block'})
      $('body').append(modal);
      modal.modal();
      console.log('MODAL CON ID:'+id+' GENERATO CORRETTAMENTE');
  }else{
      console.log('ERRORE NELLA CREAZIONE DEL MODAL');
  }
  
  }
  
  
  function StdShowModal(oggetto,titolo,pannello){
      var modal=$('#StdModal2').clone();
      var id='MOD'+generateID();
      $(modal).attr('id',id);
      var valore='';
      if (oggetto!=undefined){
      var desc_lunga='';
      var hid=oggetto.HID;
      var phid=oggetto.PHID;
      var classe='';
      var classeAggiuntiva='';
      var el=modal.find('[tipo=\'container\']');
      $(modal).find('[titolo]').each(function (){
          $(this).html(titolo);
      });
      var pannello=getServerModule('Ok',pannello);
      el.append(pannello);
      applyFormRecord(modal,oggetto);
      $(modal).css('display',''); 
    //  modal.find('[tipo=\'body\']').append(el);
    //  modal.css({'position':'absolute','left': 200, 'top': 200, 'display': 'block'})
      $('body').append(modal);
      modal.modal();
      console.log('MODAL CON ID:'+id+' GENERATO CORRETTAMENTE');
  }else{
      console.log('ERRORE NELLA CREAZIONE DEL MODAL');
  }
  
  }
  
  
  
  function StdSearchAllPanel(){
      var panel=getPanel('STDSEARCHALL');
      if (panel==undefined){
          var panel=$('#search_all').clone();
          $(panel).attr('id','PANEL'+generateID());
          $(panel).css({'position':'absolute','left':'240px','top':'80px','width':'850px','display':'block'});
          $(panel).draggable({
              handle: '.section-header, .modal-footer',
          });
          var ricerca=new Risorsa('STDRICERCA');
          ricerca.TARGET='GLOBAL';
          var hid=ricerca.HID;
          $(panel).find('select[campo=\'stdtarget\']').attr('hid',hid);
          $(panel).find('input[campo=\'stdricerca\']').attr('hid',hid);
          addPanel('STDSEARCHALL',panel);
  
      }
  }
  
  function StdSearchEasy(el,target,tipi,detail,msg){
      var ricerca=new Risorsa('STDRICERCA');
      ricerca.TARGET=target;
      ricerca.DETAIL=detail;
      ricerca.MSG=msg;
      var hid=ricerca.HID;
      $(el).find('input').attr('hid',hid);
      $(el).find('input[campo=\'stdtarget\']').val(target);
      if (tipi!=undefined){
          var listaCampi=[];
              for (var i=0; i<tipi.length;i++){
                  listaCampi.push(tipi[i].VAL);
              }
          var cmps=listaCampi.join(',');
          ricerca.TIPI=cmps;
          $(el).find('input[campo=\'stdtipi\']').val(cmps);
          }
      if (el!=undefined){
          ricerca.PANEL=el;
      }    
  }
  
  function StdSearchAllChangeSelect(el){
  var hid=$(el).attr('hid');
  
  var ricerca=Risorsa.get(hid);
  var val=$(el).val();
  var campo=$(el).attr('campo');
  switch (campo) {
      case 'stdtarget':
          ricerca.TARGET=val;        
          break;
  
      case 'stdtipi':
          ricerca.TIPI=val;        
          break;
  
      case 'stdlimit':
          if ($.isNumeric(val)){
              ricerca.LIMIT=val;     
          }   
          break;
  
      default:
          break;
  }
  StdRicerca(ricerca);
  } 
  
  //var currentSearchElement=undefined;
  
  //var visteSTD={};
  
  //var visteTreeSTD={};
  
  function StdSearchAll(el){
  var hid=$(el).attr('hid');
  var ricerca=Risorsa.get(hid);
  var val=$(el).val();
  StdRicerca(ricerca,val);
  if (ricerca!=undefined){
      ricerca.VAL=val;
      StdRicerca(ricerca);
      }
  }
  
  function StdRicerca(ricerca){
      
  if (ricerca!=undefined){
      var val=ricerca.VAL;
      var query={};
      query._ALL=val;
      var tipi=ricerca.TIPI;
      if (tipi!=undefined){
          var altq="OR ";
          var tips=tipi.split(",");
          console.log('TIPI IN QUERY:'+tipi);
          if (tips.length>0){
                  for (var j=0;j<tips.length;j++){
                      altq=altq+' '+tips[j];
                  }
              query.TIPO=altq
              }
      }
      var limit=15;
      if (ricerca.LIMIT!=undefined){
          limit=ricerca.LIMIT;
      }
      tipo=ricerca.TARGET;
  
  
      console.log('QUERY:'+tipo+':'+JSON.stringify(query));
      var res=Risorsa.search(tipo,query,limit);
      console.log('RES:'+JSON.stringify(res));
      if (res.Esito=='OK'){
          var lista=res.LISTA;
          if (currentSearchElement==undefined){
              currentSearchElement=ricerca;
          }
          var vistaN='STD'+tipo;
          var vista=visteSTD[vistaN];
          if (vista==undefined){
              
          }
          console.log('VISTA '+vistaN+':'+JSON.stringify(vista));
          var table=renderTable('TabellaStd',currentSearchElement,lista,vista);
          var panel=ricerca.PANEL;
          if (panel==undefined){
              panel=getPanel('STDSEARCHALL');
              }
              if (ricerca.MSG!=undefined){
                  $(ricerca.MSG).html(res.Msg); 
              }
              
          $(table).find('i').attr('ricerca',ricerca.HID);
          $(table).find('img').attr('ricerca',ricerca.HID);    
          $(panel).find('[tipo=\'output\']').find('table').remove();
          $(panel).find('[tipo=\'output\']').append(table);
          }
      }
      
  
  }
  
  function StdDeleteObject(el){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.load(hid);
      if (ogg!=undefined){
          ogg.delete();
      }
  }
  
  function StdEditObject(el){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.load(hid);
      if (ogg!=undefined){
          //var panel=getPanel('STDSEARCHALL');
          StdClose('STDSEARCHALL');
          var panel=getPanel('STDEDITOBJECT');
              if (panel==undefined){
                  panel=$('#search_container').clone();
                  $(panel).attr('id','PANEL'+generateID());
                  
                  $(panel).find('[titolo]').html('Modifica di '+ogg.DESCRIZIONE);
                  var container=$(panel).find('[tipo=\'container\']');
  
                  var contenuto=getServerModule('Ok','PANEL_'+ogg.TIPO);
                /*  var dett=document.createElement('div');
                  $(dett).attr('tipo','dettaglio');*/
                  $(container).append(contenuto);
                  
  
                  
                  
                      //var listapos=rc.LISTA;
                          container.find('[tipo=\'dettaglio\']').each(function(){
                          //listapos[0].CLASSE_LISTA=listaClassi;	
                          //processArticleOk(listapos[0]);
                          //var idx='STD'+ogg.TIPO;
                          var idx=ogg.TIPO;
                          var vista=visteTreeSTD[idx];
                          if (vista==undefined){
                              vista=getVistaWithDefault();
                          }
                          var v=jsonFrill(this,{tab: 2,collapse:true, toolbar: false},ogg,vista);
                          $(this).append(v);
                          
                      });
                      $(container).find('button').each(function (){
                                  $(this).attr('hid',ogg.HID);
                                  });
                      /*bindingsAll();
                      console.log('LISTAPOS:'+JSON.stringify(listapos));*/	
                  
                  
                  
  
                  
                  
                  
                  
                  
              
  
                  $(panel).draggable({
                      handle: '.section-header, .modal-footer',
                  });
                  
                  $(panel).css('display','');
                  
                  var pos=getDimensions(el);
                  var posp=getDimensions(panel);
              //	var x1=pos.x1-50-posp.x2;
                  var x1=pos.x1+100;
                  var y1=pos.y1;
                  $(panel).css({'background-color':'#ffffff','position':'absolute','left': x1, 'top': y1, 'display': 'block'});
                  addPanel('ARTICLEOK',panel);
                      
              }
  
          }
  
  }
  
  //var detailRender={};
  //var cacheContenuto={};
  
  
  
  function StdObjectDetail(el){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.load(hid);
      var ricerca=Risorsa.get($(el).attr('ricerca'));
      if (ogg!=undefined && ricerca!=undefined){
          //var panel=getPanel('STDSEARCHALL');
          var container=ricerca.DETAIL;
          var func=detailRender[ogg.TIPO];
          var contenuto=undefined;
          if (func!=undefined && container!=undefined){
              func(container,ogg);
          }
  
          //var contenuto=getServerModule('Ok','PANEL_'+ogg.TIPO);
          }
  
  }
  
  
  /**
   * Metodi standard editing dei campi
   */
  /**
   * invocato dal metodo oninput 
   * Azione: invoca callbackUpdate
   * @param {*} element 
   */
  function StdSearchField(element){
      var hid=$(element).attr('HID');
      var campo=$(element).attr('campoass');
      var val=$(element).val();
      var nodo=Risorsa.get(hid);
      
          if (nodo!=undefined){
          
          nodo[campo]=val;
          var firecallback=true;
          if (typeof nodo.callbackSearch === 'function'){
                   //console.log('Richiamo callbackUpdate');
                   nodo.callbackSearch(hid,campo,val,element);
               }else{
                  console.log('StdSearchField: Callback non presente. Strano.');
                  if (typeof nodo.initEdit === 'function'){
                      console.log('StdSearchField: Callback initEdit presente. ');
                      nodo.initEdit(element);
                  if (typeof nodo.callbackSearch === 'function'){
                      nodo.callbackSearch(hid,campo,val,element);
                    }   else{
                      console.log('StdSearchField: Callback ancora non presente. Senza speranza.'); 
                    }
                  }else{
                      console.log('StdSearchField: initEdit non presente. Abbandonate ogni speranza.')
                  }
               }
          }else{
              console.log('StdSearchField:'+nodo+' '+hid+' non trovato');
          }
  
      //$(element).focus();
  }
  
  
  /**
   * 
   * @param {* hid della riga con i parametri digitati dall'utente} hid 
   * @param {* tipo query (inviata al server dalla classe Risorsa)} tipoSearch 
   * @param {* panel nome del pannello dove deve essere inserito il risultato della query} panel 
   * @param {* resultsType nome del tipo di oggetti risultato della ricerca} resultsType 
   * @param {* vista campo opzionale utilizzato per valutare preventivamente il check sui parametri in input} vista 
   * @param {* sourcepanel: pannello origine della ricerca} spanel
   */
  function StdSearchQuery(hid,tipoSearch,panelName,resultsType,vista,spanel){
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          var panel=getPanel(panelName);
          var table=$(panel).find('table');
          var phid=ogg.PHID;
          
          console.log('Limit Query:'+ogg.LIMIT);
          var ret=Risorsa.search(tipoSearch,ogg,ogg.LIMIT,false);
          
          if (ret.Esito=='OK'){
              $(table).find('tbody').find('tr.tipo_'+resultsType).remove();
              $(panel).find('[msg]').html(ret.Msg);
              var lista=ret.LISTA;
              Risorsa.clear(resultsType);
              var recsearch=ogg;
             /* var tr=$(document.createElement('tr'));
              renderTd(tr,recsearch,vista);
              $(table).find('tbody').append(tr);*/
              for (var i=0;i<lista.length;i++){
                  var tr=$(document.createElement('tr'));
                  var riga=lista[i];
                  var riga2=new Risorsa(resultsType);
                  riga.TIPO=resultsType;
                  for (x in riga){
                      if (x!='TIPO' && x!='HID' && x!='PHID'){
                          riga2[x]=riga[x];
                      }
                  }
                  /**
                   * Propagate id of result Element
                   */
                  riga2._KEY=riga.HID;
                  if (phid!=undefined){
                      riga2.PHID=phid;
                  }
              //	console.log('Riga:'+$(table).find('tbody').length+' JSON:'+JSON.stringify(riga2));
                  
                  renderTd(tr,riga2,vista);
                  $(table).find('tbody').append(tr);
                  
                  }
          StdApplyVisibility(vista);
          $(table).find('tbody').find('img').attr('spanel',spanel);
          }
          
      }
  }
  
  
  /**
   * 
   * @param {* hid della riga con i parametri digitati dall'utente} hid 
   * @param {* tipo query (inviata al server dalla classe Risorsa)} tipoSearch 
   * @param {* panel nome del pannello dove deve essere inserito il risultato della query} panel 
   * @param {* resultsType nome del tipo di oggetti risultato della ricerca} resultsType 
   * @param {* vista campo opzionale utilizzato per valutare preventivamente il check sui parametri in input} vista 
   * @param {* sourcepanel: pannello origine della ricerca} spanel
   */
  function StdSearchQueryByService(service,action,hid,tipoSearch,panelName,resultsType,vista,spanel){
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          var panel=getPanel(panelName);
          var table=$(panel).find('table');
          var phid=ogg.PHID;
          
          console.log('Limit Query:'+ogg.LIMIT);
          //var ret=Risorsa.search(tipoSearch,ogg,ogg.LIMIT,false);
          var ret=Risorsa.searchByService(service,action,tipoSearch,ogg,ogg.LIMIT,false);
          if (ret.Esito=='OK'){
              $(table).find('tbody').find('tr.tipo_'+resultsType).remove();
              $(panel).find('[msg]').html(ret.Msg);
              var lista=ret.LISTA;
              Risorsa.clear(resultsType);
              var recsearch=ogg;
             /* var tr=$(document.createElement('tr'));
              renderTd(tr,recsearch,vista);
              $(table).find('tbody').append(tr);*/
              for (var i=0;i<lista.length;i++){
                  var tr=$(document.createElement('tr'));
                  var riga=lista[i];
                  var riga2=new Risorsa(resultsType);
                  riga.TIPO=resultsType;
                  for (x in riga){
                      if (x!='TIPO' && x!='HID' && x!='PHID'){
                          riga2[x]=riga[x];
                      }
                  }
                  /**
                   * Propagate id of result Element
                   */
                  riga2._KEY=riga.HID;
                  if (phid!=undefined){
                      riga2.PHID=phid;
                  }
              //	console.log('Riga:'+$(table).find('tbody').length+' JSON:'+JSON.stringify(riga2));
                  
                  renderTd(tr,riga2,vista);
                  $(table).find('tbody').append(tr);
                  
                  }
          StdApplyVisibility(vista);
          $(table).find('tbody').find('img').attr('spanel',spanel);
          }
          
      }
  }
  
  
  
  function StdEditLuogoSelect(element){
      var td=$(element);
      
      var selector=$(td).find('span[campo]');
      var cosaeditare=$(selector).attr('campo');
      selector.find("span").hide(50);
     
      var valInput2=selector.find("select[campoass]").show(50);
      var str='input[campoass=\''+cosaeditare+'\']';
      var valInput=selector.find(str);
     // console.log('Attivazione input element '+str+' :'+valInput.length)
      
      $(valInput).attr('type','text').show(10);
      var mc=$('.map_container');
      var x=getDimensions(td);
      var dimmc=getDimensions(mc);
      var posy=x.y1-dimmc.y2+dimmc.y1-30;
      if (posy<0){
          posy=x.y2-30-200;
      }
      mc.css({'background-color':'#ffffff','position':'absolute','left': x.x1+300, 'top': posy, 'display': 'block'});
      mc.resizable();
      mc.draggable({ handle: ".section-header" });
      var hid=$(element).attr('hid');
      mc.find('.aggiornaIndirizzo').each(function(){
          $(this).attr('hid',hid);
          $(this).data('element',element);
          $(this).attr('campoass',cosaeditare);
          $(this).on('click',function (){
              StdAggiornaLuogoSelect(this);
          });
      });
  
  
      mc.find('.annullaIndirizzo').each(function(){
          $(this).attr('hid',hid);
          $(this).data('element',element);
          $(this).attr('campoass',cosaeditare);
          $(this).on('click',function (){
              StdNonAggiornaLuogoSelect(this);
          });
      });
      
      
  
  
      $('.map_canvas').resizable();
  //	$('.map_canvas').css({'height':dimmc.y2-dimmc.y1-50});
      var $geocomplete = $(valInput),
           // $multiple = td.find('ul');
           $multiple = $('#multiple');
           $geocomplete
            .geocomplete({ map: ".map_canvas",
            location: valInput.val(),
            markerOptions: {
                  draggable: false
              }, 
              mapOptions:{scrollwheel:false}
          })
            .bind("geocode:multiple", function(event, results){
           
            });
          
              $geocomplete.geocomplete().bind("geocode:result", function(event, result){
                  var mc=$('.map_container');
                  mc.find('.aggiornaIndirizzo').data('indirizzo',result);
     // console.log(result);
    });	
                $geocomplete.geocomplete().bind("geocode:dragged", function(event, result){
     // console.log(result);
    });
    $geocomplete.geocomplete().bind("geocode:click", function(event, result){
      //console.log(result);
    });
          $(td).find('i').click(function(){
            $geocomplete.trigger("geocode");
          });
      
      }
  
  
      function aggiungiLuogo(container,ogg,campo,listaindirizzi){
          var templ=$('[tipo=\'StdLuogo\']').clone();
          $(templ).attr('hid',ogg.HID);
          $(templ).attr('tipo','Luogo');
          $(templ).css('display','');
          $(templ).attr('id',"luogo"+generateID());
          $(container).append($(templ));
          var inp=$(templ).find('input[campoass=\'NOMECAMPO\']');
          $(inp).val(ogg[campo]);
          $(inp).attr('campoass',campo);
          $(inp).attr('hid',ogg.HID);
        
          var mc=$(templ).find('[tipo=\'MAPPA\']');
          console.log('MAPPA:'+mc.length);
          var $geocomplete = $(inp),
          // $multiple = td.find('ul');
          $multiple = $('#multiple');
          $geocomplete
           .geocomplete({ map: mc,
           location: $(inp).val(),
           markerOptions: {
                 draggable: false
             }, 
             mapOptions:{scrollwheel:true}
         })
           .bind("geocode:multiple", function(event, results){
          
           });
          
             $geocomplete.geocomplete().bind("geocode:result", function(event, result){
                 var mc=this;
                 console.log("THIS.ELELEMENT:"+mc+" mc.length:"+mc.length+" HID:"+$(this).attr('hid'));
                 //$(mc).find('.aggiornaIndirizzo').data('indirizzo',result);
                 var hid=$(this).attr('hid');
                 var ogg=Risorsa.get(hid);
                 console.log("Risultato:"+JSON.stringify(result));
                 if (ogg!=undefined){
                     $(this).val(result.formatted_address);
                     var campo=$(this).attr('campoass');
                     ogg[campo]=result.formatted_address;
                     var v=campo+"_ID";
                     ogg[v]=result.place_id;
                     $(this).parent().find('[campoass=\''+v+'\']').val(result.place_id);
                     $(this).val(result.formatted_address);
                               /**
                               * Pj 2019/12/05
                               * Aggiunta dettagli indirizzo
                               */
                              var lid=result.place_id;
                              var indir=result.formatted_address;
                              var geo=result.geometry;
                              if (geo!=undefined && geo.location!=undefined){
                                  ogg.LUOGO_ID=lid;
                                  ogg.LUOGO=indir;
                                  ogg.LAT=geo.location.lat();
                                  ogg.LON=geo.location.lng();
                              }
                 }
   
   });	
               $geocomplete.geocomplete().bind("geocode:dragged", function(event, result){
    // console.log(result);
   });
   $geocomplete.geocomplete().bind("geocode:click", function(event, result){
     //console.log(result);
   });
         $(templ).find('i').click(function(){
           $geocomplete.trigger("geocode");
         });
         
         inp=$(templ).find('input[campoass=\'NOMECAMPO_ID\']');
         var v=campo+"_ID";
         $(inp).val(ogg[v]);
         $(inp).attr('hid',ogg.HID);
         $(inp).attr('campoass',v);
      }
  
      
  
  
      function StdEditLuogoSelectN(element){
          var td=$(element);
          
          var selector=$(td).find('span[campo]');
          var cosaeditare=$(selector).attr('campo');
         // selector.find("span").hide(50);
         
          var valInput2=selector.find("select[campoass]").show(50);
          var str='input[campoass=\''+cosaeditare+'\']';
          var valInput=selector.find(str);
         // console.log('Attivazione input element '+str+' :'+valInput.length)
          
          $(valInput).attr('type','text').show(10);
          var mc=$(element).parent().find('[tipo=\'MAPPPA\']');
         /* var x=getDimensions(td);
          var dimmc=getDimensions(mc);
          var posy=x.y1-dimmc.y2+dimmc.y1-30;
          if (posy<0){
              posy=x.y2-30-200;
          }
         // mc.css({'background-color':'#ffffff','position':'absolute','left': x.x1+300, 'top': posy, 'display': 'block'});
         // mc.resizable();
          mc.draggable({ handle: ".section-header" });*/
          var hid=$(element).attr('hid');
          mc.find('.aggiornaIndirizzo').each(function(){
              $(this).attr('hid',hid);
              $(this).data('element',element);
              $(this).attr('campoass',cosaeditare);
              $(this).on('click',function (){
                  StdAggiornaLuogoSelect(this);
              });
          });
      
      
          mc.find('.annullaIndirizzo').each(function(){
              $(this).attr('hid',hid);
              $(this).data('element',element);
              $(this).attr('campoass',cosaeditare);
              $(this).on('click',function (){
                  StdNonAggiornaLuogoSelect(this);
              });
          });
          
          
      
      
          //$('.map_canvas').resizable();
      //	$('.map_canvas').css({'height':dimmc.y2-dimmc.y1-50});
          var $geocomplete = $(valInput),
               // $multiple = td.find('ul');
               $multiple = $('#multiple');
               $geocomplete
                .geocomplete({ map: ".map_canvas",
                location: valInput.val(),
                markerOptions: {
                      draggable: false
                  }, 
                  mapOptions:{scrollwheel:false}
              })
                .bind("geocode:multiple", function(event, results){
               
                });
              
                  $geocomplete.geocomplete().bind("geocode:result", function(event, result){
                      var mc=$('.map_container');
                      mc.find('.aggiornaIndirizzo').data('indirizzo',result);
         // console.log(result);
        });	
                    $geocomplete.geocomplete().bind("geocode:dragged", function(event, result){
         // console.log(result);
        });
        $geocomplete.geocomplete().bind("geocode:click", function(event, result){
          //console.log(result);
        });
              $(td).find('i').click(function(){
                $geocomplete.trigger("geocode");
              });
          
          }
  
  
  function StdNonAggiornaLuogoSelect(el){
      var mc=$('.map_container');
      mc.hide(200);
      var campo=$(el).attr('campoass');
      var campoid=campo+'_ID';
      var target=$(el).data('element');
      var indirizzo=$(el).data('indirizzo');
      var span=$(target).parent();
      var hid=$(target).attr('hid');
      var ogg=Risorsa.get(hid);
  
      $(span).find('select').hide(50);
      $(span).find('input[campoass=\''+campo+'\']').val(ogg[campo]).attr('type','hidden');
     // $(span).find('input[campoass=\''+campoid+'\']').val(indirizzo.place_id).attr('type','hidden');
      $(span).find('span').show(50);
      
  
      if (typeof ogg.callbackUpdate === 'function'){
          if (ogg.cancelUpdate!=undefined){
              ogg.cancelUpdate(hid,campo);
          }
  
      }
  }
  
  function StdAggiornaLuogoSelect(el){
    
      var campo=$(el).attr('campoass');
      var campoid=campo+'_ID';
      var target=$(el).data('element');
      var indirizzo=$(el).data('indirizzo');
      var spanel=$(target).parent().find('span[campo=\''+campo+'\']');
      //console.log('Elemento modificato:'+target);
      var hid=$(target).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined && indirizzo!=undefined){
          ogg[campo]=indirizzo.formatted_address;
         
          ogg[campoid]=indirizzo.place_id;
          
      }
      $(spanel).find('select').hide(50);
      $(spanel).find('input[campoass=\''+campo+'\']').val(indirizzo.formatted_address).attr('type','hidden');
      $(spanel).find('input[campoass=\''+campoid+'\']').val(indirizzo.place_id).attr('type','hidden');
      $(spanel).find('span').html(indirizzo.formatted_address).show(50);
  
      var mc=$('.map_container');
      mc.hide(200);
      if (ogg!=undefined && indirizzo!=undefined){
         
        //  console.log('CALLBACK2:'+ogg.callbackUpdate);
          if (typeof ogg.callbackUpdate === 'function'){
         //     console.log('Richiamo callbackUpdate');
              ogg.callbackUpdate(hid,campo,indirizzo,el);
          }
  
      }
     /* if (callbackSuccess!=undefined){
          callbackSuccess();
          }*/
  }    
  
  function StdAggiornaCampoSelectLuogo(el){
  
      var campo=$(el).attr('campoass');
      var campoid=campo+'_ID';
      var target=$(el).parent().parent();
      var indirizzo={};
      var value=$(el).val();
      //<option value="ChIJPZ6TI-JZeUcRW6I2QGHugdg;Via Momesso Violante, 1, 30027 San Donà di Piave VE, Italy">Via Momesso Violante, 1, 30027 San Donà di Piave VE, Italy</option>
      var v=value.split(";",-1);
      if (v.length>0){
          indirizzo.formatted_address=v[1];
          indirizzo.place_id=v[0];
     
      var spanel=$(target).parent().find('span[campo=\''+campo+'\']');
    //  console.log('Elemento modificato:'+target);
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined && indirizzo!=undefined){
          ogg[campo]=indirizzo.formatted_address;
         
          ogg[campoid]=indirizzo.place_id;
          
      }
      
      
      $(spanel).find('input[campoass=\''+campo+'\']').val(indirizzo.formatted_address).attr('type','hidden');
      $(spanel).find('input[campoass=\''+campoid+'\']').val(indirizzo.place_id).attr('type','hidden');
      $(spanel).find('span').html(indirizzo.formatted_address).show(50);
      $(spanel).find('select').hide(50);
      var mc=$('.map_container');
      mc.hide(200);
      if (ogg!=undefined && indirizzo!=undefined){
         
    //      console.log('CALLBACK2:'+ogg.callbackUpdate);
          if (typeof ogg.callbackUpdate === 'function'){
    //          console.log('Richiamo callbackUpdate');
              ogg.callbackUpdate(hid,campo,indirizzo,el);
          }
  
      }
  }
  
  }
  
  
  
  function  StdEditNumber(el){
      var td=$(el);
      var span=$(td).find('span[campo]');
      span.find('input').attr('type','text');
      span.find('span').hide(200);
      
  
      //span.find('input').show();
      var elinput=span.find('input.numero');
      elinput.each(function(key,thisin){
      //	console.log('key:'+key,+" EL:"+thisin);
          
          var fatto=$(thisin).attr('formato');
      //	console.log('Formato:'+fatto);
      if (fatto==undefined){
          //span.find('input.numero').number(true,2,',','.');
          var valore=$(thisin).val();
          $(thisin).number(true,2,',','.');
          $(thisin).val(valore);
          $(thisin).attr('formato','numero');
          }
          });
      span.find('input').focus();
  }
  
  function  StdEditNumber5(el){
      var td=$(el);
      var span=$(td).find('span[campo]');
      span.find('input').attr('type','text');
      span.find('span').hide(200);
      
  
      //span.find('input').show();
      var elinput=span.find('input.numero');
      elinput.each(function(key,thisin){
      //	console.log('key:'+key,+" EL:"+thisin);
          
          var fatto=$(thisin).attr('formato');
      //	console.log('Formato:'+fatto);
      if (fatto==undefined){
          //span.find('input.numero').number(true,2,',','.');
          var valore=$(thisin).val();
          $(thisin).number(true,5,',','.');
          $(thisin).val(valore);
          $(thisin).attr('formato','numero');
          }
          });
      span.find('input').focus();
  }
  
  
  function StdAggiornaCampoNum(el){
  
      var hid=$(el).attr('HID');
      
  //	console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      var val=$(el).val();
      var firecallback=true;
      if (nodo!=undefined){
         var prev=nodo[campo];
        
         if (prev==val){
          firecallback=false;
         }else{
             nodo[campo]=val;
         }
        
         
          var fmt=number_format($(el).val(),2,',','.');
          $(el).parent().find('span').html($(el).val());
          $(el).parent().find('span').html(fmt);
          
      }else{
          console.log('ERRORE: '+hid+' NON TROVATO IN MEMORIA!!!!');
      }
      $(el).attr('type','hidden');
      $(el).parent().find('span').show(50);
      
      if (nodo!=undefined ){
          if (typeof nodo.callbackUpdate === 'function'){
             // console.log('callback presente');
              nodo.callbackUpdate(hid, campo,val,el);
          }else{
              console.log('callback non presente');
          }
      }
  }
  
  function StdAggiornaCampoNum5(el){
  
      var hid=$(el).attr('HID');
      
  //	console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      var val=$(el).val();
      var firecallback=true;
      if (nodo!=undefined){
         var prev=nodo[campo];
        
         if (prev==val){
          firecallback=false;
         }else{
             nodo[campo]=val;
         }
        
         
          var fmt=number_format($(el).val(),5,',','.');
          $(el).parent().find('span').html($(el).val());
          $(el).parent().find('span').html(fmt);
          
      }else{
          console.log('ERRORE: '+hid+' NON TROVATO IN MEMORIA!!!!');
      }
      $(el).attr('type','hidden');
      $(el).parent().find('span').show(50);
      
      if (nodo!=undefined ){
          if (typeof nodo.callbackUpdate === 'function'){
            //  console.log('callback presente');
              nodo.callbackUpdate(hid, campo,val,el);
          }else{
              console.log('callback non presente');
          }
      }
  }
  
  
  function  StdEdit(el){
      var td=$(el);
      var span=$(td).find('span[campo]');
      span.find('input').attr('type','text');
      span.find('span').hide(200);
      //span.find('input').show();
      span.find('input').focus();
      var hid=$(el).attr('hid');
      if (hid!=undefined){
          var nodo=Risorsa.get(hid);
          if (nodo!=undefined ){
          if (typeof nodo.initEdit === 'function'){
              console.log('callback init presente');
              nodo.initEdit(el);
          }else{
              console.log('callback init non presente:'+JSON.stringify(nodo));
           //   console.log('callback init non presente');
          }
      }else{
          console.log('Nodo non trovato!!!!'+hid);
  
      }
  }else{
  
  }
  }
  
  function  StdEditOra(el){
      var td=$(el);
      var span=$(td).find('span[campo]');
      span.find('input').attr('type','time');
      span.find('span').hide(200);
      //span.find('input').show();
      span.find('input').focus();
      var hid=$(el).attr('hid');
      if (hid!=undefined){
          var nodo=Risorsa.get(hid);
          if (nodo!=undefined ){
          if (typeof nodo.initEdit === 'function'){
              console.log('callback init presente');
              nodo.initEdit(el);
          }else{
              console.log('callback init non presente:'+JSON.stringify(nodo));
           //   console.log('callback init non presente');
          }
      }else{
          console.log('Nodo non trovato!!!!'+hid);
  
      }
  }else{
  
  }
  }
  
  function  StdEditShow(el){
      var td=$(el);
      var span=$(td).find('span[campo]');
      span.find('input').show(200);
      span.find('span').hide(200);
      //span.find('input').show();
      span.find('input').focus();
      var hid=$(el).attr('hid');
      if (hid!=undefined){
          var nodo=Risorsa.get(hid);
          if (nodo!=undefined ){
          if (typeof nodo.initEdit === 'function'){
              console.log('callback init presente');
              nodo.initEdit(el);
          }else{
           //   console.log('callback init non presente');
          }
      }else{
          console.log('Nodo non trovato!!!!'+hid);
  
      }
  }else{
      
  }
  }
  
  function  StdEditCampo(el){
      var span=$(el);
      //var span=$(td).find('span[campo]');
      span.find('input').attr('type','text');
    //  span.find('select').show(200);
      span.find('span').hide(200);
      //span.find('input').show();
      span.find('input').focus();
      var hid=$(el).attr('hid');
      if (hid!=undefined){
          var nodo=Risorsa.get(hid);
         /* if (nodo!=undefined ){
          if (typeof nodo.initEdit === 'function'){
              console.log('callback init presente');
              nodo.initEdit(el);
          }else{
           //   console.log('callback init non presente');
          }
      }*/
  }
  }
  
  
  
  function  StdEditCampoTextarea(el){
      var span=$(el);
      //var span=$(td).find('span[campo]');
      span.find('textarea').show(200);
      span.find('span').hide(200);
      //span.find('input').show();
      span.find('textarea').focus();
      var hid=$(el).attr('hid');
      if (hid!=undefined){
          var nodo=Risorsa.get(hid);
         /* if (nodo!=undefined ){
          if (typeof nodo.initEdit === 'function'){
              console.log('callback init presente');
              nodo.initEdit(el);
          }else{
           //   console.log('callback init non presente');
          }
      }*/
  }
  }
  
  function StdAggiornaCampoTextarea(el){
  
      var hid=$(el).attr('hid');
      
  //	console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      var val=$(el).val();
      var firecallback=true;
      if (nodo!=undefined){
         var prev=nodo[campo];
        
         if (prev==val){
          firecallback=false;
         }else{
             nodo[campo]=val;
         }
          
      }else{
          console.log('ERRORE: '+hid+' NON TROVATO IN MEMORIA!!!!');
      }
      $(el).hide(200);
      $(el).parent().find('span').html(val);
      $(el).parent().find('span').show(50);
      if (nodo!=undefined ){
         
      }
  }
  
  function StdAggiornaCampoTextareaW(el){
  
      var hid=$(el).attr('hid');
      
  //	console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      var val=$(el).val();
      var firecallback=true;
      if (nodo!=undefined){
         var prev=nodo[campo];
          
         if (prev==val){
          firecallback=false;
         }else{
             nodo[campo]=val;
         }
          
      }else{
          console.log('ERRORE: '+hid+' NON TROVATO IN MEMORIA!!!!');
      }
      //$(el).hide(200);
      //$(el).parent().find('span').html(val);
      //$(el).parent().find('span').show(50);
      if (nodo!=undefined ){
         
      }
  }
  
  function lockSlidePanel(el){
      if ($(el).parent().hasClass('fixed')){
              $(el).parent().removeClass('fixed'); 
              $(el).parent().find('[tipo=\'lock\']').css('display','none'); 
          }else{
              $(el).parent().addClass('fixed');
              $(el).parent().find('[tipo=\'lock\']').css('display','');
          }
  }
  
  
  function PrvSelezionaVista(el){
      StdSelezionaVista(el);
  
  }
  
  function StSelezionaVista(el){
      StdSelezionaVista(el);
  
  }
  
  
  function StdSelezionaVista(el){
      var hid=$(el).attr('vista');
      var vista=Risorsa.get(hid);
    
      if (vista!=undefined){
          console.log('VISTA:'+JSON.stringify(vista));
          var lista=vista.LISTACAMPI;
          if (lista!=undefined){
              var ls=[];
              var valore='';
              for (var i=0;i<lista.length;i++){
                  var ele={};
                  ele.TESTO=lista[i].DESCRIZIONE;
                  ele.VAL=lista[i].CAMPO;
                  ls.push(ele);
                  if (lista[i].VISIBILITY=='hidden'){
  
                  }else{
                      if (valore.length>0){
                          valore=valore+','+ele.VAL;
                      }else{
                          valore=ele.VAL;
                      }   
                      
                  }
              }
              var contenuto=getServerModule('Report','SELVISTA');
  
             /* var panel=getPanel('STDEDITOBJECT');
              if (panel==undefined){
                  panel=$('#search_container').clone();
                  $(panel).attr('id','PANEL'+generateID());
                  
                  $(panel).find('[titolo]').html('Modifica di '+vista.DESCRIZIONE);
                  var container=$(panel).find('[tipo=\'container\']');
  
               
                  $(container).append(contenuto);
                  
  
                  
                  
                      
                      $(container).find('button').each(function (){
                                  $(this).attr('hid',ogg.HID);
                                  });
                      
                  
                  
                  
  
                  
                  
                  
                  
                  
              
  
                  $(panel).draggable({
                      handle: '.section-header, .modal-footer',
                  });
                  
                  $(panel).css('display','');
                  
                  var pos=getDimensions(el);
                  var posp=getDimensions(panel);
              //	var x1=pos.x1-50-posp.x2;
                  var x1=pos.x1+100;
                  var y1=pos.y1;
                  $(panel).css({'background-color':'#ffffff','position':'absolute','left': x1, 'top': y1, 'display': 'block'});
                  addPanel('ARTICLEOK',panel);
                  StdSelectizeMulti($(panel).find('[tipo=\'SELVISTA\']').find('[vistainput]'),ls);
                      
              }*/
              var parm=new Risorsa('INPUT');
              parm.VISTAHID=vista.HID;
              parm.VAL=valore;
             var pos=$(el).closest('th');
              console.log('POS:'+pos.length+' EL:'+$(el).parent());
              $(pos).find('[tipo=\'SELVISTA\']').remove();
              $(pos).append(contenuto);
              $(pos).find('[tipo=\'SELVISTA\']').find('[vistainput]').val(valore);
              $(pos).find('[tipo=\'SELVISTA\']').find('[vistainput]').attr('hid',parm.HID);
              $(pos).find('[tipo=\'SELVISTA\']').find('[campoass]').attr('hid',parm.HID);
              StdSelectizeMulti($(pos).find('[tipo=\'SELVISTA\']').find('[vistainput]'),ls);
          }   
  
      }else{
          errorMessage('Vista corrente non modificabile:'+hid);
      }
  
  }
  
  function StdSalvaVista(el){
      var hid=$(el).attr('hid');
      var parm=Risorsa.get(hid);
      if (parm!=undefined){
          var vhid=parm.VISTAHID;
          var vista=Risorsa.get(vhid);
          if (vista!=undefined){
              if (vista._CLOK=='ALL'){
                  var nv=new Risorsa('VISTA');
                  Risorsa.copy(vista,nv);
                  Risorsa.save(nv);
              }
          }else{
              
              errorMessage('Vista corrente non modificabile:'+vhid);
              
          }
      }
  }
  
  function StdCambiaVista(el){
  var hid=$(el).attr('hid');
  var parm=Risorsa.get(hid);
  if (parm!=undefined){
      parm.VAL=$(el).val();
      var vhid=parm.VISTAHID;
      var vista=Risorsa.get(vhid);
      if (vista!=undefined){
          console.log('Ottimo. Modifichiamo la vista');
          var saveVista=vista._LISTACAMPI;
          if (saveVista==undefined){
              vista._LISTACAMPI=vista.LISTACAMPI;
          }
          var val=parm.VAL;
          var lsc=val.split(",",-1);
          var fatto={};
          var lista=vista._LISTACAMPI;
          vista.LISTACAMPI=[];
          for (var i=0;i<lsc.length;i++){
              for (var j=0;j<lista.length;j++){
                  if (lsc[i]==lista[j].CAMPO){
                      var lj=cloneObj(lista[j]);
                      lj.VISIBILITY='visible';
                      vista.LISTACAMPI.push(lj);
                      fatto[lsc[i]]=true;
                  }
              }
          }
          for (var j=0;j<lista.length;j++){
              if (!fatto[lista[j].CAMPO]){
                  var lj=cloneObj(lista[j]);
                  if (lista[j].CAMPO!='ACTIONS' && lista[j].CAMPO!='ACTIONSTH')
                      { 
                      lj.VISIBILITY='hidden';
                      }
  
                  vista.LISTACAMPI.push(lj);
                  fatto[lista[j].CAMPO]=true;
              }
          }
          StdApplyVisibility(vista);
  
  
      }else{
          errorMessage('Vista corrente non modificabile:'+vhid);
      }
  }
  
  }
  
  function lockSlidePanel3(el){
      var who=$(el).parent().parent();
      if ($(who).hasClass('fixed')){
              $(who).removeClass('fixed'); 
              $(who).find('[tipo=\'lock\']').css('display','none'); 
          }else{
              $(who).parent().addClass('fixed');
              $(who).parent().find('[tipo=\'lock\']').css('display','');
          }
  }
  function lockSlidePanel4(el){
      var who=$(el).closest('.menuSlider');
      console.log('CLOSEST:'+who.length);
      if ($(who).hasClass('fixed')){
          console.log('CLOSEST HA LA CLASSE FIXED.');
              $(who).removeClass('fixed'); 
              $(who).find('[tipo=\'lock\']').css('display','none'); 
          }else{
              console.log('CLOSEST NON HA LA CLASSE FIXED.');
              $(who).addClass('fixed');
              $(who).find('[tipo=\'lock\']').css('display','');
              /*
              $(who).parent().addClass('fixed');
              $(who).parent().find('[tipo=\'lock\']').css('display','');
              */
          }
  }
  
  
  function errorMessage(msg,testo){
      if (msg){
          $('#msgError').find('[campo=\'Msg\']').html(msg);
          }
      if (testo){
          $('#msgError').find('[campo=\'Text\']').html(testo);
          }
      //$('#msgError').css({'position':'absolute','top':'50% !important'})  ; 
     // $('#msgError').css({'position':'fixed','top':'50%','left':'40%'})  ;
      $('#msgError').modal("show");       
     
  }
  
  function Message(msg,testo){
      if (msg){
          $('#msgInfo').find('[campo=\'Msg\']').html(msg);
          }
      if (testo){
          $('#msgInfo').find('[campo=\'Text\']').html(testo);
          }
      //$('#msgError').css({'position':'absolute','top':'50% !important'})  ; 
     // $('#msgError').css({'position':'fixed','top':'50%','left':'40%'})  ;
      $('#msgInfo').modal("show");       
     
  }
  
  function StdAggiornaCampoSimple(el){
  
      var hid=$(el).attr('hid');
      
  //	console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      var val=$(el).val();
      var firecallback=true;
      if (nodo!=undefined){
         var prev=nodo[campo];
        
         if (prev==val){
          firecallback=false;
         }else{
             nodo[campo]=val;
         }
          
      }else{
          console.log('ERRORE: '+hid+' NON TROVATO IN MEMORIA!!!!');
      }
      $(el).hide(200);
      $(el).parent().find('span').html(val);
      $(el).parent().find('span').show(50);
      if (nodo!=undefined ){
         
      }
  }
  
  
  
  function StdAggiornaCampo(el){
  
      var hid=$(el).attr('HID');
      
  //	console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      var val=$(el).val();
      var firecallback=true;
      if (nodo!=undefined){
         var prev=nodo[campo];
        
         if (prev==val){
          firecallback=false;
         }else{
             nodo[campo]=val;
         }
          
      }else{
          console.log('ERRORE: '+hid+' NON TROVATO IN MEMORIA!!!!');
      }
      $(el).attr('type','hidden');
      $(el).parent().find('span').html(val);
      $(el).parent().find('span').show(50);
      if (nodo!=undefined ){
          if (typeof nodo.callbackUpdate === 'function'){
              nodo.callbackUpdate(hid, campo,val,el, prev);
          }
      }
  }
  
  
  function StdModifica(el){
  
      var hid=$(el).attr('hid');
      
      console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      var val=$(el).val();
      var firecallback=true;
      if (nodo!=undefined){
         //var prev=nodo[campo];
         var prev=getValore(nodo,campo);
  
         console.log('HID:CAMPO:VALORE '+nodo.HID+':'+campo+':'+nodo[campo]+' prev:'+prev+" val:"+val);
         if (prev==val){
          firecallback=false;
         }else{
             //nodo[campo]=val;
             var s=campo.split('.');
             var rec=nodo;
             for (var i=0;i<s.length-1;i++){
                 if (rec[s[i]] ==undefined){
                     rec[s[i]]={};
                 }
                 rec=rec[s[i]];
             }
             rec[s[s.length-1]]=val;
             rec.MODIFIED = true;
          //   console.log('HID:CAMPO:VALORE '+nodo.HID+':'+campo+':'+nodo[campo]);
         }
          
      }else{
          console.log('ERRORE: '+hid+' NON TROVATO IN MEMORIA!!!!');
      }
     
      if (nodo!=undefined && firecallback ){
       //   console.log('nodo.callbackUpdate:'+nodo.callbackUpdate);
          if (typeof nodo.callbackUpdate === 'function'){
              nodo.callbackUpdate(hid, campo,val,el, prev);
          }
      }
  }
  
  function StdModificaDiv(el){
  
      var hid=$(el).attr('hid');
      
      console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      var val=$(el).html();
      var firecallback=true;
      if (nodo!=undefined){
         //var prev=nodo[campo];
         var prev=getValore(nodo,campo);
  
         console.log('HID:CAMPO:VALORE '+nodo.HID+':'+campo+':'+nodo[campo]+' prev:'+prev+" val:"+val);
         if (prev==val){
          firecallback=false;
         }else{
             //nodo[campo]=val;
             var s=campo.split('.');
             var rec=nodo;
             for (var i=0;i<s.length-1;i++){
                 if (rec[s[i]] ==undefined){
                     rec[s[i]]={};
                 }
                 rec=rec[s[i]];
             }
             rec[s[s.length-1]]=val;
  
          //   console.log('HID:CAMPO:VALORE '+nodo.HID+':'+campo+':'+nodo[campo]);
         }
          
      }else{
          console.log('ERRORE: '+hid+' NON TROVATO IN MEMORIA!!!!');
      }
     
      if (nodo!=undefined && firecallback ){
       //   console.log('nodo.callbackUpdate:'+nodo.callbackUpdate);
          if (typeof nodo.callbackUpdate === 'function'){
              nodo.callbackUpdate(hid, campo,val,el, prev);
          }
      }
  }
  
  function StdModificaNumber(el){
  
      var hid=$(el).attr('hid');
      
      console.log('DATA:'+hid);
      var tipoParse='float';
      var step=$(el).attr('step');
      if (step!=undefined){
          step=parseFloat(''+step);
          if (step>=1){
              tipoParse='int';
          }
      }
      
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      var val=$(el).val();
      switch (tipoParse) {
          case "int":
              val=parseInt(''+val);
              break;
  
          case "float":
                  val=parseFloat(''+val);
                  break;    
      
          default:
  
              break;
      }
      var firecallback=true;
      if (nodo!=undefined){
         //var prev=nodo[campo];
         var prev=getValore(nodo,campo);
  
         console.log('HID:CAMPO:VALORE '+nodo.HID+':'+campo+':'+nodo[campo]+' prev:'+prev);
         if (prev==val){
          firecallback=false;
         }else{
             //nodo[campo]=val;
             var s=campo.split('.');
             var rec=nodo;
             for (var i=0;i<s.length-1;i++){
                 if (rec[s[i]] ==undefined){
                     rec[s[i]]={};
                 }
                 rec=rec[s[i]];
             }
             rec[s[s.length-1]]=val;
  
          //   console.log('HID:CAMPO:VALORE '+nodo.HID+':'+campo+':'+nodo[campo]);
         }
          
      }else{
          console.log('ERRORE: '+hid+' NON TROVATO IN MEMORIA!!!!');
      }
     
      if (nodo!=undefined && firecallback ){
       //   console.log('nodo.callbackUpdate:'+nodo.callbackUpdate);
          if (typeof nodo.callbackUpdate === 'function'){
              nodo.callbackUpdate(hid, campo,val,el,prev);
          }
      }
  }
  
  
  function StdAggiornaCampov2(el,nohide){
  
      var hid=$(el).attr('HID');
      
  //	console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoval');
      var val=$(el).val();
      var firecallback=true;
      if (nodo!=undefined){
         var prev=nodo[campo];
        
         if (prev==val){
          firecallback=false;
         }else{
             nodo[campo]=val;
         }
          
      }else{
          console.log('ERRORE: '+hid+' NON TROVATO IN MEMORIA!!!!');
      }
      if (nohide!=undefined){
          $(el).attr('type','hidden');
          $(el).parent().find('span').html(val);
          $(el).parent().find('span').show(50);
          }
      if (nodo!=undefined ){
          if (typeof nodo.callbackUpdate === 'function'){
              nodo.callbackUpdate(hid, campo,val,el);
          }
      }
  }
  
  function  StdEditSelect(el){
      var td=$(el);
      var span=$(td).find('span[campo]');
      //span.find('input').attr('type','text');
      span.find('span').hide(200);
      
  
      //span.find('input').show();
      
      span.find('select').show(50).focus();
  }
  
  function  StdEditSelect2(el){
      var span=$(el);
      //var span=$(td).find('span[campo]');
      //span.find('input').attr('type','text');
      span.find('span').hide(200);
      
  
      //span.find('input').show();
      
      span.find('select').show(50).focus();
  }
  
  
  function StdHideCampoSelect(el){
      $(el).hide(50);
      $(el).parent().find('span').show(50);
  }
  
  
  
  
  function StdAggiornaCampoSelect(el){
      var hid=$(el).attr('HID');
      
  //	console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      var val=$(el).val();
      var firecallback=true;
      if (nodo!=undefined){
         var prev=nodo[campo];
        
         if (prev==val){
          firecallback=false;
         }else{
             nodo[campo]=val;
         }
          $(el).parent().find('span').html($(el).val());
      }
     
      
      if (nodo!=undefined ){
          if (typeof nodo.callbackUpdate === 'function'){
              nodo.callbackUpdate(hid, campo,val,el);
          }
      }
  }    
  
  function  StdEditCampoLista(el){
      var span=$(el);
      //var span=$(td).find('span[campo]');
      if (span.find('input').is(":hidden") ){
      span.find('input').show(50);
      span.find('select').show(200);
      span.find('img').show(200);
      span.find('span').hide(200);
      //span.find('input').show();
      //span.find('input').focus();
      var hid=$(el).attr('hid');
      if (hid!=undefined){
          var nodo=Risorsa.get(hid);
         /* if (nodo!=undefined ){
          if (typeof nodo.initEdit === 'function'){
              console.log('callback init presente');
              nodo.initEdit(el);
          }else{
           //   console.log('callback init non presente');
          }
      }*/
  }
      }
  }
  
  
  function StdHideCampoLista(el){
      $(el).parent().find('input').hide(50);
      $(el).parent().find('select').hide(50);
      $(el).parent().find('img').hide(50);
      $(el).parent().find('span').show(50);
  }
  
  
  
  
  function StdAggiornaCampoLista(el){
      var hid=$(el).attr('hid');
      
  //	console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoass');
      var val=$(el).val();
      var firecallback=true;
      if (nodo!=undefined){
         var prev=nodo[campo];
        
         if (prev==val){ 
          firecallback=false;
         }else{
             nodo[campo]=val;
         }
          $(el).parent().find('span').html($(el).val());
          $(el).parent().find('select').val($(el).val());
          $(el).parent().find('input').val($(el).val());
      }
     
      
      if (nodo!=undefined ){
          if (typeof nodo.callbackUpdate === 'function'){
              nodo.callbackUpdate(hid, campo,val,el);
          }
      }
  }    
  
  
  /**** 
   * Gestione pannelli
   */
  //var panelsActive={};
  function addPanel(tipoPannello,panel){
      if (panel!=undefined){
          $(panel).attr('paneltype',tipoPannello);
          $(panel).find('[bottone=\'close\']').attr('onclick','StdClose(\''+tipoPannello+'\');');
          panelsActive[tipoPannello]=panel;
          $('body').append(panel);
      }
  
  }
  
  function StdClose(tipoPannello){
      var panel=panelsActive[tipoPannello];
      if (panel!=undefined){
          panel.hide(400);
          panel.remove();
          delete panelsActive[tipoPannello];
      }
  }
  
  function getPanel(tipoPannello){
      return(panelsActive[tipoPannello]);
  }
  
  
  /**
   * Easy tabs
   */
  ;(function ($) {
      $.fn.tabs = function (options) {
          var settings = $.extend({}, {
              type: "mouseover",
              speed: 0,
              animation: "toogle"
          }, options);
          var animationMethod = "";
  
          switch (settings.animation) {
              case "fade":
                  animationMethod = "fadeIn";
                  break;
              case "slide":
                  animationMethod = "slideDown"
                  break;
              case "toogle":
                  animationMethod = "show";
                  break;
              default:
                  animationMethod = "show";
                  break;
          }
  
         var $titles = this.children("ul").children("li");
         var  $contents = this.children("div").children("div");
  
          $titles.each(function (index) {
              $(this).bind(settings.type, function () {
                  var $content = $contents.filter(":eq(" + index + ")");
                  $(this).addClass("active")
                         .siblings().removeClass("active");
                  if (!$content.is(":animated")) {
                      $content[animationMethod](settings.speed)
                              .siblings().hide();
                  }
              })
          });
      }
  }(jQuery));
  
  
  /**
   * Plot graph
   * 
   */
  
   var stdcolors=[
   '#004c6d',
   '#255e7e',
   '#3d708f',
   '#5383a1',
   '#6996b3',
   '#7faac6',
   '#94bed9',
   '#abd2ec',
   '#c1e7ff',
   '#17a62d',
   '#39af3f',
   '#50b950',
   '#64c261',
   '#77cb72',
   '#88d482',
   '#9ade93',
   '#aae7a3',
   '#bbf0b4'];
  
   var previousPoint = null;
  
  
   function addPoint(recs,val,label){
       if (recs!=undefined){
     var v={
          'label':label,
          data:val,
          color:stdcolors[recs.length]
      };
      recs.push(v);
      }else{
          console.log('Grave mancanza in recs:'+recs);
      }
   }
  
   function DonutChartHop(id){
       this.chrt={
          type: 'doughnut',
          data: {
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: ['#EDBD40','#377D7C','#ACBBBC','#D3E3E3', '#E9790B',
              '#004c6d',
              '#255e7e',
              '#3d708f',
              '#5383a1',
              '#6996b3',
              '#7faac6',
              '#94bed9',
              '#abd2ec'],
              hoverBackgroundColor: ['#EDBD40','#4C9F9D','#ACBBBC','#D3E3E3', '#E9790B',
              '#17a62d',
              '#39af3f',
              '#50b950',
              '#64c261',
              '#77cb72',
              '#88d482',
              '#9ade93',
              '#aae7a3',
              '#bbf0b4'
              ],
              hoverBorderColor: "rgba(234, 236, 244, 1)",
              recs:[]
            }],
          },
          options: {
            maintainAspectRatio: false,
            tooltips: {
              backgroundColor: "rgb(255,255,255)",
              bodyFontColor: "#858796",
              borderColor: '#dddfeb',
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              caretPadding: 10,
            },
            legend: {
              display: false
                /*position: 'bottom'*/
            },
            cutoutPercentage: 65,
          },
        };
  
  
        this.addDonutPoint=function (val,label,rec){
     
         
          /*var v={
               'label':label,
               data:val,
               color:stdcolors[recs.length]
           };
           recs.push(v);*/
           this.chrt.data.labels.push(label);
           this.chrt.data.datasets[0].data.push(val);
           this.chrt.data.datasets[0].recs.push(rec);
           
        
        }
    
        this.plotDonutHop=function (el,cont){
            if ($(el).length<1){
                console.log('Nessun elemento in cui inserire il grafico');
                return;
            }
            var chop=new Chart($(el)[0], this.chrt);
            this.chrt._CHART=chop;
        }
  
        //return(this);
  
        
  
  
   }
  
   function addDonutPoint(chartHOP,val,label){
     
          if (chartHOP!=undefined){
        /*var v={
             'label':label,
             data:val,
             color:stdcolors[recs.length]
         };
         recs.push(v);*/
         chartHOP.data.labels.push(label);
         chartHOP.data.datasets[0].data.push(val);
         }else{
             console.log('Grave mancanza in recs:'+chartHOP);
         }
      
   }
  
  
  function plotDonutHop(chartHOP,el,cont){
      if ($(el).length<1){
          console.log('Nessun elemento in cui inserire il grafico');
          return;
      }
      var chop=new Chart($(el)[0], chartHOP);
      chartHOP._CHART=chop;
  }
  
  
  function plotDonut(el,dati,container){
  /*var donutData = [
      {
        label: 'Series2',
        data : 30,
        color: '#3c8dbc'
      },
      {
        label: 'Series3',
        data : 20,
        color: '#0073b7'
      },
      {
        label: 'Series4',
        data : 50,
        color: '#00c0ef'
      }
    ];
    */
   var dim=getDimensions(el);
   if (dim==undefined){
       return;
   }
   showLabel=false;
    if (dati.length<5){
      showLabel=true;
    }
    try {
      $.plot(el, dati, {
          series: {
            pie: {
              show       : true,
              radius     : 1,
              innerRadius: 0.5,
              label      : {
                show     : showLabel,
                radius   : 2 / 3,
                formatter: labelFormatter,
                threshold: 0.1
              }
      
            }
          },grid: {
              hoverable: true,
              clickable: true
          },
          legend: {
            show: false
          }
        }); 
        
        $(el).bind("plothover", function (event, pos, item) {
          // $("#x").text(pos.x.toFixed(2));
          // $("#y").text(pos.y.toFixed(2));
           console.log('Plothover fired');
           if ($(el).data('dontshowtooltip')==undefined) {
               if (item) {
                   if (previousPoint != item.dataIndex) {
                       previousPoint = item.dataIndex;
                       
                       $("#tooltipPlot").remove();
                      /* var x = item.datapoint[0].toFixed(2),
                           y = item.datapoint[1].toFixed(2);
                       */
                      var x = item.datapoint[0],
                           y = item.datapoint[1];
                         var xpos=window.event.pageX;
                          var  ypos=window.event.pageY;
  
                           console.log('X,Y:'+x+','+y);
                       showTooltip(xpos, ypos,
                                   item.series.label + "  " + x.toFixed(2) +'%');
                   }
               }
               else {
                   $("#tooltipPlot").remove();
                   previousPoint = null;            
               }
           }else{
               console.log('Tooltip non displayabile');
           }
       });
       
       
       $(el).bind("plotclick", function (event, pos, item) {
           if (item) {
               var vx=Math.round(item.datapoint[0]*100)/100;
               $(container).find('[campo=\'clickdata\']').text("Dettaglio "+" per " + item.series.label + ":"+vx+' %');
             //  plot.highlight(item.series, item.datapoint);
           }
       });
  
  
    } catch (error) {
        console.log('ERROR PLOT:'+error);
    }
    
   
  
  }
  
  function hideToolTipThis(){
      $('.tooltipPlotThis').hide(200).remove();
  }
  
  
  function showToolTipThis(el){
      var tooltip=$(el).attr('tooltip');
      if (tooltip!=undefined && tooltip.length>0){
          var pos=getDimensions(el);
          var x=pos.x1+5;
          var y=pos.y1+20;
      $('<div class="tooltipPlotThis">' + tooltip + '</div>').css( {
          position: 'absolute',
          display: 'none',
          top: y + 5,
          left: x + 5,
          border: '1px solid #fdd',
          padding: '2px',
          'background-color': '#fee',
          opacity: 0.80,
          'z-index':6000
      }).appendTo("body").fadeIn(200);
      var tt=$('#tooltipPlot');
      console.log('display tooltip at '+x+':'+y+':'+$(tt).length);
  
      }
  }
  
  
  function showTooltip(x, y, contents) {
      $('<div id="tooltipPlot">' + contents + '</div>').css( {
          position: 'absolute',
          display: 'none',
          top: y + 5,
          left: x + 5,
          border: '1px solid #fdd',
          padding: '2px',
          'background-color': '#fee',
          opacity: 0.80,
          'z-index':6000
      }).appendTo("body").fadeIn(200);
      var tt=$('#tooltipPlot');
      console.log('display tooltip at '+x+':'+y+':'+$(tt).length);
  }
  
  
  
  
  function labelFormatter(label, series) {
      //return '<div style="font-size:13px; text-align:center; padding:2px; color: #fff;background-color:'+stdcolors[12]+'; font-weight: 600;">'
      
      return '<div class="morris-hover morris-default-style" style="padding:2px;margin-left:-16px;margin-top:-10px">'
        + label
        + '<br>'
        + Math.round(series.percent) + '%</div>'
    }
  
    function replaceCampi(el,r){
        if (r==undefined){
            return;
        }
        var hid=r.HID;
        if (hid!=undefined){
            var res=Risorsa.get(hid);
            if (res==undefined){
                Risorsa.registerElement(res);
            }
        }
        
      $(el).find('[campoass]').each(function (){
          $(this).attr('hid',hid);
          var cmp=$(this).attr('campoass');
          if (r[cmp]!=undefined){
              $(this).html(r[cmp]);
              }
      });
      $(el).find('[campoicon]').each(function (){
          $(this).attr('hid',hid);
          var cmp=$(this).attr('campoicon');
          if (r[cmp]!=undefined){
              $(this).removeClass();
              $(this).addClass(r[cmp]);
              }
      });
      $(el).find('[campohref]').each(function (){
          $(this).attr('hid',hid);
          var cmp=$(this).attr('campohref');
          if (r[cmp]!=undefined){
              $(this).attr('href',r[cmp]);
              }
      });
      $(el).find('[campoval]').each(function (){
          $(this).attr('hid',hid);
          var cmp=$(this).attr('campoval');
          if (r[cmp]!=undefined){
              $(this).val(r[cmp]);
              }
      });
    }
  
  function chartData(){
      var chartD={
          labels:[],
          datasets:[],
          dati:{
              datasets: {backgroundColor: ["#EDBD40", "#F00", "#E9790B", "#E9790B"]}
          },
          xdati:{}
      };
      return(chartD);
  };
  
  
  function chartDataAddPoint(chartData,labelx,serie,val){
      var xdati=chartData.xdati;
      var xdata=xdati[labelx];
      if (xdata==undefined){
          xdati[labelx]=chartData.labels.length;
          chartData.labels.push(labelx);
          xdata=xdati[labelx];
      }
      
      
      var rowData=chartData.dati[serie];
      if (rowData==undefined){
          rowData={
              'label':serie,
              'data':[],
              backgroundColor:stdcolors[chartData.datasets.length]
          };
          chartData.dati[serie]=rowData;
          chartData.datasets.push(rowData);
      }
      rowData.data[xdata]=val;
  }
  
  function chartSetDescrizione(chartData,serie,descr){
      var rowData=chartData.dati[serie];
      rowData.DESCRIZIONE=descr;
  }
  
  /**
   * dati:var areaChartData = {
        labels  : ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label               : 'Electronics',
            fillColor           : 'rgba(210, 214, 222, 1)',
            strokeColor         : 'rgba(210, 214, 222, 1)',
            pointColor          : 'rgba(210, 214, 222, 1)',
            pointStrokeColor    : '#c1c7d1',
            pointHighlightFill  : '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data                : [65, 59, 80, 81, 56, 55, 40]
          },
          {
            label               : 'Digital Goods',
            fillColor           : 'rgba(60,141,188,0.9)',
            strokeColor         : 'rgba(60,141,188,0.8)',
            pointColor          : '#3b8bba',
            pointStrokeColor    : 'rgba(60,141,188,1)',
            pointHighlightFill  : '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data                : [28, 48, 40, 19, 86, 27, 90]
          }
        ]
      }
   */
  
    function plotBarChart(el,dati,container,valmax,testo,valtot,testo2){
        //-------------
      //- BAR CHART -
      //-------------
      var arrayColori = ["#234C50"];
      for(var i=0; i<dati.datasets.length; i++){
          dati.datasets[i].backgroundColor = arrayColori[i % arrayColori.length];
      }
      console.log("CHART DATI: " + JSON.stringify(dati));
      var beginAtZero=false;
      if (dati.startzero!=undefined){
          beginAtZero=true;
      }
      var barChartCanvas                   = $(el).get(0).getContext('2d')
      //var barChart                         = new Chart(barChartCanvas)
      var barChartData                     = dati
      var barChartOptions                  = {
       scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:beginAtZero
                  }
              }],
              xAxes: [{
                  ticks: {
                    autoSkip: false,
                              maxRotation: 60,
                              minRotation: 0,
                    maxTicksLimit: 20,
                      showXLabels: 10 
                  },
                  maxBarThickness: 25,
                }],
                
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      }
          },
          tooltips: {
              callbacks: {
                // tooltipItem is an object containing some information about the item that this label is for (item that will show in tooltip). 
                // data : the chart data item containing all of the datasets
                label: function(tooltipItem, data) {
                  // Return string from this function. You know the datasetIndex and the data index from the tooltip item. You could compute the percentage here and attach it to the string.
                // alert('tooltipitem:'+JSON.stringify(tooltipItem));
                 var v='[';
                 var valmax=data.valmax;
                 var valtot=data.valtot;
                 var testo=data.testo;
                 var testo2=data.testo2;
                 for (var x in data){
                     v=v+", '"+x+"'";
                 }
                 v=v+"]";
                //alert('data.x:'+JSON.stringify(v));
                 if (valmax!=undefined){
                     try {
                      var val=numeroArr((tooltipItem.yLabel-valmax)*100/valmax);
                      return(tooltipItem.xLabel+' - Valore:'+tooltipItem.yLabel+' '+testo+':'+val+' % ');
                     } catch (error) {
                         console.log('ERRORE BARCHART LABEL :'+error);
                     }
                     
                     return(tooltipItem.xLabel+' : '+tooltipItem.yLabel);
                 }else{
                  if (valtot!=undefined){
                              try {
                              var val=numeroArr((tooltipItem.yLabel)*100/valtot);
                              return(tooltipItem.xLabel+' - Valore:'+tooltipItem.yLabel+' '+testo2+':'+val+' % ');
                              } catch (error) {
                                  console.log('ERRORE BARCHART LABEL :'+error);
                              }
                          }
                  var idx=tooltipItem.datasetIndex;
                  var rowData=data.datasets[idx];
                  if (rowData.DESCRIZIONE!=undefined){
                      return(rowData.DESCRIZIONE+' : '+tooltipItem.yLabel);
                  }        
                  
                  return(tooltipItem.xLabel+' : '+tooltipItem.yLabel);
                 }
                 
                }
              }
          },
        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero        : true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines      : true,
        //String - Colour of the grid lines
        scaleGridLineColor      : 'rgba(0,0,0,.05)',
        //Number - Width of the grid lines
        scaleGridLineWidth      : 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines  : true,
        //Boolean - If there is a stroke on each bar
        barShowStroke           : true,
        //Number - Pixel width of the bar stroke
        barStrokeWidth          : 2,
        //Number - Spacing between each of the X value sets
        barValueSpacing         : 5,
        //Number - Spacing between data sets within X values
        barDatasetSpacing       : 1,
        //String - A legend template
        legendTemplate          : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
        //Boolean - whether to make the chart responsive
        responsive              : true,
        maintainAspectRatio     : true,
        legend: {
          display: false,
          labels: {
              fontColor: 'rgb(255, 99, 132)'
          }
      },
      cornerRadius: 20
      
  }
  
      barChartOptions.datasetFill = false;
  
      var barChart = new Chart(barChartCanvas, {
          type: 'bar',
          data: dati,
          options: barChartOptions
       });
       var chart=new Risorsa('CHART');
       chart.chart=barChart;
       $(container).attr('chart',chart.HID);
     // var barChart = new Chart(barChartCanvas,)
      //barChart.Bar(dati, barChartOptions);
    }
  
   function chartUpdate(chartHID,data){ 
       var chr=Risorsa.get(chartHID);
      /* chart.data.labels.pop();
      chart.data.datasets.forEach((dataset) => {
          dataset.data.pop();
      });
      chart.data.labels.push(label);
      chart.data.datasets.forEach((dataset) => {
          dataset.data.push(data);
      });*/
      if (chr!=undefined){
          var chart=chr.chart;
          if (chart!=undefined){
              chart.data=data;
              chart.update();
          }
      }
  
   }
  
  
  
  /**
   * End grafici
   */
  
  
    /**
     * 
     * @param {*} target 
     * @param {*} lista 
     */
  
    function StdSelectizeSingleLibero(target, lista, hid_ogg, campo){
       
        if (lista!=undefined){
          console.log('SELECTIZE SINGLE:'+ JSON.stringify(lista));
        }else{
          console.log('SELECTIZE SINGLE:'+lista);
        }
      $(target).selectize({
          //$('#ReportCliente').find('.report_options').selectize({	
              //plugins: ['remove_button'],
              persist: false,
              create: true,
              valueField: 'VAL',
              labelField: 'TESTO',
              searchField: 'TESTO',
              maxItems: 1,
           /*   dropdownParent : 'body',*/
              insert: true,
              options:lista,
              render: {
                  
                  item: function(data, escape) {
                      console.log("render: " + '<div>' + escape(data.TESTO) + '</div>');
                      return '<div>' + escape(data.TESTO) + '</div>';
                  }
              },
              onChange: function (values){
                 // console.log('Selectize Changed:'+JSON.stringify(values));
                  var hid=$(this).attr('hid');
                  console.log('Selectize Changed:'+JSON.stringify(values)+' HID:'+hid);
              },
              onOptionAdd: function(value, data){
                  console.log('AGGIUNTA OPZIONE - data: ' + JSON.stringify(data) + " ; value: " + value + " ; hid: " + hid_ogg+ " ; campo: " + campo);
                  var ogg = Risorsa.get(hid_ogg);
                  if(ogg != undefined){
                      if (typeof ogg.callbackAddItem === 'function'){
                        ogg.callbackAddItem(hid_ogg, data, value, this, campo);
                      }
                  }
              },
              onDelete: function(values) {
              //	return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
              }
          });
    }
  
    async function applyLinkNew(hidnew){
        var oggnew=Risorsa.get(hidnew);
        
        var oggtarhid=linkNew.HID;
        if (oggnew!=undefined && oggtarhid!=undefined){
            var oggtarget=Risorsa.get(oggtarhid);
            if (oggtarget!=undefined){
              var campo=linkNew.CAMPO;
              if (oggtarget.callbackUpdate!=undefined){
                  console.log('EL:'+linkNew.EL);
                  oggtarget.callbackUpdate(oggtarhid,campo,hidnew,linkNew.EL);
                  linkNew={};
                  }
              }
            }
        }
    
  
    function StdSelectizeSingle(target,lista){
      /* $(target).parent().find('.selectize-control').remove();
      $(target).css('display','');
      $(target).selectize()[0].selectize.destroy(); */
      /* if( $(target).selectize != undefined ){        
          if ( $(target).selectize()[0]!=undefined &&  $(target).selectize()[0].selectize!=undefined){
                console.log("StdSelectizeSingle... DEVO DISTRUGGERE LA SELECTIZE SINGLE!!!");
                $(target).selectize()[0].selectize.destroy();
          }
      } */
      if (lista!=undefined){
        console.log('SELECTIZE SINGLE:'+lista.length);
      }else{
        console.log('SELECTIZE SINGLE:'+lista);
      }
    $(target).selectize({
        //$('#ReportCliente').find('.report_options').selectize({	
            //plugins: ['remove_button'],
            delimiter: ';',
            persist: false,
            create: false,
            valueField: 'VAL',
            labelField: 'TESTO',
            searchField: 'TESTO',
            dropdownDirection:'auto',
          /*  dropdownParent: 'body',*/
            maxItems: 1,
            insert: false,
            options:lista,
            render: {
                
                item: function(data, escape) {
                    return '<div>' + escape(data.TESTO) + '</div>';
                }
            },
            onChange: function (values){
               // console.log('Selectize Changed:'+JSON.stringify(values));
                var hid=$(this).attr('hid');
                console.log('Selectize Changed:'+JSON.stringify(values)+' HID:'+hid);
            },
            onDelete: function(values) {
            //	return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
            }
        });
  }
  
  function StdSelectizeSingleHop(target, lista, destroy){
      /*  $(target).parent().find('.selectize-control').remove();
       $(target).css('display',''); */
    //  $(target).selectize()[0].selectize.destroy();
        if(destroy){
          distruggiSelectize(target);
        }
        if (lista!=undefined){
          console.log('SELECTIZE SINGLE:'+lista.length);
        }else{
          console.log('SELECTIZE SINGLE:'+lista);
        }
      $(target).selectize({
          //$('#ReportCliente').find('.report_options').selectize({	
              //plugins: ['remove_button'],
              delimiter: ';',
              persist: false,
              create: false,
              valueField: 'HID',
              labelField: 'DESCRIZIONE',
              searchField: 'DESCRIZIONE',
            /*  dropdownParent: 'body',*/
              maxItems: 1,
              insert: false,
              options:lista,
              render: {
                  
                  item: function(data, escape) {
                      return '<div>' + escape(data.DESCRIZIONE) + '</div>';
                  }
              },
              onChange: function (values){
                 // console.log('Selectize Changed:'+JSON.stringify(values));
                  var hid=$(this).attr('hid');
                  console.log('Selectize Changed:'+JSON.stringify(values)+' HID:'+hid);
              },
              onDelete: function(values) {
              //	return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
              }
          });
      
      /* var tooltip = $(target).attr('tooltip');
      if(tooltip!=undefined && tooltip.length>0){
          var onmouseover = $(target).attr('onmouseover');
          var onmouseout = $(target).attr('onmouseout');
          var secondInput = $(target).parent().find('input')[1];
          $(secondInput).attr('tooltip', tooltip);
          $(secondInput).attr('onmouseover', onmouseover);
          $(secondInput).attr('onmouseout', onmouseout);
      } */
  
    }
    
  
  
  
  function StdModificaSelect(el){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      var campo=$(el).attr('camposelect');
      if (ogg!=undefined){
          if (campo!=undefined){
              //ogg[campo]=$(el).val();
              var valore=$(el).val();
              var s=campo.split('.');
              var rec=ogg;
              for (var i=0;i<s.length-1;i++){
                  if (rec[s[i]] ==undefined){
                      rec[s[i]]={};
                  }
                  rec=rec[s[i]];
              }
              rec[s[s.length-1]]=valore;
              rec.MODIFIED = true;
              console.log('CAMPOSELECT '+campo+' '+ogg[campo]+ ':'+ogg.HID+':'+ogg.callbackUpdate);
              if (typeof ogg.callbackUpdate==='function'){
                //  var loc=ogg[campo];
                  ogg.callbackUpdate(hid,campo,valore,el);
  
              }
          }
      }
  }
  
  
  function StdModificaRadio(el){
  
      var hid=$(el).attr('hid');
      
      //	console.log('DATA:'+hid);
      
      var nodo=Risorsa.get(hid);
      var campo=$(el).attr('campoassr');
      var val=$(el).val();
      var firecallback=true;
      if (nodo!=undefined){
         var prev=nodo[campo];
         console.log('HID:CAMPO:VALORE '+nodo.HID+':'+campo+':'+nodo[campo]+' prev:'+prev);
         if (prev==val){
          firecallback=false;
         }else{
             nodo[campo]=val;
             console.log('HID:CAMPO:VALORE '+nodo.HID+':'+campo+':'+nodo[campo]);
         }
          
      }else{
          console.log('ERRORE: '+hid+' NON TROVATO IN MEMORIA!!!!');
      }
      
      if (nodo!=undefined && firecallback ){
          if (typeof nodo.callbackUpdate === 'function'){
              nodo.callbackUpdate(hid, campo,val,el);
          }
      }
      }
  
  function StdSelectizeSingleNobody(target,lista){
       
      if (lista!=undefined){
        console.log('SELECTIZE SINGLE:'+lista.length);
      }else{
        console.log('SELECTIZE SINGLE:'+lista);
      }
    $(target).selectize({
        //$('#ReportCliente').find('.report_options').selectize({	
            //plugins: ['remove_button'],
            persist: false,
            create: false,
            valueField: 'VAL',
            labelField: 'TESTO',
            searchField: 'TESTO',
            maxItems: 1,
            insert: false,
            options:lista,
            render: {
                
                item: function(data, escape) {
                    return '<div>' + escape(data.TESTO) + '</div>';
                }
            },
            onChange: function (values){
               // console.log('Selectize Changed:'+JSON.stringify(values));
                var hid=$(this).attr('hid');
                console.log('Selectize Changed:'+JSON.stringify(values)+' HID:'+hid);
            },
            onDelete: function(values) {
            //	return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
            }
        });
  }
  
    function StdSelectizeMulti(target,lista){
        if( $(target).selectize != undefined ){
            console.log("1 stdselectizemulti DISTRUGGO LA SELECTIZE!!!");
            if ( $(target).selectize()[0]!=undefined &&  $(target).selectize()[0].selectize!=undefined){
                  $(target).selectize()[0].selectize.destroy();
                  console.log("2 stdselectizemulti DISTRUGGO LA SELECTIZE!!!");
            }
        }
      $(target).selectize({
          //$('#ReportCliente').find('.report_options').selectize({	
              plugins: ['remove_button','drag_drop'],
              persist: false,
              create: false,
              valueField: 'VAL',
              labelField: 'TESTO',
              searchField: 'TESTO',
              dropdownDirection:'auto',
              /*dropdownParent: 'body',*/
              options:lista,
              render: {
                  
                  item: function(data, escape) {
                      return '<div>' + escape(data.TESTO) + '</div>';
                  }
              },
              onChange: function (values){
                 // console.log('Selectize Changed:'+JSON.stringify(values));
                  var hid=$(this).attr('hid');
                  console.log('Selectize Changed:'+JSON.stringify(values)+' HID:'+hid);
              },
              onDelete: function(values) {
              //	return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
              }
          });
    }
  
    function StdSelectizeMultiHop(target,lista){
      if( $(target).selectize != undefined ){
          console.log("1 stdselectizemultihop DISTRUGGO LA SELECTIZE!!!");
          if ( $(target).selectize()[0]!=undefined &&  $(target).selectize()[0].selectize!=undefined){
                $(target).selectize()[0].selectize.destroy();
                console.log("2 stdselectizemultihop DISTRUGGO LA SELECTIZE!!!");
          }
      }
    $(target).selectize({
        //$('#ReportCliente').find('.report_options').selectize({	
            plugins: ['remove_button','drag_drop'],
            persist: false,
            create: false,
            valueField: 'HID',
            labelField: 'DESCRIZIONE',
            searchField: 'DESCRIZIONE',
            dropdownDirection:'auto',
            /*dropdownParent: 'body',*/
            options:lista,
            render: {
                
                item: function(data, escape) {
                    return '<div>' + escape(data.DESCRIZIONE) + '</div>';
                }
            },
            onChange: function (values){
               // console.log('Selectize Changed:'+JSON.stringify(values));
                var hid=$(this).attr('hid');
                console.log('Selectize Changed:'+JSON.stringify(values)+' HID:'+hid);
            },
            onDelete: function(values) {
            //	return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
            }
        });
  }
  
    function StdSelectizeMultiLibero(target, lista, hid_ogg, campo){
      $(target).selectize({
          //$('#ReportCliente').find('.report_options').selectize({	
              plugins: ['remove_button','drag_drop'],
              persist: false,
              create: true,
              valueField: 'VAL',
              labelField: 'TESTO',
              searchField: 'TESTO',
              /*dropdownParent: 'body',*/
              options:lista,
              render: {
                  
                  item: function(data, escape) {
                      return '<div>' + escape(data.TESTO) + '</div>';
                  }
              },
              
              onOptionAdd: function(value, data){
                  var hid = $(this).parent().parent().find('input').attr('hid');
                  // console.log('StdSelectizeMultiLibero AGGIUNTA OPZIONE: '+JSON.stringify(data)+" : "+value+" ; hid: " + hid);
                  // console.log($(this).html());
                  /* var ogg = Risorsa.get(hid);
                  if(ogg != undefined){
                      if (typeof ogg.callbackAddItemSelectize === 'function'){
                          console.log('StdSelectizeMultiLibero Richiamo callbackAddItemSelectize');
                          ogg.callbackAddItemSelectize(hid, campo, val, el);
                      }
                  } else {
                      console.log("StdSelectizeMultiLibero ogg undefined");
                  } */
  
                  console.log('AGGIUNTA OPZIONE - data: ' + JSON.stringify(data) + " ; value: " + value + " ; hid: " + hid_ogg+ " ; campo: " + campo);
                  var ogg = Risorsa.get(hid_ogg);
                  if(ogg != undefined){
                      if (typeof ogg.callbackAddItem === 'function'){
                        ogg.callbackAddItem(hid_ogg, data, value, this, campo);
                      }
                  }
              },
  
              onChange: function (values){
                 // console.log('Selectize Changed:'+JSON.stringify(values));
                  var hid=$(this).attr('hid');
                  console.log('Selectize Changed:'+JSON.stringify(values)+' HID:'+hid);
              },
              
              onDelete: function(values) {
              //	return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
              }
          });
    }
    
  
    function StdSelectizeGroupMultiple(target,lista,groups){
        console.log('GROUPS:'+JSON.stringify(groups)+ ' LENGTH:'+$(target).length);
        console.log('LISTA:'+JSON.stringify(lista));
      $(target).selectize({
          //$('#ReportCliente').find('.report_options').selectize({	
              plugins: ['remove_button'],
              persist: false,
              create: false,
              valueField: 'VAL',
              labelField: 'TESTO',
              searchField: 'TESTO',
              optgroups: groups,
              optgroupField: 'GRUPPO',
              optgroupLabelField:'GRUPPO',
              optgroupValueField: 'GRUPPO',
            //  dropdownParent: 'body',
              options:lista,
              render: {
                  /*optgroup_header: function(data, escape) {
                      return '<div class="optgroup-header">' + escape(data.GRUPPO) + ' <span >' + escape(data.GRUPPO) + '</span></div>';
                  },*/
                  optgroup_header:function(data, escape) {
                      console.log('GROUPPO:'+JSON.stringify(data));
                      return '<div ><span><b>' + escape(data.GRUPPO) + '</b></span></div>';
                  },
                  option:function(data, escape) {
                      console.log('ELEMENTO:'+JSON.stringify(data));
                      return '<div ><span style="margin-left:10px;">' + escape(data.TESTO) + '</span></div>';
                  },
                  item: function(data, escape) {
                      var pippo = '';
                      if(data.GRUPPO == undefined){
                          
                      } else {
                          var pippo = '<span >'+escape(data.GRUPPO)+' - </span>';
                      }
                      return '<div >' + pippo + '<span>'+ escape(data.TESTO) + '</span></div>';
                  }
              },
              onChange: function (values){
                 // console.log('Selectize Changed:'+JSON.stringify(values));
                  var hid=$(this).attr('hid');
                  console.log('Selectize Changed:'+JSON.stringify(values)+' HID:'+hid);
              },
              onOptionAdd: function(value, data){
                  console.log('AGGIUNTA OPZIONE - data: ' + JSON.stringify(data) + " ; value: " + value + " ; hid: " + hid_ogg+ " ; campo: " + campo);
                  var ogg = Risorsa.get(hid_ogg);
                  if(ogg != undefined){
                      if (typeof ogg.callbackAddItem === 'function'){
                        ogg.callbackAddItem(hid_ogg, data, value, this, campo);
                      }
                  }
              },
              onDelete: function(values) {
              //	return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
              }
          });
    }
  
    function StdSelectizeGroupSingle(target,lista,groups){
      console.log('GROUPS:'+JSON.stringify(groups)+ ' LENGTH:'+$(target).length);
      console.log('LISTA:'+JSON.stringify(lista));
    $(target).selectize({
        //$('#ReportCliente').find('.report_options').selectize({	
            plugins: ['remove_button'],
            persist: false,
            create: false,
            valueField: 'VAL',
            labelField: 'TESTO',
            searchField: 'TESTO',
            optgroups: groups,
            maxItems: 1,
            optgroupField: 'GRUPPO',
            optgroupLabelField:'GRUPPO',
            optgroupValueField: 'GRUPPO',
           // dropdownParent: 'body',
            options:lista,
            render: {
                /*optgroup_header: function(data, escape) {
                    return '<div class="optgroup-header">' + escape(data.GRUPPO) + ' <span >' + escape(data.GRUPPO) + '</span></div>';
                },*/
                optgroup_header:function(data, escape) {
                    console.log('GROUPPO:'+JSON.stringify(data));
                    return '<div ><span><b>' + escape(data.GRUPPO) + '</b></span></div>';
                },
                option:function(data, escape) {
                    console.log('ELEMENTO:'+JSON.stringify(data));
                    return '<div ><span style="margin-left:10px;">' + escape(data.TESTO) + '</span></div>';
                },
                item: function(data, escape) {
                    var pippo = '';
                    if(data.GRUPPO == undefined){
                        
                    } else {
                        var pippo = '<span >'+escape(data.GRUPPO)+' - </span>';
                    }
                    return '<div >' + pippo + '<span>'+ escape(data.TESTO) + '</span></div>';
                }
            },
            onChange: function (values){
               // console.log('Selectize Changed:'+JSON.stringify(values));
                var hid=$(this).attr('hid');
                console.log('Selectize Changed:'+JSON.stringify(values)+' HID:'+hid);
            },
            onDelete: function(values) {
            //	return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
            }
        });
  }
  
  function StdSelectizeGroupSingleLibero(target,lista,groups, hid_ogg, campo){
      console.log('GROUPS:'+JSON.stringify(groups)+ ' LENGTH:'+$(target).length);
      console.log('LISTA:'+JSON.stringify(lista));
    $(target).selectize({
        //$('#ReportCliente').find('.report_options').selectize({	
            plugins: ['remove_button'],
            persist: false,
            create: true,
            valueField: 'VAL',
            labelField: 'TESTO',
            searchField: 'TESTO',
            optgroups: groups,
            maxItems: 1,
            optgroupField: 'GRUPPO',
            optgroupLabelField:'GRUPPO',
            optgroupValueField: 'GRUPPO',
           // dropdownParent: 'body',
            options:lista,
            render: {
                /*optgroup_header: function(data, escape) {
                    return '<div class="optgroup-header">' + escape(data.GRUPPO) + ' <span >' + escape(data.GRUPPO) + '</span></div>';
                },*/
                optgroup_header:function(data, escape) {
                    console.log('GROUPPOLLO:'+JSON.stringify(data));
                    return '<div ><span><b>' + escape(data.GRUPPO) + '</b></span></div>';
                },
                option:function(data, escape) {
                    console.log('ELEMENTO:'+JSON.stringify(data));
                    return '<div ><span style="margin-left:10px;">' + escape(data.TESTO) + '</span></div>';
                },
                item: function(data, escape) {
                    var pippo = '';
                    if(data.GRUPPO == undefined){
                        
                    } else {
                        var pippo = '<span >'+escape(data.GRUPPO)+' - </span>';
                    }
                    return '<div >' + pippo + '<span>'+ escape(data.TESTO) + '</span></div>';
                }
            },
            onChange: function (values){
               // console.log('Selectize Changed:'+JSON.stringify(values));
                var hid=$(this).attr('hid');
                console.log('Selectize Changed:'+JSON.stringify(values)+' HID:'+hid);
            },
            onOptionAdd: function(value, data){
              console.log('AGGIUNTA OPZIONE - data: ' + JSON.stringify(data) + " ; value: " + value + " ; hid: " + hid_ogg+ " ; campo: " + campo);
              var ogg = Risorsa.get(hid_ogg);
              if(ogg != undefined){
                  if (typeof ogg.callbackAddItem === 'function'){
                    ogg.callbackAddItem(hid_ogg, data, value, this, campo, 'GroupSingle');
                  }
              }
            },
            onDelete: function(values) {
            //	return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
            }
        });
  }
  
  function removeImage(el) {
      var hid = $(el).attr('hid');
      var obj = getObjEl(el);
      if(obj!=undefined && obj.IMMAGINE != undefined){
          delete obj.IMMAGINE;
          if(obj.callbackUpdate!=undefined && typeof obj.callbackUpdate==='function'){
              var campo = $(el).attr('campophoto');
              var loc = "";
              obj.callbackUpdate(hid,campo,loc,el);
          }
      }
  }
  
  async function editImage(el){
      console.log("ENTRO IN editImage");
      var obj=getObjEl(el);
      var campo=$(el).attr('campophoto');
      var aspect=$(el).attr('aspect');
      if (aspect==undefined){
          aspect=1/1;
      }
      aspect=parseFloat(aspect);
      if (obj!=undefined && getValore(obj,campo)!=undefined){
  
      var imageData=getImmagineServer(getValore(obj,campo));
      console.log(imageData);
      //$('#img_scontrino').attr('src',imageData);
      var panel=$.parseHTML(getServerModule('Ok','EDIT_IMAGE'));
     
      var scontrimg=$(panel).find('#img_scontrino');
        $(scontrimg).attr('src',imageData);
        var divscontr=$(panel).find('#display_img_scontrino');
        var cropcont=STDcrop(divscontr,el,obj,campo,aspect);
          cropcont.CROP.replace(imageData);
          $(divscontr).resizable();
        await hopnotify('Modifica Immagine',panel);
        //STDpanz(divscontr);
      
          
    /*     $('#post_file_scontrini').css('display','none');
        $('#display_img_scontrino').css('display','');
        $('#display_dettaglio_scontrino').css('display',''); */
       /*  $(divscontr).resizable();
        requestFocus('display_img_scontrino'); */
       // clearAreaSpesa();
       /*        var spesa=new Risorsa('NSSPESA');
              var target=$('#display_dettaglio_scontrino');
              var dochid=$(el).attr('hid');
              var ndoc=Risorsa.get(dochid);
              if (ndoc!=undefined){
                      spesa.DOCHID=ndoc.HID;
                      var c=['TOTALE','EsitoOcr','MsgOcr','DATA','ORA','PERIODO'];
                      for (var i=0;i<c.length;i++){
                          if (ndoc[c[i]]!=undefined){
                              spesa[c[i]]=ndoc[c[i]];
                          }
                      }
                  }
             clbSelezione(target,spesa); */
              }
  }
  
  function selezioneArea(el){
      var divscontr=$('#display_img_scontrino');
      var target=$('#display_dettaglio_scontrino');
      var ogg=Risorsa.get($(el).attr('crophid'));
      sendCrop(divscontr,'IMMAGINI',ogg,target,undefined);
  }
  
  function sendCrop(divscontr,categoria,ogg,target,callback){
      
      //STDpanz(divscontr);
      var	doc=new Risorsa('DOCUMENTO');
      var cropcont=STDcrop(divscontr);
  
      if (cropcont!=undefined&&cropcont.CROP!=undefined){
          var crop=cropcont.CROP;
          crop.crop();
        //  cropper.getCroppedCanvas({ "maxWidth": 4096, "maxHeight": 4096 });
        //  console.log(JSON.stringify(crop.getCanvasData()));
        try {
          crop.getCroppedCanvas({ "maxWidth": 4096, "maxHeight": 4096 }).toBlob((blob) => {
              const formData = new FormData();
              formData.append('Selezione.png', blob);
             
                  if (categoria==undefined){
                      categoria="ALTRO";
                  }
                  doc.CATEGORIA=categoria;
                  doc.TIPO_DOCUMENTO='DOC';
                  console.log("BEF SEND DOC:"+JSON.stringify(doc));
                  var d={};
                  allineaCampiDocumento(doc,d);
                      //for (var x in doc){
                  formData.append('parametri',JSON.stringify(d));
          //	}
              // Use `jQuery.ajax` method
            $.ajax(server+'/ecs/?Service=Upload&Action=upload', {
                  method: "POST",
                  data: formData,
                  processData: false,
                  contentType: false,
                  success(response) {
                      console.log('Upload success:'+JSON.stringify(response));
                      console.log('DOC is:'+doc.HID);
                      $(divscontr).find('[bottone]').removeClass('isDisabled');
                      $(divscontr).find('[bottone]').attr('crophid',cropcont.HID);
                      cropcont.DOCHID=doc.HID;
                      if (ogg!=undefined){
                      ogg.DOCHID=doc.HID;
  
                      Risorsa.copy(doc,ogg);
                      
                      if (callback!=undefined){
                          callback(target,ogg);
                      }
                    }
                     
                  },
                  error() {
                  console.log('Upload error');
                  },
              });
              });
        } catch (error) {
            
        }
        
      }
   
  
  
  }
  
  function StdAggiornaImmagine(el){
      // selezioneArea(el);
  
      var divscontr=$('#display_img_scontrino');
      var cropcont=STDcrop(divscontr);
      if (cropcont.PARENT!=undefined && cropcont.DOCHID!=undefined){
          var obj=cropcont.PARENT;
          var tg=cropcont.TARGETEL;
          var campo=cropcont.CAMPO;
          setValore(obj,campo,cropcont.DOCHID);
          var v=getValore(obj,campo);
          if (v!=undefined){
              $(tg).attr('src',getDocUrl(v));
              obj.MODIFIED = true;
              }
      }else{
          console.log('Molto strano: '+JSON.stringify(cropcont));
      }
  
  }
  
  function  STDcrop(ogg,targetel,obj,campo,aspect){
      var dp= $(ogg).attr('crophid');
      if (dp==undefined){
          var cropcont=new Risorsa('CROP');
          cropcont.TARGETEL=targetel;
          cropcont.PARENT=obj;
          cropcont.CAMPO=campo;
          cropcont.ASPECT=aspect;
          try {
              var options={
                  dragMode:'move',
                  aspectRatio: 1 / 1/* ,
                  preview:'#preview' */
                  /*,
                  preview:'#preview'*/
              };
              var img=$(ogg).find('img');
              var crop=new Cropper(img[0],options);
              crop.enable();
              crop.PHID=cropcont.HID;
  
              cropcont.CROP=crop;
            /*  $(ogg).find('.panzoom').panzoom({
                  panOnlyWhenZoomed:true,
                  maxScale: 10,
                  $zoomIn: $(ogg).find(".zoom-in"),
                  $zoomOut: $(ogg).find(".zoom-out"),
                  $zoomRange: $(ogg).find(".zoom-range"),
                  $reset: $(ogg).find(".zoom-reset")
              });*/
              $(ogg).attr('crophid',cropcont.HID);
              
              return(cropcont);
          } catch (error) {
              console.log('Error CROP:'+error);
          }
          
      }else{
          var cropcont=Risorsa.get(dp);
          if (cropcont!=undefined){
              return(cropcont);
          }
      }
  }
  
  
  
    /**
     * Checkboxes
     */
  
    function toggleCustomCheckbox(el) {
      var hid=$(el).attr('hid');
       var ogg=Risorsa.get(hid);
       if (ogg!=undefined){
  
              var campo=$(el).attr('campoflag');
              var s=campo.split('.');
              var rec=ogg;
              for (var i=0;i<s.length-1;i++){
                  if (rec[s[i]] ==undefined){
                      rec[s[i]]={};
                  }
                  rec=rec[s[i]];
              }
  //            rec[s[s.length-1]]=valore;
  
              var tickEl = $(el).find('.custom-tick').addBack('.custom-tick');
              var loc=true;
              //if (ogg[campo]!=undefined && ogg[campo]==false){
              if (rec[s[s.length-1]]!=undefined && rec[s[s.length-1]]==false){
                  var cont=$(el).parent().parent();
                 // console.log("BU 1: " + el + " ; " + $(cont).html());
                  if ($(cont).attr('groupcheckbox')!=undefined){
                      $(cont).find('[campoflag]').each(function(){
                          var cmp=$(this).attr('campoflag');
                          setValore(ogg,cmp,false);
                          console.log("SIAMO QUI RIUNITI 1: " + cmp + " ; " + getValore(ogg, cmp));
                          $(this).find('.custom-tick').css('visibility','hidden');
                      });
                  }
                  tickEl.css('visibility', 'visible');
              //   rec[campo]=true;
                  rec[s[s.length-1]]=true;
                  loc=true;
              }else{
                  if (rec[s[s.length-1]]==undefined){
                      var cont=$(el).parent().parent();
                  //    console.log("BU 2: " + el + " ; " + $(cont).html());
                      if ($(cont).attr('groupcheckbox')!=undefined){
                          $(cont).find('[campoflag]').each(function(){
                              var cmp=$(this).attr('campoflag');
                              setValore(ogg,cmp,false);
                              console.log("SIAMO QUI RIUNITI 2: " + cmp + " ; " + getValore(ogg, cmp));
                              $(this).find('.custom-tick').css('visibility','hidden');
                          });
                      }
                      tickEl.css('visibility', 'visible');
                      //rec[campo]=true;
                      rec[s[s.length-1]]=true;
                      loc=true;
                  }else{
                  tickEl.css('visibility', 'hidden');
                 // rec[campo]=false;
                  rec[s[s.length-1]]=false;
                  loc=false;
                  }
              }
  
              console.log('Campo:'+campo+' Valore finale:'+ogg[campo]+":"+ogg.HID+":"+ogg.callbackUpdate);
              if (typeof ogg.callbackUpdate === 'function'){
                      console.log('Richiamo callbackUpdate');
                      ogg.callbackUpdate(hid,campo,loc,el);
                  }
              /*if (tickEl.css('visibility') === 'hidden') {
                  tickEl.css('visibility', 'visible')
                  $('.custom-checkbox').val(true);
              //  alert('you ticked me')
              } else {
                  tickEl.css('visibility', 'hidden')
                  $('.custom-checkbox').val(false);
              //  alert('you un-ticked me')
              }*/
      }
  
  }
  function setCustomCheckbox(checkboxid, val) {
      var tickEl = $(checkboxid).find('.custom-tick').addBack('.custom-tick');
      if (val && val === true) {
          tickEl.css('visibility', 'visible')
          $('.custom-checkbox').val(true)
      }
      else {
          tickEl.css('visibility', 'hidden')
          $('.custom-checkbox').val(false)
      }
  }
  
  
  
  /**
   * Upload files generici
   */
  function StdEditFiles(rec,div,table,categoria){
     // var div = document.getElementById(iddropzone);
      $(div).removeClass('dropzonepj');
      $(div).addClass('dropzone');
      var parm={};
      parm.REC=rec;
      parm.TABLE=table;
      parm.acceptedFiles='.xls,.xlsx,.csv,.pdf,.jpeg,.doc,.docx,.jpg,.png,.svg,.xml,.p7m';
      if (categoria==undefined){
          categoria='DOCUMENTAZIONE';
      }
      attivaCampoUpload(div,categoria,undefined,StdCbkObjUploaded,parm);
      //nsUpdateFileTable(rec.DOCUMENTI,rec,idtable);
  
  }
  
  function StdCbkObjUploaded(docUpl,parm){
      console.log('RETURN OK FROM UPLOAD:'+JSON.stringify(docUpl));
      if (parm!=undefined){
          var docs=parm.REC.DOCUMENTI;
          var found=false;
          for (var i=0;i<docs.length;i++){
              var doc=docs[i];
              if (doc.HID==docUpl.HID){
                  allineaCampiDocumento(docUpl,doc);
                  found=true;
              }
          }
          if (!found){
              var ndoc={};
              allineaCampiDocumento(docUpl,ndoc);
              Risorsa.registerElement(ndoc);
              docs.push(ndoc);
          }
          redrawTable(parm.TABLE,docs);
          console.log('After redrawTable '+parm.TABLE+':'+docs.length);
         // nsUpdateFileTable(docs,parm.REC,parm.TABLE);
         
      }
  }
  
  
  
  function  nsUpdateNSTable(docs,idtable){
     // $('#'+idtable).find('tbody').empty();
     $('#'+idtable).empty();
      if (docs!=undefined){
          var vista=getCurrentVista('NOTASPESE');
          var lista=new Risorsa('LISTA');
          var table=renderTable('',lista,docs,vista);
         /* for (var i=0;i<docs.length;i++){
              var doc=docs[i];
              var tr=document.createElement('tr');
             
  
              renderTd($(tr),doc,vista);
              $('#'+idtable).find('tbody').append(tr);
          }*/
          $('#'+idtable).append(table);
  
      }
  }
  
  /**
   * Pannello lista 
   */
  
  /**
   * Foto e documenti
   */
  
   function loadPhoto(el,categoria){
      try {
          
  
          var nomefile="Foto.jpeg";
          var hid=$(el).attr('hid');
          //var categoria="SCONTRINI";
          var ogg=Risorsa.get(hid);
          if (ogg!=undefined){
                  var target=$(el);
                  if (window.cordova==undefined){
                      //takePhotoOn2(nomefile,categoria,ogg,target,loadedFoto);
                      loadPhotoStep2(nomefile,categoria,ogg,target,loadedFoto);
                  }else{
                      takePhotoApp(nomefile,categoria,ogg,target,loadedFoto);
                  }
              }
      } catch (error) {
          alert('ERRORE:'+error);
      }
   }
   function loadPhotoStep2(nomefile,categoria,ogg,target,callback) {
      scanContext=new Risorsa('SCANCONTEXT');
      scanContext.NOMEFILE=nomefile;
      scanContext.CATEGORIA=categoria;
      scanContext.OGG=ogg;
      scanContext.TARGET=target;
      scanContext.CALLBACK=callback;
  
       var target="#loadfilepanel";
       $(target).find('input').val("");
       var width="600";
       var heigth="auto";
      var dialog = $( target ).dialog({
          autoOpen: true,
          height: heigth,
          width: width,
          modal: true,
      /*    buttons: {
            "Nuovo Capitolo": addUser,
            "Chiudi": function() {
              dialog.dialog( "close" );
            }
          },*/
          close: function() {
            //form[ 0 ].reset();
            //allFields.removeClass( "ui-state-error" );
          }
        });
        
   }
  
   function StdFileUpload(el){
      var file = el.files[0];
  
      console.log('FILE UPLOAD:'+file,JSON.stringify(scanContext));
  
      //uploadFileStd(file, scanContext.NOMEFILE, scanContext.CATEGORIA,scanContext.OGG,scanContext.TARGET,scanContext.CALLBACK);
      uploadFileStd(file, file.name, scanContext.CATEGORIA,scanContext.OGG,scanContext.TARGET,scanContext.CALLBACK);
  
   }
  
   function loadDocumentStd(el,categoria) {
  
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
  
      scanContext=new Risorsa('SCANCONTEXT');
      scanContext.CATEGORIA=categoria;
      scanContext.OGG=ogg;
      scanContext.TARGET=el;
      scanContext.CALLBACK=ogg.callbackUpload;
      if(ogg.callbackUpload == undefined){
          ogg.callbackUpload = callbackUploadStd;
          scanContext.CALLBACK=ogg.callbackUpload;
      }
  
       var target="#loaddocumentpanel";
       $(target).find('input').val("");
       var width="600";
       var heigth="auto";
      var dialog = $( target ).dialog({
          autoOpen: true,
          height: heigth,
          width: width,
          modal: true,
   
          close: function() {
          }
        });
      }
   }
  
   function loadDocumentStdGiulia(el, categoria, funzionemia) {
  
      scanContext=new Risorsa('SCANCONTEXT');
      scanContext.CATEGORIA=categoria;
      //scanContext.OGG=ogg;
      scanContext.TARGET=el;
      //scanContext.CALLBACK=ogg.callbackUpload;
  
       var target="#loaddocumentpanelGiulia";
       var width="600";
       var heigth="auto";
      var dialog = $( target ).dialog({
          autoOpen: true,
          height: heigth,
          width: width,
          modal: true,
   
          close: function() {
          }
        });
  
        $(dialog).find('input').attr('onchange', funzionemia);
  
  }
  
   var scanContext={};
  
   function loadDocumentStdTd(el) {
  
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
  
      scanContext=new Risorsa('SCANCONTEXT');
      var categoria=$(el).attr('categoria');
      if (categoria==undefined){
          categoria='DOCUMENTO';
      }
      scanContext.CATEGORIA=categoria;
      scanContext.OGG=ogg;
      scanContext.TARGET=el;
      var cllback=ogg.callbackUpload;
      if (cllback==undefined){
          cllback=callbackUploadStd;
      }
      scanContext.CALLBACK=cllback;
  
       var target="#loaddocumentpanel";
       var width="600";
       var heigth="auto";
      var dialog = $( target ).dialog({
          autoOpen: true,
          height: heigth,
          width: width,
          modal: true,
   
          close: function() {
          }
        });
      }
   }
  
   function StdDocUpload(el){
      var file = el.files[0];
     
      uploadFileStd(file, file.name, scanContext.CATEGORIA,scanContext.OGG,scanContext.TARGET,scanContext.CALLBACK);
   }
  /* 
   window.console.log = function(){
      console.error('Sorry , developers tools are blocked here....');
      window.console.log = function() {
          return false;
      }
    }
   */
  
  
  
   function attivaTraccia(){
      $('#tracehopperix').attr('onclick','fineTraccia();return(false);');
      $('#tracehopperix').find('span').text('Disattiva Traccia');
          console.error('Inizio traccia ...');
          window.console.log = function(msg) {
              addMsg('TRACE',msg);
              return true;
          }
   }
  
   function fineTraccia(){
       $('#tracehopperix').attr('onclick','attivaTraccia();return(false);');
       $('#tracehopperix').find('span').text('Attiva Traccia');
      console.error('Fine traccia');
      window.console.log = function() {
          return false;
      }
    }
  
   function uploadFileStd(blob,nomefile,categoria,ogg,target,callback,lastupload){
      try {
          
     
      //STDpanz(divscontr);
      var	doc=new Risorsa('DOCUMENTO');
        const formData = new FormData();
        formData.append(nomefile, blob,nomefile);
       
            if (categoria==undefined){
                categoria="ALTRO";
            }
            doc.CATEGORIA=categoria;
            doc.TIPO_DOCUMENTO='DOC';
            console.log("BEF SEND DOC:"+JSON.stringify(doc));
            var d={};
            allineaCampiDocumento(doc,d);
                //for (var x in doc){
            formData.append('parametri',JSON.stringify(d));
    //	}
        // Use `jQuery.ajax` method
      $.ajax(server+'/ecs/?Service=Upload&Action=upload', {
            method: "POST",
            async: true,
            data: formData,
            processData: false,
            contentType: false,
            success(response) {
                
                console.log('Upload success:'+JSON.stringify(response));
              if (response.Esito=='OK'){
                var docfs=response.DOCUMENTO;
                console.log('DOC is:'+doc.HID+' and perhaps we call '+callback);
                //window.open("/ecs/?Service=Document&Action=getdoc&hid="+doc.HID+"&tipodoc=DOC");
                if (callback!=undefined){
                    /**ATTENZIONE LA PROSSIMA RIGA E' STATA INSERITA IL 20190530 PER CONSENTIRE ALLA CALLBACK DI FARE get(dochid) */
                    Risorsa.registerElement(docfs);
                    /** FINE ATTENZIONE */
                    callback(ogg,target,docfs,lastupload);
                }
              }
               
            },
            error(errore) {
                errorMessage('Errore nel caricamento sul server del file '+nomefile+':'+errore);
            console.log('Upload error:'+errore);
            },
        });
      } catch (error) {
       alert('ERRORE IN FASE DI UPLOAD '+nomefile+':'+error);   
      }
       
      
   
  
  
  }
  
  
   async function loadedFoto(ogg,target,docfs){
     var campo=$(target).attr('campophoto');
     if (docfs!=undefined && campo!=undefined){
         ogg[campo]=docfs.HID;
         $(target).attr('src',getDocUrl(docfs.HID));
         $(target).parent().find('a').attr('href',getDocUrl(docfs.HID));
  
         // Giulia il 11/02/2020
         $(target).closest('[tipo="pannello-iniziale"]').find('[tipo="ModificaImmagine"]').css('display', '');
         $(target).closest('[tipo="pannello-iniziale"]').find('[tipo="CancellaImmagine"]').css('display', '');
     }
   }
  
   /**
    * RIDIMENSIONA DIALOG
    */
  
    async function ridimensionaDialog(target){
      var dialog2=$(target).closest('[role="dialog"]');
      var dim=getDimensions($(dialog2));
      console.log('DIM:'+JSON.stringify(dim));
      var larg=dim.x2-dim.x1;
      var dimscreen=$(window).width();
      var posx=(dimscreen-larg)/2;
      var left=''+posx+'px';
      console.log("LEFT:"+left);
      $(dialog2).css('left',left);
    }
  
    function setAttributoOgg(el,campo,valore){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          setValore(ogg,campo,valore);
      }
    }
  
  
  /**
   * Excel generation
   */
  async function excelCrea(){
      var excel=new Risorsa('EXCEL');
  
      var v=await XlsxPopulate.fromBlankAsync();
      console.log('WK:'+v);
      excel.WORKBOOK=v;
      return(excel);
  }
  
  async function excelAssegnaNomeFoglio(excel,num,nome){
      var workbook=excel.WORKBOOK;
      if (nome!=undefined){
          workbook.sheet(num).name(nome);
      }
      var sheet=workbook.sheet(num);
      excel.SHEET=sheet;
  }
  
  async function apriFile(idfile){
      var file = document.getElementById("filexls").files[0];
      var v=await XlsxPopulate.fromDataAsync(file);
      var excel=new Risorsa('EXCEL');
      excel.WORKBOOK=v;
      return(excel);
  
  }
  async function excelApriFile(file){
   //   var file = document.getElementById("filexls").files[0];
      var v=await XlsxPopulate.fromDataAsync(file);
      var excel=new Risorsa('EXCEL');
      excel.WORKBOOK=v;
      return(excel);
  
  }
  
  async function excelSelezionaFoglio(excel,num,nome){
      var workbook=excel.WORKBOOK;
      if (nome!=undefined){
          var sheet=workbook.sheet(nome);
          excel.SHEET=sheet;
          if (sheet==undefined){
              console.log('Foglio non trovato:'+nome);
          }
          return;
      }else{
          var sheet=workbook.sheet(num);
          excel.SHEET=sheet;
          if (sheet==undefined){
              console.log('Foglio non trovato:'+num);
          }
          return;
      }
  }
  
  async function salvaInExcel(el){
      var cont=$(el).closest('[tipo="tabella"]');
      var table=$(cont).find('table');
      var id=$(table).attr('id');
      var tbl=Risorsa.get(id);
      if (tbl!=undefined){
          var lista=tbl.LISTA;
          var vista=tbl.VISTA;
          var lstc=vista.LISTACAMPI;
          var listacampi=[];
          
  
          for (var i=0;i<lstc.length;i++){
              var c=lstc[i];
              if (c.DISPLAY=='ACTIONS'){
  
              }else{
                  listacampi.push(c);
              }
          }
          var excel=await excelCrea();
          await excelAssegnaNomeFoglio(excel,0,'Tabella');
          await excelSelezionaFoglio(excel,0,'Tabella');
          var lungs=[];
          for (var i=0;i<listacampi.length;i++){
              console.log('HEADER '+1+":"+i+" "+listacampi[i].DESCRIZIONE);
                  await excelAssegnaValore(excel,1,i+1,listacampi[i].DESCRIZIONE,'BCTITOLO');
                  lungs[i]=listacampi[i].DESCRIZIONE.length;
              }
          var ir=2;
          for (var j=0;j<lista.length;j++){
              var rec=lista[j];   
              var r=ir+j;
              for (var i=0;i<listacampi.length;i++){
                  console.log("QUELLO CHE C'E' NEL MIO OGGETTO: "+JSON.stringify(listacampi[i]));
                  var val=rec[listacampi[i].CAMPO];
                  if (val==undefined){
                      val='';
                  }
                  if (val.length>lungs[i]){
                      lungs[i]=val.length;
                  }
                  console.log('ASSEGNO '+r+":"+i+" "+val);
                  await excelAssegnaValore(excel,r,i+1,val,'BCNORMALE');
                  }    
              }
  
              for (var i=0;i<listacampi.length;i++){
                  await excelColWidth(excel,i+1,lungs[i]*1.3);
              }
  
              
          var blob=await excelGetBlob(excel);    
          var nomefile = "estrazione_excel.xlsx";
          var categoria = 'EXCEL_DA_TABELLE';
          uploadFileStd(blob, nomefile, categoria, undefined, undefined, function(ogg,target,docfs,lastupload){
              console.log("DOC EXCEL: " + JSON.stringify(docfs));
              window.open(getDocUrl(docfs.HID), '_blank'); 
          });
      }
  }
  
  async function excelLeggi(excel,riga,colonna){
    
      var sheet=excel.SHEET;
      if (sheet!=undefined){
      
      var cel=sheet.cell(riga,colonna);
     // console.log("RIGA,COLONNA: "+riga+","+colonna+":"+cel.value());
    
      /*
      for(var i=0; i<cel.riga ; i++)
      {
          console.log("RIGA: "+i)
      }*/
      if (cel!=undefined){
          return(cel.value());
          }   else{
              console.log('CELLA NON TROVATA:'+riga+":"+colonna);
          }
      }else{
          console.log('SELEZIONARE IL FOGLIO NELL\'EXCEL');
      }
  }
  
  async function excelLettura(excel,riga,colonna){
      var workbook=excel.WORKBOOK;
      var sheet=workbook.sheet(0);
      
      
      var cel=sheet.cell(riga,colonna);
     // console.log("RIGA,COLONNA: "+riga+","+colonna+":"+cel.value());
    
      /*
      for(var i=0; i<cel.riga ; i++)
      {
          console.log("RIGA: "+i)
      }*/
      if (cel!=undefined){
          return(cel.value());
          }   
  
  }
  
  async function leggiFileExcel(){
      var excel=await apriFile('filexls');
      console.log('EXCEL:'+excel);
      excelLettura(excel,3,2);
  }
  
  async function excelAssegnaValore(excel,riga,colonna,val,tipostile,valStile){
      var sheet=excel.SHEET;
      if (sheet==undefined){
          sheet=excel.WORKBOOK.sheet(0);
      }
      var cell=sheet.cell(riga,colonna);
      if (val!=undefined){
          cell.value(val);
      }
      if ( valStile!=undefined){
          
          cell.style(valStile);
      }else{
          if (tipostile!=undefined){
              var val=EXCELSTILI[tipostile];
              if (val!=undefined){
                  cell.style(val);
              }
          }
      }
  }
  
  async function excelAssegnaStile(excel,riga,colonna,tipostile,valStile){
      var sheet=excel.SHEET;
      if (sheet==undefined){
          sheet=excel.WORKBOOK.sheet(0);
      }
      var cell=sheet.cell(riga,colonna);
      
      if ( valStile!=undefined){
          
          cell.style(valStile);
      }else{
          if (tipostile!=undefined){
              var val=EXCELSTILI[tipostile];
              if (val!=undefined){
                  cell.style(val);
              }
          }
      }
  }
  
  async function excelAssegnaStileRiga(excel,riga,valStile){
      var sheet=excel.SHEET;
      if (sheet==undefined){
          sheet=excel.WORKBOOK.sheet(0);
      }
      var cell=sheet.row(riga);
      
      if ( valStile!=undefined){
          cell.style(valStile);
      }
  }
  
  async function excelColWidth(excel,posc,len){
      var sheet=excel.SHEET;
      if (sheet==undefined){
          sheet=excel.WORKBOOK.sheet(0);
      }
      var col=sheet.column(posc);
      col.width(len);
  }
  
  async function controlloOrdineColExcel(excel, lista){
      var ok = {};
      ok.OK = true;
      var stringa = "okkè";
      var contExcel = 1;
      /* while(stringa != undefined){
          var valore = await excelLeggi(excel, 1, contExcel);
          stringa = valore;
          valore = valore.toUpperCase();
          if(valore != lista[contExcel-1]){
              ok = false;
              break;
          }
          contExcel++;
      } */
  
      for(var i=0; i<lista.length; i++){
          var valore = await excelLeggi(excel, 1, (i+1));
          console.log("VALORE CELLA EXCEL: " + valore);
          stringa = valore;
          if(valore == undefined){
              ok.OK = false;
              ok.MSG = 'Attenzione! Cella vuota nella prima riga.';
              break;
          }
          valore = valore.toUpperCase();
          if(valore != lista[i]){
              ok.OK = false;
              ok.MSG = 'Attenzione! Cella errata nella prima riga. Il nome della cella è: ' + valore;
              break;
          }
      }
  
      return ok;
  }
  
  async function excelGetBlob(excel){
      var workbook=excel.WORKBOOK;
      var blob=await workbook.outputAsync({ type: 'blob' });
      return(blob);
  }
  
  async function excelGetOutput(excel){
      var workbook=excel.WORKBOOK;
      var blob=await workbook.outputAsync({ type: 'buffer' });
      return(blob);
  }
  
  var EXCELSTILI={
  'TITOLO':{
      fontColor: "ffffff", 
      fill:'87137f',
      bold:true,
      underline: true 
  },
  'NORMALE':{
    // fontColor: "ffffff", 
     fill:'fafafa',
    // bold:true,
    // underline: true 
  },
  
  
  
  /**
   * Borders
   */
  'BTITOLO':{
      border:{
          'left':{
              style:'thick',
              color:'030303'
          },
          'right':{
              style:'thick',
              color:'030303'
          },
          'top':{
              style:'double',
              color:'030303'
          },
          'bottom':{
              style:'double',
              color:'030303'
          }
      }
  },
  'BNORMALE':{
      border:{
      'left':{
          style:'thin',
          color:'030303'
      },
      'right':{
          style:'thin',
          color:'030303'
      },
      'top':{
          style:'thin',
          color:'030303'
      },
      'bottom':{
          style:'thin',
          color:'030303'
      }
  }
  },
  
  'BCTITOLO':{
          fontColor: "ffffff", 
          fill:'87137f',
          bold:true,
          underline: true ,
          border: true
      
  },
  'BCNORMALE':{
       // fontColor: "ffffff", 
        fill:'fafafa',
       // bold:true,
       // underline: true 
      border: true
  }
  };
  
  var EXCELBORDERS={
      'BTITOLO':{
          'left':{
              style:'thick',
              color:'030303'
          },
          'right':{
              style:'thick',
              color:'030303'
          },
          'top':{
              style:'double',
              color:'030303'
          },
          'bottom':{
              style:'double',
              color:'030303'
          }
      },
      'BNORMALE':{
          'left':{
              style:'thin',
              color:'030303'
          },
          'right':{
              style:'thin',
              color:'030303'
          },
          'top':{
              style:'thin',
              color:'030303'
          },
          'bottom':{
              style:'thin',
              color:'030303'
          }
      }
  }
  
  
  
  
  // -------------- GENERAZIONE DOCX ----------------
  function loadFile(url,callback){
      JSZipUtils.getBinaryContent(url,callback);
  }
  
  function loadFile2(url) {
      return new Promise(function(resolve, reject) {
          JSZipUtils.getBinaryContent(url, function (err, data) {
              if(err) {
                  reject(err);
              } else {
                  resolve(data);
              }
          });
      });
  }
  
  var b64toBlob = (b64Data, contentType='', sliceSize=512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];
    
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
    
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
    
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
    
      const blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }
  
    async function base64ToFile(dataURL, fileName) {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      console.log('MIME:'+mime);
      return (fetch(dataURL)
          .then(function (result) {
              return result.arrayBuffer();
          }));
  }
  
  async function storeImage(tag){
      var el = $('#'+tag);
          if (el.length>0){
              //var canvasel=$(el).find('canvas');
              var canvasel=$(el).find('img');
              console.log('Sono passato qui cazzarola2:'+canvasel.length);
      
              if (canvasel.length>0){
                  var imageData=$(canvasel).attr('src');
                  /* imageData=imageData.replace('data:image/png;base64,',''); 
                  blobData=b64toBlob(imageData,'data:image/png');*/
                  console.log('Sono passato qui:');
                  blobData= await base64ToFile(imageData);
                  
                  if (blobData!=undefined && blobData.byteLength>0){
                      console.log('BLOBDATA:'+blobData+":"+blobData.byteLength);
                  datiCache[tag]=blobData;
                  }else{
                      console.log('SFIGA NERA');
                  }
                  /*var canvas=canvasel[0];
              if (canvas!=undefined){
                  blobData=getCanvasBlob(canvas);
              }*/
              }
          }
      
  }
  
  
  async function generaDocx(template, ogg, target, callback, nomefile) {
      if(ogg == undefined){
          alert("ERRORE: OGGETTO NON DEFINITO");
          return;
      }
  
      loadFile(template, function(error,content){
          if (error) { throw error };
          var zip = new JSZip(content);
       //  window.docxtemplater=window.Docxtemplater;
          /**
           * Gestione immagini
           */
          var opts={};
          opts.centered = false; //Set to true to always center images
          opts.fileType = "docx"; //Or pptx
          opts.getImage = function(tagValue, tagName) {
              //tagValue is 'examples/image.png'
              //tagName is 'image'
              var blobData = undefined;
              if (tagValue!=undefined){
              
             //     console
  
              console.log('Invocato getImage su:'+JSON.stringify(tagValue)+":"+tagName+":");
              if (tagValue.URL!=undefined){
                  blobData=getImage(tagValue.URL);
                  
                  if (blobData!=undefined){
                      console.log('Dimensione Immagine:'+tagValue.URL+":"+blobData.byteLength);
                  }
               }
               if (tagValue.QRCODE!=undefined){
                  console.log('Sono passato qui cazzarola:'+tagValue.QRCODE);
                  blobData=datiCache[tagValue.QRCODE];
               }
          }
             // console.log('BLOB DATA:'+blobData.byteLength);
              return(blobData);
          }
  
          //Pass the function that return image size
          opts.getSize = function(img, tagValue, tagName) {
              //img is the image returned by opts.getImage()
              //tagValue is 'examples/image.png'
              //tagName is 'image'
              //tip: you can use node module 'image-size' here
              if (tagValue!=undefined){
                  
                  console.log('Invocato getImage su:'+tagValue+":"+tagName+":");
                  if (tagValue.DIM!=undefined){
                      return(tagValue.DIM);
                  }
              }
              return [150, 150];
          }
  
          var imageModule = new ImageModule(opts);
  
  
  
  
  
  
          var doc=new window.docxtemplater().attachModule(imageModule).loadZip(zip);
         //var doc=new window.docxtemplater().loadZip(zip);
          console.log('DOC:'+JSON.stringify(doc));
          //Below the options that will be passed to ImageModule instance
          /* var opts = {}
          opts.centered = false; //Set to true to always center images
          opts.fileType = "docx"; //Or pptx
  
          //Pass your image loader
          opts.getImage = function(tagValue, tagName) {
              //tagValue is 'examples/image.png'
              //tagName is 'image'
              var blobData = undefined;
  
              $.ajaxSetup({async: false});
              $.ajax({
                  type: "GET",
                  url: 'http://localhost:8080/www/paul-walker-signature.png',
                  async: false,
                  success : function(data) {
                      blobData = data;
                  }
              });
              $.ajax({
                  url: 'http://localhost:8080/www/paul-walker-signature.png',
                  xhrFields:{
                      responseType: 'blob'
                  },
                  success: function(data){            
                      blobData = data;
                      var url = window.URL || window.webkitURL;
                      var src = url.createObjectURL(data);
                      $('#result-image').attr("src", src);
                  }
              });
  
              $.ajaxSetup({async: true});
              console.log("BLOB DATA: " + blobData);
              return 'http://localhost:8080/www/paul-walker-signature.png';
          }
  
          //Pass the function that return image size
          opts.getSize = function(img, tagValue, tagName) {
              //img is the image returned by opts.getImage()
              //tagValue is 'examples/image.png'
              //tagName is 'image'
              //tip: you can use node module 'image-size' here
              return [150, 150];
          }
  
          var imageModule = new ImageModule(opts);
  
          var zip = new JSZip(content);
          var doc = new window.docxtemplater()
              .attachModule(imageModule)
              .loadZip(zip)
              .setData({
                  codice: ogg.CODICE,
                  descrizione: ogg.DESCRIZIONE,
                  cliente: ogg.CLIENTE,
                  categoria: ogg.CATEGORIA,
                  datainizio: ogg.DATAINIZIO,
                  datafine: ogg.DATAFINE,
                  luogo: ogg.LUOGO,
                  stato: ogg.STATO,
                  image: 'http://localhost:8080/www/paul-walker-signature.png'
              })
              .render(); */
  
          
  
          doc.setData(ogg);
          doc.setOptions({
              nullGetter(part, scopeManager) {
                  if (!part.module) {
                      return "";
                  }
                  if (part.module === "rawxml") {
                      return "";
                  }
                  return "";
              },
          });
         /*      {
              codice: ogg.CODICE,
              descrizione: ogg.DESCRIZIONE,
              cliente: ogg.CLIENTE,
              categoria: ogg.CATEGORIA,
              datainizio: ogg.DATAINIZIO,
              datafine: ogg.DATAFINE,
              luogo: ogg.LUOGO,
              stato: ogg.STATO,
              image: 'http://localhost:8080/www/paul-walker-signature.png'
          }); */
          try {
              // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
              doc.render();
              console.log("DOPO RENDER: ");
          }
          catch (error) {
              var e = {
                  message: error.message,
                  name: error.name,
                  stack: error.stack,
                  properties: error.properties,
              }
              console.log(JSON.stringify({error: e}));
              // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
              throw error;
          }
          var out=doc.getZip().generate({
              type:"blob",
              mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              compression: "DEFLATE"
          }); //Output the document using Data-URI
         // saveAs(out, "output.docx")
         console.log("TRACCIA: " + JSON.stringify(out));
         if (nomefile==undefined || nomefile.length<1){
             nomefile="output.docx";
         }
         uploadFileStd(out, nomefile, "INFOREPORT", ogg, target, callback);
      });
  
  }
  
  
  
  
  function getRawWrXml(str,stile,stile2){
      var ret='';
      if (stile==undefined){
          stile='';
      }
      if (stile2==undefined){
          stile2='';
      }
      try {
         // var parser = new DOMParser(); 
          str='<body>'+str+'</body>';
          var html = $.parseHTML( str);
               
          
          for (var i=0;i<html.length;i++){
              var el=html[i];
              console.log('ELM:'+el.nodeName);
              ret=parseRawWrXml(el,ret,undefined,stile,stile2);
          }
      } catch (error) {
          console.log('ERRORE IN getRawWrXml:'+error);
      }
      console.log('RET getRawWrXml:'+ret);
      return(ret);
  }
  
  async function getRawWrXmlS(str,stile,stile2){
      var parser=new DOMParser();
      var xml = parser.parseFromString('<w:body xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"></w:body>',"text/xml");
      try {
          // var parser = new DOMParser(); 
           str='<body>'+str+'</body>';
           var html = $.parseHTML( str);
                
           
           for (var i=0;i<html.length;i++){
               var el=html[i];
               console.log('ELM:'+el.nodeName);
               parseRawWrXml2(xml,xml.documentElement,el,stile,stile2,parser);
           }
       } catch (error) {
           console.log('ERRORE IN getRawWrXml:'+error);
       }
       var body=xml.getElementsByTagName("w:body");
       //consolelog('BODY:'+body);
       if (body==undefined){
           body=xml.getElementsByTagName("body");
       }
       var serializer = new XMLSerializer();
       var xmlString='';
       var childs=body[0].children;
      
       if (childs!=undefined){
           for (var i=0;i<childs.length;i++){
               xmlString = xmlString+serializer.serializeToString(childs[i]);
           }
       }
   
      
       console.log('XMLSTRING:'+xmlString);
       return(xmlString);
       console.log('RET getRawWrXml:'+ret);
       return(ret);
  }
  
  function parseRawWrXml2(xml,padre,elem,stile,stile2,parser){
      var nm=elem.nodeName;
         if (stile==undefined){
             stile='';
         }
         if (stile2==undefined){
             stile2='';
         }
         nm=nm.toUpperCase();
   
         switch (nm) {
             case 'DIV':
              console.log('DIV');
              if (padre.nodeName.toUpperCase()=='BODY'||padre.nodeName.toUpperCase()=='W:BODY'){
                  var np= parser.parseFromString( '<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:pPr>'+stile+'<w:jc w:val="both"/></w:pPr><w:rPr>'+stile2+'</w:rPr></w:p>',"text/xml");
                  var npp=xml.importNode(np.documentElement,true);
                  padre.append(npp);
                  padre=npp;
              }
              var els=$(elem).contents();
                  for (var i=0;i<els.length;i++){
                  var el=els[i];
                  parseRawWrXml2(xml,padre,el,stile,stile2,parser);
                  }
                 break;
             case 'P':
              console.log('P');
                 var np= parser.parseFromString( '<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:pPr>'+stile+'<w:jc w:val="both"/></w:pPr><w:rPr>'+stile2+'</w:rPr></w:p>',"text/xml");
                 var npp=xml.importNode(np.documentElement,true);
                 padre.append(npp);
                 var els=$(elem).contents();
                 for (var i=0;i<els.length;i++){
                  var el=els[i];
                  parseRawWrXml2(xml,npp,el,stile,stile2,parser);
                  }
                /*   if (els.length>0){
                      np= parser.parseFromString('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:rPr >'+stile2+'</w:rPr><w:br/></w:r>',"text/xml");
                      //  var np= parser.parseFromString('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:br w:type="textWrapping"/></w:r>',"text/xml");
                      var npp2=xml.importNode(np.documentElement,true);
                      npp.append(npp2);
                  } */
                break;
  
                case 'BR':
                  var np= parser.parseFromString('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:rPr >'+stile2+'</w:rPr><w:br/></w:r>',"text/xml");
                  //  var np= parser.parseFromString('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:br w:type="textWrapping"/></w:r>',"text/xml");
                  var npp=xml.importNode(np.documentElement,true);
                  padre.append(npp);
                  break;
              
                  case 'B':
                      
                      stile2=stile2+'<w:b/><w:bCs/>';
                      console.log('BOLD:'+stile2);
                    /*   var np= parser.parseFromString('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:rPr>'+stile2+'</w:rPr></w:r>',"text/xml");
                      //var np= parser.parseFromString('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:rPr >'+stile2+'<w:b/><w:bCs/></w:rPr></w:r>',"text/xml");
                      var npp=xml.importNode(np.documentElement,true);
                      padre.append(npp);
                       */
                      var els=$(elem).contents();
                      for (var i=0;i<els.length;i++){
                          var el=els[i];
                          parseRawWrXml2(xml,padre,el,stile,stile2,parser);
                         // parseRawWrXml2(xml,npp,el,stile,stile2,parser);
                          }
                      break;
  
                  case 'U':
                      
                      stile2=stile2+'<w:u w:val="single"/>';
                      console.log('UNDERSCORE:'+stile2);
                    /*   var np= parser.parseFromString('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:rPr>'+stile2+'</w:rPr></w:r>',"text/xml");
                      //var np= parser.parseFromString('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:rPr>'+stile2+'<w:u/><w:uCs/></w:rPr></w:r>',"text/xml");
                      var npp=xml.importNode(np.documentElement,true);
                     */
                      padre.append(npp);
                      var els=$(elem).contents();
                      for (var i=0;i<els.length;i++){
                          var el=els[i];
                          parseRawWrXml2(xml,padre,el,stile,stile2,parser);
                          //parseRawWrXml2(xml,npp,el,stile,stile2,parser);
                          }
                      break;
  
                  case 'I':
                      
                      stile2=stile2+'<w:i/><w:iCs/>';
                      console.log('ITALIC:'+stile2);
                    /*   var np= parser.parseFromString('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:rPr>'+stile2+'</w:rPr></w:r>',"text/xml");
                    //  var np= parser.parseFromString('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:rPr >'+stile2+'<w:i/><w:iCs/></w:rPr></w:r>',"text/xml");
                      var npp=xml.importNode(np.documentElement,true);
                      padre.append(npp);
                     */
                      var els=$(elem).contents();
                      for (var i=0;i<els.length;i++){
                          var el=els[i];
                          parseRawWrXml2(xml,padre,el,stile,stile2,parser);
                          //parseRawWrXml2(xml,npp,el,stile,stile2,parser);
                          }
                      break;
                  
                  case 'UL':
                      console.log('UL');
                      var els=$(elem).contents();
                      for (var i=0;i<els.length;i++){
                           var el=els[i];
                           parseRawWrXml2(xml,padre,el,stile,stile2,parser);
                      }
                     break;
  
                  case 'LI':
                      
                      console.log('LI:'+stile2);
                      var np= parser.parseFromString('<w:p  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:pPr><w:numPr> <w:ilvl w:val="0"/> <w:numId w:val="1"/></w:numPr><w:jc w:val="both"/><w:rPr>'+stile2+'</w:rPr></w:pPr></w:p>',"text/xml");
                      var npp=xml.importNode(np.documentElement,true);
                      padre.append(npp);
                      var els=$(elem).contents();
                      for (var i=0;i<els.length;i++){
                          var el=els[i];
                          parseRawWrXml2(xml,npp,el,stile,stile2,parser);
                          }
                  break;
  
                  case '#TEXT':
                      console.log('#TEXT:'+stile2+":"+padre.nodeName);
                      if (padre.nodeName.toUpperCase()=='P'||padre.nodeName.toUpperCase()=='W:P'){
                      var np= parser.parseFromString('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:rPr>'+stile2+'</w:rPr><w:t xml:space="preserve" >'+$(elem).text()+'</w:t></w:r>',"text/xml");
                      var npp=xml.importNode(np.documentElement,true);
                      padre.append(npp);
                      }else{
                      var np= parser.parseFromString('<w:t xml:space="preserve" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'+$(elem).text()+'</w:t>',"text/xml");
                      var npp=xml.importNode(np.documentElement,true);
                      padre.append(npp);
                      }
                      break;    
      
  
              default:
              console.log('ALTRO:'+nm);
              break;
         }
      }
  
  
  
  function parseRawWrXml(elem,str,stato,stile,stile2){
   var nm=elem.nodeName;
      if (stile==undefined){
          stile='';
      }
      if (stile2==undefined){
          stile2='';
      }
      var pre = '<w:p><w:pPr><w:jc w:val="both"/></w:pPr><w:r><w:t>';
      var preP = '<w:p><w:pPr>'+stile+'<w:jc w:val="both"/></w:pPr><w:rPr>'+stile2+'</w:rPr>';
      var endP = '</w:p>';
      var finep = '<w:p><w:pPr><w:jc w:val="both"/></w:pPr><w:r></w:r></w:p>';
      var preBoldP='<w:r><w:rPr>'+stile2+'<w:b/><w:bCs/></w:rPr>';
      var preItalicP='<w:r><w:rPr>'+stile2+'<w:i/><w:iCs/>'+'</w:rPr>';
      
      var prerP='<w:r>';
      var pretxP='<w:t xml:space="preserve">';
      var endrP='</w:r>';
      var endtxP='</w:t>';
      var bold='<w:b/>'
      var preBold = '<w:p><w:pPr>><w:jc w:val="both"/></w:pPr><w:rPr>'+stile2+'<w:b/></w:rPr><w:r><w:t>';
      var preLi='<w:p><w:pPr><w:numPr> <w:ilvl w:val="0"/> <w:numId w:val="1"/></w:numPr><w:jc w:val="both"/><w:rPr>'+stile2+'</w:rPr></w:pPr>';
      var post = "</w:t></w:r></w:p>";
  //	var pre = "";
  //	var post = "";
  if (stato==undefined){
      stato={'STARTR':false};
      }
      var startr=stato.STARTR;
      
      if (stato.BOLD==undefined){
          stato.BOLD='';
  
      }
      var lineB = "<w:br/>";
      nm=nm.toUpperCase();
   
      switch (nm) {
          case 'DIV':
              console.log('PARAGRAPH:'+stile2);
              var els=$(elem).contents();
              for (var i=0;i<els.length;i++){
                  var el=els[i];
                  str=parseRawWrXml(el,str,stato,stile,stile2);
              }
              break;
          case 'P':
              console.log('PARAGRAPH:'+stile2);
              var els=$(elem).contents();
              str=str+preP;
              stato.STARTP=true;
              
                  for (var i=0;i<els.length;i++){
                      var el=els[i];
                      str=str+prerP;
                      if (stile2!=undefined && stile2.length>0){
                          str=str+'<w:rPr>'+stile2+'</w:rPr>';
                      }
                      startr=true;
                      stato.STARTR=startr;
                      str=parseRawWrXml(el,str,stato,stile,stile2);
                      startr=stato.STARTR;
                      if (startr){
                          str=str+endrP;
                          startr=false;
                      }
                      
                      
                      //console.log('ELS:'+el.nodeName+':'+JSON.stringify(el));
                  }
  
                  str=str+endP;
                  stato.STARTP=false;
                  str=str+finep;
              break;
          case 'BR':
              console.log('NEWLINE:'+stato.STARTR+":"+stato.STARTP);
              //str=str+pre+post;
              if (startr){
                  str=str+endrP;
                  startr=false;
              }
  
              if (stato.STARTP!=undefined && stato.STARTP){
                  
                  str=str+endP+preP; 
                  stato.STARTP=true;  
              }else{
                  str=str+preP;
                  stato.STARTP=true;
              
              }
              str=str+prerP;
              if (stile2!=undefined && stile2.length>0){
                  str=str+'<w:rPr>'+stile2+'</w:rPr>';
              }
              startr=true;
              //str=str+prerP+lineB+endrP;
              break;
  
          /* case 'BOLD':
              console.log('BOLD1');
              str=str+preBold+$(elem).text()+post;
              break; */
  
  
              case 'U':
                      console.log('Italic');
                     // str=str+preItalicP+$(elem).text()+'</w:t></w:r>';
                      if (startr){
                          str=str+endrP;
                          startr=false;
                      }
                      if (!startr){
                              str=str+preItalicP;
                              startr=true;
                           }
                      var els=$(elem).contents();
                      stile2='<w:u/><w:uCs/>';
                      for (var i=0;i<els.length;i++){
                          var el=els[i];
                          stato.STARTR=startr;
                        //  stato.ITALIC=bold;
                          str=parseRawWrXml(el,str,stato,stile,stile2);
                          startr=stato.STARTR;
                          if (startr){
                              str=str+endrP;
                              startr=false;
                          }
                      //    stato.ITALIC='';
                      }
                      break;
  
          case 'I':
              console.log('Italic');
             // str=str+preItalicP+$(elem).text()+'</w:t></w:r>';
              if (startr){
                  str=str+endrP;
                  startr=false;
              }
              if (!startr){
                      str=str+preItalicP;
                      startr=true;
                   }
              var els=$(elem).contents();
              stile2='<w:i/><w:iCs/>';
              for (var i=0;i<els.length;i++){
                  var el=els[i];
                  stato.STARTR=startr;
                //  stato.ITALIC=bold;
                  str=parseRawWrXml(el,str,stato,stile,stile2);
                  startr=stato.STARTR;
                  if (startr){
                      str=str+endrP;
                      startr=false;
                  }
              //    stato.ITALIC='';
              }
              break;
  
          case 'BOLD':   
          case 'B':
              console.log('BOLD');
              //str=str+preBold+$(elem).text()+post;
              /*if (startr){
                  str=str+endrP;
                  startr=false;
              }
              str=str+preBoldP+$(elem).text()+endtxP+endrP;*/
              if (startr){
                  str=str+endrP;
                  startr=false;
              }
              if (!startr){
                      str=str+preBoldP;
                      startr=true;
                   }
              var els=$(elem).contents();
              stile2='<w:b/><w:bCs/>';
              for (var i=0;i<els.length;i++){
                  var el=els[i];
                  stato.STARTR=startr;
                  stato.BOLD=bold;
                 
                  str=parseRawWrXml(el,str,stato,stile,stile2);
                  startr=stato.STARTR;
                  if (startr){
                      str=str+endrP;
                      startr=false;
                  }
                  stato.BOLD='';
              }
  
              break;
             
          
          case 'STRONG':
              console.log('STRONG');
              //str=str+preBold+$(elem).text()+post;
              if (startr){
                  str=str+endrP;
                  startr=false;
              }
              str=str+preBoldP+$(elem).text()+endtxP+endrP;
              break;    
  
          case 'UL':
              console.log('UL');
              var els=$(elem).contents();
              for (var i=0;i<els.length;i++){
                  var el=els[i];
                  stato.STARTR=startr;
                  str=parseRawWrXml(el,str,stato,stile,stile2);
                  startr=stato.STARTR;
                  //console.log('ELS:'+el.nodeName+':'+JSON.stringify(el));
              }
              break;    
  
          case '#TEXT':
              console.log('#TEXT:'+stile2);      
              //str=str+pre+$(elem).text()+post;
             /*  if (startr){
                  str=str+endrP;
                  startr=false;
              }
              if (!startr){
                  str=str+prerP;
                  if (stile2!=undefined && stile2.length>0){
                      str=str+'<w:rPr>'+stile2+stato.BOLD+'</w:rPr>';
                  }
                  startr=true;
              } */
              if (!startr){
                  str=str+prerP;
                  if (stile2!=undefined && stile2.length>0){
                      str=str+'<w:rPr>'+stile2+stato.BOLD+'</w:rPr>';
                  }
                  startr=true;
              }
              str=str+pretxP+$(elem).text()+endtxP;
              break;
          
          case 'LI':
              console.log('LI:'+$(elem).text());      
              //str=str+prerP;
              str=str+preLi;
              if (!startr){
                  str=str+prerP;
                  str=str+'<w:rPr>'+stile2+'</w:rPr>';
                  startr=true;
  
                  }
              //startr=true;
              var els=$(elem).contents();
              for (var i=0;i<els.length;i++){
                  var el=els[i];
  
                  stato.STARTR=startr;
                  str=parseRawWrXml(el,str,stato,stile,stile2);
                  startr=stato.STARTR;
                  if (startr){
                      str=str+endrP;
                      startr=false;
                  }
              }
              str=str+endP;
              stato.STARTP=false;
              //str=str+preLi+$(elem).text()+post;
              break;    
      
          default:
              console.log('ALTRO:'+nm);
              break;
      }
      /*var els=$(elems).children();
      for (var i=0;i<els.length;i++){
          var el=els[i];
          console.log('ELS:'+el.nodeName+':'+JSON.stringify(el));
      }*/
      stato.STARTR=startr;
      return(str);
  }
  
  
  
  async function getRawWrXmlS2(str,stile,stile2){
      /**
       * Nuova versione serversided
       */
  
      var app='xpay';
      var service='Rutils';
      var action='getdocraw';
      var json={};
      json.HTML=str;
      var ret=await apgJSON(app,service,action,json);
      if (ret==undefined || ret.Esito!='OK'){
          if (ret==undefined){
              ret={};
          }
          addTempMsg('ERRORE','Errore nella conversione della stringa '+ret.Msg+''+str);
          return;
      }
      var rec=ret.RAW;
  
      var parser = new DOMParser();
      var xml = parser.parseFromString(rec,"text/xml");
      //consolelog('XML:'+xml);
      var body=xml.getElementsByTagName("w:body");
      //consolelog('BODY:'+body);
      if (body==undefined){
          body=xml.getElementsByTagName("body");
      }
      var serializer = new XMLSerializer();
      var xmlString='';
      var childs=body[0].children;
     
      if (childs!=undefined){
          for (var i=0;i<childs.length;i++){
              xmlString = xmlString+serializer.serializeToString(childs[i]);
          }
      }
  
     
      //console.log('XMLSTRING:'+xmlString);
      return(xmlString);
  }
  
  
  function getRawHyperlink(testo,link){
      if (testo==undefined){
          testo='LINK';
      }
      if (link==undefined){
          link='#';
      }
      link=link.replace(/&/g,'&amp;');
      testo=testo.replace(/&/g,'&amp;');
      //var str='<w:p><w:pPr><w:overflowPunct w:val="0"/><w:jc w:val="center"/><w:rPr><w:color w:val="FFFFFF" w:themeColor="background1"/><w:sz w:val="36"/><w:szCs w:val="36"/><w14:textFill><w14:solidFill><w14:schemeClr w14:val="bg1"/></w14:solidFill></w14:textFill></w:rPr></w:pPr><w:r><w:rPr><w:color w:val="FFFFFF" w:themeColor="background1"/><w:sz w:val="36"/><w:szCs w:val="36"/><w14:textFill><w14:solidFill><w14:schemeClr w14:val="bg1"/></w14:solidFill></w14:textFill></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> HYPERLINK #$#LINK#$# </w:instrText></w:r><w:r><w:rPr><w:color w:val="FFFFFF" w:themeColor="background1"/><w:sz w:val="36"/><w:szCs w:val="36"/><w14:textFill><w14:solidFill><w14:schemeClr w14:val="bg1"/></w14:solidFill></w14:textFill></w:rPr><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:rStyle w:val="8"/><w:color w:val="FFFFFF" w:themeColor="background1"/><w:sz w:val="36"/><w:szCs w:val="36"/><w14:textFill><w14:solidFill><w14:schemeClr w14:val="bg1"/></w14:solidFill></w14:textFill></w:rPr><w:t>#$#TESTO#$#</w:t></w:r><w:r><w:rPr><w:color w:val="FFFFFF" w:themeColor="background1"/><w:sz w:val="36"/><w:szCs w:val="36"/><w14:textFill><w14:solidFill><w14:schemeClr w14:val="bg1"/></w14:solidFill></w14:textFill></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:p>';
      var str='<w:p><w:pPr><w:overflowPunct w:val="0"/><w:jc w:val="center"/><w:rPr><w:color w:val="FFFFFF" w:themeColor="background1"/><w:sz w:val="36"/><w:szCs w:val="36"/><w14:textFill><w14:solidFill><w14:schemeClr w14:val="bg1"/></w14:solidFill></w14:textFill></w:rPr></w:pPr><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve">HYPERLINK "#$#LINK#$#"</w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:rStyle w:val="9"/><w:sz w:val="36"/><w:szCs w:val="36"/></w:rPr><w:t xml:space="preserve">#$#TESTO#$#</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p>';
      str=str.replace('#$#TESTO#$#',testo);
      str=str.replace('#$#LINK#$#',link);
      return(str);
  }
  
  /* function creatoDocx(ogg,target,docfs){
      if (ogg!=undefined){
          ogg.INFOCOMMESSA=docfs.HID;
          Risorsa.save(ogg);
          console.log('HO SALVATO:'+ogg.HID);
      }
  } */
  
  async function salvaParametri(el){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg!=undefined){
          var ret=Risorsa.asave(ogg);
          
      }
  }
  
  function getNewConfigurazione(sezione,riferimento){
      var newconf=new Risorsa('CONFIGURAZIONI');
          if (riferimento!=undefined){
              newconf.RIFERIMENTO=riferimento;
              }
          newconf.SEZIONE=sezione;
          
      return(newconf);    
      
  }
  
  
  async function getConfigurazione(sezione,riferimento,valbase){
  
      var rect=undefined;
      var qry='{"SEZIONE":"'+sezione+'"}';
      if (riferimento!=undefined){
          qry='{"SEZIONE":"'+sezione+'","RIFERIMENTO":"'+riferimento+'"}';
      }
      var ret=await Risorsa.aquery('CONFIGURAZIONI',qry);
      if (ret.Esito=='OK'){
          var lst=ret.LISTA;
          if (lst.length>0){
              var rect=lst[0];
              if (valbase!=undefined){
                  for (var x in valbase){
                      if (rect[x]==undefined){
                          rect[x]=valbase[x];
                      }
                  }
              }
           }
      }
      return(rect);
  }
  
  var callbackConf=async function (hid,campo,valore,el){
      console.log('in callback callbackConf:'+campo+" :"+valore);
      Risorsa.save(this);
  }
  
  async function predisponiGruppiCategorie(ogg,sezione,sezionegruppi,sezionelista){
      var cats = ogg[sezione];
      var listasez = [];
      var gruppi = [];
      var keys = getSortedKeys(cats);
      for (var i=0; i<keys.length; i++){
          var k=keys[i];
          var gruppo={};
          gruppo.GRUPPO=k;
          gruppo.TESTO=k;
          gruppo.VAL=k;
          gruppi.push(gruppo);
          var lista=cats[k];
          for (var j=0;j<lista.length;j++){
              var cat=lista[j];
              var val={};
              val.VAL=cat;
              val.TESTO=cat;
              val.GRUPPO=k;
              listasez.push(val);
          }
      }
  
      if (sezionelista!=undefined){
          AttrezzatureOptions[sezionelista] = listasez;
      }
      if (sezionegruppi!=undefined){
          AttrezzatureOptions[sezionegruppi] = gruppi;
      }
      /*
      var tg=$('#inputTipoAntinfortunistica');
      console.log('TPANTINFORTUNISTICA:'+JSON.stringify(tpAntinfortunistica));
      StdSelectizeGroupSingle(tg, tpAntinfortunistica, gruppi);*/
  }
  
  /**
   * 
   * @param {*} ogg AttrezzatureOptions [nome dell'oggetto]
   * @param {*} sezione [Nome di quello che mi verrà mostrato nella tendina]
   * @param {*} valore [valore da passare dall'interno della callback]
   */
  
  async function testSePresenteInConf(ogg,sezione,valore){
      if (valore==undefined || valore.length<1){
          return;
      }
      var lista=ogg[sezione];
      var trovato=false;
      for (var i=0;i<lista.length;i++){
              var rec=lista[i];
              if (rec.VAL==valore){
                  trovato=true;
              }
      }
      if (!trovato){
          var newconf=undefined;
          var ret=await Risorsa.aquery('CONFIGURAZIONI','{"SEZIONE":"'+sezione+'"}');
              if (ret.Esito=='OK'){
                  var lista2=ret.LISTA;
                  if (lista2.length>0){
                      newconf=lista2[0];
                      
                  }
              }
         if (newconf==undefined){
              newconf=new Risorsa('CONFIGURAZIONI');
              newconf[sezione]=lista;
              newconf.SEZIONE=sezione;
         }     
         var nuovorec={'VAL':valore,'TESTO':valore};
         newconf[sezione].push(nuovorec);
         ret=await Risorsa.asave(newconf);
         if (ret.Esito=='OK'){
              ogg[sezione]=newconf[sezione];
             
          }
          console.log("HO FATTO IL TEST -- CONFERMO");
      }   
  }
  
  
  /**
   * 
   * @param {*} ogg AttrezzatureOptions [nome dell'oggetto]
   * @param {*} sezione [Nome di quello che mi verrà mostrato nella tendina]
   * @param {*} valore [valore da passare dall'interno della callback]
   * 
   */
  
  async function testSePresenteInConfGruppo(ogg,sezione,valore,gruppo,sezionegruppi,sezionelista){
      console.log('TEST SE PRESENTE IN GRUPPO: '+ogg+" : "+sezione+" : "+valore+" : "+gruppo);
      if (valore==undefined || valore.length<1){
          return;
      }
      var lista=ogg[sezione];
      
      var trovato=false;
      for(var j in lista){    
          var rec = lista[j];
          for(var i=0; i<rec.length; i++){
              var elementoSingolo = rec[i];
              if(elementoSingolo == valore)
              {
              trovato = true;
              }
          }
      }
      if (!trovato){
          var newconf=undefined;
          var ret=await Risorsa.aquery('CONFIGURAZIONI','{"SEZIONE":"'+sezione+'"}');
              if (ret.Esito=='OK'){
                  var lista2=ret.LISTA;
                  if (lista2.length>0){
                      newconf=lista2[0];
                  }
              }
          if (newconf==undefined){
              newconf=new Risorsa('CONFIGURAZIONI');
              newconf[sezione]=lista;
              newconf.SEZIONE=sezione;
         }
         if (newconf[sezione][gruppo]==undefined){
          newconf[sezione][gruppo]=[];
              }    
         for(var k in newconf[sezione]){
             var lista3 = newconf[sezione];
             if(k==gruppo){
                 var nuovorec=valore;
                 lista3[k].push(nuovorec);
             }
         } 
         ret=await Risorsa.asave(newconf);
         if (ret.Esito=='OK'){
              ogg[sezione]=newconf[sezione];
              if (sezionegruppi!=undefined||sezionelista!=undefined){
                  predisponiGruppiCategorie(ogg,sezione,sezionegruppi,sezionelista);
              }
          }
      }   
  }
  
  function copytext(el){
      var text=$(el).find('[campoass]').text();
      var $tempInput =  $("<textarea>");
      $("body").append($tempInput);
      $tempInput.val(text).select();
      document.execCommand("copy");
      $tempInput.remove();
      //document.execCommand("copy");
      console.log('Copied');
  }
  
  
  
  // FIRMA CANVAS
  async function firma(div_principale, funzionemia ){
      /* var wrapper = document.getElementById("signature-pad");
      var clearButton = wrapper.querySelector("[data-action=clear]");
      var saveButton = wrapper.querySelector("[data-action=save]");
      var canvas = wrapper.querySelector("canvas"); */
  
      var clearButton = $(div_principale).find("[data-action=clear]");
      var saveButton = $(div_principale).find("[data-action=save]");
      var canvas = $(div_principale).find("canvas")[0];
  
      // $(canvas).css({width: '664px', height: '373px'});
  
      console.log('CANVAS:'+canvas);
      var signaturePad = new SignaturePad(canvas, {
          // It's Necessary to use an opaque color when saving image as JPEG;
          // this option can be omitted if only saving as PNG or SVG
        //  backgroundColor: 'rgb(255, 255, 255)'
      });
     
      $(clearButton).on("click", function (event) {
          signaturePad.clear();
      });
  
      $(saveButton).on("click", function (event) {
          var ogg = Risorsa.load( $(this).attr('hid') );
          if(ogg != undefined){
              var firmatab = $(this).closest('[tipo="div-firma-canvas"]').find('.signature-pad--body').find('canvas');
              var canvas2 = trimCanvas( $(firmatab)[0] );
              canvas2.toBlob(function (blob){
                  console.log("BLOB FIRMA: " + blob);
                  if(funzionemia != undefined){
                      funzionemia(blob, ogg, this);
                      signaturePad.clear();
                  } else {
                      console.log("FUNZIONEMIA NON DEFINITA!!!");
                  }
              }); 
          } else {
              console.log("OGGETTO NON TROVATO!!! " + $(this).attr('hid'));
          }
      });
  
      // Adjust canvas coordinate space taking into account pixel ratio,
      // to make it look crisp on mobile devices.
      // This also causes canvas to be cleared.
      function resizeCanvas() {
          // When zoomed out to less than 100%, for some very strange reason,
          // some browsers report devicePixelRatio as less than 1
          // and only part of the canvas is cleared then.
          var ratio =  Math.max(window.devicePixelRatio || 1, 1);
  
          // This part causes the canvas to be cleared
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext("2d").scale(ratio, ratio);
  
          // This library does not listen for canvas changes, so after the canvas is automatically
          // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
          // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
          // that the state of this library is consistent with visual state of the canvas, you
          // have to clear it manually.
          
          signaturePad.clear();
          
      }
      signaturePad.clear();
      // On mobile devices it might make more sense to listen to orientation change,
      // rather than window resize events.
     // await sleeping(300);
      window.onresize = resizeCanvas;
      resizeCanvas();
      signaturePad.clear();
      // Unbinds all event handlers
      signaturePad.off();
  
      // Rebinds all event handlers
      signaturePad.on();
      //$(canvas).resize();
      console.log("firma... PRIMA DI RESIZE");
      $(window).trigger('resize');
      console.log("firma... DOPO DI RESIZE");
  }
  
  // Start close dialog
  function closeDialog(dialogName) {
      $('#'+ dialogName).dialog('close');
      return false;
  }
  
  
  async function getLocationFromString(ogg, stringa){
      console.log("ENTRO IN getLocationFromString: " + JSON.stringify(ogg));
  
      var el = document.createElement("input");
      el.setAttribute("type", "text");
      el.setAttribute("hid", ogg.HID);
  
      $(el).val(stringa);
  
      console.log("getLocationFromString val: " + $(el).val());
  
      var options = {
          location: $(el).val(),
          markerOptions: {
              draggable: false
          }, 
          
          mapOptions:{scrollwheel:true}
      };
  
      $(el).geocomplete(options)
      .bind("geocode:multiple", function(event, results){
  
      });
     
      $(el).geocomplete().bind("geocode:result", async function(event, result){
          console.log("getLocationFromString result: " + result + " ; hid: " + $(this).attr('hid'));
  
          var hid = $(this).attr('hid');
          var ogg2 = Risorsa.get(hid);
  
          if(ogg2 != undefined){
              ogg2.NCIVICO = "";
              ogg2.VIA = "";
              ogg2.CITTA = "";
              ogg2.PROVINCIA = "";
              ogg2.NAZIONE = "";
              ogg2.CAP = "";
              
              var v = "INDIRIZZO_ID";
              var prev = ogg2[v];
              if (prev==undefined || prev!=result.place_id){
                  ogg2[v] = result.place_id;
  
                  for(var i=0; i<result.address_components.length; i++){
                      var rec = result.address_components[i];
                      var type = rec.types[0];
                      if(type != undefined){
                          switch (type) {
                              case 'street_number':
                                  ogg2.NCIVICO = rec.short_name;
                                  break;
  
                              case 'route':
                                  ogg2.VIA = rec.short_name;
                                  break;
  
                              case 'administrative_area_level_3':
                                  ogg2.CITTA = rec.short_name;
                                  break;
  
                              case 'administrative_area_level_2':
                                  ogg2.PROVINCIA = rec.short_name;
                                  break;
  
                              case 'country':
                                  ogg2.NAZIONE = rec.long_name;
                                  break;
  
                              case 'postal_code':
                                  ogg2.CAP = rec.short_name;
                                  break;
                          
                              default:
                                  break;
                          }
                      }
                       /**
                               * Pj 2019/12/05
                               * Aggiunta dettagli indirizzo
                               */
                              var lid=result.place_id;
                              var indir=result.formatted_address;
                              var geo=result.geometry;
                              if (geo!=undefined && geo.location!=undefined){
                                  ogg2.LUOGO_ID=lid;
                                  ogg2.LUOGO=indir;
                                  ogg2.LAT=geo.location.lat();
                                  ogg2.LON=geo.location.lng();
                              }
                  }
  
                  console.log('getLocationFromString Nuovo valore Oggetto: ' + JSON.stringify(ogg2));
                  var ogg_padre = Risorsa.get(ogg2.PHID);
                  Risorsa.asave(ogg_padre);
  
              }
          } else {
              console.log("getLocationFromString ogg2 non trovato!!!");
          }
  
      });	
  
  }
  var visteTAPPO={ciao:'MAO'};
  
  
  async function mostraUltimiMessaggi(){
      var panel=getServerModule('Ok','LOG_MESSAGGI');
      var target='#new-Attrezzatura-panel';
      if (window.pageapp!=undefined){
          target=pageapp;
      }
      var width="80%";
      var heigth=$(window).height() - 60; 
     // $(target).html(panel);
  
      if (window.INAPP==undefined||!window.INAPP){
          $(target).html(panel);
          var dialog = $( target ).dialog({
              autoOpen: true,
              height: heigth,
              width: width,
              modal: true,
              position: {my: "left top+60", at: "left top", of: '#main-container'},
              close: function(){}});
          }else{
              target=$('#main-container');
              caricaPagina(mostraUltimiMessaggi,panel,arguments);
          }
          var cont= $(target).find('[tipo="contLog"]');
          var vista = getCurrentVista('LOGMESSAGGI');
          var table = renderTable('cardTabella', new Risorsa('NA'), MSGS, vista,undefined,20,'Lista Ultimi Messaggi Log');
          $(cont).append(table);
          $(table).css('width','100%');
  
  
  }
  
  
  var HIST=[];
  var CURRHISTPOS=0;
  var HISTNOADD=false;
  
  function caricaPagina(funzione,html,parms){
      var rec=HIST[0];
      $('.collapse.show').removeClass('show');
      if (rec!=undefined){
          rec.HTML=$('#main-container').html();
          }else{
             rec={};
             rec.FUNZIONE=undefined;
             rec.PARMS=undefined;
             rec.HTML=$('#main-container').html();
             rec.PAGE=window.location.href;
             HIST.push(rec);
          }
          
     /* if (CURRHISTPOS>0){
          HIST.splice(0,CURRHISTPOS-1);
      }*/    
      CURRHISTPOS=0;
      rec={};
      rec.FUNZIONE=funzione;
      rec.PARMS=parms;    
      if (html!=undefined){
          $('#main-container').html(html);
          }
      if (window.SMARTPHONE!=undefined && window.SMARTPHONE){
          $('#accordionSidebar').hide(200);
      }
      try {
        //  requestFocus('main-container');
        requestFocus('wrapper');
      } catch (error) {
         // hopnotify('Errore strano',''+JSON.stringify(error));
      }
      rec.HTML=html;
      HIST.unshift(rec);
      if (HIST.length>100){
          HIST.pop();
      }
      if (!HISTNOADD){
      var pag='#PAG_'+generateID();
      history.pushState('','Pagina '+pag,pag);
      rec.PAGE=window.location.href;
      }else{
          rec.PAGE=window.location.href;
          HISTNOADD=false;
      }
      
  }
  
  var EVENTO=undefined;
  
  window.onpopstate = function(event) {
  
      // "event" object seems to contain value only when the back button is clicked
      // and if the pop state event fires due to clicks on a button
      // or a link it comes up as "undefined" 
    
    //  var r = confirm("Hai schiacciato "+event.state);
      EVENTO=event;
    /*  if (r == true) {
          // Call Back button programmatically as per user confirmation.
         // history.back();
          // Uncomment below line to redirect to the previous page instead.
          // window.location = document.referrer // Note: IE11 is not supporting this.
          CURRHISTPOS=CURRHISTPOS+1;
          var rec=HIST[CURRHISTPOS];
  
          $('#main-container').html(rec.HTML);
      } else {
          // Stay on the current page.
          history.pushState(null, null, window.location.pathname);
      }
      event.preventDefault();*/
      //history.pushState(null, null, window.location.pathname);
      //addMsg('NAV','POPSTATE:'+ window.location.pathname+":"+event.stato+":"+JSON.stringify(event));
      for (var i=0;i<HIST.length;i++){
          var rec=HIST[i];
          //console.log('COMPARE:'+rec.PAGE+" -- "+window.location.pathname);
          var path=window.location.href;
          if (rec!=undefined && path==rec.PAGE){
              console.log('Found page:'+rec.PAGE);
              // $('#main-container').html(rec.HTML);
              //history.pushState(null,null,rec.PAGE);
              if (rec.FUNZIONE!=undefined){
                  HISTNOADD=true;
                  var v=rec.PARMS;
                  if (v!=undefined){
                  rec.FUNZIONE(v[0],v[1],v[2],v[3],v[4],v[5],v[6],v[7],v[8],v[9]);
                  }else{
                      rec.FUNZIONE();
                  }
              }
              break;
          }
      }
  
      return true;
  
      if(event){
          alert('PUSHED EVENT:',JSON.stringify(event));
          EVENTO=event;
          event.preventDefault();
        // Code to handle back button or prevent from navigation
      }
      else{
        // Continue user action through link or button
      }
    }
  
  
    function navPrevPage(){
      var rec=HIST[CURRHISTPOS+1];
      if (rec!=undefined){
          if (rec.FUNZIONE!=undefined){
              HISTNOADD=true;
              var v=rec.PARMS;
              if (v!=undefined){
              rec.FUNZIONE(v[0],v[1],v[2],v[3],v[4],v[5],v[6],v[7],v[8],v[9]);
              }else{
                  rec.FUNZIONE();
              }
              HIST.splice(0,CURRHISTPOS);
          }
      }
  
    }
  
    jQuery(function ($) {
      $.fn.hScroll = function (amount) {
          amount = amount || 120;
          $(this).bind("DOMMouseScroll mousewheel", function (event) {
              var oEvent = event.originalEvent, 
                  direction = oEvent.detail ? oEvent.detail * -amount : oEvent.wheelDelta, 
                  position = $(this).scrollLeft();
              position += direction > 0 ? -amount : amount;
              $(this).scrollLeft(position);
              event.preventDefault();
          })
      };
  });
  
  
      async function scrollSegnaposto(){
          await sleeping(200);
          var sps = $('body').find('.wrap-segnaposto');
  
          for(var i=0; i<sps.length; i++){
              var sp = sps[i];
              if($(sp).is(':visible')){
                  var div_boh = $(sp).find('.mybody')
                  console.log("scrollSegnaposto div: " + $(div_boh).html());
                  var parent = $(sp).parent();
                  var dim=getDimensions(sp);
                  var dim2=getDimensions(parent);
                  console.log("sp e sp parent: " + sp + " ; " + parent.length);
                  var l=dim.x2-dim.x1;
                  var l2=dim2.x2-dim2.x1;
                  var box=[dim2.x1-l+80,dim.y1,dim2.x1,dim.y2];
                  if (l>l2){
                      console.log("Abilito il draggable del segnaposto");
  
                      if( $(sp).draggable('instance') != undefined){
                          console.log("Disabilito il draggable del segnaposto");
                          $(sp).draggable({disabled: false});
                      } else {
  
                          $(sp).draggable({
                              start: function( event, ui ) {
                                  event.stopPropagation();
                              },
                              /* drag: function( event, ui){
                                  $(this).find('.box.selected').off('click');
                              }, */
                              axis: "x",
                              containment:box
                          });
                      }
                  } else {
  
                      console.log("Finestra aperta del tutto: " + l + " ; " + l2);
  
                      if( $(sp).draggable('instance') != undefined){
                          console.log("Disabilito il draggable del segnaposto");
                          $(sp).draggable({disabled: true});
                      }
                  }
              }
          }
      }
  
      function tooltippj(event,contenuto){
          var tg=$('#tooltippj');
          $(tg).css({'position':'absolute','top':event.y,'left':event.x});
          $(tg).find('[tipo="CONTENUTO"]').empty();
          $(tg).find('[tipo="CONTENUTO"]').append(contenuto);
          $(tg).show(100);
      }
  
  
      window.onresize = async function(event){
          // await scrollSegnaposto();
          // --- RICREAZIONE LINEE GERARCHIA UTENTI ---
          var cont_gerarchia = $('#NEW-PAGINA-GERARCHIA');
          if(cont_gerarchia.length > 0){
              var div_principale = $(cont_gerarchia).find('[tipo="costrutto-principale"]');
              var div_svg = $(cont_gerarchia).find('[tipo="svgs"]');
              $(div_svg).empty();
              creaLineeGerarchiaUtenti(div_principale, div_svg);
          }
      }
  
    
  
  
  function visualizzaOggetto(el){
      var ogg = Risorsa.get( $(el).attr('hid') );
  
      if(ogg != undefined){
          switch (ogg.TIPO) {
              case 'CLIENTE':
                  editCliente(el, 'DISABILITA'); return false;
                  break;
  
              case 'UTENTI':
                  editUtente(el, undefined, 'DISABILITA'); return false;
                  break;
  
              case 'PREVENTIVO':
                  ModificaPreventivo(el, 'DISABILITA'); return false;
                  break;
  
              case 'COMMESSA':
                  ModificaCommessa(el, 'DISABILITA'); return false;
                  break;
          
              default:
                  console.log("visualizzaOggetto... non so cosa aprire perchè non c'è un case per questo TIPO: " + ogg.TIPO);
                  break;
          }
      } else {
          console.log("visualizzaOggetto ogg undefined");
      }
  }
  
  
  
  function addTempMsg(titolo,testo,tempo){
      // var t=2000;
      var t=1600;
          
      if(tempo!=undefined){
          try {
              t=parseInt(tempo);    
          } catch (error) {
              
          }
      }
      
      if (t==undefined||t<200){
          // t=2000;
          var t=1600;
      }
      
      var classe='info';
  $.gritter.add({
      // (string | mandatory) the heading of the notification
      title: titolo,
      // (string | mandatory) the text inside the notification
      text: testo,
      // (string | optional) the image to display on the left
    //  image: image,
      // (bool | optional) if you want it to fade out on its own or just sit there
    //  sticky: stk,
      // (int | optional) the time you want it to be alive for before fading out
      time: t,
      class_name: classe
  });
  }
  
  function getObjEl(el){
      var hid=$(el).attr('hid');
      return(Risorsa.get(hid));
  }
  
  function loadObjEl(el){
      var hid=$(el).attr('hid');
      var ogg=Risorsa.get(hid);
      if (ogg==undefined){
          ogg=Risorsa.load(hid);
      }
      return(ogg);
  }
  
  function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  
  
    var StdBadges={};
  async function getBadgeGenerico(ogg,tipobadge,imagebase){
      if (ogg==undefined){
          return(undefined);
      }
      var bdg=undefined;
      
      var tipo=ogg.TIPO;
      var btype=tipobadge;
      if (tipobadge==undefined){
          
          switch (tipo) {
              case "ATTREZZATURA":
                  btype="BADGE_"+tipo;
                  break;
          
              default:
                  btype="BADGE_"+tipo;
                  break;
          }
      }
      bdg=StdBadges[btype];
      if (bdg==undefined){
          bdg=getServerModule('Ok',btype);
          
          StdBadges[btype]=bdg;
        }
      var newbadge=jQuery.parseHTML(bdg);
      if (ogg!=undefined){
          if (ogg.IMMAGINE!=undefined){
              var image = server+"/ecs/?Service=Document&Action=getdoc&hid="+ ogg.IMMAGINE +'&tipodoc=DOC' ;
              $(newbadge).find('img').attr('src',image);
              }else{
                  if (ogg.IMAGE!=undefined){
                      var image = server+"/ecs/?Service=Document&Action=getdoc&hid="+ ogg.IMAGE +'&tipodoc=DOC' ;
                      $(newbadge).find('img').attr('src',image);
                      }else{
                      $(newbadge).find('img').attr('src',imagebase);
                      }
              }
          $(newbadge).find('img').attr('title','Simbolo di '+ogg.DESCRIZIONE);
          $(newbadge).find('[tipo="descrizione"]').html(ogg.DESCRIZIONE);    
          if (ogg.NOMINATIVO!=undefined){
              $(newbadge).find('img').attr('title','Simbolo di '+ogg.NOMINATIVO);
              $(newbadge).find('[tipo="descrizione"]').html(ogg.NOMINATIVO); 
          }
      }
      $(newbadge).attr('hid',ogg.HID);
      return(newbadge);
  }
  
  function isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }
  
  function getPctColor(val){
      /*
      --hop:#234C50;
      --hop-sec:#438E8E;
      --hop-o:#E9790B;
      --hop-g:#F0AE2A;
      --hop-sfondo1:#edf2f2;
      --hop-sfondo2:#F8FAFA;
      --hop-sfondo-verde-leggero: #e8efef;
      --hop-sfondo-verde-medio: #B9D5D5;
      --hop-chatonline:#38c538;
      --hop-chatinactive:gray;
      --hop-grey:#BBC4C4;
      */
      var clsrange=[40,60,70,90,100];
      var cls=['234C50','438E8E','F0AE2A','E9790B','FF1010'];
      for (var i=0;i<clsrange.length;i++){
          if (val<clsrange[i]){
              if (i==0){
                  return('#'+cls[0]);
              }else{
                  var ret=findColor(val,clsrange[i-1],clsrange[i],cls[i-1],cls[i]);
                  return('#'+ret);
              }
          }
      }
      return('#FF1010');
  }
  
  function findColor(vact,min,max,color1,color2)
  {
      var delta=max-min;
      var cur=max-vact;
      /* var color1 = 'FF0000';
      var color2 = '00FF00';
       */
      var ratio = cur/delta;
  
  
  var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
  var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
  var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));
  
  var middle = hex(r) + hex(g) + hex(b);
  return(middle);
  }
  
  
  var hex = function(x) {
      x = x.toString(16);
      return (x.length == 1) ? '0' + x : x;
  };
  
  /**
   * @param {Object} ogg oggetto
   * @param {String} target id del dialog
   * @param {*} width width del dialog
   * @param {*} height height del dialog
   * @param {String} titolo titolo del dialog
   */
  function openDialog(ogg, target, width, height, titolo){
      var dialog = $( target ).dialog({
          autoOpen: true,
          height: height,
          width: width,
          modal: true,
          beforeClose: function(event, ui){
              if(ogg!=undefined && ogg.MODIFIED == true){
                  // var ok = await hopconfirm('Attenzione!!!', 'I dati non sono stati salvati. Sei sicuro di voler uscire?', 'Si', 'Annulla');
                  var ok = confirm('Attenzione!!! I dati non sono stati salvati. Sei sicuro di voler uscire?');
                  if(!ok){ return false; }
              }
          },
          close: async function(event, ui){
              /* if(ogg.MODIFIED == true){
                  var ok = await hopconfirm('Attenzione!!!', 'I dati non sono stati salvati. Sei sicuro di voler uscire?', 'Si', 'Annulla');
                  if(!ok){ return; }
              } */
          }
      });
  
      if(ogg != undefined){
          $(target).attr('hid', ogg.HID);
          ogg.MODIFIED = false;
      }
  
      if(titolo != undefined){
          $(dialog).parent().find('.ui-dialog-title').html(titolo);
      } else {
          $(dialog).parent().find('.ui-dialog-title').html('');
      }
  }
  
  
  /**
   * ctx deve essere un elemento di tipo canvas
   * labels: array di array
   * ritorna l'oggetto chart
   * @param {*} ctx 
   */
  async function StdDrawBarChart(ctx,labels,dati,titoloyax){
  
      try {
          var myBarChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labels, // , ["Interventi", "da", "evadere"], ["Interventi"," in", "ritardo"]
                datasets: [
                  {
                    backgroundColor: ["#EDBD40", "#F00", "#E9790B", "#E9790B"],
                  //   data: [500,350,450,150]
                    data: dati
                  }
                ]
              },
      
              options: {
                  cornerRadius: 20,
                  scales: {
                      xAxes: [{
                          ticks: {
                              autoSkip: false,
                              maxRotation: 0,
                              minRotation: 0,
                              maxTicksLimit: 20,
                              showXLabels: 10,
                              /* beginAtZero: true,
                              stepSize: 1 */
                          },
                          maxBarThickness: 25,
                      }],
      
                      yAxes: [{
                              ticks: {
                                  beginAtZero: true,
                                  stepSize: 1
                              },
                              scaleLabel: {
                                  display: true,
                                  labelString: titoloyax
                              }
                          }],
                  },
      
                  maintainAspectRatio: false,
                  layout: {
                      padding: {
                          left: 10,
                          right: 25,
                          top: 25,
                          bottom: 0
                      }
                  },
      
                  legend: { display: false }
                
              }
          });
          return(myBarChart);
      } catch (error) {
          addMsg('DRAW BAR CHART','Errore:'+error,'KO');
      }
  
  
  }
  
  async function StdLineChart(ctx,labels,data, yTitle,xTitle){
      var config = {
          type: 'line',
          data: {
              labels: labels,
              datasets: [{
                  label: '',
                  backgroundColor: '#D3E3E3',
                  borderColor: '#234C50',
                  pointBackgroundColor: '#F0AE2A',
                  pointBorderWidth: 0,
                  data:data,
                  fill: 'zero',
              }]
          },
          options: {
              legend: {
                  display: false
              },
              responsive: true,
              title: {
                  display: false,
                  text: ''
              },
              tooltips: {
                  mode: 'index',
                  intersect: false,
              },
              hover: {
                  mode: 'nearest',
                  intersect: true
              },
              scales: {
                  xAxes: [{
                      display: true,
                      scaleLabel: {
                          display: true,
                          labelString: xTitle
                      }
                  }],
                  yAxes: [{
                      display: true,
                      scaleLabel: {
                          display: true,
                          labelString: yTitle
                      }
                  }]
              }
          }
      };
      var myLine = new Chart(ctx, config);
      return (myLine);
  }
  
  
  /**
   * Gestione mappe
   * 
   */
  
  var defaultRadius=300;
  
  
  async function applyMapRecord(el,rec,interactive,int2){
      if (interactive==undefined){
          interactive=true;
      }
      if (int2==undefined){
          int2=true;
      }
      var mappahid=$(el).attr('mappahid');
      if (rec!=undefined){
           $(el).attr('hid',rec.HID);
      }
  
      var mappa=undefined;
      if (mappahid!=undefined){
          mappa=Risorsa.get(mappahid);
      }
      if (rec==undefined){
          if (mappa!=undefined && mappa.OGG!=undefined){
              rec=mappa.OGG;
              if (rec==undefined){
                  return;
              }
          }
      }
      var campo=$(el).attr('puntimappa');
  
      var campopres=$(el).attr('presenze');
      
      
      var punti=rec[campo];
      if(punti==undefined && campo!=undefined){
          var dominio = campo.split(".",-1);
          var win = window;
          var go=true;
          for (var j=0;j<dominio.length;j++){
              if (win!=undefined){
                  win=win[dominio[j]];
              }else{
                  go=false;
              }
          }   
          if (go){
              punti=win;
          }
      }
      console.log("applyMapRecord... punti: " + JSON.stringify(punti));
      var presenze={};
      if (campopres!=undefined && rec[campopres]!=undefined){
          presenze=rec[campopres];
      }
      var center=[44.4561403, 12.0004138];
      var centerRec=rec.CENTER;
      if (centerRec!=undefined){
          
          center=rec.CENTER
      }
      var left=center;
      var right=center;
      var minlat=800;
      var minlon=800;
      var maxlat=-800;
      var maxlon=-800;
      var left=L.latLng(35,6);
      var right=L.latLng(48,19);
      if (punti!=undefined && punti.length>0){
          for (var i=0;i<punti.length;i++){
              var punto=punti[i];  
              var lat=punto.LAT;
              var lon=punto.LON;
              
              if (minlat>lat){
                  minlat=lat;
              }
              if (minlon>lon){
                  minlon=lon;
              }
              if (maxlat<lat){
                  maxlat=lat;
              }
              if (maxlon<lon){
                  maxlon=lon;
              }
          }
          
          left=L.latLng(minlat,minlon);
          right=L.latLng(maxlat,maxlon);
          if (rec.CENTER==undefined){
              rec.CENTER=[
                  (maxlat-minlat)/2,(maxlon-minlon)/2
              ]
              center=rec.CANTER;
          }
          console.log('MIN:MAX:'+JSON.stringify(left)+" "+JSON.stringify(right)+":"+minlat+":"+minlon+":"+maxlat+":"+maxlon);
          
      }
     
      var map=undefined;
      if (mappa!=undefined){
          map=mappa.MAP;
      }else{
      mappa=new Risorsa('MAPPA');
      mappa.OGG=rec;
      
  
      map = await L.map($(el)[0], {
          center: [44.4561403, 12.0004138],
          fullscreenControl: true,
         // scrollWheelZoom	:false,
         
          zoom: 13
      });  
      console.log('LEFT:'+JSON.stringify(left));
      console.log('RIGHT:'+JSON.stringify(right));
      await map.fitBounds(L.latLngBounds(left, right));
        await  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              } ).addTo(map);
          
  
              setTimeout(function(){ map.invalidateSize()}, 1600);
          mappa.MAP=map;
          $(el).attr('mappahid',mappa.HID);
      }
  
      clearMap(map);
      if(punti!=undefined){
          for (var j=0;j<punti.length;j++){
              addMarkerPos(map,punti[j],presenze,interactive,int2);
          }
      }
  
  }
  
  
  function addShape(map,shape){
      var markers=map.listMarkers;
      if (map.listMarkers==undefined){
          markers=[];
          map.listMarkers=markers;
      }
  
      markers.push(shape);
  }
  
  function clearMap(map){
      var markers=map.listMarkers;
      if (markers!=undefined){
          for (var i=0;i<markers.length;i++) {
              var marker=markers[i];
              map.removeLayer(marker);
      }
    
      }
  } 
  
  
  
  async function addMarkerPos(map,pos,presenze,interactive,int2){
      try {
          if (interactive==undefined){
              interactive=false;
          }
          if (int2==undefined){
              int2=false;
          }
      var presenti=getPresenti(pos,presenze);
      console.log('PRESENZE:'+pos.HID+':'+JSON.stringify(presenze));
      if (presenti.length>2){
          /**
           * Abbiamo gia' inserito se il sito è attivo
           * */
          
      } else{
          presenti=" nessuno";
      }   
      var radius=defaultRadius;
      if (pos.RADIUS!=undefined){
          radius=pos.RADIUS;
      }
      //L.marker([-20,-20], {icon: L.icon.glyph({ prefix: 'mdi', glyph: 'school' }) }).addTo(map);
      var tipopos=glyphsdec[pos.TIPO];
      var k=pos.TIPO+'_'+pos.STATO;
      var tipoimg=mappaimg[k];
      if (tipoimg==undefined){
          k=pos.TIPO;
          tipoimg=mappaimg[k];
      }
      if(pos.TIPO == "UTEMAP"){
          tipoimg = getSrcUserImage(pos.HID);
      }
      if (tipoimg==undefined){
          tipoimg=mappaimg.DEFAULT;
      }
      var classname="minactive";
      var pres=presenze[pos.HID];
      if (pres==undefined){
          pres={};
      }
      var statopos='INACTIVE';
      if (pres!=undefined && pres.STATOPOS!=undefined){
          statopos=pres.STATOPOS;
      }
      console.log('STATOPOS:'+statopos);
      if (statopos=='ACTIVE'){
          classname='mactive';
      }
      if (statopos=='ATTIVA'){
          classname='mactive';
      }
      if (statopos=="PROBLEM"){
          classname='mproblem';
      }
  
      var imgsize=mappasize[k];
      if (imgsize==undefined){
          imgsize=mappasize.DEFAULT;
      }
      var imganchor=[imgsize[0]/2,imgsize[1]/2];
  
      if (tipopos==undefined){
          tipopos=glyphsdec.DEFAULT;
      }
      var statopos=iconlist[pos.STATOPOS];
  
      var colore=colors[pos.STATOPUNTO];
      if (statopos==undefined){
          statopos=iconlist.DEFAULT;
      }
      if (colore==undefined){
          colore=colors.DEFAULT;
      } 
      var testo=pos.DESCRIZIONE;
      if (pos.TIPO=='COMMESSA'){
          testo="<b>Commessa - "+pos.DESCPADRE+"</b>";
              testo=testo+"<br><b>"+pos.DESCRIZIONE+"<b>";
              testo=testo+'<br>Indirizzo: <a href="geo:'+pos.LAT+','+pos.LON+'">'+pos.INDIRIZZO+"</a>";
              testo=testo+'<br>Raggio: '+pos.RADIUS+" metri";
              testo=testo+"<br><br>"+"Presenti:"+presenti;
      }
  
      if (pos.TIPO=='CAR'){
          testo="<b>Posizione mezzo </b>";
              testo=testo+"<br><b>"+pos.DESCRIZIONE+"<b>";
              testo=testo+'<br>Indirizzo: <a href="geo:'+pos.LAT+','+pos.LON+'">'+pos.INDIRIZZO+"</a>";
              testo=testo+"<br><br>"+"Presenti:"+presenti;
      }
  
      if (pos.TIPO=='ALTROCANTIERE'){
          var desc=pos.DESCRIZIONE;
          if (desc==undefined){
              pos.DESCRIZIONE=pos.NOMECANTIERE;
          }
          testo="<b>Commessa - "+getDescrizionePadre(pos.PHID)+"</b>";
          if (int2){
              testo='<b>Commessa - <a href="#" onclick="ModificaCommessa(this);return(false);" hid="'+pos.PHID+'">'+getDescrizionePadre(pos.PHID)+"</a></b>";  
          }
  
              testo=testo+"<br><b>Cantiere: "+pos.DESCRIZIONE+"<b>";
              testo=testo+'<br>Indirizzo: <a href="geo:'+pos.LAT+','+pos.LON+'">'+pos.LUOGO+"</a>";
              testo=testo+'<br>Raggio: '+pos.RADIUS+" metri";
              if (pres.MOTIVO!=undefined && pres.MOTIVO.length>0){
                  testo=testo+'<br>Note: <span style="color:var(--hop-o);">'+pres.MOTIVO+"</span>";
              }
              testo=testo+"<br><br>"+"Presenti:"+presenti;
      }
  
      if (pos.TIPO=='ALTROCANTIEREPRINCIPALE'){
          var desc=pos.DESCRIZIONE;
          if (desc==undefined){
              pos.DESCRIZIONE=pos.NOMECANTIERE;
          }
              testo="<b>Commessa - "+getDescrizionePadre(pos.PHID)+"</b>";
              if (int2){
                  testo='<b>Commessa - <a href="#" onclick="ModificaCommessa(this);return(false);" hid="'+pos.PHID+'">'+getDescrizionePadre(pos.PHID)+"</a></b>";  
              }
              testo=testo+"<br><b>Cantiere: "+pos.DESCRIZIONE+"<b>";
              testo=testo+'<br>Indirizzo: <a href="geo:'+pos.LAT+','+pos.LON+'">'+pos.LUOGO+"</a>";
              testo=testo+'<br>Raggio: '+pos.RADIUS+" metri";
              if (pres.MOTIVO!=undefined && pres.MOTIVO.length>0){
                  testo=testo+'<br>Note: <span style="color:var(--hop-o);">'+pres.MOTIVO+"</span>";
              }
              testo=testo+"<br><br>"+"Presenti:"+presenti;
      }
  
      if (pos.TIPO=='AZIENDA'||pos.TIPO=='SEDEAZIENDA'){
          testo="<b>Azienda - ";
              if (pos.DESCRIZIONE==undefined){
                  if (pos.TIPOSEDE!=undefined){
                      pos.DESCRIZIONE=pos.TIPOSEDE;
                  }
                  if (pos.TIPOUNITALOC!=undefined){
                      pos.DESCRIZIONE=pos.TIPOUNITALOC;
                  }
              }
              testo=testo+pos.DESCRIZIONE+"</b>";
              testo=testo+'<br>Indirizzo: <a href="geo:'+pos.LAT+','+pos.LON+'">'+pos.INDIRIZZO+"</a>";
              testo=testo+'<br>Raggio: '+pos.RADIUS+" metri";
              testo=testo+"<br><br>"+"Presenti:"+presenti;
      }
  
      if (pos.TIPO=='UTEMAP'){
          testo = "Nome utente: " + pos.DESCRIZIONE;
          if(pos.DISTANZA != undefined){ testo += "<br>Distanza dal cantiere: " + pos.DISTANZA + " KM"; }
      }
      
      
      //var marker = L.marker([pos.LAT, pos.LONG], {icon: L.icon.glyph({ glyphColor:'#87137f', prefix: 'mdi', glyphSize:'18px',glyph: tipopos,iconSize:[24,30],allSize:[24,41],iconUrl:statopos }) }).addTo(map);
      //var marker = L.marker([pos.LAT, pos.LONG], {icon: L.icon.glyph({ prefix: 'mdi', glyphSize:'24px',glyph: 'mdi-worker',iconSize:[100,100],allSize:[100,100],iconUrl:'/www/img/base/cantiere_selezionato.png' }) }).addTo(map);
     //var iconUrl=iconUrl:tipoimg;
      //var marker = L.marker([pos.LAT, pos.LON], {icon: L.icon({ iconAnchor:imganchor,iconSize:imgsize,allSize:imgsize,iconUrl:tipoimg }) }).addTo(map);
      if (pos.LUOGO==undefined && pos.INDIRIZZO!=undefined){
          pos.LUOGO=pos.INDIRIZZO;
      }
  
      if (pos.LAT==undefined && pos.LUOGO!=undefined){
          var ret=await getAddress(pos.LUOGO);
          console.log('DISPERATELY SEEKING LUOGO:'+JSON-stringify(ret));
      }
      var marker = L.marker([pos.LAT, pos.LON], {icon: L.icon({ iconSize:imgsize,iconUrl:tipoimg,className:classname }) }).addTo(map);
      
      marker.bindPopup('<b>'+testo+'</b>');
     var circle=undefined;
     var tipoluogo=pos.TIPO;
     console.log('Ma dimmi perche non vieni fuori:'+tipoluogo);
     switch (tipoluogo) {
         case "COMMESSA":
         case "ALTROCANTIERE":
         case "ALTROCANTIEREPRINCIPALE":
         case "AZIENDA":
         case "UTEMAP":
              circle = L.circle([pos.LAT, pos.LON], {
              color: '#87137f',
              fillColor: colore,
              fillOpacity: 0.4,
              radius: radius,
              interactive:interactive,
              weight: 1
              }).addTo(map); 
              circle.on({
                  mousedown: function () {
                    map.on('mousemove', function (e) {
                          //    e.stopPropagation();
                        e.originalEvent.preventDefault();
                        e.originalEvent.stopPropagation();
                        var dist=getDistanceFromLatLonInKm(e.latlng.lat,e.latlng.lng,pos.LAT,pos.LON);
                        console.log('DISTANZA AFTER DRAG:'+JSON.stringify(e.latlng)+":"+JSON.stringify(pos)+":"+dist);
                        dist=dist*1000;
                        circle.setRadius(dist);
                        pos.RADIUS=Math.round(dist);
                        addMsg('Dimensione Cantiere','Dimensione del luogo di attivit&agrave; impostata a '+dist+" metri.");
                        if (pos.callbackUpdate!=undefined && typeof(pos.callbackUpdate)==='function'){
                           
                          pos.callbackUpdate(pos.HID,'RADIUS',dist);
                          
                        }
                     // circle.setLatLng(e.latlng);
                     console.log('Prima di e:'+e);
                     console.log(e);
                     return(false);
                    });
                  },
                  mouseover: function(){
                      var dist=circle.getRadius();
                      addMsg('Dimensione Cantiere','Dimensione del cantiere '+pos.NOMECANTIERE+' impostata a '+dist+" metri.");
                  }
               }); 
               map.on('mouseup',function(e){
                 map.removeEventListener('mousemove');
               })
             break;
     
         default:
             break;
     }
      
      var markers=map.listMarkers;
      if (map.listMarkers==undefined){
          markers=[];
          map.listMarkers=markers;
      }
      markers.push(marker);
      if (circle!=undefined){
          markers.push(circle);
      }
  } catch (error) {
          console.log("ALERT:"+error);
      }
  }
  
  function getDescrizionePadre(phid){
      if (phid!=undefined){
          var ogg=Risorsa.get(phid);
          if (ogg!=undefined){
              if (ogg.TIPO=='COMMESSA'){
                  var ret=ogg.CLIENTE+" / "+ogg.CODICE+" / "+ogg.DESCRIZIONE;
                  return(ret);
              }
              return(ogg.DESCRIZIONE);
          }
      }
      return(undefined);
  }
  
  
  function getPresenti(pos,presenze){
      var pres=presenze[pos.HID];
      if (pres==undefined){
          return("");
      }
     
      console.log("LUOGO:"+pos.LUOGO_ID+" PRESENTI:"+pos.PRESENTI+" "+UTENTI.length+" "+pos.STATOPUNTO);
      var ret="";
      if (pres!=undefined && pres.PRESENTI!=undefined && pres.PRESENTI.length>0){
          for (var i=0;i<pres.PRESENTI.length;i++){
              var user=pres.PRESENTI[i];
              if (USERS[user]!=undefined){
                  ret=ret+' '+USERS[user].NOMINATIVO+', '; 
              }
            /* for (var j=0;j<UTENTI.length;j++){
                 ret=ret+UTENTI[j].NOMINATIVO+', '; 
              }*/
          }
      }
      return(ret);
  }
  
  
  
  /* function displayMap(map,location){
      map.panTo(new L.LatLng(location.latitude, location.longitude));
      //map.setView(new L.LatLng(40.737, -73.923), 8);
     clearMap(map);
    //  addMarker(map,location.latitude,location.longitude,MVSTATE,'Posizione Corrente');
  }
  
  function displayMapPos(map,pos){
     // map.panTo(new L.LatLng(pos.LAT, pos.LON));
      //map.setView(new L.LatLng(40.737, -73.923), 8);
    
      addMarkerPos(map,pos.LAT,location.LON,MVSTATE,'Posizione Corrente');
  }
   */
  
  function addMarker(map,lat,long,stato,testo){
      var marker = L.marker([lat, long]).addTo(map);
      marker.bindPopup('<b>'+stato+':'+testo+'</b>');
     /* var circle = L.circle([45.4561403, 11.9004138], {
      color: '#87137f',
      fillColor: '#e2c3ec',
      fillOpacity: 0.5,
      radius: 300
      }).addTo(map); */
      var markers=map.listMarkers;
      if (map.listMarkers==undefined){
          markers=[];
          map.listMarkers=markers;
      }
      markers.push(marker);
  }
  
  var glyphsdec={
      'COMMESSA_OLD':'mdi-worker',
      'COMMESSA':'mdi-timer',
      'AZIENDA':'mdi-city-variant-outline',
      'UTENTE':'mdi-account',
      'UTENTE_LAVORO':'mdi-account-clock',
      'UTENTE_OFFLINE':'mdi-account-off-outline',
      'CAR':'mdi-car-pickup',
      'DEFAULT':'mdi-cloud-question'
  }
  
  var iconlist={
      'MIAPOS':'img/base/icon-miapres.png',
      'INATTIVA':'img/base/icon-inattiva.png',
      'ATTIVA':'img/base/icon-attiva.png',
      'PROBLEMA':'img/base/icon-problem.png',
      'DEFAULT':'img/base/icon-inattiva.png'
  }
  
  /* var mappaimg={
      'COMMESSA_MIAPOS':'img/base/cantiere-miapres.png',
      'COMMESSA_INATTIVA':'img/base/cantiere-inattivoa.png',
      'COMMESSA_ATTIVA':'img/base/cantiere-attivo.png',
      'COMMESSA_PROBLEMA':'img/base/cantiere-problema.png',
      'AZIENDA_MIAPOS':'img/base/sede-miapres.png',
      'AZIENDA_INATTIVA':'img/base/sede-inattiva.png',
      'AZIENDA_ATTIVA':'img/base/sede-attiva.png',
      'VAN':'img/base/van2.png',
      'VAN_ATTIVA':'img/base/van2.png',
      'VAN_INATTIVA':'img/base/van2.png',
      'VAN_MIAPOS':'img/base/van.png',
      'CAR':'img/base/car.png',
      'CAR_ATTIVA':'img/base/car.png',
      'CAR_INATTIVA':'img/base/car.png',
      'CAR_MIAPOS':'img/base/car-miapos.png',
      'INATTIVA':'img/base/icon-inattiva.png',
      'ATTIVA':'img/base/icon-attiva.png',
      'PROBLEM':'img/base/icon-problem.png',
      'DEFAULT':'img/base/cantiere-inattivo.png'
  }
   */
  var mappaimg={
     /*  'COMMESSA_MIAPOS':'img/base/cantiere-miapres.png',
      'COMMESSA_INATTIVA':'img/base/cantiere-inattivoa.png',
      'COMMESSA_ATTIVA':'img/base/cantiere-attivo.png',
      'COMMESSA_PROBLEMA':'img/base/cantiere-problema.png',
      'AZIENDA_MIAPOS':'img/base/sede-miapres.png',
      'AZIENDA_INATTIVA':'img/base/sede-inattiva.png',
      'AZIENDA_ATTIVA':'img/base/sede-attiva.png',
      'VAN':'img/base/van2.png',
      'VAN_ATTIVA':'img/base/van2.png',
      'VAN_INATTIVA':'img/base/van2.png',
      'VAN_MIAPOS':'img/base/van.png',
      'CAR':'img/base/car.png',
      'CAR_ATTIVA':'img/base/car.png',
      'CAR_INATTIVA':'img/base/car.png',
      'CAR_MIAPOS':'img/base/car-miapos.png',
      'INATTIVA':'img/base/icon-inattiva.png',
      'ATTIVA':'img/base/icon-attiva.png', */
      'CAR':'/hopperix/Icone/TracciamentoAttivita.svg',
      'SEDEAZIENDA':'/hopperix/IconeMappa/Banca.svg',
      'ALTROCANTIERE':'/hopperix/IconeMappa/Cantieri.svg',
      'ALTROCANTIEREPRINCIPALE':'/hopperix/IconeMappa/Cantieri.svg',
      'PROBLEM':'img/base/icon-problem.png',
      'DEFAULT':'/hopperix/Icone/Luogo-Indirizzo.svg',
      // 'UTENTI':'',
  }
  
  var mappasize={
      'COMMESSA_MIAPOS':[80,80],
      'COMMESSA_INATTIVA':[40,40],
      'COMMESSA_ATTIVA':[80,80],
      'COMMESSA_PROBLEMA':[80,80],
      'AZIENDA_MIAPOS':[80,86],
      'AZIENDA_INATTIVA':[80,86],
      'AZIENDA_ATTIVA':[80,86],
      'VAN':[70,40],
      'VAN_ATTIVA':[70,40],
      'VAN_INATTIVA':[70,40],
      'VAN_MIAPOS':[70,40],
      'CAR':[50,50],
      'CAR_ATTIVA':[50,50],
      'CAR_INATTIVA':[50,50],
      'CAR_MIAPOS':[50,50],
      
      'DEFAULT':[30,30]
  }
  
  
  
  var colors={
      'MIAPOS':'#f35d16',
      'INATTIVA':'#7c7572',
      'ATTIVA':'#12ae42',
      'PROBLEM':'#ee0813',
      'DEFAULT':'#7c7572'
  }
  
  
  
  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    }
    
    
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //:::                                                                         :::
    //:::  This routine calculates the distance between two points (given the     :::
    //:::  latitude/longitude of those points). It is being used to calculate     :::
    //:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
    //:::                                                                         :::
    //:::  Definitions:                                                           :::
    //:::    South latitudes are negative, east longitudes are positive           :::
    //:::                                                                         :::
    //:::  Passed to function:                                                    :::
    //:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
    //:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
    //:::    unit = the unit you desire for results                               :::
    //:::           where: 'M' is statute miles (default)                         :::
    //:::                  'K' is kilometers                                      :::
    //:::                  'N' is nautical miles                                  :::
    //:::                                                                         :::
    //:::  Worldwide cities and other features databases with latitude longitude  :::
    //:::  are available at https://www.geodatasource.com                         :::
    //:::                                                                         :::
    //:::  For enquiries, please contact sales@geodatasource.com                  :::
    //:::                                                                         :::
    //:::  Official Web site: https://www.geodatasource.com                       :::
    //:::                                                                         :::
    //:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
    //:::                                                                         :::
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    function getDistanceFromLatLon(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    }
    
    
    
    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
  
  
    async function getAddress(indir){
      var parm="address="+indir;
      var savedata={
          address:indir
      };
      var res=await apostandgetJSON('AddressQuery','query',savedata,undefined,parm,parm);
      return(res);
    }
  
  
  
  async function stampaEtichetteA4(el, tipo, query, maindiv){
      var res = undefined;
      var lista_res = [];
  
      if(tipo != undefined){
          if(query == undefined){
              res = await Risorsa.aquery(tipo, '{}');
          }
  
          if(res.Esito == 'OK'){
              lista_res = res.LISTA;
              Risorsa.registerElements(lista_res);
          }
      } else {
          var se = Risorsa.get( $(el).attr('hid') );
          if(se != undefined){
              lista_res = se.LISTASTAMPA;
          }
      }
  
      var doc = new PDFDocument({
          bufferPages: true,
          margins: {
              top: 4,
              bottom: 4,
              left: 2,
              right: 2
          },
      });
      var stream = doc.pipe(blobStream());
      doc.fontSize(6);
  
      var x = 35;
      var y = 60;
      
      for(var i=0; i<lista_res.length; i++){
          var ogg = lista_res[i];
          
          if(i%3==0 && i!=0){
              x = 35;
              y += 95;
          }
  
          var iddiv = 'qrcode' + tipo + (i+1);
          var divqr_text = '<div class="col" tipo="qrcode" id="'+iddiv+'"></div>';
          $(maindiv).find('[tipo="listaQRcode"]').empty();
          $(maindiv).find('[tipo="listaQRcode"]').append(divqr_text);
  
          // var divqr = $(maindiv).find('#'+iddiv);
          
          // genero il qrcode per ogni oggetto
          var str = getQrCodeData(ogg);
  
          var qrcode = new QRCode(iddiv, {
              text: str,
              width: 80,
              height: 80,
              colorDark : "#000000",
              colorLight : "#ffffff",
              correctLevel : QRCode.CorrectLevel.H,
          });
       
  
          var bufimg = $(maindiv).find('[tipo="listaQRcode"]').find('#'+iddiv).find('img').attr('src');
          var timeo=3000;
          var t2=0;
          while (bufimg==undefined && t2<timeo){
              t2=t2+30;
              await sleeping(30);
              bufimg = $(maindiv).find('[tipo="listaQRcode"]').find('#'+iddiv).find('img').attr('src');
              console.log('Sleeping waiting for qrcode');
          }
  
          
          console.log("stampaEtichette... src img: " + bufimg);
  
          if(bufimg != undefined){
              doc.image(bufimg, x, y, {'width': 60});
          }
  
          testo = "TIPO: " + ogg.TIPO;
          doc.font('Helvetica').text(testo, (x+65), y, {'width': 70, align: 'left', continued: true});
          doc.font('Helvetica-Bold').text("DESCRIZIONE: ", {'width': 70, align: 'left', continued: true});
          doc.font('Helvetica').text(ogg.DESCRIZIONE, {'width': 70, align: 'left', continued: false});
  
          /* doc.text(testo, (x+65), y, {'width': 70, align: 'left', continued: true});
          doc.text("DESCRIZIONE: ", {'width': 70, align: 'left', continued: true});
          doc.text(ogg.DESCRIZIONE, {'width': 70, align: 'left', continued: false, stroke: true}); */
          
          x += 190;
      }
  
      doc.end();
      stream.on('finish', function() {
          var iframe = document.querySelector(maindiv+' iframe');
          $(maindiv).find('[tipo="listaQRcodePDF"]').css({display: ''});
          iframe.src = stream.toBlobURL('application/pdf');
      });
  
      console.log("--- stampaEtichette THE END ---");
  
  }
  
  async function stampaEtichette(el, tipo, query, maindiv){
      var lista_res = undefined;
      var x = 11;
      var y = 10;
      var se = Risorsa.get( $(el).attr('hid') );
      if(se != undefined){
          lista_res = se.LISTASTAMPA;
      }
      
      var doc = new PDFDocument({
          bufferPages: true,
          margin: 10,
          size: [204, 70]
      });
      var stream = doc.pipe(blobStream());
      doc.fontSize(6);
      for(var i=0; i<lista_res.length; i++){
          y = 10;
          var ogg = lista_res[i];
          var iddiv = 'qrcode' + tipo + (i+1);
          var divqr_text = '<div class="col" tipo="qrcode" id="'+iddiv+'"></div>';
          $(maindiv).find('[tipo="listaQRcode"]').empty();
          $(maindiv).find('[tipo="listaQRcode"]').append(divqr_text);
  
          var str = getQrCodeData(ogg);
  
          var qrcode = new QRCode(iddiv, {
              text: str,
              width: 80,
              height: 80,
              colorDark : "#000000",
              colorLight : "#ffffff",
              correctLevel : QRCode.CorrectLevel.H,
          });
  
          var bufimg = $(maindiv).find('[tipo="listaQRcode"]').find('#'+iddiv).find('img').attr('src');
          var timeo=3000;
          var t2=0;
          while (bufimg==undefined && t2<timeo){
              t2=t2+30;
              await sleeping(30);
              bufimg = $(maindiv).find('[tipo="listaQRcode"]').find('#'+iddiv).find('img').attr('src');
              console.log('Sleeping waiting for qrcode');
          }
  
          
          console.log("stampaEtichette... src img: " + bufimg);
  
          if(bufimg != undefined){
              doc.image(bufimg, x, y, {'width': 50});
          }
  
          var testo = "TIPO: " + ogg.TIPO;
          doc.font('Helvetica-Bold').text(AZIENDA.NOME, (x+55), y, {'width': 110, align: 'left', continued: false});
          y = doc.y;
          doc.font('Helvetica-Bold').text("TIPO: ", (x+55), y, {'width': 110, align: 'left', continued: true});
          doc.font('Helvetica').text(ogg.TIPO, {'width': 110, align: 'left', continued: false});
          y = doc.y;
          doc.font('Helvetica-Bold').text("DESCRIZIONE: ", (x+55), y, {'width': 110, align: 'left', continued: true});
          doc.font('Helvetica').text(ogg.DESCRIZIONE, {'width': 110, align: 'left', continued: false});
          if(ogg.TARGA != undefined){
              testo = "TARGA: " + ogg.TARGA;
              y = doc.y;
              doc.font('Helvetica-Bold').text("TARGA: ", (x+55), y, {'width': 110, align: 'left', continued: true});
              doc.font('Helvetica').text(ogg.TARGA, {'width': 110, align: 'left', continued: false});
          } else if(ogg.MATRICOLA != undefined) {
              y = doc.y;
              doc.font('Helvetica-Bold').text("MATRICOLA: ", (x+55), y, {'width': 110, align: 'left', continued: true});
              doc.font('Helvetica').text(ogg.MATRICOLA, {'width': 110, align: 'left', continued: false});
          }
          
          if(ogg.DATAACQUISTO != undefined){
              testo = "DATA ACQUISTO: " + ogg.DATAACQUISTO;
              y = doc.y;
              doc.font('Helvetica-Bold').text("DATA ACQUISTO: ", (x+55), y, {'width': 110, align: 'left', continued: true});
              doc.font('Helvetica').text(ogg.DATAACQUISTO, {'width': 110, align: 'left', continued: false});
          }
  
          if(i<lista_res.length-1){
              doc.addPage();
          }
      }
  
      doc.end();
      stream.on('finish', function() {
          var iframe = document.querySelector(maindiv+' iframe');
          $(maindiv).find('[tipo="listaQRcodePDF"]').css({display: ''});
          iframe.src = stream.toBlobURL('application/pdf');
      });
  }
  
  async function stampaEtichetta(el){
      var x = 11;
      var y = 10;
      var ogg = Risorsa.get( $(el).attr('hid') );
      
      if(ogg != undefined){
          var doc = new PDFDocument({
              bufferPages: true,
              margin: 10,
              size: [204, 70]
          });
          var stream = doc.pipe(blobStream());
          doc.fontSize(6);
  
  
          openDialog(ogg, '#etichetta-popup', "70%", "auto", 'Stampa etichetta di: '+ogg.DESCRIZIONE);
      
          var iddiv = 'qrcode' + ogg.TIPO + '1';
          var divqr_text = '<div class="col" tipo="qrcode" id="'+iddiv+'"></div>';
          $('#etichetta-popup').find('[tipo="listaQRcode"]').empty();
          $('#etichetta-popup').find('[tipo="listaQRcode"]').append(divqr_text);
  
          var str = getQrCodeData(ogg);
  
          var qrcode = new QRCode(iddiv, {
              text: str,
              width: 80,
              height: 80,
              colorDark : "#000000",
              colorLight : "#ffffff",
              correctLevel : QRCode.CorrectLevel.H,
          });
  
          var bufimg = $('#etichetta-popup').find('[tipo="listaQRcode"]').find('#'+iddiv).find('img').attr('src');
          var timeo=3000;
          var t2=0;
          while (bufimg==undefined && t2<timeo){
              t2=t2+30;
              await sleeping(30);
              bufimg = $('#etichetta-popup').find('[tipo="listaQRcode"]').find('#'+iddiv).find('img').attr('src');
              console.log('Sleeping waiting for qrcode');
          }
  
          
          console.log("stampaEtichette... src img: " + bufimg);
  
          if(bufimg != undefined){
              doc.image(bufimg, x, y, {'width': 50});
          }
  
          var testo = "TIPO: " + ogg.TIPO;
          doc.font('Helvetica-Bold').text(AZIENDA.NOME, (x+55), y, {'width': 110, align: 'left', continued: false});
          y = doc.y;
          // doc.font('Helvetica').text(testo, (x+55), y, {'width': 110, align: 'left', continued: false});
          doc.font('Helvetica-Bold').text("TIPO: ", (x+55), y, {'width': 110, align: 'left', continued: true});
          doc.font('Helvetica').text(ogg.TIPO, {'width': 110, align: 'left', continued: false});
          y = doc.y;
          doc.font('Helvetica-Bold').text("DESCRIZIONE: ", (x+55), y, {'width': 110, align: 'left', continued: true});
          doc.font('Helvetica').text(ogg.DESCRIZIONE, {'width': 110, align: 'left', continued: false});
          if(ogg.TARGA != undefined){
              testo = "TARGA: " + ogg.TARGA;
              y = doc.y;
              doc.font('Helvetica-Bold').text("TARGA: ", (x+55), y, {'width': 110, align: 'left', continued: true});
              doc.font('Helvetica').text(ogg.TARGA, {'width': 110, align: 'left', continued: false});
              // doc.font('Helvetica').text(testo, (x+55), y, {'width': 110, align: 'left', continued: false});
          } else if(ogg.MATRICOLA != undefined) {
              y = doc.y;
              doc.font('Helvetica-Bold').text("MATRICOLA: ", (x+55), y, {'width': 110, align: 'left', continued: true});
              doc.font('Helvetica').text(ogg.MATRICOLA, {'width': 110, align: 'left', continued: false});
              // doc.font('Helvetica').text(testo, (x+55), y, {'width': 110, align: 'left', continued: false});
          }
          
          if(ogg.DATAACQUISTO != undefined){
              testo = "DATA ACQUISTO: " + ogg.DATAACQUISTO;
              y = doc.y;
              doc.font('Helvetica-Bold').text("DATA ACQUISTO: ", (x+55), y, {'width': 110, align: 'left', continued: true});
              doc.font('Helvetica').text(ogg.DATAACQUISTO, {'width': 110, align: 'left', continued: false});
              // doc.font('Helvetica').text(testo, (x+55), y, {'width': 110, align: 'left', continued: false});
          }
  
          doc.end();
          stream.on('finish', function() {
              var iframe = document.querySelector('#etichetta-popup'+' iframe');
              // $('#etichetta-popup').find('[tipo="listaQRcodePDF"]').css({display: ''});
              iframe.src = stream.toBlobURL('application/pdf');
          });
      }
  
  }
  
  var trcon=true;
  
  function consolelog(msg){
      var dt=new Date();
      var m=dt.getTime();
      var js='';
      var mod='';
      var line='';
      if (trcon){
          try {
              
         
          var e=new Error().stack;
          var v=e.split(' at ');
          var s=v[2];
          if (s!=undefined){
              v=s.split(' ');
              mod=v[0];
              v=s.split(':');
              js=v[1];
              line=v[2];
              v=js.split('/');
              js=v[v.length-1];
          }
      } catch (error) {
            js='ErrorPj';
      }
      }
  console.log('SLOG\t'+m+'\t'+js+'\t'+mod+'\t'+line+"\t"+msg);
  }
  
  
  
  

   /**
    * End Viste Functions
    */