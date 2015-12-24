
    $(document).on('ready',function(){
        action={
            right:1,
            left:2,
            rotate:3,
            drop:0,
        }
        scoreMap={
            0:0,
            1:100,
            2:300,
            3:900,
            4:1800
        }
        score=0;
        canvasProp={//block width
            width:250,//Dont Change this too much
            height:500,
            noBlocks:10 ,//in each row
            blockColor:'grey',
            keyLag:10,
            refreshScFreq:500,
            gameSpeed:500,
            }
        changed=false;
        score=0;
        var refreshTimeout;
        var gameOver=false;
        var blockArray={};//store All blocks here
        fallingBlock={}
        init=function(){
                //prepare and initialize canvas and context ;
             //$('#game-console').css('width',canvasProp.width);
             fallingBlock.isfalling=false;
             this.canvas=$('canvas')[0];
             this.canvas.width=canvasProp.width;
             this.canvas.height=canvasProp.height;
             this.ctx=$('canvas').get(0).getContext('2d');
             ctx.fillStyle=canvasProp.blockColor;
             this.blockWidth=canvasProp.width/canvasProp.noBlocks;

    //initialize block array
            this.rowSize=canvasProp.width/blockWidth;
            this.columnSize=canvasProp.height/blockWidth;
            blockArray=new Array(columnSize);
            for(var i=0;i<blockArray.length;i++){
                blockArray[i]=new Array(rowSize);
                for(j=0;j<blockArray[i].length;j++){
                    blockArray[i][j]=0;
                }
            }
            this.blockArray=blockArray
        }
        var refreshScreen=function(str){
            blockArray=this.blockArray;
            ctx.clearRect(0,0,canvasProp.width,canvasProp.height);
            var drawblock=function(row,column){
            ctx.beginPath();
                //if(blockArray[row][column ]==0)return;
                ctx.rect(column*blockWidth,row*blockWidth,blockWidth,blockWidth);
                ctx.fill();
                ctx.stroke();
            ctx.closePath();
            }
                    //columns
            for(var i=0;i<columnSize;i++){
               for(var j=0;j<rowSize;j++){
                  if(blockArray[i][j]==1)drawblock(i,j);
                }
            }
            if(fallingBlock.isfalling){
                var arr=fallingBlock.blockType;
                var psRot=arr.length;
               //refactor later;
                arr=arr[fallingBlock.rotation%psRot];
                ls=fallingBlock.getCurrentTileList();
               for(i=0;i<ls.length;i=i+1){
                  drawblock(ls[i][0],ls[i][1]);

                }

            }
            ctx.closePath();
            changed=false;
            }

        function screenTimer(){
            clearTimeout(refreshTimeout);
            if(changed){refreshScreen();//console.log('screen refreshed');
            }
            if(!gameOver)refreshTimeout=setTimeout(screenTimer,100);
        };


        function gamePlay(){
            function checkGameOver(){
                if(fallingBlock.row==0&&testCollisionForMovementOrRotation(fallingBlock,action.drop)){
                    gameOver=true;
                }
            }
            if(fallingBlock.isfalling){
                move.moveDown();
                }else{
                     fallingBlock=blockFactory();
                     checkGameOver();
                     fallingBlock.isfalling=true;
                     changed=true;
            }

            clearTimeout(this.gameId);
            if(!gameOver)this.gameId=window.setTimeout(gamePlay,canvasProp.gameSpeed);

        };
        function add(){
            ls=fallingBlock.getCurrentTileList();
            for(i=0;i<ls.length;i++){
                t=ls[i]
                x=t[0]
                y=t[1]
                blockArray[x][y]=1;
            }
            fallingBlock.isfalling=false

            scoreAndShift()
        }
        function scoreAndShift(){
            function isRowFull(r){
                for(j=0;j<blockArray.length;j++){
                    if(blockArray[i][j]==0)return false
                }
                return true;
            }
            currScore=0;
            for(i=0;i<columnSize;i++){

                if(isRowFull(i)){
                currScore++;
               // console.log("row "+ i+ "is full");
                blockArray.splice(i,1);
                t=new Array(rowSize);
                for(k=0;k<t.length;k++){
                    t[k]=0;
                    }
                blockArray.splice(0,0,t)
                }
            }

            score=score+scoreMap[currScore];

            $('#score').text(score);
            }



        function t(){
           this.fallingBlock=blockFactory();

        }





        function addKeyHandlers(){
            currKey=0
            lastPressTime=0;
            keyLag=canvasProp.keyLag;
            $(document).keypress(function(e){
                now=$.now();
                if((now-lastPressTime<keyLag)&&(currKey==e.keyCode)){
                        return;
                    }
                lastPressTime=now;
                currKey=e.keyCode;
                switch(currKey){
                    case 37:
                        move.moveLeft();
                        console.log("left Key Pressed");
                        break;
                    case 39:
                        move.moveRight();
                        console.log("right Key Pressed");
                        break;
                    case 38:
//                        drop();
                        move.rotate();
                        console.log("Up Key Pressed");
                        break ;
                    case 40:
                        move.moveDown();
                        console.log('down key pressed');
                        break;

                }
            });
        };
        addKeyHandlers();

        move={
            moveDown:function (){
            if(!fallingBlock.isfalling)return;
            //console.log('time'+$.now());
            if(!testCollisionForMovementOrRotation(fallingBlock,action.drop)){
                                 fallingBlock.row=fallingBlock.row+1;
                                 changed=true;
                     }else{
                         add();
                         changed=true;
                                         }
                                     },

            moveRight:function(){

                    changed=true;
                    if(!testCollisionForMovementOrRotation(fallingBlock,action.right)){
                     changed=true;
                        fallingBlock.column=fallingBlock.column+1;
                    };
            },
            moveLeft:function(){
                 if(!testCollisionForMovementOrRotation(fallingBlock,action.left)){
                                     changed=true;
                                     fallingBlock.column=fallingBlock.column-1;
                                    };
                },
            rotate:function(){
                if(!testCollisionForMovementOrRotation(fallingBlock,action.rotate)){
                    fallingBlock.rotation=fallingBlock.rotation+1;
                     changed=true;

                }
            }
        }
        function testCollisionForMovementOrRotation(fallblock,action){
           //check all coordinates ;
           //check all boundaries ;
           function isBlockColliding(i,j){
            if((i>=columnSize)||(i<0)){console.log('attempt to breach row boundary');return true;}
            if((j>=rowSize)||(j<0)){console.log('attempt to breach column boundary');return true;}
            if(blockArray[i][j]==1){console.log('attempt to hit other block');return true;}
            return false;
           }
           switch(action){
            case 0://drop
                tileListToTest=fallblock.getListAfterDrop();
                break;
            case 1:
                tileListToTest=fallblock.getListAfterRight();
                break;
            case 2:
                tileListToTest=fallblock.getListAfterLedt();
                break;
             case 3:
                tileListToTest=fallblock.getListAfterRotation();
                break;
           }

           for(i=0;i<4;i=i+1){
                if(isBlockColliding(tileListToTest[i][0],tileListToTest[i][1])){
                       return true;
                }
           }
           return false;
        }

        function blockFactory(){
            blockMap={
                0:'line',
                1:'square',
                2:'leftZig',
                3:'rightZig',
                4:'lefthook',
                5:'pin'

            }
            function generateRandomInteger(){
               return  Math.floor((Math.random() * 10) + 1)%Object.keys(blockMap).length;
            }

            blockData={
                        line:[[0,-1,0,0,0,1,0,2],
                                [-1,0,0,0,1,0,2,0]],
                        square:[[0,0,0,1,1,0,1,1]],
                        leftZig:[[0,-1,0,0,1,0,1,1],
                                [0,0,1,0,1,-1,2,-1]],
                        rightZig:[[1,-1,1,0,0,0,0,1],
                                   [0,0,1,0,1,1,2,1] ],
                        lefthook:[[0,0,0,-1,1,0,2,0],
                                    [0,0,0,1,0,-1,1,-1],
                                    [0,0,1,0,2,0,2,1],
                                    [1,0,1,1,0,1,1,-1]],
                        pin:[[0,0,0,1,1,0,0,-1],
                            [0,0,0,1,-1,1,1,1,],
                            [0,0,1,-1,1,0,1,1],
                            [0,0,0,-1,-1,-1,1,-1]
                           ],

                    }

            function getRandomBlockData(){
                return blockData[blockMap[generateRandomInteger()]] ;
            }
            block={}
            block.blockType=getRandomBlockData();
            block.rotation=0;
            block.row=0;
            block.column=3;
            block.isfalling=true;
            block.getListOfAllTile=function(rotation,row,column){
                var l=this.blockType.length;
                var i=rotation%l;
                var arr=this.blockType[i];
                var ls=[];
                for(j=0;j<arr.length;j=j+2){
                    ls.push([row+arr[j],column+arr[j+1]]);
                }
               return ls;
            }
            block.getListAfterDrop=function(){
                return this.getListOfAllTile(this.rotation,this.row+1,this.column);
            };
            block.getListAfterRotation=function(){
                return this.getListOfAllTile(this.rotation+1,this.row,this.column);
            };
            block.getListAfterRight=function(){
            return   this.getListOfAllTile(this.rotation,this.row,this.column+1);
            };
            block.getListAfterLedt=function(){
                return this.getListOfAllTile(this.rotation,this.row,this.column-1);
            }
            block.getCurrentTileList=function(){
                return this.getListOfAllTile(this.rotation,this.row,this.column);
            }

            return block;


        }

        function playGame(){
            score=0;
            gameOver=false;
            init();
            screenTimer();
            gamePlay();

        }

        $($('#newGame')[0]).on('click',playGame);
        $($('#pauseGame')[0]).on('click',function(){
            gameOver=true;
        });

        playGame();
    });



