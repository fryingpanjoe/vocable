function exportWords(){
    var output= '#mode=' + CURRENT_MODE + "\n";
    for(var i = 0; i < WORDS.length; i++){
        output += WORDS[i][0]+':'+WORDS[i][1]+"\n";
    }
    $("#id_import_textarea").val(output);
}

function saveList(){
    var blob = new Blob([$("#id_import_textarea").val()], {type: "text/plain;charset=utf-8"});
    saveAs(blob, prompt("Filnamn", "krimilingo.txt"));
}

function importWords(){
    var temp = $("#id_import_textarea").val();
    var rows = temp.split("\n");

    var result = new Array();
    for(var i = 0; i < rows.length; i++){
        if(rows[i].charAt(0) === '#'){
            handleFileHeader(rows[i]);
        }else{
            var cols = $.trim(rows[i]).split(':');
            if(cols[0] !== undefined && cols[1] !== undefined){
                result.push(cols);
            }
        }
    }
    WORDS = result;
    showWordList();
}

function handleFileSelect(evt) {
    $("#id_import_textarea").val('');
    var files = evt.target.files;

    var title = "";

    // Import each files content to the textarea
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        reader.onload = (function (theFile) {
            title += theFile.name.substring(0, theFile.name.length - 4);
            return function (e) {
                $("#id_import_textarea").val($("#id_import_textarea").val() + e.target.result);
                importWords();
            };
        })(f);
        reader.readAsText(f);
    }

    //set the title from the filename(s)
    $(".title").html(title);
    document.title = title;

    $("#files").val('');
}

function handleFileHeader(row){
    var cols = $.trim(row).substring(1).split('=');
    if(cols[0] !== undefined && cols[1] !== undefined){
        switch(cols[0]){
            case 'mode':
                setMode(cols[1]);
                break;
        }
    }
}
