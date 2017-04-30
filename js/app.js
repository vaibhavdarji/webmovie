var BootStrapApp = function ($el) {
    if (!($el instanceof $)) {
		$el = $($el);
	}

	//bind the events
	//$el.on('click', this.onQuickTipClick.bind(this));

	this.$el = $el;
	this.el = $el[0];


}

BootStrapApp.prototype = {
    /**
	 * @property {jQuery} $el
	 */
	$el: null,

	/**
	 * [el description]
	 * @property {HTMLElement} el
	 */
	el: null,
    onSuccess: function (response) {
        if (typeof response === 'string') {
            response = JSON.parse(response);
        }
        var $slide,
            $poster,
            self = this,
            genreList = [],
            genre;

        $.each(response, function (index, slider) {
            genre = slider.Genre.split(', ');

            if (genreList.length) {
                var itemGenre = genreList;
                genreList = itemGenre.concat(genre.filter(function (item) {
                    return genreList.indexOf(item) < 0;
                }));
            } else {
                genreList = genreList.concat(genre);
            }

            $slide = $('<div></div>');
            $slide.data({
                'genre': genre
            });
            $poster = $('<img/>', {
                id: slider.Id,
                class: 'img-slider',
                src: slider.Poster
            });
            $slide.append($poster);
            $('.carousel').append($slide);




        });
        $(".carousel").slick({
            slidesToShow: 3,
            slidesToScroll: 3,
            lazyLoad: 'progressive',
            responsive: [
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 400,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 320,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
            ]
        });


        $('.img-slider').on('click', function (e) {
            var record = response.filter(function (item) {
                return item.Id === e.currentTarget.id
            });
            if (record.length) {
                self.updateMovieDetail(record[0]);
            }
        });

        this.updateGenreList(genreList);

    },
    updateGenreList: function (genreList) {
        var $dropdown = this.$el.find('.dropdown');
        $.each(genreList, function (i, item) {
            $dropdown.append($('<option>', {
                value: i,
                text : item
            }));
        });

        $dropdown.on('change', this.onChangeGenre);
    },

    onChangeGenre: function (e) {
        e.preventDefault();
        if (!e.target.value) {
            return;
        }

        var index = parseInt(e.target.value, 10),
            genre = $(e.target).find(':selected').text(),
            $carousel = $('.carousel');

        $carousel.slick('slickUnfilter');
        $carousel.slick('slickFilter', function (index, item) {

            var genreList = $(item).data('genre');
            return genreList.indexOf(genre) >= 0;
        });


    },

    updateMovieDetail: function (record) {
        this.$el.find('.poster img').attr('src', record.Poster);
        var $metadata = this.$el.find('.metadata');
        $metadata.find('.title').html(record.Title);
        var $detail = $metadata.find('.detail');

        $detail.empty();
        var skip = ['poster', 'id', 'title', 'n/a'];

        var $container,
            $title,
            $answer
        $.each(record, function (key, value) {
            if (skip.indexOf(key.toLowerCase()) < 0 && skip.indexOf(value.toLowerCase()) < 0) {
                $container = $('<div></div>');
                $title = $('<span></span>');
                $title.html(key);
                $answer = $('<span></span>');
                if (key.toLowerCase() === 'website') {
                    $answer.append($('<a></a>').attr({
                        'href': value,
                        'target': '_blank'
                    }).html(value));
                } else {
                    $answer.html(value);
                }
                $container.append($title, $answer);

                $detail.append($container);
            }
        })
    },


    onError: function (error) {
        console.log('\n\n error while loading carousel list >>', error)
    },
    loadCarousel: function () {

        $.ajax({
            context: this,
            crossOrigin: true,
            url: 'https://pastebin.com/raw/xS0VZJxr'
        })
        .done(this.onSuccess)
        .fail(this.onError);

        
    }
};

BootStrapApp.init = function ($container) {
    if (!($container instanceof $)) {
		$container = $($container);
	}


    return new BootStrapApp($container);
}
