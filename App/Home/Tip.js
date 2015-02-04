(function($){

  window.App = window.App || {};

  var Tip = function(tip) { 
    this.tip = tip; 
  };
  //either build an <ul> or return Don't use
  Tip.prototype.replacementHtml = function (){
    var html = '<div class="replacements">';
    if(this.tip.replacements && this.tip.replacements.length){
      html += '<div class="muted replacements-label">Replace it with:</div><ul>';
      for(var i=0; i < this.tip.replacements.length; i++){
        html += '<li>' + this.tip.replacements[i] + '</li>';
      }
      html += '</ul>';
    } else {
      html += "Don't Use"
    }
    return html + '</div>';
  }

  Tip.prototype.truncate = function (string, length){
    if(string.length <= length) return string;
    else return string.substring(0, length) + "...";
  }


  Tip.prototype.render = function() {
    var html = '<li id="tip-' + this.tip.id + '" class="tip-container" data-tip-container>' +
                  '<div class="inner-tip-class">' +
                    '<a href="' + App.baseUrl + 'tip/' + this.tip.id + '" target="_blank"><h2 class="tip-header">' + this.tip.matched_string + '</h2></a>' +
                    '<a href="' + App.baseUrl + 'profile/' + this.tip.creator.id + '" class="creator" target="_blank">' +
                      '<img class="user-image" src="' + this.tip.creator.mugshot_url + '" title="' + this.tip.creator.name.split(' ')[0] + ' alt="" />' +
                      '<div class="contributor-desc">Submitted By: <br />' + this.tip.creator.name + '</div>' +
                    '</a>' +
                    '<div class="tip clearfix">' +
                      '<div class="explanation">' +
                        this.truncate(this.tip.explanation, 230) + this.replacementHtml() +
                      '</div>' +
                      '<div class="tip-border">' +
                        '<a href="javascript:void(0)" data-tip-id="' + this.tip.id + '" class="close-tip">&times;</a>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</li>';

    return $(html);
  }

  Tip.prototype.fillerMessage = function() {
    var html = '<li class="tip-container">'+
                  '<div class="container">' +
                    this.tip.matched_string +
                  '</div>' +
               '</li>';

    return $(html);
  }

  $(document).on('click', '.close-tip', function(){
    $('#tip-' + $(this).data('tip-id')).remove();
  });

  App.Tip = Tip;

})(jQuery);