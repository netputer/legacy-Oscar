/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '$',
        'IO',
        'GA',
        'Actions',
        'Wording'
    ], function (
        React,
        $,
        IO,
        GA,
        Actions,
        Wording
    ) {


        var banner = {};

        var bannerWidth = 740;

        var getBannerAsync = function (type) {

            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.TOPIC,
                data : {
                    type : type
                },
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };


        var ItemView = React.createClass({
            render : function () {
                var data = this.props.data;
                var link = '/topic.html?type=' + this.props.source + '#' + data.name;
                var title = data.cnName;
                var imageUrl = data.picture;
                return (
                    <li className="banner-item">
                        <a href={link} title={title}>
                            <img src={imageUrl} alt={title} />
                        </a>
                    </li>
                );
            }
        });

        var DotView = React.createClass({
            componentDidMount : function () {
                this.slider(1);
            },
            clickDot : function (index) {
                document.getElementById('banner-container').style.marginLeft = '-' + (index * bannerWidth) + 'px';

                _.each(document.getElementsByClassName('dot'), function (ele, index) {
                    ele.className = 'dot';
                });

                this.refs['dot'].getDOMNode().className += ' current';
            },
            slider : function (index) {
                if (banner.length > 1) {
                    setInterval(function () {
                        console.log(index)
                        document.getElementsByClassName('dot')[index++].click();

                        if (index >= banner.length) {
                            index = 0;
                        }
                    }, 3000);

                }
            },
            render : function () {
                if (this.props.index === 0) {
                    return (
                        <span ref="dot" className="dot current" onClick={this.clickDot.bind(this, this.props.index)}>{this.props.index}</span>                  
                    );
                } else {
                    return (
                        <span ref="dot" className="dot" onClick={this.clickDot.bind(this, this.props.index)}>{this.props.index}</span>                  
                    );
                }
            }
        });

        var BannerView = React.createClass({
            getBanner : function () {
                if (this.props.source !== undefined) {
                    getBannerAsync(this.props.source).done(function (resp) {
                        banner = resp;
                    }.bind(this));
                }
            },
            renderItem : function (source) {
                var result = _.map(banner, function (item) {
                    return (
                        <ItemView data={item} source={source} />
                    );
                });
                return result;

            }.bind(this),
            renderDot : function () {
                var result;
                if (banner.length > 1) {
                    result = _.map(banner, function (item, index) {
                        return (
                            <DotView index={index} />
                        );
                    });
                }
                return result;
            },
            render : function () {
                this.getBanner();

                return (
                    <div class="banner">
                        <ul id="banner-container">
                            {this.renderItem.call(this, this.props.source)}
                        </ul>
                        <div class="dots">
                            {this.renderDot}
                        </div>
                    </div>
                );
            }
        });

        return BannerView;
    });
}(this));
