/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone'
    ], function (
        React,
        _,
        Backbone
    ) {

        var PageView = React.createClass({displayName: 'PageView',
            
            render : function () {
                this.total = this.state['total'] || 0;
                this.current = this.state['current'] || 1;
                this.win = this.state['win'] || 5;

                if ( this.total === 0 ) {
                    return '';
                }
                
                var previousClass = "o-page-arrow previous";
                if (this.current === 1) {
                    previousClass += ' disable';
                }

                var nextClass = "o-page-arrow next";
                if (this.current === this.total) {
                    nextClass += ' disable';
                }
                
                var left = parseInt(this.win / 2);
                var right = parseInt((this.win - 1) / 2);

                var start;
                if (this.total - this.current < right) {
                    start = this.total - this.win + 1;
                } else {
                    start = this.current - left;
                }

                if (start < 1) {
                    start = 1;
                }

                var count;
                if (this.total - start < this.win) {
                    count = this.total - start + 1;
                } else {
                    count = this.win;   
                }

                return (
                    React.DOM.div( {className:"o-page-container"}, 
                        React.DOM.a( {className:previousClass, onClick:this.getPrevious}, "上一页"),
                        React.DOM.div( {className:"o-pagecount-container"}, 
                            React.DOM.span( {className:"o-pagecount-dot"}, "・"),
                            this.getPageCount(start, count)
                        ),
                        React.DOM.a( {className:nextClass, onClick:this.getNext}, "下一页")
                    ) 
                );
            },
            getPageCount : function (start, count) {
                var result = [];
                if (this.current !== 1) {
                    result.push(React.DOM.a( {className:"o-pagecount-item", onClick:this.getPage}, "1"));
                    result.push(React.DOM.span( {className:"o-pagecount-dot"}, "・"));
                } else {
                    result.push(React.DOM.a( {className:"o-pagecount-item current"}, "1"));
                    result.push(React.DOM.span( {className:"o-pagecount-dot"}, "・"));
                }

                if (start === 1 ){
                    start ++;
                    count --;                     
                } else if (start > 2) {
                    result.push(React.DOM.span( {className:"o-pagecount-dot"}, "・"));
                    result.push(React.DOM.span( {className:"o-pagecount-dot"}, "・"));
                }

                var end = start + count - 1;
                if (end === this.total) {
                    end --;     
                }

                if (start <= end) {
                    for (var i = start ; i <= end ; i ++ ){
                        if (this.current  !== i ) {
                            result.push(React.DOM.a( {className:"o-pagecount-item", onClick:this.getPage}, i));
                        } else {
                            result.push(React.DOM.a( {className:"o-pagecount-item current", onClick:this.getPage}, i));
                        }
                            result.push(React.DOM.span( {className:"o-pagecount-dot"}, "・"));   
                    }
                }
                            
                if (end < this.total - 1 ) {
                    result.push(React.DOM.span( {className:"o-pagecount-dot"}, "・"));
                    result.push(React.DOM.span( {className:"o-pagecount-dot"}, "・"));
                }

                if (this.current != this.total) {
                    result.push(React.DOM.a( {className:"o-pagecount-item", onClick:this.getPage}, this.total));
                } else {
                    result.push(React.DOM.a( {className:"o-pagecount-item current", onClick:this.getPage}, this.total));
                }

                result.push(React.DOM.span( {className:"o-pagecount-dot"}, "・"));

                return result;
            },
            getPrevious : function () {
                var previous = this.current - 1;
                if (previous === 0) {
                    return;
                }

                this.setState({
                    current : previous
                });
            },
            getNext : function () {
                var next = this.current + 1;
                if (next > this.total) {
                    return;
                }

                this.setState({
                    current : next
                });
            },
            getPage : function (evt) {
                this.setState({
                    current : parseInt(evt.target.innerHTML)
                });
            },
            getInitialState: function() {
                return this.props.data;
            },
        });

        return PageView;
    });
}(this));
