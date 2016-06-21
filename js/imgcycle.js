$(document).ready(function(){
    var imgnamelist;
    var len;
    var interval = 5000;

    /**
     * Get request to imglist.php
     */
    $.get('./api/imglist.php',function(data){
        imgnamelist = JSON.parse(data);
        len = $('div.img-container').length;
        for(var i=0;i<len;i++){
            var path = "./img/"+imgnamelist[i];
            var tg = $('.img-container img:first-child');
            $(tg[i]).attr('src',path);
        }
        var cl = new CycleLoader(imgnamelist,len);
        setInterval(cl.imgCycle,interval);
    });

    /**
     * Resize and centered
     */
    $('.viewer-wrapper img').on('load',function(){
        var nh = this.height;
        var nw = this.width;
        var size = 540;
        if(nh > nw){
            var dx = size/nw;
            var yz = Math.round((size-dx*nh)/2);
            this.width = dx*nw;
            this.height = dx*nh;
            $(this).css('top',yz);
        }else{
            var dy = size/nh;
            var xz = Math.round((size-dy*nw)/2);
            this.width = dy*nw;
            this.height = dy*nh;
            $(this).css('left',xz);
        }
    });
    /**
     *  CycleLoader object for iterate path and dom
     * @param imgnamelist
     * @param len
     * @constructor
     */
    var CycleLoader = function(imgnamelist,len){
        this.imgnamelist = imgnamelist;
        this.len = imgnamelist.length-1;
        this.file_pointer = 7;
        this.domlen = len;
        this.dom_pointer = 1;

        this.getDOM = function(){
            var dom = $('.img-container:nth-of-type('+this.dom_pointer+') img');
            this.dom_pointer += 1;
            if(this.dom_pointer > this.domlen){
                this.dom_pointer = 1;
            }
            return dom;
        }.bind(this);

        this.getPath = function(){
            var path = "./img/"+this.imgnamelist[this.file_pointer];
            this.file_pointer += 1;
            if(this.file_pointer > this.len){
                this.file_pointer = 0;
            }
            return path;
        }.bind(this);

        this.imgCycle = function(){
            console.log(this);
            this.getDOM().attr('src',this.getPath()).fadeIn();
        }.bind(this);
    };
});