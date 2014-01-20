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
            onClick : function () {
                GA.log({
                    'event' : 'video.common.action',
                    'action' : 'topic_clicked',
                    'keyword' : this.props.data.name,
                    'pos' : this.props.source
                });
            },
            render : function () {
                var data = this.props.data;
                var link = 'topic.html?type=' + this.props.source + '#' + data.name;
                var title = data.cnName;
                var imageUrl = data.picture;
                return (
                    <li className="banner-item">
                        <a href={link} title={title} onClick={this.onClick}>
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
                if (this.state.banner.length > 1) {
                    setInterval(function () {
                        document.getElementsByClassName('dot')[index++].click();

                        if (index >= this.state.banner.length) {
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
           getInitialState : function () {
                return {
                    banner :  {}
                };
            },
            componentWillMount : function () {
                this.getBanner();
            },
            getBanner : function () {
                if (this.props.source !== undefined) {
                    getBannerAsync(this.props.source).done(function(resp) {
                        this.setState({
                            banner : resp
                        });
                    }.bind(this));
                }
            },
            renderItem : function (source) {
                if (this.state.banner.length > 0) {
                    var result = _.map(this.state.banner, function (item) {
                        return (
                            <ItemView data={item} source={source} />
                        );
                    });
                }

                return result;

            },
            renderDot : function () {
                var result;
                if (this.state.banner.length > 1) {
                    result = _.map(this.state.banner, function (item, index) {
                        return (
                            <DotView index={index} />
                        );
                    });
                }
                return result;
            },
            render : function () {

                return (
                    <div className="banner">
                        <ul id="banner-container">
                            {this.renderItem.call(this, this.props.source)}
                        </ul>
                        <div className="dots">
                            {this.renderDot}
                        </div>
                    </div>
                );
            }
        });

        return BannerView;
    });
}(this));
