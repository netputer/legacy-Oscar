/** @jsx React.DOM */
(function (window) {
    define([
        '$',
        '_',
        'GA',
        'React',
        'utilities/KeyMapping',
        'components/searchbox/SuggestionItemModel'
    ], function (
        $,
        _,
        GA,
        React,
        KeyMapping,
        SuggestionItemModel
    ) {
        var queryAsync = function (keyword) {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/search/suggest/' + keyword,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var SuggestionItemView = React.createClass({
            clickItem : function (evt) {
                this.props.model.set('selected', true);
            },
            render : function () {
                return (
                    <li class={'o-search-box-suggestion-item' + (this.props.model.get('selected') ? ' selected' : '')}
                        dangerouslySetInnerHTML={{__html : this.props.model.get('body')}}
                        onClick={this.clickItem} />
                );
            }
        });

        var SuggestionListView = React.createClass({
            render : function () {
                var lists = _.map(this.props.resultModels, function (model) {
                    return <SuggestionItemView model={model} key={model.get('body')} />
                });

                return (
                    <ul class="o-search-box-suggestion"
                        style={{display : lists.length > 0 ? 'block' : 'none'}}>
                        {lists}
                    </ul>
                );
            }
        });

        var SearchboxView = React.createClass({
            getInitialState : function () {
                return {
                    resultModels : []
                };
            },
            getDefaultProps : function () {
                return {
                    keyword : ''
                };
            },
            changeInput : function (evt) {
                // queryAsync(evt.target.value).done(function (resp) {
                //     this.setState({
                //         resultModels : _.map(resp, function (item) {
                //             return new SuggestionItemModel({
                //                 body : item
                //             });
                //         })
                //     });
                // }.bind(this));
            },
            modelChangeHander : function (model, selected) {
                if (selected) {
                    var previousSelectedModel = _.find(this.state.resultModels, function (m) {
                        return m.get('selected') && (m !== model);
                    });
                    if (previousSelectedModel !== undefined) {
                        previousSelectedModel.set('selected', false);
                    }
                }

                this.setState({
                    resultModels : this.state.resultModels
                });
            },
            componentWillUpdate : function () {
                _.each(this.state.resultModels, function (model) {
                    model.off('change:selected', this.modelChangeHander, this);
                }, this);
            },
            componentDidUpdate : function () {
                _.each(this.state.resultModels, function (model) {
                    model.on('change:selected', this.modelChangeHander, this);
                }, this);
            },
            keypressInput : function (evt) {
                var resultModels = this.state.resultModels;
                var selectedItem;
                var targetItem;
                var index;

                switch (evt.keyCode) {
                case KeyMapping.ESC:
                    this.setState({
                        resultModels : []
                    });
                    break;
                case KeyMapping.DOWN:
                    if (resultModels.length > 0) {
                        evt.preventDefault();
                        selectedItem = _.find(resultModels, function (item) {
                            return item.get('selected');
                        });
                        if (selectedItem === undefined) {
                            targetItem = resultModels[0];
                        } else {
                            index = resultModels.indexOf(selectedItem);
                            if (index === (resultModels.length - 1)) {
                                targetItem = resultModels[0];
                            } else {
                                targetItem = resultModels[index + 1];
                            }
                        }
                        targetItem.set('selected', true);
                    }
                    break;
                case KeyMapping.UP:
                    if (resultModels.length > 0) {
                        evt.preventDefault();
                        selectedItem = _.find(resultModels, function (item) {
                            return item.get('selected');
                        });
                        if (selectedItem === undefined) {
                            targetItem = resultModels[resultModels.length - 1];
                        } else {
                            index= resultModels.indexOf(selectedItem);
                            if (index === 0) {
                                targetItem = resultModels[resultModels.length - 1];
                            } else {
                                targetItem = resultModels[index - 1];
                            }
                        }
                        targetItem.set('selected', true);
                    }
                    break;
                }
            },
            submitForm : function (evt) {
                GA.log({
                    'event' : 'video.common.action',
                    'action' : 'search',
                    'keyword' : evt.target.keyword.value,
                    'pos' : this.props.source
                });

                if (this.props.onAction) {
                    evt.preventDefault();
                    this.props.onAction(evt.target.keyword.value);
                } else {

                }
            },
            render : function () {
                return (
                    <form class="o-search-box w-form-inline" action="search.html" method="get" onSubmit={this.submitForm}>
                        <div class="o-search-box-wrap">
                            <input
                            ref="searchBoxInput"
                                class="o-search-box-input w-form-inline w-input-large"
                                placeholder="搜索片名、演员、导演"
                                type="text"
                                name="keyword"
                                autoComplete="off"
                                defaultValue={this.props.keyword}
                                onChange={this.changeInput}
                                onKeyDown={this.keypressInput} />
                            <SuggestionListView resultModels={this.state.resultModels} />
                        </div>
                        <button class="w-btn w-btn-large w-btn-primary">搜索</button>
                    </form>
                );
            }
        });

        return SearchboxView;
    });
}(this));
