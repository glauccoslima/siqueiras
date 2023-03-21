const onReady = function onReadyFunction() {
  const SPMaskBehavior = function maskBehavior(val) {
    return val.replace(/\D/g, "").length === 11
      ? "(00) 0 0000-0000"
      : "(00) 0000-00009";
  };

  const spOptions = {
    onKeyPress(val, e, field, options) {
      field.mask(SPMaskBehavior(val), options);
    },
  };

  $("#telefone").mask(SPMaskBehavior, spOptions);

  $.validator.addMethod(
    "nomeCompleto",
    function validateNomeCompleto(value, element) {
      return this.optional(element) || /^[^\s]+(\s+[^\s]+)+$/.test(value);
    },
    "Por favor, informe o nome e sobrenome."
  );

  function capitalizeName(name) {
    const prepositionsAndArticles = [
      "e",
      "da",
      "de",
      "do",
      "das",
      "dos",
      "a",
      "an",
      "and",
      "the",
    ];
    return name
      .toLowerCase()
      .replace(/\b\w+/g, function capitalizeWord(word, index) {
        if (prepositionsAndArticles.includes(word) && index !== 0) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
  }

  $.validator.addMethod(
    "emailStrict",
    function validateEmailStrict(value, element) {
      return (
        this.optional(element) ||
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
      );
    },
    "Por favor, informe um endereço de email válido."
  );

  $("#nome").on("blur", function onNomeBlur() {
    const capitalized = capitalizeName($(this).val());
    $(this).val(capitalized);
  });

  $.validator.addMethod(
    "mensagemMinima",
    function validateMensagemMinima(value, element) {
      const wordCount = value.trim().split(/\s+/).length;
      return this.optional(element) || wordCount >= 3;
    },
    "Por favor, escreva uma mensagem com pelo menos 3 palavras."
  );

  $("#meuFormulario").validate({
    rules: {
      nome: {
        required: true,
        nomeCompleto: true,
      },
      email: {
        required: true,
        emailStrict: true,
      },
      telefone: {
        minlength: 14,
      },
      mensagem: {
        required: true,
        mensagemMinima: true,
      },
    },

    messages: {
      telefone: "Por favor, informe o número de telefone ou celular.",
    },
    highlight(element) {
      $(element).addClass("is-invalid").removeClass("is-valid");
    },
    unhighlight(element) {
      $(element).addClass("is-valid").removeClass("is-invalid");
    },
    submitHandler(form) {
      $("#success-message").fadeIn(500).delay(7000).fadeOut(500);
      $(form)[0].reset();
      $(form).find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
    },
  });

  const updateActiveNavLinks = function updateActiveNavLinksFunction() {
    const scrollPos = $(document).scrollTop() + 1;
    const windowHeight = $(window).height();
    const documentHeight = $(document).height();
    const isNearBottom = scrollPos + windowHeight + 5 >= documentHeight;
    const headerHeight = $(".navbar").outerHeight();
    $('a[data-bs-smooth-scroll="true"]').removeClass("active");
    const lastNavLink = $('a[data-bs-smooth-scroll="true"]').last();
    const lastTarget = $(lastNavLink.attr("href"));
    const lastTargetTop = lastTarget.offset().top - headerHeight;
    if (isNearBottom || scrollPos >= lastTargetTop) {
      lastNavLink.addClass("active");
    } else {
      $('a[data-bs-smooth-scroll="true"]').each(function updateNavLink() {
        const target = $(this.getAttribute("href"));
        const targetTop = target.offset().top - headerHeight;
        const targetBottom = targetTop + target.outerHeight();
        const isActive = scrollPos >= targetTop && scrollPos < targetBottom;

        if (isActive) {
          $(this).addClass("active");
          return false; // Encerra o loop each
        }
        return true;
      });
    }
  };

  $('a[data-bs-smooth-scroll="true"]').on(
    "click",
    function onClickNavLink(event) {
      event.preventDefault();
      const target = $($(this).attr("href"));
      const headerHeight = $(".navbar").outerHeight();
      if (target.length) {
        $("html, body")
          .stop()
          .animate(
            {
              scrollTop: target.offset().top - headerHeight,
            },
            2000
          ); // Mantém a mesma duração para todos os links
      }
    }
  );

  updateActiveNavLinks();

  $(document).on("scroll", updateActiveNavLinks);
};

jQuery(onReady);
