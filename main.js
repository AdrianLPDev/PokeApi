// $(document).ready(function (){  });
/*CUANDO CARGUE EL DOCUMENTO*/
$(function(){
    //Elementos
    const pokeCard = $("#pokeCard");
    const pokemon = $("#pokemon");
    const pokedex = $("#pokeCard > :nth-of-type(1)");
    const pokeImg = $("#pokeCard > :nth-of-type(2) > img");
    const pokeId = $("#pokeCard > div > :nth-of-type(1)");
    const pokeType = $("#pokeCard > div >  :nth-of-type(2)");
    const pokeStats = $("#pokeCard > div > :nth-of-type(3)");

    
    /*
    * Array para posteriormente poner los colores de los tipos de pokemons
    * Source: https://www.epidemicjohto.com/t882-type-colors-hex-colors
    * Ordenados por orden alfabético con default al final
    * 
    * Realmente no los uso, uso clases creadas por mí en el CSS, pero estaba bien como idea
    * Ej: typeTextElement.style.color = typeColors[type.type.name];
    */
    const typeColors = {
        bug:  'A6B91A',
        dark:  '705746',
        dragon:  '6F35FC',
        electric:  'F7D02C',
        fairy:  'D685AD',
        fire:  'EE8130',
        fighting:  'C22E28',
        flying:  'A98FF3',
        grass:  '7AC74C',
        ghost:  '735797',
        ground:  'E2BF65',
        ice:  '96D9D6',
        normal: 'A8A77A',
        water:  '6390F0', 
        poison:  'A33EA1',
        psychic:  'F95587',
        rock:  'B6A136',
        steel:  'B7B7CE',
        default: 'FFFFFF',
    };
    /* Source: https://stackoverflow.com/questions/12252378/capturing-a-form-submit-with-jquery-and-submit/12252576*/
    $("form").submit(function(event) {
        //Dejamos en blanco el nombre del Pokémon para resetearlo
        pokemon.text('');
        //Por si ha fallado alguna búsqueda, reseteamos el style
        $(".divImg > img").removeAttr("style");
        event.preventDefault();
        /* Cogemos el nombre del pokémon para buscarlo en la API */
        const { value } = event.target.pokemon;
        fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
            .then(data => data.json())
            .then(response => renderPokemonData(response))
            /*Por si hay errores, como que escriba mal el nombre*/
            .catch(err => renderNotFound());
    });
    
    const renderPokemonData = data => {
        /* Opacidad 0 */
        pokeCard.css({
            opacity: 0,
          });
        const sprite =  data.sprites.front_default;
        const { stats, types } = data;
        pokedex.html(data.name);
        pokeId.text(`Nº ${data.id}`);
        pokeImg.attr('src', sprite);
        setCardColor(types);
        renderPokemonTypes(types);
        renderPokemonStats(stats);
        /* Animación de aparición de la carta */
        pokeCard.animate({
            opacity: 1,
          }, 1000, function() {
            // Animación completada.
          });
    }
    
    /*Set default classes*/
    const setCardColor = types => {
        pokeCard.removeClass();
        pokeCard.addClass('pokeCard');
    }
    
    const renderPokemonTypes = types => {
        pokeType.html('');
        for (let i = 0; i < types.length; i++) {
            switch (i){
                case 0:
                    //Voy al padre del padre (card) para darle el estilo del primer tipo
                    pokeType.parent().parent().addClass(`${types[0].type.name}`);
                    /* Añadimos el div con todo a través de JQuery para el primer tipo */
                    // Source: https://stackoverflow.com/questions/867916/creating-a-div-element-in-jquery
                    jQuery('<div/>', {
                        "id": 'pokeType1',
                        "class": `${types[0].type.name}PokeType`,
                        "title": `${types[0].type.name}`,
                        "text": `${types[0].type.name.toUpperCase()}`
                    }).appendTo('.pokeType');
                    break;
                case 1:
                    /* Añadimos el div con todo a través de JQuery para el segundo tipo */
                    jQuery('<div/>', {
                        "id": 'pokeType1',
                        "class": `${types[1].type.name}PokeType`,
                        "title": `${types[1].type.name}`,
                        "text": `${types[1].type.name.toUpperCase()}`
                    }).appendTo('.pokeType');
                    break;
                default:
                    break;
            }
        }     
    }
    
    const renderPokemonStats = stats => {
        /*Reseteamos el texto de pokestats*/
        pokeStats.html('');
        /*Por cada stat, creamos un div con el nombre y luego con el número de ése stat*/
        stats.forEach(stat => {
            jQuery('<div/>', {
                "id": 'statName',
                "title": `${stat.stat.name}`,
                "text": `${stat.stat.name}`
            }).appendTo('.pokeStats');

            jQuery('<div/>', {
                "id": 'statNum',
                "title": `${stat.base_stat}`,
                "text": `${stat.base_stat}`
            }).appendTo('.pokeStats');
        });
    }
    /*Si hay error, dejamos todo por defecto y ponemos un mensaje de 'No encontrado' */
    const renderNotFound = () => {
        pokedex.text('No encontrado');
        pokeImg.attr('src', 'Pikachu.png');
        pokeImg.css('background-color',  '#fff');
        pokeType.html('');
        pokeStats.html('');
        pokeId.text('');
    }
    /*Shiny onclick*/
    pokeImg.on("click", function(event){
        const value = $('.titulo').text();
        fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
        .then(data => data.json())
        .then(response => renderShiny(response))

    });
    /*Default on double click*/
    pokeImg.on("dblclick", function(event){
        const value = $('.titulo').text();
        fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
        .then(data => data.json())
        .then(response => renderDefault(response))

    });
    /* Shiny */
    const renderShiny = data => {
        const sprite =  data.sprites.front_shiny;
        pokeImg.attr('src', sprite);
    }
    /*Default*/
    const renderDefault = data => {
        const sprite =  data.sprites.front_default;
        pokeImg.attr('src', sprite);
    }
});