const onReady = function onReadyFunction() {
  // Adiciona método de validação para nome completo
  $.validator.addMethod(
    "nomeCompleto",
    function validateNomeCompleto(value, element) {
      return this.optional(element) || /^[^\s]+(\s+[^\s]+)+\s*$/.test(value); // Adicione '\s*' no final da regex
    },
    "Por favor, informe o nome e sobrenome."
  );

  // Função para capitalizar nomes
  function capitalizeName(name) {
    const prepositionsAndArticles = [
      "e", "da", "de", "do", "das", "dos", "a", "an", "and", "the"
    ];
    return name
      .toLowerCase()
      .replace(/\b\w+/g, (word, index) => {
        if (prepositionsAndArticles.includes(word) && index !== 0) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
  }

  // Evento para capitalizar o nome ao sair do campo
  $("#nome").on("blur", function() {
    const trimmedValue = $(this).val().trim();
    const capitalized = capitalizeName(trimmedValue);
    $(this).val(capitalized);
  });

  // Adiciona método de validação para email
  $.validator.addMethod(
    "emailStrict",
    function validateEmailStrict(value, element) {
      return this.optional(element) || /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
    },
    "Por favor, informe um endereço de email válido."
  );

  // Máscara do telefone
  const SPMaskBehavior = (val) => {
    return val.replace(/\D/g, "").length === 11 ? "(00) 0 0000-0000" : "(00) 0000-00009";
  };

  const spOptions = {
    onKeyPress(val, e, field, options) {
      field.mask(SPMaskBehavior(val), options);
    },
  };

  // Aplica a máscara ao campo telefone
  $("#telefone").mask(SPMaskBehavior, spOptions);

  // Adiciona método de validação para mensagem mínima
  $.validator.addMethod(
    "mensagemMinima",
    function validateMensagemMinima(value, element) {
      const wordCount = value.trim().split(/\s+/).length;
      return this.optional(element) || wordCount >= 3;
    },
    "Por favor, escreva uma mensagem com pelo menos 3 palavras."
  );

  // Configura o plugin de validação
  $("#meuFormulario").validate({
    rules: {
      nome: { required: true, nomeCompleto: true },
      email: { required: true, emailStrict: true },
      telefone: { minlength: 14 },
      mensagem: { required: true, mensagemMinima: true }
    },
    messages: { telefone: "Por favor, informe o número de telefone ou celular." },
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
    }
  });

  // Atualiza os links ativos da navegação
  const updateActiveNavLinks = () => {
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
      $('a[data-bs-smooth-scroll="true"]').each(function() {
        const target = $(this.getAttribute("href"));
        const targetTop = target.offset().top - headerHeight;
        const targetBottom = targetTop + target.outerHeight();
        const isActive = scrollPos >= targetTop && scrollPos < targetBottom;

        if (isActive) {
          $(this).addClass("active");
          return false; // Encerra o loop each
        }
      });
    }
  };

  // Função de rolagem suave com duração em segundos
  function smoothScroll(target, durationInSeconds) {
    const durationInMilliseconds = durationInSeconds * 1000; // Converte segundos para milissegundos
    $('html, body').stop().animate(
      {
        scrollTop: $(target).offset().top - $('.navbar').outerHeight(),
      },
      durationInMilliseconds, // Duração da animação em milissegundos
      'easeInOutCubic' // Função de easing para suavizar a rolagem
    );
  }

  // Evento de clique nos links da navegação
  $('a[data-bs-smooth-scroll="true"]').on('click', function(event) {
    event.preventDefault();
    const targetId = $(this).attr('href');
    const durationInSeconds = 1; // Duração da rolagem em segundos
    smoothScroll(targetId, durationInSeconds);
  });

  // Atualiza os links ativos da navegação
  updateActiveNavLinks();

  // Atualiza os links ativos da navegação durante a rolagem
  $(document).on("scroll", updateActiveNavLinks);
};

// Executa a função onReady quando o DOM estiver pronto
jQuery(onReady);

// Adiciona a função de easing personalizada ao jQuery
jQuery.easing['easeInOutCubic'] = function(x, t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
  return c / 2 * ((t -= 2) * t * t + 2) + b;
};
