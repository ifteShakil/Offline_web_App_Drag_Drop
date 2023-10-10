
$(document).ready(function() {
    $('#target').on('dragover', function (event) {
         event.preventDefault();
        $(this).css('border', '2px solid #000');
    });
        
    $('#target').on('dragleave', function(event) {
        event.preventDefault();
         $(this).css('border', '2px dashed #bbb');
    });
        
    $('#target').on('drop', function(event) {
         event.preventDefault();
        $(this).css('border', '2px dashed #bbb');
        var files = event.originalEvent.dataTransfer.files;
        
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var name = file.name;
            var type = file.type;
            var size = file.size;
            var url = URL.createObjectURL(file);
        
             $('#filesTable').append('<tr><td>' + name + '</td><td>' + type + '</td><td>' + size + '</td><td><a href="' + url + '" download> <img src="' + url + '" alt="Your Image"  style="float:right;width:42px;height:42px;" id="image_input" /> </a></td></tr>');
        }
    });
});
 