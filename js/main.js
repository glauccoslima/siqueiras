$(document).ready(function () {
    console.log("ready");

    // Função para determinar o formato da máscara do campo telefone
    var SPMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 0 0000-0000' : '(00) 0000-00009';
    };

    // Opções para aplicar a máscara no campo telefone
    var spOptions = {
        onKeyPress: function (val, e, field, options) {
            field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
    };

    // Aplica a máscara no campo telefone
    $('#telefone').mask(SPMaskBehavior, spOptions);

    // Adiciona o método de validação personalizado para o nome completo
    $.validator.addMethod("nomeCompleto", function (value, element) {
        return this.optional(element) || /^[^\s]+(\s+[^\s]+)+$/.test(value);
    }, "Por favor, informe o nome e sobrenome.");

    // Função para capitalizar iniciais, excluindo preposições e artigos
    function capitalizeName(name) {
        var prepositionsAndArticles = ['e', 'da', 'de', 'do', 'das', 'dos', 'a', 'an', 'and', 'the'];
        return name.toLowerCase().replace(/\b\w+/g, function (word, index, fullString) {
            if (prepositionsAndArticles.includes(word) && index !== 0) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
    }

    // Adiciona o método de validação personalizado para o email
    $.validator.addMethod("emailStrict", function (value, element) {
        return this.optional(element) || /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
    }, "Por favor, informe um endereço de email válido.");

    // Adiciona evento 'blur' para o campo nome
    $('#nome').on('blur', function () {
        var capitalized = capitalizeName($(this).val());
        $(this).val(capitalized);
    });

    // Adiciona o método de validação personalizado para a mensagem
    $.validator.addMethod("mensagemMinima", function (value, element) {
        var wordCount = value.trim().split(/\s+/).length;
        return this.optional(element) || wordCount >= 3;
    }, "Por favor, escreva uma mensagem com pelo menos 3 palavras.");
    ;

    // Configura a validação do formulário
    $('#meuFormulario').validate({
        // Define as regras de validação para cada campo
        rules: {
            // Regras de validação para o campo 'nome'
            nome: {
                required: true, // O campo 'nome' é obrigatório
                nomeCompleto: true // O campo 'nome' deve conter um nome completo
            },

            // Regras de validação para o campo 'email'
            email: {
                required: true, // O campo 'email' é obrigatório
                emailStrict: true // O campo 'email' deve ser um endereço de e-mail válido e bem formatado
            },

            // Regras de validação para o campo 'telefone'
            telefone: {
                minlength: 14 // O campo 'telefone' deve ter no mínimo 14 caracteres (formato com DDD)
            },

            // Regras de validação para o campo 'mensagem'
            mensagem: {
                required: true, // O campo 'mensagem' é obrigatório
                mensagemMinima: true // O campo 'mensagem' deve ter uma quantidade mínima de caracteres
            },
        },

        // Define as mensagens personalizadas para cada campo
        messages: {
            telefone: 'Por favor, informe o número de telefone ou celular.'
        },
        highlight: function (element) {
            // Adiciona a classe 'is-invalid' e remove a classe 'is-valid' para campos inválidos
            $(element).addClass('is-invalid').removeClass('is-valid');
        },
        unhighlight: function (element) {
            // Adiciona a classe 'is-valid' e remove a classe 'is-invalid' para campos válidos
            $(element).addClass('is-valid').removeClass('is-invalid');
        },
        submitHandler: function (form) {
            // Aqui você pode executar o código para enviar o formulário (por exemplo, usando AJAX)
            // Após o envio bem-sucedido, mostre a mensagem de sucesso
            $("#success-message").fadeIn(500).delay(7000).fadeOut(500);
            // Limpe o formulário e remova as classes de validação
            $(form)[0].reset();
            $(form).find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
        },
    });

    $(document).ready(function () {
        // Função para atualizar a classe 'active' dos links de navegação
        function updateActiveNavLinks() {
            var scrollPos = $(document).scrollTop() + 1;
            var windowHeight = $(window).height();
            var documentHeight = $(document).height();
            var isNearBottom = (scrollPos + windowHeight + 5) >= documentHeight;
            var headerHeight = $('.navbar').outerHeight();

            // Remover a classe 'active' de todos os nav-links
            $('a[data-bs-smooth-scroll="true"]').removeClass('active');

            // Verificar se o scrollPos está no último link antes de verificar os outros links
            var lastNavLink = $('a[data-bs-smooth-scroll="true"]').last();
            var lastTarget = $(lastNavLink.attr('href'));
            var lastTargetTop = lastTarget.offset().top - headerHeight;
            if (isNearBottom || scrollPos >= lastTargetTop) {
                lastNavLink.addClass('active');
                return;
            }

            $('a[data-bs-smooth-scroll="true"]').each(function () {
                var target = $(this.getAttribute('href'));
                var targetTop = target.offset().top - headerHeight;
                var targetBottom = targetTop + target.outerHeight();
                var isActive = scrollPos >= targetTop && scrollPos < targetBottom;

                if (isActive) {
                    $(this).addClass('active');
                    return false; // Encerra o loop each
                }
            });
        }

        // Adiciona um evento de clique nos links com atributo data-bs-smooth-scroll="true"
        $('a[data-bs-smooth-scroll="true"]').on('click', function (event) {
            event.preventDefault();
            var target = $($(this).attr('href'));
            var headerHeight = $('.navbar').outerHeight();

            if (target.length) {
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - headerHeight
                }, 2000); // Mantém a mesma duração para todos os links
            }
        });

        // Atualiza a classe 'active' dos links de navegação ao carregar a página
        updateActiveNavLinks();

        // Atualiza a classe 'active' dos links de navegação quando o usuário rola a página
        $(document).on('scroll', updateActiveNavLinks);
    });


});