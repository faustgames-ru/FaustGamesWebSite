var animation;
(function (animation) {
    var TimeLineElement = (function () {
        function TimeLineElement(timeStart, timeEnd, valueStart, valueEnd) {
            this.TimeStart = timeStart;
            this.TimeEnd = timeEnd;
            this.ValueStart = valueStart;
            this.ValueEnd = valueEnd;
        }
        return TimeLineElement;
    })();
    animation.TimeLineElement = TimeLineElement;
    var TimeLineAnimatedValue = (function () {
        function TimeLineAnimatedValue() {
            this.Value = 0.0;
            this.StartRepeatKey = 0;
            this.FinishRepeatKey = 0;
            this.TimeLine = new collections.LinkedList();
            this._timeLineValues = new collections.LinkedList();
            this.Time = 0.0;
            this._timelineLength = 0.0;
            this._currentKey = 0;
            this._finish = false;
        }
        TimeLineAnimatedValue.prototype.isEnable = function () {
            return this.TimeLine.size() > 0;
        };
        TimeLineAnimatedValue.prototype.finish = function () {
            this._finish = true;
        };
        TimeLineAnimatedValue.prototype.rewind = function () {
            this._finish = false;
            this._currentKey = 0;
            this.Time = 0.0;
        };
        TimeLineAnimatedValue.prototype.update = function (time) {
            if (!this.isEnable())
                return;

            if (this.Time == 0.0) {
                this.prepareTimeLineValues();
            }

            if (this._currentKey >= this._timeLineValues.size())
                return;

            this.Time += time;
            var key = 0;
            for (var node = this._timeLineValues.firstNode; node != null; node = node.next) {
                if ((this.Time >= node.element.TimeStart) && (this.Time <= node.element.TimeEnd)) {
                    break;
                }
                key++;
            }
            if (key > this._currentKey) {
                this._currentKey++;
            }
            if ((this.FinishRepeatKey - this.StartRepeatKey) > 0) {
                if ((this._currentKey > this.FinishRepeatKey) && !this._finish) {
                    this._currentKey = this.StartRepeatKey;
                    this.prepareTimeLineValues();
                    this.Time = this._timeLineValues.elementAtIndex(this._currentKey).TimeStart;
                }
            }

            var keyValue = (this._currentKey < this._timeLineValues.size()) ? this._timeLineValues.elementAtIndex(this._currentKey) : this._timeLineValues.last();
            var localTime = this.Time - keyValue.TimeStart;
            var localTimeLine = keyValue.TimeEnd - keyValue.TimeStart;
            this.Value = keyValue.ValueStart + (keyValue.ValueEnd - keyValue.ValueStart) * (localTime / localTimeLine);
        };

        TimeLineAnimatedValue.prototype.prepareTimeLineValues = function () {
            this._timelineLength = 0.0;
            this._timeLineValues.clear();
            for (var node = this.TimeLine.firstNode; node != null; node = node.next) {
                var addtime = new mathematics.FloatValueRange(node.element.TimeStart, node.element.TimeEnd).Gen();
                this._timeLineValues.add(new TimeLineElement(this._timelineLength, this._timelineLength + addtime, node.element.ValueStart, node.element.ValueEnd));
                this._timelineLength += addtime;
            }
        };
        return TimeLineAnimatedValue;
    })();
    animation.TimeLineAnimatedValue = TimeLineAnimatedValue;
})(animation || (animation = {}));
//# sourceMappingURL=animation.js.map
