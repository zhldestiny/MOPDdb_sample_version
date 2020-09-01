function readScore(scoreFile) {
    d3.tsv(scoreFile, function(error, data) {
        if (error) throw error;

        for (var i = 0; i < data.length; i++) {
            // numArr[i] = +data[i].num;
            // aminoArr[i] = data[i].amino;
            // secStructArr[i] = data[i].secStruct;
            numset.push(data[i].Ind);
            valueset.push(+data[i].Score);
        }

        addValueMap();
    });
}

function addValueMap(){
    //归一化处理
    var normalize = d3.scale.linear()
                        .domain([d3.min(valueset,function(d){
                                            return d;
                                }),d3.max(valueset,function(d){
                                            return d;
                                })])
                        .range([0,1]);
    for(var i = 0; i < numset.length; i++) {
        valueset[i] = parseFloat((normalize(valueset[i])).toFixed(5));
    }
    // dataset
    for(var i=0;i<numset.length;i++) {
            dataset.push({
            key:numset[i],
            value:parseFloat(valueset[i]),
            // secStruct:secStructset[i],
            // amino:aminoset[i],
            // exp:expset[i]
        });
    }

    xScale = d3.scale.linear()
                .domain([0,numset.length])
                .range([105,905]);
    yScale = d3.scale.linear()
                .domain([d3.min(valueset,function(d){
                            return d;
                        }),d3.max(valueset,function(d){
                            return d;
                        })])
                .range([h-padding,padding]);

    /* yExpScale = d3.scale.linear()
                        .domain([0,1])
                        .range([h-padding,padding]); */
    // add ValueMap
    var p = "";
    for(var i=0;i<numset.length;i++) {
        p += xScale(numset[i]);
        p += ",";
        p += yScale(valueset[i]);
        if(i<numset.length-1) {
            p+=" ";
        }
    }
    //console.log(p);
    //折线图区域
    var svg = d3.select("#dataValue")
                .attr("width",w)
                .attr("height",h);
    svg.on("mouseover", function(){
        xpos = d3.mouse(svg.node())[0];
        ypos = d3.mouse(svg.node())[1];
    });
    //添加折线
    svg.append("polyline")
        .attr("points",p)
        .attr("fill","none")
        .attr("stroke","rgba(66,133,244,0.5)")
        .attr("stroke-width",2);

    //Define X axis
    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .ticks(5)//最多刻度数，连上原点
                    .orient("bottom");
                    //.tickFormat();//添加刻度格式
    //Define Y axis
    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);
                    //.tickFormat();
    //Create X axis

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")//设置据下边界的距离
        .call(xAxis);

    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(105, 0)")//设置轴据左边界的距离
        .call(yAxis);

    svg.selectAll(".srect")
        .data(dataset,function(d){
            return d.key;
        })
        .enter()
        .append("rect")
        .attr("id",function(d,i){
            var theId = "scoreRect" + i;
            return theId;
        })
        .attr("class", "srect")
        .attr("x",function(d,i){
            return xScale(i+1)-x_len/dataset.length/2;
        })
        .attr("y",function(d){
            return padding;
        })
        .attr("height",function(d){
            return h-padding*2;
            //return (w-padding*2)/dataset.length;
        })
        .attr("width",function(d){
            return x_len/dataset.length;
        })
        .attr("fill","rgba(255,0,0,0)")
        .on("mouseover",function(d,i){
            var tempValue = d.value;
            var tempIndex = d.key;
            var tempExp = null;    // 亲疏水，暂时设为null

            var xPosition = xScale(tempIndex);
            var yPosition = yScale(tempValue);
            //console.log(tempValue);
            //console.log(yPosition);

            drawInteraction(tempValue,tempExp,tempIndex,xPosition,yPosition);
        })
        .on("mouseout",function(d,i){
            /* d3.select("#tooltipExp")
                .style("left", "-1000px")
                .style("top", "-1000px");
            d3.select("#sCircleExp").classed("hidden1",true);
            d3.select("#xlineExp").classed("hidden1", true);
            d3.select("#ylineExp").classed("hidden1", true); */
            d3.select("#tooltip")
                .style("left", "-1000px")
                .style("top", "-1000px");
            d3.select("#scircle").classed("hidden1", true);
            d3.select("#xline").classed("hidden1", true);
            d3.select("#yline").classed("hidden1", true);
            var tempId = "#rect" + (d.key-1);
            d3.select(tempId)
                .transition()
                .duration(100)
                .attr("fill","rgba(255,0,0,0)");
            });
}

function drawInteraction(tempValue, tempExp, tempIndex, xPosition, yPosition){
    // var _yPosition = yExpScale(tempExp);
    //alert(yPosition);
    //添加提示框
    var temp = tempIndex+", "+tempValue;
    d3.select("#tooltip")
        .style("left",(xPosition+"px"))
        .style("top",(yPosition+"px"))
        .transition()
        .duration(speed)
        .select("#value")
        .text(temp);

    //添加提示圈
    d3.select("#scircle")
            .classed("hidden1", false)
            .attr("cx",xPosition)
            .attr("cy",yPosition)
            .attr("r",3)
            .transition()
            .duration(speed)
            .attr("fill","black");

    //添加坐标线
    d3.select("#xline")
            .classed("hidden1", false)
            .attr("x1", 105)
            .attr("y1", yPosition)
            .attr("x2", 905)
            .attr("y2", yPosition)
            .transition()
            .duration(speed)
            .attr("stroke", "rgba(255,0,0,0.3)");
    d3.select("#yline")
            .classed("hidden1", false)
            .attr("x1", xPosition)
            .attr("y1", padding)
            .attr("x2", xPosition)
            .attr("y2", h-padding)
            .transition()
            .duration(speed)
            .attr("stroke", "rgba(255,0,0,0.3)");

    //////
    /* temp = tempIndex+", "+tempExp;

    d3.select("#tooltipExp")
        .style("left",(xPosition+"px"))
        .style("top",(_yPosition+"px"))
        .transition()
        .duration(speed)
        .select("#valueExp")
        .text(temp);

    d3.select("#tooltipExp")
        .classed("hidden1",false)
        .transition()
        .duration(speed)
        .style("left",(xPosition+"px"))
        .style("top",(_yPosition+"px"))
        .select("#exp")
        .text(temp);

    //添加提示圈
    d3.select("#sCircleExp")
            .classed("hidden1", false)
            .attr("cx",xPosition)
            .attr("cy",_yPosition)
            .attr("r",3)
            .transition()
            .duration(speed)
            .attr("fill","black");
    //添加坐标线
    d3.select("#xlineExp")
            .classed("hidden1", false)
            .attr("x1", 105)
            .attr("y1", _yPosition)
            .attr("x2", 905)
            .attr("y2", _yPosition)
            .transition()
            .duration(speed)
            .attr("stroke", "rgba(255,0,0,0.3)");
    d3.select("#ylineExp")
            .classed("hidden1", false)
            .attr("x1", xPosition)
            .attr("y1", padding)
            .attr("x2", xPosition)
            .attr("y2", h-padding)
            .transition()
            .duration(speed)
            .attr("stroke", "rgba(255,0,0,0.3)");
    //二级结构图的分割线
    var tempId = "#rect" + (tempIndex-1);
    d3.select(tempId)
        .transition()
        .duration(100)
        .attr("fill","rgba(255,0,0,0.3)"); */
    }


// 全局变量
var w=930;
var h=250;
var x_len = 800;
var padding = 26;
var speed = 50;
//比例尺
var xScale;                 //将下标映射到x轴上
var yScale;                 //将score值映射到y轴上
var numset = [];
var valueset = [];
var dataset = [];

readScore("/static/tsv_dir/" + "{{ protein_name }}" + ".tsv");

// plot rect
var colorArr = ['yellow', 'green', 'blue', 'pink', 'red'];
function splitDom(domStr){
    // var widthArr = [];
    // var xArr = [];
    var splitArr = domStr.match(/\(.*?\)/g);    // ["(1-294)", "(295-487)", "(488-839)"]
    // console.log(splitArr);
    var tmpX1, tmpX2, tmpWidth;
    for (var i = 0; i<splitArr.length; i++) {
        if (splitArr[i].indexOf('|') == -1){
            tmpX2 = splitArr[i].match(/-\w+/)[0].slice(1,);
            tmpX2 = parseInt(tmpX2);
            tmpX1 = splitArr[i].match(/\w+-/)[0];
            tmpX1 = tmpX1.slice(0,tmpX1.length-1);
            tmpX1 = parseInt(tmpX1) - 1;
            tmpWidth = tmpX2 - tmpX1;
            createRect(tmpX1, tmpWidth, colorArr[i]);
        } else {
            var tmpsplitArr = splitArr[i].split('|');    // ["(1-294", "488-600)"]
            for (var j = 0; j < tmpsplitArr.length; j++) {
                tmpX2 = tmpsplitArr[j].match(/-\w+/)[0].slice(1,);
                tmpX2 = parseInt(tmpX2);
                tmpX1 = tmpsplitArr[j].match(/\w+-/)[0];
                tmpX1 = tmpX1.slice(0,tmpX1.length-1);
                tmpX1 = parseInt(tmpX1) - 1;
                tmpWidth = tmpX2 - tmpX1;
                createRect(tmpX1, tmpWidth, colorArr[i]);
            }
        }
    }
}
function createRect(x, width, color) {
    var domSvg = document.getElementById("domSvg");
    var rect_element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect_element.setAttribute("x", x);
    rect_element.setAttribute("y", "20");
    rect_element.setAttribute("width", width);
    rect_element.setAttribute("rx", "10");
    rect_element.setAttribute("ry", "20");
    rect_element.setAttribute("height", "10");
    rect_element.setAttribute("style", 'fill:'+color+';stroke:black;stroke-width:4;opacity:0.5');
    domSvg.appendChild(rect_element);
}
// var domain = "(1-294)(295-487)(488-839)";    // '(1-294|488-600)(295-487)(601-839)'
var domain = '{{ domain }}';
// console.log(domain);
// var domain_num = {{ domain_num }};
var domain_length = {{ length }};
splitDom(domain);
svg1 = d3.select("#domain_organization").select("svg");
svg1.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0, 30)");
  //.call(d3.svg.axis().scale([1, domain_length]).orient("bottom"));

// read secStruct file
function readSS(s){
    d3.tsv(s, function (data) {
    // console.log(data[0], data.length, typeof(+data[0].num));
    for (var i = 0; i < data.length; i++) {
        // numArr[i] = +data[i].num;
        // aminoArr[i] = data[i].amino;
        // secStructArr[i] = data[i].secStruct;
        numArr.push(+data[i].num);
        aminoArr.push(data[i].amino);
        secStructArr.push(data[i].secStruct);
    }
    addSecStructMapTip();
});
}
//添加二级结构局部详细图
function addSecStructMapTip () {
    var _padding = 10;
    var _height = 130;
    var _left = 20;    // raw 135
    //if(i>=5)
    for(var j = 0; j<numArr.length; j++){
        //添加残基名
        d3.select("#secStruct")
            .append("p")
            .attr("id","secStructAmino")
            .text(aminoArr[j])
            .style("left",((_padding+_left + (j)*15+3) + "px"))
            .style("top",((_padding + 20) +"px"));
        //添加坐标线
        d3.select("#secStructSvg")
            .append("line")
            .attr("id","secStructAxis")
            .attr("x1",(_padding+_left + (j)*15))
            .attr("y1",(_padding+40))
            .attr("x2",(_padding+_left + (j+1)*15))
            .attr("y2",(_padding+40))
            .attr("stroke","black")
            .attr("stroke-width",1);
        if(j%5==0)
        {
            d3.select("#secStructSvg")
                .append("line")
                .attr("id","secStructAxis")
                .attr("x1",(_padding+_left + (j)*15 + 7))
                .attr("y1",(_padding+40))
                .attr("x2",(_padding+_left + (j)*15 + 7))
                .attr("y2",(_padding+45))
                .attr("stroke","black")
                .attr("stroke-width",2);
            d3.select("#secStruct")
                .append("p")
                .style("left",((_padding+_left + (j)*15) + "px"))
                .style("top",((_padding+50) + "px"))
                .style("position","absolute")
                .text(j+1);
        }

        if(secStructArr[j] == "H")
        {
            d3.select("#secStruct")
                .append("img")
                .attr("id","secStructImg")
                .attr("src","{% static 'img/Helix.png' %}")
                .style("left",((_padding+_left + (j)*15) + "px"))
                .style("top",((_padding) + "px"));
        }
        else if(secStructArr[j] == "E")
        {
            if(j == secStructArr.length-1 ||secStructArr[j+1] != "E")
            {
                d3.select("#secStruct")
                    .append("img")
                    .attr("id","secStructImg")
                    .attr("src","{% static 'img/Strand1.png' %}")
                    .style("left",((_padding+_left + (j)*15) + "px"))
                    .style("top",((_padding) + "px"));
            }
            else
            {
                d3.select("#secStruct")
                    .append("img")
                    .attr("id","secStructImg")
                    .attr("src","{% static 'img/Strand2.png' %}")
                    .style("left",((_padding+_left + (j)*15) + "px"))
                    .style("top",((_padding) + "px"));
            }
        }
        else //if(dataset[(i*40 + j)].secStruct == "C")
        {
            d3.select("#secStruct")
                .append("img")
                .attr("id","secStructImg")
                .attr("src","{% static 'img/Coil.png' %}")
                .style("left",((_padding+_left + (j)*15) + "px"))
                .style("top",((_padding) + "px"));
        }
    }
}
// 全局变量
var aminoArr = [];
var numArr = [];
var secStructArr = [];
readSS("/static/seqsstsv_dir/" + "{{ protein_name }}" + ".ss.tsv");