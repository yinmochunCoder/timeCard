/**
 * Created by xiaoyanli on 2018/9/27.
 */
;(function(){

    initTimeCard();
    handleSelector();   //可输入下拉框值的变化情况
    handleTimeSpan();   //点击span触发

    //下拉框选择
    function handleSelector() {
        let selector = document.getElementById("select-year"),
            span = document.getElementsByClassName('nav-month')[0].children,
            input = document.getElementById("input-year");
            selector.addEventListener(
                'change',
                function(event) {
                   let optionIndex = this.selectedIndex,
                       defaultSpan = document.getElementsByClassName('nav-month')[0].children[0];
                       input.value = this.options[optionIndex].value;
                       defaultSpan.style.background = 'lightcoral';
                       resetRecord(span,0);
                       getDateToWeek(input.value, defaultSpan.innerText);
                }
            );
    }

    //根据年月获取日期和星期的对应关系
    function getDateToWeek( year, monthV ) {
        let month = handleSwitchMonth(monthV);
        let date, dateCount, timeObj = [], monthFormat ;
            date = new Date( Number.parseInt(year) , month, 0 );
            dateCount = date.getDate();   //获取一月有多少天

            for ( let dateIndex = 1; dateIndex < dateCount+1; dateIndex++ ) {
                let day = new Date( Number.parseInt(year) , month-1, dateIndex );     //实例化年月日，获取星期几
                ( month < 10 ) ? ( monthFormat  = "0"+month.toString() ) : ( monthFormat = month );  //格式化小于10的月
                if ( dateIndex < 10 ) { dateIndex = '0'+dateIndex; }            //格式化小于10的日期

                timeObj.push({
                    dateO: monthFormat+"-"+dateIndex,   //当前日期
                    weekO: day.getDay(),                //获取星期几
                    weekC: Math.ceil( ( day.getDate() + 6 - day.getDay() )/ 7)  //在一个月的第几周内
                });
         }
        formatTimeWeek(timeObj);
    }


    //处理month
    function handleSwitchMonth( month ) {
        const monthValue = {
            'Jan': 1,
            'Feb': 2,
            'Mar': 3,
            'Apr': 4,
            'May': 5,
            'June': 6,
            'July': 7,
            'Aug': 8,
            'Sep': 9,
            'Oct': 10,
            'Nov': 11,
            'Dec': 12,
        };
        return monthValue[month];
    }

    //选择月份span
    function handleTimeSpan() {
        let span = document.getElementsByClassName('nav-month')[0].children,
            input = document.getElementById("input-year");
            for ( let index = 0 ; index < span.length; index++ ) {
                span[index].addEventListener(
                    'click',
                    function(event) {
                        if ( input.value === "" ) {
                            alert("请选择或输入想要查询的年份！") ;
                            return false;
                        } else {
                            span[index].style.background = 'lightcoral';
                            resetRecord(span,index);
                            getDateToWeek(input.value,span[index].innerText);
                        }
                    }
                );
            }
    }

    //剩余未选中的index
    function resetRecord( span,index ) {
        for ( let subIndex = 0 ; subIndex < span.length; subIndex++ ) {
            if ( subIndex !== index ) {
                span[subIndex].style.background = 'white';
            }
        }
    }

    //初始化右边timeCard
    function initTimeCard() {
        let contentArea = document.getElementsByClassName("content-wrapper")[0]; //加载的内容区
        for ( let row = 0 ; row < 5; row++ ) {   //五行七列
            for ( let col = 0; col < 7; col++ ) { //timeCard内容div区
                let timeCardDiv = document.createElement("div");
                    timeCardDiv.setAttribute("class","content-item");
                    timeCardDiv.setAttribute("row", row+1);
                    timeCardDiv.setAttribute("col", col);
                    contentArea.appendChild(timeCardDiv);
                }
        }
    }

    //格式化日期
    function formatTimeWeek( timeObj ) {
        let cardItems = document.getElementsByClassName("content-item"),
            row, col, dateSpan ;

        for ( let cardIndex = 0; cardIndex < cardItems.length; cardIndex++ ) {
            for ( let timeIndex = 0; timeIndex < timeObj.length; timeIndex++ ) {
                row = Number.parseInt(cardItems[cardIndex].getAttribute("row"));
                col = Number.parseInt(cardItems[cardIndex].getAttribute("col"));
                dateSpan = document.createElement("span");
                dateSpan.setAttribute('class','date-label');

                if ( row === timeObj[timeIndex].weekC && col === timeObj[timeIndex].weekO ) {
                    dateSpan.innerHTML = timeObj[timeIndex].dateO;
                    ( cardItems[cardIndex].firstChild === null ) ?
                    ( cardItems[cardIndex].appendChild(dateSpan) ) :
                    ( cardItems[cardIndex].replaceChild(dateSpan, cardItems[cardIndex].firstChild ) );
                } else {
                }
            }
        }
    }

    function fillIntoTimeCard(info) {
        let cardItems = document.getElementsByClassName("content-item");
        console.info(cardItems);
    }

})();