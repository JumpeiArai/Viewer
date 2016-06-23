$(document).ready(function(){
    var imgnamelist;
    var domlen;
    var interval = 3000;
    var tmr;
    var cl;
    /**
     * Get request to imglist.php
     */
    $.get('./api/imglist.php',function(data){
        imgnamelist = JSON.parse(data);
        domlen = $('div.img-container').length;
        for(var i=0;i<domlen;i++){
            var path = imgnamelist[i];
            var tg = $('.img-container img:first-child');
            $(tg[i]).attr('src',path);
            var non_active = $('.img-container img:last-child');
            var j = i+domlen;
            if( j>imgnamelist.length-1 ){ j = j-imgnamelist.length ;}
            $(non_active[i]).attr('src',imgnamelist[j]);
        }
        cl = new CycleLoader(imgnamelist,domlen);
        tmr = setInterval(cl.imgCycle,interval);
    });

    /**
     * Resize and centered image
     */
    $('.viewer-wrapper img').on('load',function(){
        var nh = this.naturalHeight;
        var nw = this.naturalWidth;
        var size = 540;
        if(nh > nw){
            var dx = size/nw;
            var yz = Math.round((size-dx*nh)/2);
            this.width = dx*nw;
            this.height = dx*nh;
            $(this).css('left',0);
            $(this).css('top',yz);
        }else{
            var dy = size/nh;
            var xz = Math.round((size-dy*nw)/2);
            this.width = dy*nw;
            this.height = dy*nh;
            $(this).css('top',0);
            $(this).css('left',xz);
        }
    });

    /**
     *  CycleLoader object for iterate file_pointer and dom_pointer
     * @param imgnamelist - Filename Array
     * @param domlen - <img> DOM length
     * @constructor
     */
    var CycleLoader = function(imgnamelist,domlen){

        this.imgnamelist = imgnamelist;
        this.len = imgnamelist.length-1;
        this.domlen = domlen;
        this.dom_pointer = 0;
        this.file_pointer = domlen+1;
        this.fadetime = 1000;

        this.getActiveDOM = function(){
            var active = $('.img-container img.active');
            var select = $(active[this.dom_pointer]);
            return select;
        }.bind(this);

        this.getNonActiveDOM = function(){
            var non_active = $('.img-container > img:not(.active)');
            var select = $(non_active[this.dom_pointer]);
            return select;
        }.bind(this);

        // Loop iterator for file_pointer
        this.getPath = function(){
            var path = this.imgnamelist[this.file_pointer];
            this.file_pointer += 1;
            if(this.file_pointer > this.len){
                this.file_pointer = 0;
            }
            return path;
        }.bind(this);

        this.imgCycle = function(){
            var self = this;
            var adom = this.getActiveDOM();
            var ndom = this.getNonActiveDOM();
            adom.animate({ 'opacity':0 },self.fadetime,'linear',function(){
                ndom.addClass('active');
                $(this).attr('src',self.getPath()).removeClass('active');
            });
            ndom.animate({ 'opacity':1.0 },self.fadetime);
            this.dom_pointer ++;
            if(this.dom_pointer > this.domlen-1){this.dom_pointer = 0;}
        }.bind(this);

        this.updateDomUrl = function(){
            console.log(this.imgnamelist);
            for(var i=0;i<this.domlen;i++){
                var fc = $('.img-container img:first-child');
                $(fc[i]).attr('src',this.imgnamelist[i]);
                var lc = $('.img-container img:last-child');
                var j = i+this.domlen;
                if( j>this.imgnamelist.length-1 ) {
                    j = j-this.imgnamelist.length;
                }
                $(lc[i]).attr('src',this.imgnamelist[j]);
            }
        }.bind(this);
    };

    function getBingimages(){
        var query = $('#query').val();
        $.ajax({
            url: './api/bingsearch.php',
            type:'POST',
            dataType: 'json',
            data : {query:query},
            timeout:10000,
            success: function(data) {
                cl.imgnamelist = data;
                cl.file_pointer = 0;
                cl.len = data.length;
                cl.updateDomUrl();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
            }
        });
    };

    $('#send').on('click',getBingimages);
});