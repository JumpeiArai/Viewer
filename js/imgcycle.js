$(document).ready(function(){
    var imgnamelist;
    var len;
    var interval = 5000;

    $.get('./api/imglist.php',function(data){
        imgnamelist = JSON.parse(data);
        len = $('div.img-container').length;
        for(var i=0;i<len;i++){
            var path = "./img/"+imgnamelist[i];
            $('.viewer-wrapper img:eq('+i+')').attr('src',path);
        }
        var cl = new CycleLoader(imgnamelist,len);
        setInterval(cl.imgCycle,interval);
    });

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

    var CycleLoader = function(imgnamelist,len){
        this.imgnamelist = imgnamelist;
        this.len = imgnamelist.length-1;
        this.file_pointer = 7;
        this.domlen = len;
        this.dom_pointer = 1;
        this.getDOM = function(){
            var dom = $('.img-container:nth-of-type('+this.dom_pointer+') img');
            return dom;
        };
        this.getPath = function(){
            return "./img/"+this.imgnamelist[this.file_pointer];
        };
        this.imgCycle = function(){
            console.log(this);
            this.getDOM().attr('src',this.getPath()).fadeIn();
            this.file_pointer += 1;
            this.dom_pointer += 1;
            if(this.file_pointer > this.len){
                this.file_pointer = 0;
            }
            if(this.dom_pointer > this.domlen){
                this.dom_pointer = 1;
            }
        }.bind(this);
    };
});