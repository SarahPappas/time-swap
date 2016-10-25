function Dropdown (selector, targetInputSelector) {
	$(document).ready(function () {
		this._el = $(selector);
		this._targetInput = $(targetInputSelector);

		var taskNeedEls = this._findEl("li.js-item");
		for (var i = 0; i < taskNeedEls.length; i++) {
			var taskEl = $(taskNeedEls[i]);

			var self = this;
			taskEl.on("click", function(e) {
				e.preventDefault();
				self._targetInput.attr("value", this.value);
				self._findEl(".selected-item").text(e.target.textContent);
				self._findEl(".selected-item").val(this.value);
			});
		};
	}.bind(this));
}

Dropdown.prototype = {
	_findEl: function (selector) {
		return this._el.find(selector);
	}
};
