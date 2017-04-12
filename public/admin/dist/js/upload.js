$(window).ready(function(){
    //upload form btn
    let btnSelectFiles = $('#btn-select-files'),
        files = $('#files');
    btnSelectFiles.on('click', function () {
        files.trigger('click');
    });
    files.on('change', function () {
        $('#upload-form').submit();
    });

});

let tbody = $('.upload-table tbody');
function doUpload() {
    tbody.removeClass('hidden').empty();
    let fileType = document.getElementById('fileType').value;
    let files = document.getElementById('files').files;
    for (let i = 0; i < files.length; i++) {
        uploadFile(files[i], i+1, fileType);
    }
    return false;
}
function uploadFile(file, index, fileType) {

    if (!fileType) fileType = 'image';

    let fileSize = parseInt(file.size / 1024);

    let http = new XMLHttpRequest();

    tbody.append(`<tr class='row${index}'>
                        <td>${index}</td>
                        <td>${file.name}</td>
                        <td>${fileSize} kb</td>
                        <td class="status"></td>
                    </tr>`);

    let row = tbody.find(`.row${index}`);

    http.upload.addEventListener('progress', function (event) {
        let fileLoaded = event.loaded;
        let fileTotal = event.total;
        let fileProgress = parseInt((fileLoaded / fileTotal) * 100) || 0;
        if (fileProgress === 100) {
            row.find('.status').text('Processing...');
        } else {
            row.find('.status').text(`${fileProgress}%`);
        }
    });

    //Start upload
    let data = new FormData();
    data.append('filename', file.name);
    data.append('file', file);
    data.append('type', 'image');
    http.open('POST', '/admin/media/create?type=' + fileType, true);
    http.send(data);

    http.onreadystatechange = function (event) {
        if (http.readyState == 4 && http.status == 200) {
            let response = JSON.parse(http.responseText);
            if (response.status == 1) {
                let image = JSON.stringify(response.file);
                row.addClass('bg-success');
                row.find('.status').html('<i class="fa fa-check-circle-o" style="color: #00a65a;"></i>');
                $('table.main-table tbody').prepend(`<tr>
                            <td><input type="checkbox" name="listId" value="${response.file.id}"></td>
                            <td>
                                <img src="/uploads/${response.file.path}-150x150${response.file.ext}" alt="${response.file.name}" width="50">
                            </td>
                            <td>${response.file.name}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                    </tr>`)
                $('#MediaPopup .modal-body a.img-thumb:nth-child(32)').remove();
                $('#MediaPopup .modal-body').prepend(`<a class="img-thumb" data-id="${response.file._id}" data-path="${response.file.path}" data-ext="${response.file.ext}"><img src="/uploads/${response.file.path}-150x150${response.file.ext}"></a>`)
            } else {
                row.find('.status').text(`${response.message}`);
                row.addClass('bg-danger');
            }
        }
        http.removeEventListener('progress', function() {
            console.log('Remove Event');
        });
    }
}