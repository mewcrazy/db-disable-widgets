jQuery(document).ready(function($) {

    $('.choose-recipients-wrap').on('click', '.apply-single', function(e) {
        e.preventDefault();

        if(!$('input[name="job_title"]').val()) {
            alert("job title missing");
            return;
        }

        let form = $(this).closest('form').serialize();
        let email = $(this).data("email");

        var data = {
            'action': 'send_single_application',
            'form': form + '&recipients=' + email + '&company=' + encodeURIComponent(email)
        };
        $.post(dashboard_ajax.ajax_url, data, (response) => {
            response = $.parseJSON(response);
            if (response.data) {
                let fields = response.data
                $.each( fields, function( key, value ) {
                    console.log(key, value);
                });
            }
        });

        $(this).closest('tr').addClass("sent");
    });

    var recipients_table = $('.recipients-table').DataTable({
        "ajax": {
            url: dashboard_ajax.ajax_url,
            data: { action: "get_recipients" },
            type: "POST"
        },
        searching: true,
        select: true,
        bFilter: false,
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0,
        }],
        columns: [
            {
                data: null,
                defaultContent: '',
                className: 'select-checkbox',
                orderable: false
            },
            {
                data: "id",
                defaultContent: '-',
                className: "id"
            },
            {
                data: "url",
                defaultContent: '-',
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<a href='https://"+sData+"' target='_blank'>"+sData+"</a>");
                }
            },
            {
                data: "email",
                defaultContent: '-',
                className: "email"
            },
            {
                data: "meta_title",
                defaultContent: '-'
            },
            {
                data: "meta_description",
                defaultContent: '-'
            }
        ],
        select: {
            style: 'os',
            selector: 'td:first-child',
        },
        buttons: [
            'selectAll',
            'selectNone'
        ],
        language: {
            buttons: {
                selectAll: "Select all items",
                selectNone: "Select none"
            }
        }
    });

    recipients_table.on('select deselect draw', function () {
        var all = table.rows({ search: 'applied' }).count();
        var selectedRows = table.rows({ selected: true, search: 'applied' }).count();

        if (selectedRows < all) {
            $('#MyTableCheckAllButton').removeClass('selected');
        } else {
            $('#MyTableCheckAllButton').addClass('selected');
        }

    });

    $('#MyTableCheckAllButton').on('click', function () {
        var all = table.rows({ search: 'applied' }).count();
        var selectedRows = table.rows({ selected: true, search: 'applied' }).count();

        if (selectedRows < all) {
            table.rows({ search: 'applied' }).deselect();
            table.rows({ search: 'applied' }).select();
        } else {
            table.rows({ search: 'applied' }).deselect();
        }
    });


    var newsletter_recipients_table = jQuery('.newsletter-recipients-table').DataTable({
        "ajax": {
            url: dashboard_ajax.ajax_url,
            data: { action: "get_newsletter_recipients" },
            type: "POST"
        },
        searching: true,
        select: true,
        bFilter: false,
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0,
        }],
        columns: [
            {
                data: null,
                defaultContent: '',
                className: 'select-checkbox',
                orderable: false
            },
            {
                data: "id",
                defaultContent: '-',
                className: "id"
            },
            {
                data: "url",
                defaultContent: '-',
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<a href='https://"+sData+"' target='_blank'>"+sData+"</a>");
                }
            },
            {
                data: "email",
                defaultContent: '-',
                className: "email"
            },
            {
                data: "company",
                defaultContent: '-'
            },
            {
                data: "description",
                defaultContent: '-'
            },
            {
                defaultContent: '-',
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<a class='button apply-single' href='#' target='_blank' data-id='"+oData.id+"' data-email='"+oData.email+"' data-lastsent='"+oData.last_sent+"'>Bewerben</a>");
                }
            },
        ],
        select: {
            style: 'os',
            selector: 'td:first-child',
        },
        buttons: [
            'selectAll',
            'selectNone'
        ],
        language: {
            buttons: {
                selectAll: "Select all items",
                selectNone: "Select none"
            }
        }
    });

    /** load template */
    $('select[name="template"]').on('change', function () {

        if(!$(this).val()) return;

        var data = {
            'action': 'load_template',
            'id': $(this).val()
        };
        $.post(dashboard_ajax.ajax_url, data, (response) => {
            response = $.parseJSON(response);
            if (response.data) {
                let fields = response.data
                $.each( fields, function( key, value ) {
                    console.log(key, value);
                });
            }
        });
    });


    var table = $('.recipients-table-import').DataTable({
        "ajax": {
            url: dashboard_ajax.ajax_url,
            data: { action: "get_recipients" },
            type: "POST"
        },
        searching: true,
        select: true,
        bFilter: false,
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0,
        }],
        columns: [
            {
                data: null,
                defaultContent: '',
                className: 'select-checkbox',
                orderable: false
            },
            {
                data: "id",
                defaultContent: '-',
                className: "id"
            },
            {
                data: "url",
                defaultContent: '-',
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<a href='https://"+sData+"' target='_blank'>"+sData+"</a>");
                }
            },
            {
                data: "email",
                defaultContent: '-',
                className: "email",
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html('<span class="inline-edit">'+(sData ? sData : "-")+"</span>");
                }
            },
            {
                data: "meta_title",
                defaultContent: '-'
            },
            {
                data: "meta_description",
                defaultContent: '-',
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html(
                        (oData.meta_description_lang && oData.meta_description_lang == 'de' ? '<strong class="lang"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="14" viewBox="0 0 5 3"><desc>Flag of Germany</desc><rect id="black_stripe" width="5" height="3" y="0" x="0" fill="#000"/><rect id="red_stripe" width="5" height="2" y="1" x="0" fill="#D00"/><rect id="gold_stripe" width="5" height="1" y="2" x="0" fill="#FFCE00"/></svg></strong>' : "-") +
                        (sData ? sData : "-"));
                }
            },
            {
                data: "actions",
                defaultContent: '<div class="button-bar"><a class="action reset" href="#">Reset</a><a class="action import" href="#">Import</a><a class="action delete" href="#">Delete</a></div>',
                className: 'actions',
                orderable: false
            }
        ],
        select: {
            style: 'os',
            selector: 'td:first-child',
        },
        buttons: [
            'selectAll',
            'selectNone'
        ],
        language: {
            buttons: {
                selectAll: "Select all items",
                selectNone: "Select none"
            }
        }
    });

    table.on('select deselect draw', function () {
        var all = table.rows({ search: 'applied' }).count(); // get total count of rows
        var selectedRows = table.rows({ selected: true, search: 'applied' }).count(); // get total count of selected rows

        if (selectedRows < all) {
            $('#MyTableCheckAllButton').removeClass('selected');
        } else {
            $('#MyTableCheckAllButton').addClass('selected');
        }

    });

    $('#MyTableCheckAllButton').on('click', function () {
        var all = table.rows({ search: 'applied' }).count(); // get total count of rows
        var selectedRows = table.rows({ selected: true, search: 'applied' }).count(); // get total count of selected rows

        if (selectedRows < all) {
            table.rows({ search: 'applied' }).deselect();
            table.rows({ search: 'applied' }).select();
        } else {
            table.rows({ search: 'applied' }).deselect();
        }
    });

    $('.recipients-table-import').on('click', '.action.reset', function(e) {
        e.preventDefault();

        var data = {
            'action': 'reset_email',
            'id': $(this).closest('tr').find('.id').text()
        };
        $.post(dashboard_ajax.ajax_url, data, (response) => {
            response = $.parseJSON(response);
            if(response.status == "success") {
                table
                    .row( $(this).closest('tr') )
                    .remove()
                    .draw(false);
            }
        });
    });

    $('.recipients-table-import').on('click', '.action.import', function(e) {
        e.preventDefault();


        var data = {
            'action': 'import_email',
            'id': $(this).closest('tr').find('.id').text()
        };
        $.post(dashboard_ajax.ajax_url, data, (response) => {
            response = $.parseJSON(response);
            if(response.status == "success") {
                table
                    .row( $(this).closest('tr') )
                    .remove()
                    .draw(false);
            }
        });
    });

    $('.recipients-table-import').on('click', '.action.delete', function(e) {
        e.preventDefault();

        var data = {
            'action': 'delete_email',
            'id': $(this).closest('tr').find('.id').text()
        };
        $.post(dashboard_ajax.ajax_url, data, (response) => {
            response = $.parseJSON(response);
            if(response.status == "success") {
                table
                    .row( $(this).closest('tr') )
                    .remove()
                    .draw(false);
            }
        });
    });

    $('.recipients-table-import').on('click', '.inline-edit', function(e) {
        $(this).toggle();
        $('<input/>').attr({ type: 'text', class: 'add-inline-edit active', name: $.trim($(this).closest('td').attr('class')), value: $(this).text()}).appendTo($(this).parent());
        $(this).parent().find('input').focus();
    });

    $('.recipients-table-import').on('focusout', '.add-inline-edit', function(e) {
        $(this).prev('.inline-edit').toggle();
        $(this).remove();
    });

    $('.recipients-table-import').on('keyup', '.add-inline-edit', function(evt) {
        if (evt.keyCode == 13) { // enter

            var data = {
                'action': 'update_email',
                'id': $(this).closest('tr').find('.id').text(),
                'email': $(this).val()
            };
            $.post(dashboard_ajax.ajax_url, data, (response) => {
                if(response == "true") {
                    $(this).prev('.inline-edit').text($(this).val());
                    $(this).remove();
                }
                else {

                }
            });
        }
    });

});