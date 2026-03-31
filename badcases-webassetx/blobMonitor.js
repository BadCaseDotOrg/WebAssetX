(function(){

function send(url, mime){
  try{
    window.dispatchEvent(new CustomEvent("bc-blob-url-created", {
      detail: { url, mime }
    }));
  }catch(e){}
}

/* --------------------
   URL.createObjectURL
-------------------- */

const origCreate = URL.createObjectURL;

URL.createObjectURL = function(obj){

  const url = origCreate.call(URL, obj);

  let mime = "";

  try {

    if (obj instanceof Blob) {
      mime = obj.type || "blob";
    }

    if (obj instanceof MediaSource) {
      mime = "video/stream";
    }

  } catch(e){}

  send(url, mime);

  return url;
};

/* --------------------
   Blob constructor hook
-------------------- */

const OrigBlob = window.Blob;

window.Blob = function(parts, options){

  const blob = new OrigBlob(parts, options);

  try{
    const mime = options?.type || "";

    if(mime){
      send("blob:constructed", mime);
    }
  }catch(e){}

  return blob;
};

window.Blob.prototype = OrigBlob.prototype;

/* --------------------
   MediaRecorder output
-------------------- */

if(window.MediaRecorder){

  const origStop = MediaRecorder.prototype.stop;

  MediaRecorder.prototype.stop = function(){

    this.addEventListener("dataavailable", e => {

      if(e.data){
        const mime = e.data.type || "video/recording";
        send("blob:mediarecorder", mime);
      }

    }, {once:true});

    return origStop.apply(this, arguments);
  };
}

/* --------------------
   Canvas export hooks
-------------------- */

const origCanvasBlob = HTMLCanvasElement.prototype.toBlob;

if(origCanvasBlob){
  HTMLCanvasElement.prototype.toBlob = function(callback, type, quality){

    const wrapped = function(blob){
      try{
        send("blob:canvas", blob?.type || type || "image/png");
      }catch(e){}

      callback(blob);
    };

    return origCanvasBlob.call(this, wrapped, type, quality);
  };
}

const origCanvasData = HTMLCanvasElement.prototype.toDataURL;

if(origCanvasData){
  HTMLCanvasElement.prototype.toDataURL = function(type, quality){

    try{
      send("dataurl:canvas", type || "image/png");
    }catch(e){}

    return origCanvasData.call(this, type, quality);
  };
}

/* --------------------
   FileReader hook
-------------------- */

const origRead = FileReader.prototype.readAsDataURL;

FileReader.prototype.readAsDataURL = function(blob){

  try{
    send("dataurl:filereader", blob?.type || "");
  }catch(e){}

  return origRead.call(this, blob);
};

})();