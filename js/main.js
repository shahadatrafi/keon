(function() {
    "use strict";

    var hero = $("#hero"),
        heroContent = $(".hero-content"),
        contact = $("#contact");

    /* =Loader
    -------------------------------------------------------------- */
    $("body").queryLoader2({
        // Loader background color
        backgroundColor: "#2E344E",
        percentage: "true",
        fadeOutTime: 500,
        onComplete: function() {
            // Animate the hero after loading is complete
            hero.animate({
                left: 0
            });
            // Add animation classes to content after loading is complete
            heroContent.addClass("loadin");
            $(".depth-1, .depth-3").addClass("loadin-secondary");
        }
    });

    /* =Hero
    -------------------------------------------------------------- */
    // Centering function
    function centerInit() {
        heroContent.css({
            "margin-top": ($(window).height() - heroContent.height()) / 2 + "px"
        });

        hero.css({
            "height": $(window).height() + "px"
        });

        $(".bx-viewport").css({
            "height": $(window).height() + 20 + "px"
        });

        $(".bxslider li").css({
            "height": $(window).height() + 20 + "px"
        });
    }

    // Initialize centering function
    centerInit();
    $(window).resize(centerInit);

    // Slider progress line
    var line = new ProgressBar.Line("#progress-line", {
        duration: 5000,
        easing: "easeInOutCubic",
        color: "#fff"
    });

    // Init full-screen slider
    $(".bxslider").bxSlider({
        mode: "fade",
        pager: false,
        controls: false,
        auto: true,
        easing: "ease-in-out",
        speed: 1500,
        pause: 5000,
        responsive: false,
        onSliderLoad: function() {
            line.set(0);
            line.animate(1.0);
        },
        onSlideBefore: function() {
            line.set(0);
            line.animate(1.0);
        }
    });

    // Init hero parallax effect
    hero.parallax();

    /* =MailChimp Integration
    -------------------------------------------------------------- */
    ajaxMailChimpForm($("#subscribe-form"), $("#subscribe-result"));
    // Turn the given MailChimp form into an ajax version of it.
    // If resultElement is given, the subscribe result is set as html to
    // that element.
    function ajaxMailChimpForm($form, $resultElement) {
        // Hijack the submission. We'll submit the form manually.
        $form.submit(function(e) {
            e.preventDefault();
            if (!isValidEmail($form)) {
                var error = "A valid email address must be provided.";
                $resultElement.hide();
                $resultElement.html(error);
                $resultElement.fadeIn();
                $resultElement.removeClass("notification-success");
                $resultElement.addClass("notification-error");
            } else {
                submitSubscribeForm($form, $resultElement);
            }
        });
    }
    // Validate the email address in the form
    function isValidEmail($form) {
        // If email is empty, show error message.
        // contains just one @
        var email = $form.find("input[type='email']").val();
        if (!email || !email.length) {
            return false;
        } else if (email.indexOf("@") == -1) {
            return false;
        }
        return true;
    }
    // Submit the form with an ajax/jsonp request.
    // Based on http://stackoverflow.com/a/15120409/215821
    function submitSubscribeForm($form, $resultElement) {
        $.ajax({
            type: "GET",
            url: $form.attr("action"),
            data: $form.serialize(),
            cache: false,
            dataType: "jsonp",
            jsonp: "c", // trigger MailChimp to return a JSONP response
            contentType: "application/json; charset=utf-8",
            error: function(error) {
                // According to jquery docs, this is never called for cross-domain JSONP requests
            },
            success: function(data) {
                if (data.result != "success") {
                    var message = data.msg || "Sorry. Unable to subscribe. Please try again later.";
                    if (data.msg && data.msg.indexOf("already subscribed") >= 0) {
                        message = "You're already subscribed. Thank you.";
                    }
                    $resultElement.hide();
                    $resultElement.html(message);
                    $resultElement.fadeIn();
                    $resultElement.removeClass("notification-error");
                    $resultElement.addClass("notification-success");
                } else {
                    $resultElement.hide();
                    $resultElement.html("Thank you! You must confirm the subscription in your inbox.");
                    $resultElement.fadeIn();
                    $resultElement.removeClass("notification-error");
                    $resultElement.addClass("notification-success");
                }
            }
        });
    };

    /* =Contact Form
    -------------------------------------------------------------- */
    $(function() {
        contact.validate({
            // Validation rules
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                email: {
                    required: true,
                    email: true
                },
                message: {
                    required: true
                }
            },
            // The notification messages
            messages: {
                name: {
                    required: "come on, you have a name don't you?",
                    minlength: "your name must consist of at least 2 characters"
                },
                email: {
                    required: "no email, no message"
                },
                message: {
                    required: "um...yea, you have to write something to send this form.",
                    minlength: "thats all? really?"
                }
            },
            submitHandler: function(form) {
                // Submit via AJAX
                $(form).ajaxSubmit({
                    type: "POST",
                    data: $(form).serialize(),
                    url: "contact.php",
                    // Success message
                    success: function() {
                        $("#contact :input").attr("disabled", "disabled");
                        contact.fadeTo("slow", 0.15, function() {
                            $(this).find(":input").attr("disabled", "disabled");
                            $(this).find("label").css("cursor", "default");
                            $("#success").fadeIn();
                        });
                    },
                    // Error message
                    error: function() {
                        contact.fadeTo("slow", 0.15, function() {
                            $("#error").fadeIn();
                        });
                    }
                });
            }
        });
    });

})();