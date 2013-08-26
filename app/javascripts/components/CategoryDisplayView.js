/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'utilities/Download',
        'utilities/FormatString',
        'utilities/FormatDate'
    ], function (
        React,
        _,
        Backbone,
        Download,
        FormatString,
        FormatDate
    ) {
    	var queryAsync = function (data) {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/search/',
                data : data || {},
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var textEnum = {
        	LAST_EPISODE : '第{0}集',
        	TOTLE_COMPLATE : '{0}集完',
        	NO_RATING : '暂无评分',
        	NO_DATA : '暂无数据'
        };

    	var  ItemView = React.createClass({displayName: 'ItemView',
    		render : function () {
    			
    			var data = this.props.data;
    			var rating = data.marketRatings;
    			var actors = data.actors;
    			var type = data.type;
    			var title = data.title;

    			if (actors.length) {
    				actors = actors.join(' / ');
    			} else {
    				actors = textEnum.NO_DATA;
    			}

    			var ele;
    			switch (type) {
        		case "MOVIE": 
        			
        			if (rating && rating.length) {
    					rating = rating[0].rating;
    				} else {
    					rating = textEnum.NO_RATING;
    				}
        			
        			ele = this.renderMovie(title, actors, rating);
        			break;
        		case "TV": 
        		case "COMIC":
        			
        			var episode;
        			if (data.latestEpisodeNum === data.totalEpisodesNum) {
        				episode = FormatString(textEnum.TOTLE_COMPLATE, [data.latestEpisodeNum]);
        			} else {
        				episode = FormatString(textEnum.LAST_EPISODE, [data.latestEpisodeNum]);
        			}
        			
        			ele = this.renderTV(title, actors, episode);
        			break;
        		case "VARIETY":

        			var presenters = data.presenters;
        			if (presenters.length) {
    					presenters = presenters.join(' / ');
    				} else {
    					presenters = textEnum.NO_DATA;
    				}	

    				var episode;
        			if (data.latestEpisodeDate) {
        				episode = FormatDate('yyyy-MM-dd',data.latestEpisodeDate);
        			} else {
        				episode = textEnum.NO_DATA;
        			}
        			
        			ele = this.renderVarirty(title, presenters, episode);
        			break;
        		}
    			
    			return (
    				React.DOM.li( {className:"o-categories-item"}, 
    					React.DOM.div( {className:"cover"}, 
    						React.DOM.img( {src:data.cover.l})
    					),
    					ele
    				)
    			);	
    		},
    		renderVarirty : function (title, presenters, episode) {
    			return (
    				React.DOM.div( {className:"info"}, 
    					React.DOM.span( {className:"title wc w-text-secondary", dangerouslySetInnerHTML:{ __html : title }}),
    					React.DOM.span( {className:"presenters wc w-text-info"}, presenters),
    					React.DOM.span( {className:"episode w-text-info"}, episode),React.DOM.br(null),
    					React.DOM.button( {className:"download w-btn w-btn-primary w-btn-mini", onClick:this.download}, "下载")
    				)
    			);
    		},
    		renderMovie : function (title, actors, rating) {
    			return (
    				React.DOM.div( {className:"info"}, 
    					React.DOM.span( {className:"title wc w-text-secondary", dangerouslySetInnerHTML:{ __html : title }}),
    					React.DOM.span( {className:"actor wc w-text-info"}, actors),
    					React.DOM.span( {className:"rating w-text-info"}, rating),React.DOM.br(null),
    					React.DOM.button( {className:"download w-btn w-btn-primary w-btn-mini", onClick:this.download}, "下载")
    				)
    			);
    		},
    		renderTV : function (title, actors, episode) {
    			return (
    				React.DOM.div( {className:"info"}, 
    					React.DOM.span( {className:"title wc w-text-secondary", dangerouslySetInnerHTML:{ __html : title }}),
    					React.DOM.span( {className:"actor wc w-text-info"}, actors),
    					React.DOM.span( {className:"episode w-text-info"}, episode),React.DOM.br(null),
    					React.DOM.button( {className:"download w-btn w-btn-primary w-btn-mini", onClick:this.download}, "下载")
    				)
    			);
    		},
    		download : function () {
                
                var videoEpisodes = this.props.data.videoEpisodes;
                var type = this.props.data.type;

    			Download.downloadVideo(videoEpisodes, type);
    		}
        });

        var CategoriesDisplayView = React.createClass({displayName: 'CategoriesDisplayView',
        	checkArgs : function () {
        		var data = this.props.data;
        		
        		return {
        			mixed : data.mixed === undefined ? true : data.mixed,
        			max : data.max || 4,
        			start : data.start === undefined ? 0 : data.start
        		};
        	},
        	getInitialState : function () {
             	
                var data = this.checkArgs();

                queryAsync(data).done(function (resp) {
               		
               		this.videoList = resp.videoList;
               		this.setState({
               			'videoList' : resp.videoList
               		});

                }.bind(this));

                return {};
            },
            render : function () {

            	return (
            		React.DOM.div( {className:"o-categories-diplay-container"}, 
            			React.DOM.ul( {className:"o-categories-item-container"}, 
            				this.renderItem()
            			)
            		)
            	);
            },
            renderItem : function () {
            	var result = [];

            	_.map(this.videoList, function (video) {
            		result.push(ItemView( {data:video}));
            	});

            	return result;
            }
        });

        return CategoriesDisplayView;
    });
 }(this));