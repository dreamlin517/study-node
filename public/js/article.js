function deleteModal() {
    $('#deleteModal').modal('show');
} 
 
function ensuerDelete(title){
    $.ajax({
        url: '/article',
        method: 'delete',
        data: { title: title },
        success: function () {
            location.href = '/blog';
        }
    });
}