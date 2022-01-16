jQuery(document).ready( function ($) {

    /**
     * Job form
     */
    if($('.job-form').length) {

        /** gender toggle */
        $('select[name="gender"]').on('change', function() {
            $('input[name="last_name"]').hide();
            if($(this).val() != "Damen und Herren") $('input[name="last_name"]').show();
        });

        /** application type toggle */
        if ($('input[name="options[bulk_send]"]').length) {
            $('input[name="options[bulk_send]"]').on('change', function() {
                if ($(this).is(':checked')) {
                    // massen
                    $('.personal-details-wrap').fadeOut(300);
                    $('.choose-recipients-wrap').fadeIn(300);
                    $('.form-group.offset_recipients').fadeIn(300);
                    $('.form-group.bulk_send_limit').fadeIn(300);
                    $('input[name="job_id"]').fadeOut(300);
                    $('input[name="recipient"]').fadeOut(300);
                    $('.load-templates-wrap').fadeIn(300);
                }
                else {
                    // einzel
                    $('.personal-details-wrap').fadeIn(300);
                    $('.choose-recipients-wrap').fadeOut(300);
                    $('.form-group.offset_recipients').fadeOut(300);
                    $('.form-group.bulk_send_limit').fadeOut(300);
                    $('input[name="job_id"]').fadeIn(300);
                    $('input[name="recipient"]').fadeIn(300);
                    $('.load-templates-wrap').fadeOut(300);
                }
            })
        }
    }

    /** signature pad */
    var signaturePad = new SignaturePad(document.getElementById('signature-pad'));

    /** form */
    $('form').on('submit', function(e) {
        e.preventDefault();
        $('input[name="signature"]').val(signaturePad.toDataURL());
        $(this).off('submit').submit();
    });
} );