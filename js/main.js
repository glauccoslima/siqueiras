const onReady = function onReadyFunction() {
  // Máscara do telefone
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

  // Aplica a máscara ao campo telefone
  $("#telefone").mask(SPMaskBehavior, spOptions);

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

  // Adiciona método de validação para email
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

  // Evento para capitalizar o nome ao sair do campo
  $("#nome").on("blur", function onNomeBlur() {
    const trimmedValue = $(this).val().trim(); // Adicione esta linha para remover os espaços extras
    const capitalized = capitalizeName(trimmedValue); // Altere '$(this).val()' para 'trimmedValue'
    $(this).val(capitalized);
  });

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
    // Destaca elementos inválidos
    highlight(element) {
      $(element).addClass("is-invalid").removeClass("is-valid");
    },
    // Remove o destaque dos elementos válidos
    unhighlight(element) {
      $(element).addClass("is-valid").removeClass("is-invalid");
    },
    // Ação a ser realizada quando o formulário for enviado com sucesso
    submitHandler(form) {
      // Exibe a mensagem de sucesso
      $("#success-message").fadeIn(500).delay(7000).fadeOut(500);
      // Reseta o formulário
      $(form)[0].reset();
      // Remove as classes de validação dos campos do formulário
      $(form).find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
    },
  });

  // Atualiza os links ativos da navegação
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

  // Evento de clique nos links da navegação
  $('a[data-bs-smooth-scroll="true"]').on(
    "click",
    function onClickNavLink(event) {
      event.preventDefault();
      const target = $($(this).attr("href"));
      const headerHeight = $(".navbar").outerHeight();

      // Adicione um valor de ajuste (positivo ou negativo) para a posição de rolagem
      const adjustment = 0; // Ajuste este valor conforme necessário

      if (target.length) {
        const distance = Math.abs(
          target.offset().top - headerHeight - $(window).scrollTop()
        );
        const speed = 500; // Ajuste este valor para alterar a velocidade de rolagem (pixels por segundo)
        const animationTime = (distance / speed) * 1000;

        $("html, body")
          .stop()
          .animate(
            {
              // Adicione o valor de ajuste à posição de rolagem
              scrollTop: target.offset().top - headerHeight + adjustment,
            },
            animationTime,
            "easeOutSine" // Função de easing para uma animação mais suave
          );
      }
    }
  );

  // Atualiza os links ativos da navegação
  updateActiveNavLinks();

  // Atualiza os links ativos da navegação durante a rolagem
  $(document).on("scroll", updateActiveNavLinks);
};

// Executa a função onReady quando o DOM estiver pronto
jQuery(onReady);
