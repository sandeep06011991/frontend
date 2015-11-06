 (function($){
            $.fn.carousel=function(imglist){
                return this.each(function(){
                img_content="";
                var total_slides=0;
                var ac_timer;
                var curr_slide_no=0;

                function enclosediv(classList,id,content){

                    var ac_content=""
                    var idStr=""
                    var clsStr=""
                    var contentStr=""
                    if(content!==undefined){
                        contentStr=content
                    }
                    if(id!==undefined){
                        idStr="id='"+id+"'";
                        }
                    if(classList!==undefined){
                        var clsStr="class='"
                        for(var i in classList){
                            clsStr+=classList[i]+" ";
                        }
                        clsStr+="'";
                    }

                    var outer_div="<div "+clsStr+idStr+">";
                    ac_content=outer_div+contentStr+"</div>"
                    return ac_content;

                }
                //returns html content with a new enclosing div with given id and classes attached

                 for(var i=0;i<imglist.length;i++){
                                    img_content+=enclosediv(["slide_"+i,"abs_slides"],undefined,"<img src='"+imglist[i]+"'>")
                                    total_slides+=1;
                                }//calculate image content and total slides


                var control_content="";
                (function getControlContent(){
                    playbttn=enclosediv(classList=["play","button_clk","button_sprite"])
                    pausebttn=enclosediv(classList=["pause","button_clk","button_sprite"])
                    numbered_button_cnt="";

                    for(var i=1;i<=total_slides;i++){
                        numbered_button_cnt+=enclosediv(["numbered_button","round_black_border"],undefined,i);
                    }

                    control_content+=enclosediv(classList=["control_set"],undefined,content=playbttn+pausebttn+numbered_button_cnt);
                })();

                //rough <div>1</div>
                //rough <div>2</div>

                ac_content=control_content+img_content;

                $(this).html(ac_content);
                var slides=$(this);
                function postTransitionAdjustment(){
                    for(var i=0;i<total_slides;i++){
                            if(i!==curr_slide_no){
                            slides.find(".slide_"+i).css({
                                'top':'1000px'
                            });
                        }
                    }
                    slides.find(".slide_"+curr_slide_no).css({'top':'0px','left':'0px'});
                    slides.find(".numbered_button").removeClass("enabled");
                    slides.find(".numbered_button").addClass("disabled");
                    $(slides.find(".numbered_button").get(curr_slide_no)).removeClass("disabled").addClass("enabled");
                };


                function transition_slides(option){
                   //case normal auto transition
                    postTransitionAdjustment();
                    var next_slide_no=curr_slide_no+1
                    if(curr_slide_no==total_slides-1)next_slide_no=0
                    if(option!==undefined && option.goto!==undefined)next_slide_no=option.goto;
                    currSlide=slides.find('.slide_'+curr_slide_no);
                    nextSlide=slides.find('.slide_'+next_slide_no);
                    if(next_slide_no>curr_slide_no){
                       nextSlide.css({
                        'left':'640px',
                        'top':'0px'
                       });

                     nextSlide.animate({"left":"0px"},{"queue":false});
                     curr_slide_no=next_slide_no;
                     currSlide.animate({"left":"-640px"},{"complete":postTransitionAdjustment,"queue":false});
                    }else{
                        nextSlide.css({'left':'-640px',
                                                  'top':'0px'
                                                 });
                        nextSlide.animate({"left":"0px"},{"queue":false});
                        curr_slide_no=next_slide_no;
                        currSlide.animate({"left":"640px"},{"complete":postTransitionAdjustment,"queue":false});
                    }
                }

                //create play slides
                function pauseSlide(){
                    slides.find('.play').removeClass('btn-hide');
                    slides.find('.pause').addClass('btn-hide');
                    ac_timer=clearInterval(ac_timer);
                }

                function playSlide(){
                    slides.find('.pause').removeClass('btn-hide');
                    slides.find('.play').addClass('btn-hide');
                    ac_timer=setInterval(transition_slides,2000);
                }

                //bind events
                slides.find('.play').click(playSlide);
                slides.find('.pause').click(pauseSlide);
                playSlide();

                slides.find('.numbered_button').click(function(){
                        pauseSlide();
                        var slNo=parseInt($(this).text())-1;
                        if(slNo!==(curr_slide_no)){
                            transition_slides({"goto":slNo});
                        }
                    });

                });
            }
        })(jQuery);

 $(document).ready(function(){
        imglist=["11.jpg","12.jpg","13.jpg"];
        $("#slider").carousel(imglist);

    });